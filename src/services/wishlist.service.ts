import {
  CheckProductAvailability,
  Weight,
} from "../utils/checkProductAvailability";
import { Wishlist, IWishlist, Product } from "../models";
import mongoose from "mongoose";

export class WishlistService {
  async createWishlist(
    data: {
      weight: Weight;
      productId: mongoose.Schema.Types.ObjectId;
      quantity: number;
    },
    userId: string
  ): Promise<IWishlist> {
    try {
      let wishlist = await Wishlist.findOne({ userId });

      if (wishlist) {
        // Check if the product already exists in the wishlist with the same weight
        const existingProductIndex = wishlist.products.findIndex(
          (product) =>
            product.productId.toString() === data.productId.toString() &&
            product.weight === data.weight
        );

        if (existingProductIndex !== -1) {
          // If the product exists with the same weight, update its quantity
          wishlist.products[existingProductIndex].quantity += data.quantity;
        } else {
          // If product exists but weight is different, add as a new entry
          const product = await Product.findById(data.productId);
          const availability = CheckProductAvailability(product, data.weight);

          wishlist.products.push({
            productId: data.productId,
            quantity: data.quantity,
            weight: data.weight,
            price: String(availability?.price), // You can add more details here as required
          });
        }

        await wishlist.save();
      } else {
        // If no wishlist exists, create a new one
        const product = await Product.findById(data.productId);
        const availability = CheckProductAvailability(product, data.weight);

        wishlist = new Wishlist({
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

        await wishlist.save();
      }

      // Return the populated wishlist
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
  async removeProduct(
    userId: string,
    productId: string,
    weight: string
  ): Promise<IWishlist | null> {
    try {
      // Find the wishlist by userId and delete it
      const wishlist = await Wishlist.findOne({ userId });

      if (!wishlist) {
        throw new Error("Wishlist not found");
      }

      // Filter out the product from the wishlist products array
      wishlist.products = wishlist.products.filter(
        (product) =>
          product.productId.toString() !== productId ||
          product.weight !== weight
      );
      // If products are left, save the updated wishlist
      if (wishlist.products.length > 0) {
        await wishlist.save();
        return wishlist;
      }

      // If no products left, delete the wishlist
      await Wishlist.findByIdAndDelete(wishlist._id);
      return null;
    } catch (error) {
      console.error("Error in removeProduct:", error);
      throw error;
    }
  }
  async clearWishlist(userId: string) {
    try {
      const wishlist = await Wishlist.findOneAndDelete({ userId: userId });

      if (!wishlist) {
        throw new Error("Wishlist not found");
      }
      return wishlist;
    } catch (error) {
      console.error("Error in clear wishlist:", error);
      throw error;
    }
  }
}
