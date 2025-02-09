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
        weight: req.body.weight,
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
  async removeCartProduct(req: Request, res: Response) {
    try {
      const productId = req.params.id;
      const weight = req.params.weight;

      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (!productId) {
        return res.status(401).json({ message: "Product id is required" });
      }
      const cart = await cartService.removeCartProduct(
        user._id,
        productId,
        weight
      );
      res.status(201).json({
        status: true,
        message: "product remove from cart successfully",
        data: cart,
      });
    } catch (error) {
      console.error("Error in remove product in cart:", error);
      handleError(res, error);
    }
  }
  async clearCart(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      await cartService.clearCart(user._id);

      res.status(201).json({
        status: true,
        message: "clear cart successfully",
      });
    } catch (error) {
      console.error("Error in clear cart:", error);
      handleError(res, error);
    }
  }
}
