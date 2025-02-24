import { Request, Response } from "express";
import { Order, IOrder } from "../models";
import { AdminService } from "../services";
import { handleError } from "./user.controller";
import { OrderService } from "../services/order.service";

const orderService = new OrderService();
export class OrderController {
  async placeOrderController(req: Request, res: Response) {
    try {
      const { cash_on_delivery, is_wallet_transaction } = req.body;
      const user = req.user;
      if (!user) {
        return res.status(401).json({
          status: false,
          message: "Unauthorized",
        });
      }
      const order = await orderService.placeOrder(
        cash_on_delivery,
        is_wallet_transaction,
        user
      );
      res.status(201).json({
        status: true,
        message: "Order placed successfully",
        data: order,
      });
    } catch (error) {
      console.error("Error placing order:", error);
      handleError(res, error);
    }
  }

  async getOrdersController(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({
          status: false,
          message: "Unauthorized",
        });
      }
      const orders = await orderService.getOrders(user);
      res.status(200).json({
        status: true,
        data: orders,
      });
    } catch (error) {
      console.error("Error getting orders:", error);
      handleError(res, error);
    }
  }
}
