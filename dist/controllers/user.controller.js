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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = exports.handleError = void 0;
const services_1 = require("../services");
const passport_1 = __importDefault(require("passport"));
// Initialize the UserService instance
const userService = new services_1.UserService();
// Utility for error handling
const handleError = (res, error) => {
    if (error instanceof Error) {
        res.status(400).json({ message: error.message, status: false });
    }
    else {
        res
            .status(500)
            .json({ message: "Internal server error. Please try again later." });
    }
};
exports.handleError = handleError;
class UserController {
    // register
    registerController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const user = yield userService.register(userData);
                const _a = user.toObject(), { password } = _a, safeUserData = __rest(_a, ["password"]);
                res.status(201).json({
                    status: true,
                    message: "User registered successfully",
                    data: safeUserData,
                });
            }
            catch (error) {
                console.error("Error registering user:", error);
                (0, exports.handleError)(res, error);
            }
        });
    }
    // login
    loginController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    return res
                        .status(400)
                        .json({ message: "Email and password are required." });
                }
                const userData = yield userService.login(email, password, res);
                res.status(200).json({
                    status: true,
                    message: "User login successful",
                    data: userData,
                });
            }
            catch (error) {
                console.error("Error logging in user:", error);
                (0, exports.handleError)(res, error);
            }
        });
    }
    // chngepassword
    passwordChangeController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                if (!user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const { oldPassword, newPassword } = req.body;
                if (!oldPassword || !newPassword) {
                    return res
                        .status(400)
                        .json({ message: "Old and new passwords are required." });
                }
                yield userService.changePassword(user._id, oldPassword, newPassword);
                res.status(200).json({ message: "Password changed successfully" });
            }
            catch (error) {
                console.error("Error changing password:", error);
                (0, exports.handleError)(res, error);
            }
        });
    }
    getUserCurrentController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const user = yield userService.getCurrentUser(req.user._id);
                res.status(200).json({
                    status: true,
                    message: "User fetched successfully",
                    data: user,
                });
            }
            catch (error) {
                console.error("Error fetching user:", error);
                (0, exports.handleError)(res, error);
            }
        });
    }
    updateUserCurrentController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const user = yield userService.updateUser(req.user._id, req.body);
                res.status(200).json({
                    status: true,
                    message: "User updated successfully",
                    data: user,
                });
            }
            catch (error) {
                console.error("Error updating user:", error);
                (0, exports.handleError)(res, error);
            }
        });
    }
    getAllUserController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userService.getAllUser();
                res.status(200).json({
                    status: true,
                    message: "Users fetched successfully",
                    data: users,
                });
            }
            catch (error) {
                console.error("Error fetching users:", error);
                (0, exports.handleError)(res, error);
            }
        });
    }
    //logout
    logoutController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                yield userService.logoutUser(res);
                res.status(200).json({ message: "User logged out successfully" });
            }
            catch (error) {
                console.error("Error logging out user:", error);
                (0, exports.handleError)(res, error);
            }
        });
    }
    //google auth
    // Google Auth Redirect
    googleAuthController(req, res) {
        passport_1.default.authenticate("google", { scope: ["profile", "email"] })(req, res);
    }
    // Google Callback
    googleAuthCallbackController(req, res) {
        passport_1.default.authenticate("google", { failureRedirect: "/" }, (err, user) => {
            if (err || !user) {
                return res.status(400).json({ message: "Authentication failed" });
            }
            req.login(user, (err) => {
                if (err)
                    return res.status(500).json({ message: "Login error" });
                res.status(200).json({
                    status: true,
                    message: "Google login successful",
                    data: user,
                });
            });
        })(req, res);
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map