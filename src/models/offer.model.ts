import mongoose, { Schema } from "mongoose";

export interface IOffer extends Document {}

const offerSchema = new Schema({
  offerName: {
    type: String,
    required: [true, "Offer name is required"],
  },
  offerType: {
    type: String,
    enum: ["percent", "amount"], // "percent" for percentage off, "amount" for Rs off
    required: [true, "Offer type is required"],
  },
  discountValue: {
    type: Number,
    required: [true, "Discount value is required"], // E.g., 10% or ₹50
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"],
  },
  endDate: {
    type: Date,
    required: [true, "End date is required"],
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

// Create the User model
const Offer = mongoose.model<IOffer>("Offer", offerSchema);

export default Offer;
