import mongoose, { Schema } from "mongoose";

export interface IProduct extends Document {
  productName: string;
  productDescription: string;
  productWeight: {
    "250g": boolean;
    "500g": boolean;
    "1kg": boolean;
    "2kg": boolean;
    "3kg": boolean;
  };
  productPrice: {
    "250g": number;
    "500g": number;
    "1kg": number;
    "2kg": number;
    "3kg": number;
  };
  productImage: string[];
  productType: string;
  additionalInformation: {
    returnPolicy: string;
    shippingPolicy: string;
  };
  offerId: Schema.Types.ObjectId;
}

const productSchema = new Schema({
  productName: {
    type: String,
    required: [true, "Product name is required"],
  },
  productDescription: {
    type: String,
    required: [true, "Product description is required"],
  },

  productWeight: {
    "250g": { type: Boolean, default: false },
    "500g": { type: Boolean, default: false },
    "1kg": { type: Boolean, default: false },
    "2kg": { type: Boolean, default: false },
    "3kg": { type: Boolean, default: false },
  },
  productPrice: {
    "250g": {
      type: Number,
      required: function () {
        return this.productWeight["250g"];
      },
    },
    "500g": {
      type: Number,
      required: function () {
        return this.productWeight["500g"];
      },
    },
    "1kg": {
      type: Number,
      required: function () {
        return this.productWeight["1kg"];
      },
    },
    "2kg": {
      type: Number,
      required: function () {
        return this.productWeight["2kg"];
      },
    },
    "3kg": {
      type: Number,
      required: function () {
        return this.productWeight["3kg"];
      },
    },
  },
  productImage: {
    type: [String],
    required: [true, "Product image is required"],
  },
  productType: {
    type: String,
    required: [true, "Product type is required"],
    enum: ["seed", "powder"],
    default: null,
  },
  additionalInformation: {
    returnPolicy: {
      type: String,
      required: true,
      default: null,
    },
    shippingPolicy: {
      type: String,
      required: true,
      default: null,
    },
  },
  offerId: {
    type: Schema.Types.ObjectId,
    ref: "Offer",
    default: null,
  },
});

// Create the User model
const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
