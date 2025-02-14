"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductQuantity = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const productSchema = new mongoose_1.Schema({
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
            required: function () {
                var _a, _b;
                return (_b = (_a = this === null || this === void 0 ? void 0 : this.productWeight) === null || _a === void 0 ? void 0 : _a["100g"]) !== null && _b !== void 0 ? _b : false;
            },
        },
        "250g": {
            type: Number,
            required: function () {
                var _a, _b;
                return (_b = (_a = this === null || this === void 0 ? void 0 : this.productWeight) === null || _a === void 0 ? void 0 : _a["250g"]) !== null && _b !== void 0 ? _b : false;
            },
        },
        "500g": {
            type: Number,
            required: function () {
                var _a, _b;
                return (_b = (_a = this === null || this === void 0 ? void 0 : this.productWeight) === null || _a === void 0 ? void 0 : _a["500g"]) !== null && _b !== void 0 ? _b : false;
            },
        },
        "1kg": {
            type: Number,
            required: function () {
                var _a, _b;
                return (_b = (_a = this === null || this === void 0 ? void 0 : this.productWeight) === null || _a === void 0 ? void 0 : _a["1kg"]) !== null && _b !== void 0 ? _b : false;
            },
        },
        "2kg": {
            type: Number,
            required: function () {
                var _a, _b;
                return (_b = (_a = this === null || this === void 0 ? void 0 : this.productWeight) === null || _a === void 0 ? void 0 : _a["2kg"]) !== null && _b !== void 0 ? _b : false;
            },
        },
        "3kg": {
            type: Number,
            required: function () {
                var _a, _b;
                return (_b = (_a = this === null || this === void 0 ? void 0 : this.productWeight) === null || _a === void 0 ? void 0 : _a["3kg"]) !== null && _b !== void 0 ? _b : false;
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
        type: mongoose_1.Schema.Types.ObjectId,
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
    this.totalQuantity = Object.values(this.productQuantity).reduce((sum, qty) => sum + qty, 0);
    next();
});
// Pre-update hook for when a product is updated using `updateOne` or similar queries
productSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();
    if (update.$set && update.$set.productQuantity) {
        const newQuantities = update.$set.productQuantity;
        update.$set.totalQuantity = Object.values(newQuantities).reduce((sum, qty) => sum + qty, 0);
    }
    next();
});
// Create the User model
const Product = mongoose_1.default.model("Product", productSchema);
const getProductQuantity = (productId, weight) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield Product.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }
        if (!product.productWeight[weight]) {
            throw new Error(`Weight ${weight} is not available for this product`);
        }
        return product.productQuantity[weight] || null;
    }
    catch (error) {
        console.error("Error fetching product quantity:", error);
        throw error;
    }
});
exports.getProductQuantity = getProductQuantity;
exports.default = Product;
//# sourceMappingURL=product.model.js.map