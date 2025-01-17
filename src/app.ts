import express from "express";
import userRoutes from "./routes/user.route";

const app = express();

//Health check endpoint at root
app.get("/", (req, res) => {
  res.status(200).send("Server is live");
});

app.use(express.json());
app.use("/api", userRoutes);

export default app;
