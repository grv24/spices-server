"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const banner_route_1 = require("./banner.route");
const router = express_1.default.Router();
const productController = new controllers_1.ProductController();
//create product
router.post("/", (0, middleware_1.authenticateMiddleware)("admin"), (req, res) => productController.createProductController(req, res));
//update product
router.patch("/:id", banner_route_1.upload.fields([
    { name: "bgImage", maxCount: 1 },
    { name: "productImage", maxCount: 1 },
    { name: "mainImage", maxCount: 1 },
]), (0, middleware_1.authenticateMiddleware)("admin"), (req, res) => productController.updateProductController(req, res));
//get all product
router.get("/", (req, res) => productController.getAllProductsController(req, res));
//get product by type
router.get("/:type", (req, res) => productController.getProductByTypeController(req, res));
//get by id
router.get("/single/:id", (req, res) => productController.getProductByIdController(req, res));
//search product
router.get("/search/:name", (req, res) => productController.searchProduct(req, res));
//update product price
router.patch("/price/:id", (0, middleware_1.authenticateMiddleware)("admin"), (req, res) => productController.updateProductPrice(req, res));
//filter product
router.get('/filter/:category/:priceOrder', (req, res) => productController.filterProduct(req, res));
exports.default = router;
//# sourceMappingURL=product.route.js.map