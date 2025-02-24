import express, { Request, Response } from "express";
import { authenticateMiddleware } from "../middleware";
import { OrderController } from "../controllers";

const router = express.Router();

const orderController = new OrderController();

router.post(
  "/place",
  authenticateMiddleware("user"),
  async (req: Request, res: Response) =>
    orderController.placeOrderController(req, res)
);

router.get("/",authenticateMiddleware("user"),async (req: Request, res: Response) =>
  orderController.getOrdersController(req, res))

export default router;
