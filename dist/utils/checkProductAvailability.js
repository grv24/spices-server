"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckProductAvailability = void 0;
const CheckProductAvailability = (product, weight) => {
    var _a, _b, _c, _d;
    if (((_a = product === null || product === void 0 ? void 0 : product.productWeight) === null || _a === void 0 ? void 0 : _a[weight]) &&
        ((_b = product === null || product === void 0 ? void 0 : product.productQuantity) === null || _b === void 0 ? void 0 : _b[weight]) > 0) {
        return {
            available: true,
            price: (_d = (_c = product.productPrice) === null || _c === void 0 ? void 0 : _c[weight]) !== null && _d !== void 0 ? _d : "Price not available",
            product,
        };
    }
    else {
        return {
            available: false,
            message: "Weight not available or out of stock",
            product,
        };
    }
};
exports.CheckProductAvailability = CheckProductAvailability;
//# sourceMappingURL=checkProductAvailability.js.map