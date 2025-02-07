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
        weight: req.body.weight,
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
      // const data: IWishlist = req.body;
      const wishlist = await wishlistService.getWishlist(user._id);

      res.status(201).json({
        status: true,
        message: "Wishlist get successfully",
        data: wishlist,
      });
    } catch (error) {
      console.error("Error in get cart:", error);
      handleError(res, error);
    }
  }
  async removeProductController(req: Request, res: Response) {
    try {
      const productId = req.params.id;
      const weight = req.params.weight
      
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (!productId) {
        return res.status(401).json({ message: "Product id is required" });
      }
      const cart = await wishlistService.removeProduct(user._id, productId,weight);
      res.status(201).json({
        status: true,
        message: "product remove from wishlist successfully",
        data: cart,
      });
    } catch (error) {
      console.error("Error in remove product in wishlist:", error);
      handleError(res, error);
    }
  }
  async clearWishtlistController(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      await wishlistService.clearWishlist(user._id);

      res.status(201).json({
        status: true,
        message: "clear wishlist successfully",
      });
    } catch (error) {
      console.error("Error in clear wishlist:", error);
      handleError(res, error);
    }
  }
}
