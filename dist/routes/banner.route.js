"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.storage = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const multer_1 = __importDefault(require("multer"));
const banner_controller_1 = require("../controllers/banner.controller");
const router = express_1.default.Router();
exports.storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({ storage: exports.storage });
// controller
const bannerController = new banner_controller_1.BannerController();
// create banner
router.post("/", (0, middleware_1.authenticateMiddleware)("admin"), exports.upload.single("image"), (req, res) => bannerController.createBannerController(req, res));
// update banner
router.patch("/:id", (0, middleware_1.authenticateMiddleware)("admin"), exports.upload.single("image"), (req, res) => bannerController.updateBannerController(req, res));
// delete banner
router.delete("/:id", (req, res) => bannerController.deleteBannerController(req, res));
// get all banners
router.get("/", (req, res) => bannerController.getAllBannersController(req, res));
exports.default = router;
//# sourceMappingURL=banner.route.js.map