"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
const userController = new controllers_1.UserController();
//regiter
router.post("/register", (req, res) => userController.registerController(req, res));
//login
router.post("/login", (req, res) => userController.loginController(req, res));
//logout
router.get("/logout", (req, res) => userController.logoutController(req, res));
//change-password
router.post("/change-password", (0, middleware_1.authenticateMiddleware)("user"), (req, res) => userController.passwordChangeController(req, res));
// get all user
router.get("/all", (req, res) => userController.getAllUserController(req, res));
//get user
router.get("/", (0, middleware_1.authenticateMiddleware)("user"), (req, res) => userController.getUserCurrentController(req, res));
//update user
router.patch("/", (0, middleware_1.authenticateMiddleware)("user"), (req, res) => userController.updateUserCurrentController(req, res));
// ✅ Google Login Route
router.get("/auth/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
// ✅ Google Callback Route
router.get("/auth/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/" }), userController.googleAuthCallbackController);
exports.default = router;
//# sourceMappingURL=user.route.js.map