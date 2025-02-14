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
exports.ProductService = void 0;
const cloudinary_1 = require("../config/cloudinary");
const models_1 = require("../models");
class ProductService {
    // create product
    createProduct(productData) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = new models_1.Product(productData);
            yield product.save();
            return product;
        });
    }
    // get all product
    getAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.Product.find();
        });
    }
    //get single product
    getProductById(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!productId) {
                throw new Error("Product ID is required");
            }
            const product = yield models_1.Product.findById(productId);
            return product;
        });
    }
    //update product
    updateProduct(productId, productData, files) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!productId) {
                throw new Error("Product ID is required");
            }
            // Prepare the data to be updated, including handling files
            const updatedData = Object.assign({}, productData);
            // If files are provided, upload them to Cloudinary and update the data
            if (files && files.length > 0) {
                for (const file of files) {
                    try {
                        const fieldName = file.fieldname; // Get field name
                        updatedData[fieldName] = yield (0, cloudinary_1.serverlessUploadOnCloudinary)(file);
                    }
                    catch (error) {
                        console.error(`Error uploading ${file.fieldname} to Cloudinary:`, error);
                        throw new Error(`Error uploading ${file.fieldname} image to Cloudinary`);
                    }
                }
            }
            // Perform the product update in the database
            const product = yield models_1.Product.findByIdAndUpdate(productId, updatedData, { new: true, runValidators: true } // Enforce schema validation
            );
            if (!product) {
                throw new Error("Product not found");
            }
            return product;
        });
    }
    // get Product By Type
    getProductByType(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedType = type.replace(/-/g, " ");
            return models_1.Product.find({ productType: updatedType });
        });
    }
    //search product
    searchProduct(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield models_1.Product.find({
                productName: { $regex: name, $options: "i" },
            }).exec();
            return product;
        });
    }
    //update product price
    updateProductPrice(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const existingProduct = yield models_1.Product.findById(id);
                if (!existingProduct) {
                    throw new Error("Product not found");
                }
                const updatedProduct = yield models_1.Product.findByIdAndUpdate(id, {
                    $set: {
                        productWeight: Object.assign(Object.assign({}, existingProduct.productWeight), updateData.productWeight),
                        productPrice: Object.assign(Object.assign({}, existingProduct.productPrice), updateData.productPrice),
                        productQuantity: Object.assign(Object.assign({}, existingProduct.productQuantity), updateData.productQuantity),
                        totalQuantity: (_a = updateData.totalQuantity) !== null && _a !== void 0 ? _a : existingProduct.totalQuantity,
                    },
                }, { new: true, runValidators: true });
                return updatedProduct;
            }
            catch (error) {
                console.error("Error updating product:", error);
                throw error;
            }
        });
    }
    //filter product
    filterProduct(category, priceOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sortOrder = priceOrder === "asc" ? 1 : -1;
                const products = yield models_1.Product.find({
                    productType: category,
                }).sort({ productPrice: sortOrder });
                return products;
            }
            catch (error) {
                console.error("Error filter product:", error);
                throw error;
            }
        });
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map