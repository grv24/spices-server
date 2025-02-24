import { Cart, IUser, Order, Product } from "../models";

export class OrderService {
  async placeOrder(
    cash_on_delivery: boolean,
    online_payment: boolean,
    user: IUser
  ) {
    try {
      // Retrieve the user's cart and default shipping address.
      const cart = await Cart.findOne({ userId: user._id });
      if (!cart || cart.products.length === 0) {
        throw new Error("Cart is empty or not found");
      }
      const shippingDetails = user.addresses.find(
        (address) => address.isDefault
      );

      // Process each cart product and update stock accordingly.
      const orderItems = await Promise.all(
        cart.products.map(async (cartProduct) => {
          // Retrieve product document by productId.
          const productData = await Product.findById(cartProduct.productId);
          if (!productData) {
            throw new Error(
              `Product with id ${cartProduct.productId} not found`
            );
          }

          const weightKey =
            cartProduct.weight as keyof typeof productData.productQuantity;
          const availableQuantity =
            productData.productQuantity[
              weightKey as keyof typeof productData.productQuantity
            ];

          if (availableQuantity === undefined) {
            throw new Error(
              `No quantity information found for weight ${weightKey}`
            );
          }
          if (availableQuantity < cartProduct.quantity) {
            throw new Error(
              `Insufficient stock for ${cartProduct.productId} (${weightKey}). Available: ${availableQuantity}, Requested: ${cartProduct.quantity}`
            );
          }

          // Deduct the ordered quantity from the specific weight.
          productData.productQuantity[weightKey] =
            availableQuantity - cartProduct.quantity;

          // Also update the overall totalQuantity (if you maintain one)
          productData.totalQuantity -= cartProduct.quantity;

          // Save the updated product document.
          await productData.save();
          return {
            productId: cartProduct.productId,
            quantity: cartProduct.quantity,
            price: cartProduct.price,
            weight: cartProduct.weight,
            productName: productData.productName,
          };
        })
      );

      // Calculate overall total quantity and total price.
      const totalQuantity = orderItems.reduce(
        (sum, product) => sum + product.quantity,
        0
      );
      const totalPrice = orderItems.reduce(
        (sum, product) => sum + product.quantity * Number(product.price),
        0
      );

      // Create a new Order document.
      const order = new Order({
        userId: user._id,
        items: orderItems,
        totalAmount: totalPrice,
        totalQuantity: totalQuantity,
        status: "pending",
        payment: {
          paymentMode: cash_on_delivery ? "cod" : "card",
          paymentStatus: "pending",
        },
        shippingDetails: {
          address: shippingDetails?.address || "",
          city: shippingDetails?.city || "",
          state: shippingDetails?.state || "",
          postalCode: shippingDetails?.postalCode || "",
        },
        orderStatus: "Pending",
        invoiceNumber: `INV-${Date.now()}`,
      });

      // Save the order if required.
      await order.save();
      // Optionally, clear the user's cart after placing the order.
      await Cart.findOneAndUpdate({ userId: user._id }, { products: [] });

      return order;
    } catch (error) {
      console.error("Error placing order:", error);
      throw error;
    }
  }

  async getOrders(user: IUser) {
    try {
      const orders = await Order.find();
      return orders;
    } catch (error) {
      console.error("Error getting orders:", error);
      throw error;
    }
  }
}
