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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
class AdminService {
    //register
    register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, username, role } = userData;
            // Check if user with the email already exists
            const existingUser = yield models_1.Admin.findOne({ email });
            if (existingUser) {
                throw new Error("User already exists with this email.");
            }
            // Create a new user (password will be automatically hashed via the pre-save hook)
            const admin = new models_1.Admin(Object.assign({}, userData));
            // Save the user to the database
            return yield admin.save();
        });
    }
    //login
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.Admin.findOne({ email });
            if (!user) {
                throw new Error("User not found.");
            }
            // const isMatch = await user.comparePassword(password);
            if (user.password != password) {
                throw new Error("Invalid credentials.");
            }
            const token = jsonwebtoken_1.default.sign({
                id: user._id,
                role: user.role,
                email: user.email,
                username: user.username,
            }, process.env.JWT_SECRET, {
                expiresIn: "12h",
            });
            return { token };
        });
    }
    //get current admin
    getCurrentAdmin(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield models_1.Admin.findById(userId);
            if (!admin) {
                throw new Error("Admin not found");
            }
            return admin;
        });
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map