import mongoose, { Schema, Document } from "mongoose";

// Define the IOrder interface
export interface IOrder extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  items: {
    productId: mongoose.Schema.Types.ObjectId;
    productName:string;
    quantity: number;
    price: number;
    weight: string;  
    discount?: number;
    discountedPrice?: number;
  }[];
  totalAmount: number;
  totalQuantity: number;
  payment: {
    paymentMode: "cod" | "card";
    paymentStatus: "pending" | "completed" | "failed";
  };
  shippingDetails: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
  orderStatus:
    | "Pending"
    | "Processing"
    | "Confirmed"
    | "Shipped"
    | "Out for Delivery"
    | "Delivered"
    | "Completed"
    | "Cancellation Requested"
    | "Cancelled"
    | "Returned";
  invoiceNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Order schema
const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product ID is required"],
          validate: {
            validator: function (value: mongoose.Schema.Types.ObjectId) {
              return value !== null;
            },
            message: "Product ID cannot be null",
          },
        },
        productName:{
          type: String,
          required: [true, "Product name is required"],
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        weight: { type: String, required: true },
        // discount: { type: Number, default: 0 },
        // discountedPrice: { type: Number, default: 0 },
      },
    ],
    totalAmount: { type: Number, required: true },
    totalQuantity: { type: Number, required: true },
   
    payment: {
      paymentMode: {
        type: String,
        enum: ["cod", "card"],
        required: true,
      },
      paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
      },
    },
    shippingDetails: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Confirmed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Completed",
        "Cancellation Requested",
        "Cancelled",
        "Returned",
      ],
      default: "Pending",
    },
    invoiceNumber: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

// Ensure no duplicate `null` values are indexed
// orderSchema.index({ "items.productId": 1 }, { unique: false });

// Create the Order model
const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
