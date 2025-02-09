import mongoose from "mongoose";
import { Cart, ICart, Product } from "../models";
import {
  CheckProductAvailability,
  Weight,
} from "../utils/checkProductAvailability";

export class CartService {
  async createCart(
    data: {
      weight: Weight;
      productId: mongoose.Schema.Types.ObjectId;
      quantity: number;
    },
    userId: string
  ): Promise<ICart> {
    try {
      let cart = await Cart.findOne({ userId });

      if (cart) {
        // Check if the product already exists in the wishlist with the same weight
        const existingProductIndex = cart.products.findIndex(
          (product) =>
            product.productId.toString() === data.productId.toString() &&
            product.weight === data.weight
        );

        if (existingProductIndex !== -1) {
          // If the product exists with the same weight, update its quantity
          cart.products[existingProductIndex].quantity += data.quantity;
        } else {
          // If product exists but weight is different, add as a new entry
          const product = await Product.findById(data.productId);
          const availability = CheckProductAvailability(product, data.weight);

          cart.products.push({
            productId: data.productId,
            quantity: data.quantity,
            weight: data.weight,
            price: String(availability?.price),
          });
        }

        await cart.save();
      } else {
        // If no wishlist exists, create a new one
        const product = await Product.findById(data.productId);
        const availability = CheckProductAvailability(product, data.weight);

        cart = new Cart({
          userId,
          products: [
            {
              productId: data.productId,
              quantity: data.quantity,
              weight: data.weight,
              price: availability?.price, // Make sure to include other required details
            },
          ],
        });

        await cart.save();
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
  async removeCartProduct(
    userId: string,
    productId: string,
    weight: string
  ): Promise<ICart | null> {
    try {
      const cart = await Cart.findOne({ userId });

      if (!cart) {
        throw new Error("Cart not found");
      }
      // Filter out the product from the wishlist products array
      cart.products = cart.products.filter(
        (product) =>
          product.productId.toString() !== productId ||
          product.weight !== weight
      );
      // If products are left, save the updated wishlist
      if (cart.products.length > 0) {
        await cart.save();
        return cart;
      }

      // If no products left, delete the wishlist
      await Cart.findByIdAndDelete(cart._id);
      return null;
    } catch (error) {
      console.error("Error in get cart:", error);
      throw error;
    }
  }
  async clearCart(userId: string) {
    try {
      const cart = await Cart.findOneAndDelete({ userId: userId });

      if (!cart) {
        throw new Error("Cart not found");
      }
      return cart;
    } catch (error) {
      console.error("Error in get cart:", error);
      throw error;
    }
  }
}
