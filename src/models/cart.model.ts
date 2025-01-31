import mongoose, { Schema, Document } from "mongoose";

// Define the ICart interface
export interface ICart extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  productId: mongoose.Schema.Types.ObjectId;
  quantity: number;
}

// Define the Cart schema
const cartSchema = new Schema<ICart>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", 
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
});

// Create the Cart model
const Cart = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
