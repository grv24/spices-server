import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { config } from "./index";

// Cloudinary configuration
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME as string,
  api_key: config.CLOUDINARY_API_KEY as string,
  api_secret: config.CLOUDINARY_API_SECRET as string,
});

type FilePath = string | string[];
interface File {
  buffer: Buffer;
  mimetype: string;
}

const uploadOnCloudainary = async (
  localFilePaths: FilePath
): Promise<string | string[] | null> => {
  try {
    if (!localFilePaths) return null;

    const uploadFile = async (filePath: string): Promise<string> => {
      const resourceType = getResourceType(filePath);
      const response = await cloudinary.uploader.upload(filePath, {
        resource_type: resourceType as "video" | "image" | "raw" | "auto",
      });
      return response.url;
    };

    if (Array.isArray(localFilePaths)) {
      if (localFilePaths.length === 0) return null;

      const uploadedFiles = await Promise.all(
        localFilePaths.map((filePath) => uploadFile(filePath))
      );

      return uploadedFiles;
    } else {
      return await uploadFile(localFilePaths);
    }
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);

    // Remove local files if upload fails
    if (Array.isArray(localFilePaths)) {
      for (const localFilePath of localFilePaths) {
        if (fs.existsSync(localFilePath)) {
          fs.unlinkSync(localFilePath);
        }
      }
    } else {
      if (fs.existsSync(localFilePaths)) {
        fs.unlinkSync(localFilePaths);
      }
    }

    throw new Error("Error uploading images to Cloudinary");
  }
};

// For serverless
const serverlessUploadOnCloudinary = async (file: File): Promise<string> => {
  const resourceType = getResourceType(file);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType },
      (error, result) => {
        if (error) {
          console.error("Error uploading to Cloudinary:", error);
          reject(error);
        } else {
          resolve(result?.url || "");
        }
      }
    );

    uploadStream.end(file.buffer);
  });
};

// For server
const getResourceType = (
  input: string | File
): "video" | "image" | "raw" | "auto" => {
  if (typeof input === "string") {
    const extension = path.extname(input).toLowerCase();
    if ([".mp4", ".mov", ".avi", ".wmv", ".flv"].includes(extension)) {
      return "video";
    } else {
      return "image";
    }
  } else {
    const mimeType = input.mimetype;
    if (mimeType.startsWith("image/")) {
      return "image";
    } else if (mimeType.startsWith("video/")) {
      return "video";
    } else {
      return "raw";
    }
  }
};

export { uploadOnCloudainary, serverlessUploadOnCloudinary };
