import { Wishlist, IWishlist } from "../models";
import mongoose from "mongoose";

export class WishlistService {
  async createWishlist(
    data: { productId: mongoose.Schema.Types.ObjectId; quantity: number },
    userId: string
  ): Promise<IWishlist> {
    try {
      let wishlist = await Wishlist.findOne({ userId });

      if (wishlist) {
        // Check if the product already exists in the wishlist
        const existingProductIndex = wishlist.products.findIndex(
          (product) => product.productId.toString() === data.productId.toString()
        );

        if (existingProductIndex !== -1) {
          // If product exists, update its quantity
          wishlist.products[existingProductIndex].quantity += data.quantity;
        } else {
          // Otherwise, add a new product to the wishlist
          wishlist.products.push({ productId: data.productId, quantity: data.quantity });
        }

        await wishlist.save();
      } else {
        // If no wishlist exists, create a new one
        wishlist = new Wishlist({
          userId,
          products: [{ productId: data.productId, quantity: data.quantity }],
        });

        await wishlist.save();
      }

      // Return populated wishlist
      return await Wishlist.findOne({ userId }).populate("products.productId");
    } catch (error) {
      console.error("Error in create wishlist:", error);
      throw error;
    }
  }

  async getWishlist(userId: string): Promise<IWishlist | null> {
    try {
      return await Wishlist.findOne({ userId }).populate("products.productId");
    } catch (error) {
      console.error("Error in get wishlist:", error);
      throw error;
    }
  }
}
