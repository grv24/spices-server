import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

if (
  !config.PORT ||
  !config.DB_URL ||
  !config.JWT_SECRET ||
  !config.CLOUDINARY_CLOUD_NAME ||
  !config.CLOUDINARY_API_KEY ||
  !config.CLOUDINARY_API_SECRET
) {
  throw new Error("Missing required environment variables");
}

export { config };
