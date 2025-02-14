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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerService = void 0;
const cloudinary_1 = require("../config/cloudinary");
const models_1 = require("../models");
class BannerService {
    //create banner
    createBanner(bannerData, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, category, price, image } = bannerData;
            // Upload image to Cloudinary
            const imageUrl = yield (0, cloudinary_1.serverlessUploadOnCloudinary)({
                buffer: file.buffer,
                mimetype: file.mimetype,
            });
            // Create a new banner
            const banner = new models_1.Banner(Object.assign(Object.assign({}, bannerData), { image: imageUrl }));
            // Save the banner to the database
            return yield banner.save();
        });
    }
    //update banner
    updateBanner(bannerId, bannerData, // Use Partial to allow updating only some fields
    file) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, category, price } = bannerData;
            // Find the banner by ID
            const banner = yield models_1.Banner.findById(bannerId);
            if (!banner) {
                throw new Error("Banner not found");
            }
            // If a file is provided, upload it to Cloudinary and update the image URL
            if (file) {
                const imageUrl = yield (0, cloudinary_1.serverlessUploadOnCloudinary)({
                    buffer: file.buffer,
                    mimetype: file.mimetype,
                });
                banner.image = imageUrl; // Update image URL in the banner
            }
            // Update other fields only if they are provided in `bannerData`
            if (title !== undefined)
                banner.title = title;
            if (category !== undefined)
                banner.category = category;
            if (price !== undefined)
                banner.price = price;
            // Save and return the updated banner
            return yield banner.save();
        });
    }
    //delete banner
    deleteBanner(bannerId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find the banner by id
            const banner = yield models_1.Banner.findById(bannerId);
            if (!banner) {
                throw new Error("Banner not found");
            }
            // Delete the banner
            yield models_1.Banner.findByIdAndDelete(bannerId);
        });
    }
    //get all banners
    getAllBanners() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.Banner.find();
        });
    }
}
exports.BannerService = BannerService;
//# sourceMappingURL=banner.service.js.map