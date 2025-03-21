"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema = new mongoose_1.Schema({
    f_name: {
        type: String,
        required: function () {
            return !this.isOAuthUser;
        }, // Required only if not an OAuth user
        trim: true,
        lowercase: true,
    },
    l_name: {
        type: String,
        required: function () {
            return !this.isOAuthUser;
        }, // Required only if not an OAuth user
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /.+\@.+\..+/,
    },
    password: {
        type: String,
        required: function () {
            return !this.isOAuthUser;
        }, // Required only if not an OAuth user
    },
    isOAuthUser: { type: Boolean, default: false }, // Flag to identify OAuth users
    refreshToken: { type: String, required: false },
    role: { type: String, default: "user" },
    status: {
        type: String,
        required: true,
        enum: ["active", "inactive", "suspended"],
        default: "active",
    },
});
// Password hashing before saving the user
// userSchema.pre("save", async function (next) {
//   const user = this as IUser;
//   if (!user.isModified("password")) {
//     return next(); // Skip hashing if the password hasn't been modified
//   }
//   const salt = await bcrypt.genSalt(10); // Generate salt for hashing
//   user.password = await bcrypt.hash(user.password, salt); // Hash the password
//   next(); // Continue saving the user
// });
// Method to compare passwords
userSchema.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        return yield bcrypt_1.default.compare(candidatePassword, user.password);
    });
};
// Method to generate authentication token
userSchema.methods.generateAuthToken = function () {
    const user = this;
    const payload = { id: user._id, role: user.role };
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};
// Method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
    const user = this;
    const payload = { id: user._id };
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};
// Create the User model
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
//# sourceMappingURL=user.model.js.map