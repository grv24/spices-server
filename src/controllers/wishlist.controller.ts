import { Request, Response } from "express";
import { Wishlist, IWishlist } from "../models";
import { AdminService } from "../services";
import { handleError } from "./user.controller";
import { WishlistService } from "../services/wishlist.service";

const wishlistService = new WishlistService();

export class WishlistController {
  async createController(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const data = {
        productId: req.body.productId,
        quantity: req.body.quantity,
      };
      const cart = await wishlistService.createWishlist(data, user._id);

      res.status(201).json({
        status: true,
        message: "cart created successfully",
        data: cart,
      });
    } catch (error) {
      console.error("Error in create cart:", error);
      handleError(res, error);
    }
  }
  async getController(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const data: IWishlist = req.body;
      const cart = await wishlistService.getWishlist(user._id);

      res.status(201).json({
        status: true,
        message: "cart get successfully",
        data: cart,
      });
    } catch (error) {
      console.error("Error in get cart:", error);
      handleError(res, error);
    }
  }
}
