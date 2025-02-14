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
exports.BannerController = void 0;
const services_1 = require("../services");
const user_controller_1 = require("./user.controller");
// Initialize the UserService instance
const bannerService = new services_1.BannerService();
class BannerController {
    // create banner
    createBannerController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bannerData = req.body;
                const file = req.file;
                if (!file) {
                    return res.status(400).json({ error: "File is required" });
                }
                const banner = yield bannerService.createBanner(bannerData, file);
                res.status(201).json({
                    status: true,
                    message: "Banner created successfully",
                    data: banner,
                });
            }
            catch (error) {
                console.error("Error creating banner:", error);
                (0, user_controller_1.handleError)(res, error);
            }
        });
    }
    // update banner
    updateBannerController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bannerId = req.params.id;
                const bannerData = req.body;
                const file = req.file;
                let banner;
                if (!file) {
                    banner = yield bannerService.updateBanner(bannerId, bannerData);
                }
                else {
                    banner = yield bannerService.updateBanner(bannerId, bannerData, file);
                }
                res.status(200).json({
                    status: true,
                    message: "Banner updated successfully",
                    data: banner,
                });
            }
            catch (error) {
                console.error("Error updating banner:", error);
                (0, user_controller_1.handleError)(res, error);
            }
        });
    }
    // delete banner
    deleteBannerController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bannerId = req.params.id;
                yield bannerService.deleteBanner(bannerId);
                res.status(200).json({
                    status: true,
                    message: "Banner deleted successfully",
                });
            }
            catch (error) {
                console.error("Error deleting banner:", error);
                (0, user_controller_1.handleError)(res, error);
            }
        });
    }
    // get all banners
    getAllBannersController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const banners = yield bannerService.getAllBanners();
                res.status(200).json({
                    status: true,
                    data: banners,
                });
            }
            catch (error) {
                console.error("Error fetching banners:", error);
                (0, user_controller_1.handleError)(res, error);
            }
        });
    }
}
exports.BannerController = BannerController;
//# sourceMappingURL=banner.controller.js.map