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
exports.UserService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
class UserService {
    //register
    register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, f_name, l_name, role } = userData;
            // Check if user with the email already exists
            const existingUser = yield models_1.User.findOne({ email });
            if (existingUser) {
                throw new Error("User already exists with this email.");
            }
            // Create a new user (password will be automatically hashed via the pre-save hook)
            const user = new models_1.User(Object.assign({}, userData));
            // Save the user to the database
            return yield user.save();
        });
    }
    //login
    login(email, password, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.User.findOne({ email });
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
                firstName: user.f_name,
                lastName: user.l_name,
            }, process.env.JWT_SECRET, {
                expiresIn: "12h",
            });
            // Save the token in a cookie
            res.cookie("token", token, {
                httpOnly: false, // Prevents client-side access to the cookie
                secure: process.env.NODE_ENV === "production", // Use HTTPS in production
                maxAge: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
                domain: "localhost", // Ensure this matches your server's domain
                path: "/",
            });
            return { token };
        });
    }
    //chage passsword
    changePassword(userId, oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.User.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            if (user.password != oldPassword) {
                throw new Error("Old password is incorrect");
            }
            user.password = newPassword;
            // const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
            // if (!isPasswordValid) {
            //   throw new Error("Old password is incorrect");
            // }
            // const salt = await bcrypt.genSalt(10);
            // user.password = await bcrypt.hash(newPassword, salt);
            yield user.save();
        });
    }
    //get current user
    getCurrentUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.User.findById(userId);
            const cart = yield models_1.Cart.find({ userId }).populate("productId");
            console.log(cart, user);
            if (!user) {
                throw new Error("User not found");
            }
            return user;
        });
    }
    //update user
    updateUser(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.User.findByIdAndUpdate(userId, data, { new: true });
            if (!user) {
                throw new Error("User not found");
            }
            return user;
        });
    }
    //forget password
    forgetPassword() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    //logout
    logoutUser(res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Clear the token cookie
            res.clearCookie("token", {
                httpOnly: false, // Prevents client-side access to the cookie
                secure: process.env.NODE_ENV === "production", // Use HTTPS in production
                domain: "localhost", // Ensure this matches your server's domain
                path: "/",
            });
        });
    }
    //delete user
    deleteUser() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    //get all user
    getAllUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield models_1.User.find();
            return users;
        });
    }
    //send otp
    sendOtp() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    //verify otp
    verifyOtp() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map