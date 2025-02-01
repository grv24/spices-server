import { Request, Response } from "express";
import { Cart, ICart } from "../models";
import { CartService } from "../services";
import { handleError } from "./user.controller";

const cartService = new CartService();
export class CartController {
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
      const cart = await cartService.createCart(data, user._id);

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
      const data: ICart = req.body;
      const cart = await cartService.getCart(user._id);

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
