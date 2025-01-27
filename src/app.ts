import express from "express";
import userRoutes from "./routes/user.route";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config";

const allowedOrigins = [
  config.CLIENT_URL_LOCAL, // Local frontend for testing
  config.CLIENT_URL_LIVE,  // Production frontend URL
  'http://localhost:5174', // Local frontend for testing
];


const app = express();

// CORS middleware configuration
app.use(
  cors({
    origin: (origin, callback) => {
      console.log(`Request Origin: ${origin}`); // Debugging log for the origin
      if (!origin || allowedOrigins.includes(origin)) {
        console.log("CORS allowed"); // Log allowed origins
        callback(null, true); // Allow the request
      } else {
        console.error(`Blocked by CORS: ${origin}`); // Log blocked origins
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies to be sent
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // Specify allowed headers
    exposedHeaders: ["Authorization"], // Expose headers if needed
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Handle OPTIONS requests globally (preflight)
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.sendStatus(204); // No content
});

// Health check endpoint at root
app.get("/api", (req, res) => {
  res.status(200).send("Server is live");
});

// Import routes
import { userRouter, adminRouter, productRouter, bannerRouter } from "./routes";

// Use routes
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/product", productRouter);
app.use("/api/banner", bannerRouter);

export default app;
