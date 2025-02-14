import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLIENT_URL_LOCAL: process.env.CLIENT_URL_LOCAL,
  CLIENT_URL_LIVE: process.env.CLIENT_URL_LIVE,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};

if (
  !config.PORT ||
  !config.DB_URL ||
  !config.JWT_SECRET ||
  !config.CLOUDINARY_CLOUD_NAME ||
  !config.CLOUDINARY_API_KEY ||
  !config.CLOUDINARY_API_SECRET ||
  !config.CLIENT_URL_LOCAL ||
  !config.CLIENT_URL_LIVE ||
  !config.GOOGLE_CLIENT_ID ||
  !config.GOOGLE_CLIENT_SECRET
) {
  throw new Error("Missing required environment variables");
}

export { config };
