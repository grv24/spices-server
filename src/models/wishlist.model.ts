import mongoose, { Schema, Document } from "mongoose";

// Define the IWishlist interface
export interface IWishlist extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  products: {
    productId: mongoose.Schema.Types.ObjectId;
    quantity: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the Wishlist schema
const wishlistSchema = new Schema<IWishlist>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
          unique: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

// Create the Wishlist model
const Wishlist = mongoose.model<IWishlist>("Wishlist", wishlistSchema);

export default Wishlist;
