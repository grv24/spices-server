"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverlessUploadOnCloudinary = exports.uploadOnCloudainary = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const index_1 = require("./index");
// Cloudinary configuration
cloudinary_1.v2.config({
    cloud_name: index_1.config.CLOUDINARY_CLOUD_NAME,
    api_key: index_1.config.CLOUDINARY_API_KEY,
    api_secret: index_1.config.CLOUDINARY_API_SECRET,
});
const uploadOnCloudainary = (localFilePaths) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!localFilePaths)
            return null;
        const uploadFile = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
            const resourceType = getResourceType(filePath);
            const response = yield cloudinary_1.v2.uploader.upload(filePath, {
                resource_type: resourceType,
            });
            return response.url;
        });
        if (Array.isArray(localFilePaths)) {
            if (localFilePaths.length === 0)
                return null;
            const uploadedFiles = yield Promise.all(localFilePaths.map((filePath) => uploadFile(filePath)));
            return uploadedFiles;
        }
        else {
            return yield uploadFile(localFilePaths);
        }
    }
    catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        // Remove local files if upload fails
        if (Array.isArray(localFilePaths)) {
            for (const localFilePath of localFilePaths) {
                if (fs_1.default.existsSync(localFilePath)) {
                    fs_1.default.unlinkSync(localFilePath);
                }
            }
        }
        else {
            if (fs_1.default.existsSync(localFilePaths)) {
                fs_1.default.unlinkSync(localFilePaths);
            }
        }
        throw new Error("Error uploading images to Cloudinary");
    }
});
exports.uploadOnCloudainary = uploadOnCloudainary;
// For serverless
const serverlessUploadOnCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const resourceType = getResourceType(file);
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({ resource_type: resourceType }, (error, result) => {
            if (error) {
                console.error("Error uploading to Cloudinary:", error);
                reject(error);
            }
            else {
                resolve((result === null || result === void 0 ? void 0 : result.url) || "");
            }
        });
        uploadStream.end(file.buffer);
    });
});
exports.serverlessUploadOnCloudinary = serverlessUploadOnCloudinary;
// For server
const getResourceType = (input) => {
    if (typeof input === "string") {
        const extension = path_1.default.extname(input).toLowerCase();
        if ([".mp4", ".mov", ".avi", ".wmv", ".flv"].includes(extension)) {
            return "video";
        }
        else {
            return "image";
        }
    }
    else {
        const mimeType = input.mimetype;
        if (mimeType.startsWith("image/")) {
            return "image";
        }
        else if (mimeType.startsWith("video/")) {
            return "video";
        }
        else {
            return "raw";
        }
    }
};
//# sourceMappingURL=cloudinary.js.map