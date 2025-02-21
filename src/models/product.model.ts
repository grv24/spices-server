import mongoose, { Schema } from "mongoose";

export interface IProduct extends Document {
  productName: string;
  productDescription: string;
  cardImages: {
    bgImage: string;
    productImage: string;
  };
  mainImage: string;
  productWeight: {
    "100g": boolean;
    "250g": boolean;
    "500g": boolean;
    "1kg": boolean;
    "2kg": boolean;
    "3kg": boolean;
  };
  productPrice: {
    "100g": boolean;
    "250g": number;
    "500g": number;
    "1kg": number;
    "2kg": number;
    "3kg": number;
  };
  productQuantity: {
    "100g": number;
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
    unique: true,
  },
  cardImages: {
    bgImage: {
      type: String,
      required: false,
    },
    productImage: {
      type: String,
      required: false,
    },
  },
  mainImage: {
    type: String,
    required: false,
  },
  productDescription: {
    type: String,
    required: [true, "Product description is required"],
  },

  productWeight: {
    "100g": { type: Boolean, default: false },
    "250g": { type: Boolean, default: false },
    "500g": { type: Boolean, default: false },
    "1kg": { type: Boolean, default: false },
    "2kg": { type: Boolean, default: false },
    "3kg": { type: Boolean, default: false },
  },
  productPrice: {
    "100g": {
      type: Number,
      required: function (this: any) {
        return this?.productWeight?.["100g"] ?? false;
      },
    },
    "250g": {
      type: Number,
      required: function (this: any) {
        return this?.productWeight?.["250g"] ?? false;
      },
    },
    "500g": {
      type: Number,
      required: function (this: any) {
        return this?.productWeight?.["500g"] ?? false;
      },
    },
    "1kg": {
      type: Number,
      required: function (this: any) {
        return this?.productWeight?.["1kg"] ?? false;
      },
    },
    "2kg": {
      type: Number,
      required: function (this: any) {
        return this?.productWeight?.["2kg"] ?? false;
      },
    },
    "3kg": {
      type: Number,
      required: function (this: any) {
        return this?.productWeight?.["3kg"] ?? false;
      },
    },
  },
  productQuantity: {
    "100g": { type: Number, default: 0 },
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
  productType: {
    type: String,
    required: [true, "Product type is required"],
    enum: ["seed", "powder"],
    default: null,
  },

  offerId: {
    type: Schema.Types.ObjectId,
    ref: "Offer",
    default: null,
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
    required: false,
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
    (sum: number, qty: number) => sum + qty,
    0
  );
  next();
});
// Pre-update hook for when a product is updated using `updateOne` or similar queries
productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as mongoose.UpdateQuery<any>;
  if (update.$set && update.$set.productQuantity) {
    const newQuantities = update.$set.productQuantity;
    update.$set.totalQuantity = Object.values(newQuantities).reduce(
      (sum: number, qty: number) => sum + qty,
      0
    );
  }
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
