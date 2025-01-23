import {
  serverlessUploadOnCloudinary,
  uploadOnCloudainary,
} from "../config/cloudinary";
import { Banner, IBanner } from "../models";

export class BannerService {
  //create banner
  async createBanner(
    bannerData: IBanner,
    file: Express.Multer.File
  ): Promise<IBanner> {
    const { title, category, price, image } = bannerData;

    // Upload image to Cloudinary
    const imageUrl = await serverlessUploadOnCloudinary({
      buffer: file.buffer,
      mimetype: file.mimetype,
    });
    // Create a new banner
    const banner = new Banner({
      ...bannerData,
      image: imageUrl,
    });

    // Save the banner to the database
    return await banner.save();
  }

  //update banner
  async updateBanner(
    bannerId: string,
    bannerData: Partial<IBanner>, // Use Partial to allow updating only some fields
    file?: Express.Multer.File
  ): Promise<IBanner> {
    const { title, category, price } = bannerData;

    // Find the banner by ID
    const banner = await Banner.findById(bannerId);
    if (!banner) {
      throw new Error("Banner not found");
    }

    // If a file is provided, upload it to Cloudinary and update the image URL
    if (file) {
      const imageUrl = await serverlessUploadOnCloudinary({
        buffer: file.buffer,
        mimetype: file.mimetype,
      });
      banner.image = imageUrl; // Update image URL in the banner
    }

    // Update other fields only if they are provided in `bannerData`
    if (title !== undefined) banner.title = title;
    if (category !== undefined) banner.category = category;
    if (price !== undefined) banner.price = price;

    // Save and return the updated banner
    return await banner.save();
  }

  //delete banner
  async deleteBanner(bannerId: string): Promise<void> {
    // Find the banner by id
    const banner = await Banner.findById(bannerId);
    if (!banner) {
      throw new Error("Banner not found");
    }
    // Delete the banner
    await Banner.findByIdAndDelete(bannerId);
  }

  //get all banners
  async getAllBanners(): Promise<IBanner[]> {
    return await Banner.find();
  }
}
