import { config } from "./index";
import mongoose from "mongoose";

const DB_NAME = "Spieces";

const connectToDatabase = async (): Promise<void> => {
  try {
    if (!config.DB_URL) {
      throw new Error("DB_URL is not defined in the configuration");
    }
    await mongoose.connect(config.DB_URL, {
      dbName: DB_NAME,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", (error as Error).message);
    process.exit(1);
  }
};

export default connectToDatabase;
