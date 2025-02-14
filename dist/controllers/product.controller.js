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
exports.ProductController = void 0;
const services_1 = require("../services");
const user_controller_1 = require("./user.controller");
const cloudinary_1 = require("../config/cloudinary");
// Initialize the UserService instance
const productService = new services_1.ProductService();
class ProductController {
    // create product
    createProductController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield productService.createProduct(req.body);
                res.status(201).json({
                    status: true,
                    message: "Product created successfully",
                    data: product,
                });
            }
            catch (error) {
                console.error("Error creating product:", error);
                (0, user_controller_1.handleError)(res, error);
            }
        });
    }
    // get all product
    getAllProductsController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield productService.getAllProducts();
                res.status(200).json({
                    status: true,
                    message: "Products fetched successfully",
                    data: products,
                });
            }
            catch (error) {
                console.error("Error fetching products:", error);
                (0, user_controller_1.handleError)(res, error);
            }
        });
    }
    //get product according to their type
    getProductByTypeController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield productService.getProductByType(req.params.type);
                res.status(200).json({
                    status: true,
                    message: "Products fetched successfully",
                    data: products,
                });
            }
            catch (error) {
                console.error("Error fetching products:", error);
                (0, user_controller_1.handleError)(res, error);
            }
        });
    }
    //update product
    updateProductController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productId = req.params.id;
                const productData = req.body;
                const files = req.files; // Explicit typing for files
                // Prepare the data to be updated, including handling image uploads
                const updatedData = Object.assign({}, productData);
                // Ensure cardImages is initialized as an object
                if (!updatedData.cardImages) {
                    updatedData.cardImages = {};
                }
                // Check if files exist and upload to Cloudinary
                if (files["bgImage"] &&
                    Array.isArray(files["bgImage"]) &&
                    files["bgImage"][0]) {
                    updatedData.cardImages.bgImage = yield (0, cloudinary_1.serverlessUploadOnCloudinary)(files["bgImage"][0]);
                }
                if (files["productImage"] &&
                    Array.isArray(files["productImage"]) &&
                    files["productImage"][0]) {
                    updatedData.cardImages.productImage =
                        yield (0, cloudinary_1.serverlessUploadOnCloudinary)(files["productImage"][0]);
                }
                if (files["mainImage"] &&
                    Array.isArray(files["mainImage"]) &&
                    files["mainImage"][0]) {
                    updatedData.mainImage = yield (0, cloudinary_1.serverlessUploadOnCloudinary)(files["mainImage"][0]);
                }
                // Call the service to update the product with the updated data and file URLs
                const updatedProduct = yield productService.updateProduct(productId, updatedData, Object.values(files).flat());
                // Respond with the updated product data
                res.status(200).json({
                    status: true,
                    message: "Product updated successfully",
                    data: updatedProduct,
                });
            }
            catch (error) {
                console.error("Error updating product:", error);
                (0, user_controller_1.handleError)(res, error);
            }
        });
    }
    //get product by id
    getProductByIdController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.params.id, "productId controller");
                const product = yield productService.getProductById(req.params.id);
                res.status(200).json({
                    status: true,
                    message: "Product fetched successfully",
                    data: product,
                });
            }
            catch (error) {
                console.error("Error fetching product:", error);
                (0, user_controller_1.handleError)(res, error);
            }
        });
    }
    //search product
    searchProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield productService.searchProduct(req.params.name);
                res.status(200).json({
                    status: true,
                    message: "Product fetched successfully",
                    data: product,
                });
            }
            catch (error) {
                console.error("Error fetching product:", error);
                (0, user_controller_1.handleError)(res, error);
            }
        });
    }
    //update price
    updateProductPrice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield productService.updateProductPrice(req.params.id, req.body);
                res.status(200).json({
                    status: true,
                    message: "Product price updated successfully",
                    data: product,
                });
            }
            catch (error) {
                console.error("Error in update product price:", error);
                (0, user_controller_1.handleError)(res, error);
            }
        });
    }
    //filter product
    filterProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { category, priceOrder } = req.params;
                const product = yield productService.filterProduct(category, priceOrder);
            }
            catch (error) {
                console.error("Error in filter product:", error);
                (0, user_controller_1.handleError)(res, error);
            }
        });
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=product.controller.js.map