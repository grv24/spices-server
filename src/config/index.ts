import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
};

if (!config.PORT || !config.DB_URL) {
  throw new Error("Missing required environment variables");
}

export { config };
