import { Request, Response } from "express";
import { Cart, ICart } from "../models";
import { CartService } from "../services";
import { handleError } from "./user.controller";

const cartService = new CartService();
export class CartController {
  async createController(req: Request, res: Response) {
    try {
      const data: ICart = req.body;
      const cart = await cartService.createCart(data);

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
}
