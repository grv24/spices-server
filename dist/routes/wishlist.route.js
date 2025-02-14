"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
const cartController = new controllers_1.WishlistController();
//create cart
router.post("/", (0, middleware_1.authenticateMiddleware)("user"), (req, res) => cartController.createController(req, res));
//get cart
router.get("/", (0, middleware_1.authenticateMiddleware)("user"), (req, res) => cartController.getController(req, res));
//remove product
router.delete("/:id/:weight", (0, middleware_1.authenticateMiddleware)("user"), (req, res) => cartController.removeProductController(req, res));
//clear wishlist
router.get("/clear/product", (0, middleware_1.authenticateMiddleware)("user"), (req, res) => cartController.clearWishtlistController(req, res));
exports.default = router;
//# sourceMappingURL=wishlist.route.js.map