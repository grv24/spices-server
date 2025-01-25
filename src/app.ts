import express from "express";
import userRoutes from "./routes/user.route";
import cors from "cors";
import cookieParser from "cookie-parser";



const allowedOrigins = [
  process.env.CLIENT_URL_LOCAL, // Local frontend for testing
  process.env.CLIENT_URL_LIVE, // Replace with your production frontend URL
];


const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); 
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, 
  })
);
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

//Health check endpoint at root
app.get("/api", (req, res) => {
  res.status(200).send("Server is live");
});


//import routes
import { 
  userRouter, 
  adminRouter, 
  productRouter,
  bannerRouter 
} from "./routes";

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/product", productRouter);
app.use("/api/banner", bannerRouter);

export default app;
