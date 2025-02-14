"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = exports.wishlistRouter = exports.cartRouter = exports.bannerRouter = exports.productRouter = exports.adminRouter = exports.userRouter = void 0;
const user_route_1 = __importDefault(require("./user.route"));
exports.userRouter = user_route_1.default;
const admin_route_1 = __importDefault(require("./admin.route"));
exports.adminRouter = admin_route_1.default;
const product_route_1 = __importDefault(require("./product.route"));
exports.productRouter = product_route_1.default;
const banner_route_1 = __importDefault(require("./banner.route"));
exports.bannerRouter = banner_route_1.default;
const cart_route_1 = __importDefault(require("./cart.route"));
exports.cartRouter = cart_route_1.default;
const wishlist_route_1 = __importDefault(require("./wishlist.route"));
exports.wishlistRouter = wishlist_route_1.default;
const order_route_1 = __importDefault(require("./order.route"));
exports.orderRouter = order_route_1.default;
//# sourceMappingURL=index.js.map