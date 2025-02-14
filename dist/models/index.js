"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.Cart = exports.Wishlist = exports.Banner = exports.Offer = exports.Product = exports.Admin = exports.User = void 0;
const admin_model_1 = __importDefault(require("./admin.model"));
exports.Admin = admin_model_1.default;
const user_model_1 = __importDefault(require("./user.model"));
exports.User = user_model_1.default;
const product_model_1 = __importDefault(require("./product.model"));
exports.Product = product_model_1.default;
const wishlist_model_1 = __importDefault(require("./wishlist.model"));
exports.Wishlist = wishlist_model_1.default;
const offer_model_1 = __importDefault(require("./offer.model"));
exports.Offer = offer_model_1.default;
const cart_model_1 = __importDefault(require("./cart.model"));
exports.Cart = cart_model_1.default;
const banner_model_1 = __importDefault(require("./banner.model"));
exports.Banner = banner_model_1.default;
const order_model_1 = __importDefault(require("./order.model"));
exports.Order = order_model_1.default;
//# sourceMappingURL=index.js.map