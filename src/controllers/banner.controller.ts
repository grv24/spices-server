import { Request, Response } from "express";
import { Banner, IBanner } from "../models";
import { BannerService } from "../services";
import { handleError } from "./user.controller";

// Initialize the UserService instance
const bannerService = new BannerService();

export class BannerController {
  // create banner
  async createBannerController(req: Request, res: Response) {
    try {
      const bannerData: IBanner = req.body;
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "File is required" });
      }
      const banner = await bannerService.createBanner(bannerData, file);
      res.status(201).json({
        status: true,
        message: "Banner created successfully",
        data: banner,
      });
    } catch (error) {
      console.error("Error creating banner:", error);
      handleError(res, error);
    }
  }

  // update banner
  async updateBannerController(req: Request, res: Response) {
    try {
      const bannerId = req.params.id;
      const bannerData: IBanner = req.body;
      const file = req.file;
      console.log("file", file);
      let banner;
      if (!file) {
        banner = await bannerService.updateBanner(bannerId, bannerData);
      } else {
        banner = await bannerService.updateBanner(
          bannerId,
          bannerData,
          file
        );
      }
      res.status(200).json({
        status: true,
        message: "Banner updated successfully",
        data: banner,
      });
    } catch (error) {
      console.error("Error updating banner:", error);
      handleError(res, error);
    }
  }

  // delete banner
  async deleteBannerController(req: Request, res: Response) {
    try {
      const bannerId = req.params.id;
      await bannerService.deleteBanner(bannerId);
      res.status(200).json({
        status: true,
        message: "Banner deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting banner:", error);
      handleError(res, error);
    }
  }

  // get all banners
  async getAllBannersController(req: Request, res: Response) {
    try {
      const banners = await bannerService.getAllBanners();
      res.status(200).json({
        status: true,
        data: banners,
      });
    } catch (error) {
      console.error("Error fetching banners:", error);
      handleError(res, error);
    }
  }
}
