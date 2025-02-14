"use strict";
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
exports.WishlistService = void 0;
const checkProductAvailability_1 = require("../utils/checkProductAvailability");
const models_1 = require("../models");
class WishlistService {
    createWishlist(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let wishlist = yield models_1.Wishlist.findOne({ userId });
                if (wishlist) {
                    // Check if the product already exists in the wishlist with the same weight
                    const existingProductIndex = wishlist.products.findIndex((product) => product.productId.toString() === data.productId.toString() &&
                        product.weight === data.weight);
                    if (existingProductIndex !== -1) {
                        // If the product exists with the same weight, update its quantity
                        wishlist.products[existingProductIndex].quantity += data.quantity;
                    }
                    else {
                        // If product exists but weight is different, add as a new entry
                        const product = yield models_1.Product.findById(data.productId);
                        const availability = (0, checkProductAvailability_1.CheckProductAvailability)(product, data.weight);
                        wishlist.products.push({
                            productId: data.productId,
                            quantity: data.quantity,
                            weight: data.weight,
                            price: String(availability === null || availability === void 0 ? void 0 : availability.price),
                        });
                    }
                    yield wishlist.save();
                }
                else {
                    // If no wishlist exists, create a new one
                    const product = yield models_1.Product.findById(data.productId);
                    const availability = (0, checkProductAvailability_1.CheckProductAvailability)(product, data.weight);
                    wishlist = new models_1.Wishlist({
                        userId,
                        products: [
                            {
                                productId: data.productId,
                                quantity: data.quantity,
                                weight: data.weight,
                                price: availability === null || availability === void 0 ? void 0 : availability.price, // Make sure to include other required details
                            },
                        ],
                    });
                    yield wishlist.save();
                }
                // Return the populated wishlist
                return yield models_1.Wishlist.findOne({ userId }).populate("products.productId");
            }
            catch (error) {
                console.error("Error in create wishlist:", error);
                throw error;
            }
        });
    }
    getWishlist(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield models_1.Wishlist.findOne({ userId }).populate("products.productId");
            }
            catch (error) {
                console.error("Error in get wishlist:", error);
                throw error;
            }
        });
    }
    removeProduct(userId, productId, weight) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the wishlist by userId and delete it
                const wishlist = yield models_1.Wishlist.findOne({ userId });
                if (!wishlist) {
                    throw new Error("Wishlist not found");
                }
                // Filter out the product from the wishlist products array
                wishlist.products = wishlist.products.filter((product) => product.productId.toString() !== productId ||
                    product.weight !== weight);
                // If products are left, save the updated wishlist
                if (wishlist.products.length > 0) {
                    yield wishlist.save();
                    return wishlist;
                }
                // If no products left, delete the wishlist
                yield models_1.Wishlist.findByIdAndDelete(wishlist._id);
                return null;
            }
            catch (error) {
                console.error("Error in removeProduct:", error);
                throw error;
            }
        });
    }
    clearWishlist(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wishlist = yield models_1.Wishlist.findOneAndDelete({ userId: userId });
                if (!wishlist) {
                    throw new Error("Wishlist not found");
                }
                return wishlist;
            }
            catch (error) {
                console.error("Error in clear wishlist:", error);
                throw error;
            }
        });
    }
}
exports.WishlistService = WishlistService;
//# sourceMappingURL=wishlist.service.js.map