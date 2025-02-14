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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const config_1 = require("./config"); // Your config file
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Import Passport configuration (Important!)
require("./config/passport");
const allowedOrigins = [
    config_1.config.CLIENT_URL_LOCAL, // Local frontend for testing
    config_1.config.CLIENT_URL_LIVE, // Production frontend URL
    "http://localhost:5173", // Local frontend for testing
    "https://mahamaya33.in",
];
const app = (0, express_1.default)();
// 🔹 CORS Middleware
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        console.log(`Request Origin: ${origin}`);
        if (!origin || allowedOrigins.includes(origin)) {
            console.log("CORS allowed");
            callback(null, true);
        }
        else {
            console.error(`Blocked by CORS: ${origin}`);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // Allow cookies to be sent
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Authorization"],
}));
// 🔹 Express Middlewares
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// 🔹 Add Session Middleware BEFORE Passport
app.use((0, express_session_1.default)({
    secret: "your_secret_key", // Change to a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set `true` if using HTTPS
}));
// 🔹 Initialize Passport
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// 🔹 OPTIONS requests (CORS Preflight)
app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.sendStatus(204);
});
// 🔹 Health check endpoint
app.get("/api", (req, res) => {
    res.status(200).send("Server is live");
});
// 🔹 Import routes
const routes_1 = require("./routes");
// 🔹 Use routes
app.use("/api/user", routes_1.userRouter);
app.use("/api/admin", routes_1.adminRouter);
app.use("/api/product", routes_1.productRouter);
app.use("/api/banner", routes_1.bannerRouter);
app.use("/api/order", routes_1.orderRouter);
app.use("/api/wishlist", routes_1.wishlistRouter);
app.use("/api/cart", routes_1.cartRouter);
// 🔹 Google OAuth Route
// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );
// 🔹 Google OAuth Callback
app.get("/auth/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/login" }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication failed" });
    }
    const user = req.user;
    // 🔹 Generate JWT Token
    const token = jsonwebtoken_1.default.sign({
        id: user._id,
        role: user.role,
        email: user.email,
        firstName: user.f_name,
        lastName: user.l_name,
    }, process.env.JWT_SECRET, {
        expiresIn: "12h",
    });
    // 🔹 Store token in HTTP-only cookie
    res.cookie("token", token, {
        httpOnly: true, // Prevent JavaScript access (more secure)
        secure: process.env.NODE_ENV === "production",
        maxAge: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
    });
    // 🔹 Redirect or send a response
    res.json({
        message: "Authentication successful",
    });
}));
exports.default = app;
//# sourceMappingURL=app.js.map