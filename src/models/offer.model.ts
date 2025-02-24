import mongoose, { Schema, Document } from "mongoose";

export interface IOffer extends Document {
  offerName: string;
  offerType: "percent" | "amount" | "bogo" | "free_shipping";
  discountValue?: number;
  buyQuantity?: number;
  getQuantity?: number;
  minPurchaseAmount?: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

const offerSchema = new Schema<IOffer>({
  offerName: {
    type: String,
    required: [true, "Offer name is required"],
  },
  offerType: {
    type: String,
    enum: ["percent", "amount", "bogo", "free_shipping"],
    required: [true, "Offer type is required"],
  },
  discountValue: {
    type: Number,
    required: function (this: IOffer) {
      return this.offerType === "percent" || this.offerType === "amount";
    },
  },
  buyQuantity: {
    type: Number,
    required: function (this: IOffer) {
      return this.offerType === "bogo";
    },
  },
  getQuantity: {
    type: Number,
    required: function (this: IOffer) {
      return this.offerType === "bogo";
    },
  },
  minPurchaseAmount: {
    type: Number,
    required: function (this: IOffer) {
      return this.offerType === "free_shipping";
    },
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

const Offer = mongoose.model<IOffer>("Offer", offerSchema);

export default Offer;
