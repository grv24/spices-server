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
exports.CartController = void 0;
const services_1 = require("../services");
const user_controller_1 = require("./user.controller");
const cartService = new services_1.CartService();
class CartController {
    createController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                if (!user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const data = {
                    productId: req.body.productId,
                    quantity: req.body.quantity,
                    weight: req.body.weight,
                };
                const cart = yield cartService.createCart(data, user._id);
                res.status(201).json({
                    status: true,
                    message: "cart created successfully",
                    data: cart,
                });
            }
            catch (error) {
                console.error("Error in create cart:", error);
                (0, user_controller_1.handleError)(res, error);
            }
        });
    }
    getController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                if (!user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const data = req.body;
                const cart = yield cartService.getCart(user._id);
                res.status(201).json({
                    status: true,
                    message: "cart get successfully",
                    data: cart,
                });
            }
            catch (error) {
                console.error("Error in get cart:", error);
                (0, user_controller_1.handleError)(res, error);
            }
        });
    }
    removeCartProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productId = req.params.id;
                const weight = req.params.weight;
                const user = req.user;
                if (!user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                if (!productId) {
                    return res.status(401).json({ message: "Product id is required" });
                }
                const cart = yield cartService.removeCartProduct(user._id, productId, weight);
                res.status(201).json({
                    status: true,
                    message: "product remove from cart successfully",
                    data: cart,
                });
            }
            catch (error) {
                console.error("Error in remove product in cart:", error);
                (0, user_controller_1.handleError)(res, error);
            }
        });
    }
    clearCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                if (!user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                yield cartService.clearCart(user._id);
                res.status(201).json({
                    status: true,
                    message: "clear cart successfully",
                });
            }
            catch (error) {
                console.error("Error in clear cart:", error);
                (0, user_controller_1.handleError)(res, error);
            }
        });
    }
}
exports.CartController = CartController;
//# sourceMappingURL=cart.controller.js.map