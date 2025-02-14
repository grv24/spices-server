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
exports.WishlistController = void 0;
const user_controller_1 = require("./user.controller");
const wishlist_service_1 = require("../services/wishlist.service");
const wishlistService = new wishlist_service_1.WishlistService();
class WishlistController {
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
                const cart = yield wishlistService.createWishlist(data, user._id);
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
                // const data: IWishlist = req.body;
                const wishlist = yield wishlistService.getWishlist(user._id);
                res.status(201).json({
                    status: true,
                    message: "Wishlist get successfully",
                    data: wishlist,
                });
            }
            catch (error) {
                console.error("Error in get cart:", error);
                (0, user_controller_1.handleError)(res, error);
            }
        });
    }
    removeProductController(req, res) {
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
                const cart = yield wishlistService.removeProduct(user._id, productId, weight);
                res.status(201).json({
                    status: true,
                    message: "product remove from wishlist successfully",
                    data: cart,
                });
            }
            catch (error) {
                console.error("Error in remove product in wishlist:", error);
                (0, user_controller_1.handleError)(res, error);
            }
        });
    }
    clearWishtlistController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                if (!user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                yield wishlistService.clearWishlist(user._id);
                res.status(201).json({
                    status: true,
                    message: "clear wishlist successfully",
                });
            }
            catch (error) {
                console.error("Error in clear wishlist:", error);
                (0, user_controller_1.handleError)(res, error);
            }
        });
    }
}
exports.WishlistController = WishlistController;
//# sourceMappingURL=wishlist.controller.js.map