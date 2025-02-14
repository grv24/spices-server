"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const admin_controller_1 = require("../controllers/admin.controller");
const router = express_1.default.Router();
// controller
const adminController = new admin_controller_1.AdminController();
//regiter
router.post("/register", (req, res) => adminController.registerController(req, res));
//login
router.post("/login", (req, res) => adminController.loginController(req, res));
//get current admin
router.get("/", (0, middleware_1.authenticateMiddleware)("admin"), (req, res) => adminController.getAdminCurrentController(req, res));
exports.default = router;
//# sourceMappingURL=admin.route.js.map