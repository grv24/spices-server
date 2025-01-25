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
  productQuantity: {
    "250g": number;
    "500g": number;
    "1kg": number;
    "2kg": number;
    "3kg": number;
  };
  totalQuantity: number;
  productImage: string[];
  productType: string;
  additionalInformation: {
    returnPolicy: string;
    shippingPolicy: string;
  };
  offerId: Schema.Types.ObjectId;
  status: {
    "250g": "in stock" | "out of stock";
    "500g": "in stock" | "out of stock";
    "1kg": "in stock" | "out of stock";
    "2kg": "in stock" | "out of stock";
    "3kg": "in stock" | "out of stock";
  };
  reviews: Array<{
    rating: number;
    reviewText: string;
    reviewer: string;
    date: Date;
  }>;
  keyFeatures: Array<{
    title: string;
    description: string;
  }>;
  why: string;
  benefits: Array<{
    title: string;
    description: string;
  }>;
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
  productQuantity: {
    "250g": { type: Number, default: 0 },
    "500g": { type: Number, default: 0 },
    "1kg": { type: Number, default: 0 },
    "2kg": { type: Number, default: 0 },
    "3kg": { type: Number, default: 0 },
  },
  totalQuantity: {
    type: Number,
    default: 0,
  },
  productImage: {
    type: [String],
    required: [true, "Product image is required"],
  },
  productType: {
    type: String,
    required: [true, "Product type is required"],
    enum: ["dried seed", "spicy masala"],
    default: null,
  },
  // additionalInformation: {
  //   returnPolicy: {
  //     type: String,
  //     required: true,
  //     default: null,
  //   },
  //   shippingPolicy: {
  //     type: String,
  //     required: true,
  //     default: null,
  //   },
  // },
  offerId: {
    type: Schema.Types.ObjectId,
    ref: "Offer",
    default: null,
  },
  status: {
    "250g": {
      type: String,
      enum: ["in stock", "out of stock"],
      default: "out of stock",
    },
    "500g": {
      type: String,
      enum: ["in stock", "out of stock"],
      default: "out of stock",
    },
    "1kg": {
      type: String,
      enum: ["in stock", "out of stock"],
      default: "out of stock",
    },
    "2kg": {
      type: String,
      enum: ["in stock", "out of stock"],
      default: "out of stock",
    },
    "3kg": {
      type: String,
      enum: ["in stock", "out of stock"],
      default: "out of stock",
    },
  },
  reviews: [
    {
      rating: { type: Number, required: true, min: 1, max: 5 },
      reviewText: { type: String, required: true },
      reviewer: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
  keyFeatures: {
    type: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    required: [true, "Key features are required"],
  },
  why: {
    type: String,
    required: [true, "Why is required"],
  },
  benifits: {
    type: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    required: [true, "Benifits are required"],
  },
});

productSchema.pre("save", function (next) {
  this.totalQuantity = Object.values(this.productQuantity).reduce(
    (sum, qty) => sum + qty,
    0
  );
  next();
});


// Create the User model
const Product = mongoose.model<IProduct>("Product", productSchema);

const getProductQuantity = async (
  productId: mongoose.Types.ObjectId,
  weight: keyof IProduct["productWeight"]
): Promise<number | null> => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    if (!product.productWeight[weight]) {
      throw new Error(`Weight ${weight} is not available for this product`);
    }

    return product.productQuantity[weight] || null;
  } catch (error) {
    console.error("Error fetching product quantity:", error);
    throw error;
  }
};

export default Product;

export { getProductQuantity };
