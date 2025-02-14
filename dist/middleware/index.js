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
exports.authenticateMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const authenticateMiddleware = (...allowedRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authHeader = req.headers["authorization"];
            const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
            if (!token) {
                return res.status(401).json({ message: "Access token is missing" });
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
            let user = null;
            if (allowedRoles.includes("user")) {
                user = yield models_1.User.findById(decoded.id);
            }
            else if (allowedRoles.includes("admin")) {
                user = yield models_1.Admin.findById(decoded.id);
            }
            if (!user) {
                return res.status(404).json({ message: `${allowedRoles.includes("user") ? "User not found" : "Admin not found"}` });
            }
            req.user = user; // Attach user to request
            next();
        }
        catch (error) {
            console.error("Authentication error:", error);
            res.status(403).json({ message: "Invalid token" });
        }
    });
};
exports.authenticateMiddleware = authenticateMiddleware;
//# sourceMappingURL=index.js.map