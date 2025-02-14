import express from "express";
import userRoutes from "./routes/user.route";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { config } from "./config"; // Your config file
import jwt from "jsonwebtoken";

// Import Passport configuration (Important!)
import "./config/passport";

const allowedOrigins = [
  config.CLIENT_URL_LOCAL, // Local frontend for testing
  config.CLIENT_URL_LIVE, // Production frontend URL
  "http://localhost:5173", // Local frontend for testing
  "https://mahamaya33.in",
];

const app = express();

// 🔹 CORS Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      console.log(`Request Origin: ${origin}`);
      if (!origin || allowedOrigins.includes(origin)) {
        console.log("CORS allowed");
        callback(null, true);
      } else {
        console.error(`Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies to be sent
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Authorization"],
  })
);

// 🔹 Express Middlewares
app.use(express.json());
app.use(cookieParser());

// 🔹 Add Session Middleware BEFORE Passport
app.use(
  session({
    secret: "your_secret_key", // Change to a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set `true` if using HTTPS
  })
);

// 🔹 Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// 🔹 OPTIONS requests (CORS Preflight)
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.sendStatus(204);
});

// 🔹 Health check endpoint
app.get("/api", (req, res) => {
  res.status(200).send("Server is live");
});

// 🔹 Import routes
import {
  userRouter,
  adminRouter,
  productRouter,
  bannerRouter,
  wishlistRouter,
  cartRouter,
  orderRouter,
} from "./routes";

// 🔹 Use routes
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/product", productRouter);
app.use("/api/banner", bannerRouter);
app.use("/api/order", orderRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/cart", cartRouter);

// 🔹 Google OAuth Route
// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// 🔹 Google OAuth Callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const user = req.user as any;

    // 🔹 Generate JWT Token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        firstName: user.f_name,
        lastName: user.l_name,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "12h",
      }
    );

    // 🔹 Store token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: false, // Prevent JavaScript access (more secure)
      secure: process.env.NODE_ENV === "production",
      maxAge: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
      domain: "localhost", // Ensure this matches your server's domain
      path: "/",
    });

    // 🔹 Redirect or send a response
    res.redirect(`https://mahamaya33.in/token?=${token}`);
    // res.json({ token });
  }
);

export default app;
