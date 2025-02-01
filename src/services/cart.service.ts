import mongoose from "mongoose";
import { Cart, ICart } from "../models";

export class CartService {
  async createCart(
    data: { productId: mongoose.Schema.Types.ObjectId; quantity: number },
    userId: string
  ): Promise<ICart> {
    try {
      let cart = await Cart.findOne({ userId });

      if (cart) {
        // Check if the product already exists in the cart
        const existingProductIndex = cart.products.findIndex(
          (product: { productId: mongoose.Schema.Types.ObjectId; quantity: number }) =>
            product.productId.toString() === data.productId.toString()
        );

        if (existingProductIndex !== -1) {
          // If the product exists, update its quantity
          cart.products[existingProductIndex].quantity += data.quantity;
        } else {
          // Otherwise, add a new product to the cart
          cart.products.push({ productId: data.productId, quantity: data.quantity });
        }

        await cart.save();
      } else {
        // If no cart exists, create a new one
        cart = new Cart({
          userId,
          products: [{ productId: data.productId, quantity: data.quantity }],
        });

        await cart.save(); // Save first
      }

      // Populate products and return the updated cart
      return await Cart.findOne({ userId }).populate("products.productId");
    } catch (error) {
      console.error("Error in create cart:", error);
      throw error;
    }
  }

  async getCart(userId: string): Promise<ICart | null> {
    try {
      return await Cart.findOne({ userId }).populate("products.productId");
    } catch (error) {
      console.error("Error in get cart:", error);
      throw error;
    }
  }
}
