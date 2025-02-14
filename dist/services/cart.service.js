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
exports.CartService = void 0;
const models_1 = require("../models");
const checkProductAvailability_1 = require("../utils/checkProductAvailability");
class CartService {
    createCart(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let cart = yield models_1.Cart.findOne({ userId });
                if (cart) {
                    // Check if the product already exists in the wishlist with the same weight
                    const existingProductIndex = cart.products.findIndex((product) => product.productId.toString() === data.productId.toString() &&
                        product.weight === data.weight);
                    if (existingProductIndex !== -1) {
                        // If the product exists with the same weight, update its quantity
                        cart.products[existingProductIndex].quantity += data.quantity;
                    }
                    else {
                        // If product exists but weight is different, add as a new entry
                        const product = yield models_1.Product.findById(data.productId);
                        const availability = (0, checkProductAvailability_1.CheckProductAvailability)(product, data.weight);
                        cart.products.push({
                            productId: data.productId,
                            quantity: data.quantity,
                            weight: data.weight,
                            price: String(availability === null || availability === void 0 ? void 0 : availability.price),
                        });
                    }
                    yield cart.save();
                }
                else {
                    // If no wishlist exists, create a new one
                    const product = yield models_1.Product.findById(data.productId);
                    const availability = (0, checkProductAvailability_1.CheckProductAvailability)(product, data.weight);
                    cart = new models_1.Cart({
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
                    yield cart.save();
                }
                // Populate products and return the updated cart
                return yield models_1.Cart.findOne({ userId }).populate("products.productId");
            }
            catch (error) {
                console.error("Error in create cart:", error);
                throw error;
            }
        });
    }
    getCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield models_1.Cart.findOne({ userId }).populate("products.productId");
            }
            catch (error) {
                console.error("Error in get cart:", error);
                throw error;
            }
        });
    }
    removeCartProduct(userId, productId, weight) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cart = yield models_1.Cart.findOne({ userId });
                if (!cart) {
                    throw new Error("Cart not found");
                }
                // Filter out the product from the wishlist products array
                cart.products = cart.products.filter((product) => product.productId.toString() !== productId ||
                    product.weight !== weight);
                // If products are left, save the updated wishlist
                if (cart.products.length > 0) {
                    yield cart.save();
                    return cart;
                }
                // If no products left, delete the wishlist
                yield models_1.Cart.findByIdAndDelete(cart._id);
                return null;
            }
            catch (error) {
                console.error("Error in get cart:", error);
                throw error;
            }
        });
    }
    clearCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cart = yield models_1.Cart.findOneAndDelete({ userId: userId });
                if (!cart) {
                    throw new Error("Cart not found");
                }
                return cart;
            }
            catch (error) {
                console.error("Error in get cart:", error);
                throw error;
            }
        });
    }
}
exports.CartService = CartService;
//# sourceMappingURL=cart.service.js.map