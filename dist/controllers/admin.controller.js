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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const services_1 = require("../services");
const user_controller_1 = require("./user.controller");
// Initialize the UserService instance
const adminService = new services_1.AdminService();
class AdminController {
    // register
    registerController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const user = yield adminService.register(userData);
                const _a = user.toObject(), { password } = _a, safeUserData = __rest(_a, ["password"]);
                res.status(201).json({
                    status: true,
                    message: "Admin registered successfully",
                    data: safeUserData,
                });
            }
            catch (error) {
                console.error("Error registering admin:", error);
                (0, user_controller_1.handleError)(res, error);
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
                const adminData = yield adminService.login(email, password);
                res.status(200).json({
                    status: true,
                    message: "Admin login successful",
                    data: adminData,
                });
            }
            catch (error) {
                console.error("Error logging in admin:", error);
                (0, user_controller_1.handleError)(res, error);
            }
        });
    }
    //get current data
    getAdminCurrentController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const user = yield adminService.getCurrentAdmin(req.user._id);
                res.status(200).json({
                    status: true,
                    message: "Admin fetched successfully",
                    data: user,
                });
            }
            catch (error) {
                console.error("Error fetching admmin:", error);
                (0, user_controller_1.handleError)(res, error);
            }
        });
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map