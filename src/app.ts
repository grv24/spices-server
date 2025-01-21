import express from "express";
import userRoutes from "./routes/user.route";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

//Health check endpoint at root
app.get("/api", (req, res) => {
  res.status(200).send("Server is live");
});

app.use(express.json());

//import routes
import { 
  userRouter,
  adminRouter 
} from "./routes";

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

export default app;
