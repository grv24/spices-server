import express, { Request, Response } from "express";
import { authenticateMiddleware } from "../middleware";
import { CartController } from "../controllers";

const router = express.Router();
const cartController = new CartController();

//create cart
router.post(
  "/",
  authenticateMiddleware("user"),
  (req: Request, res: Response) => cartController.createController(req, res)
);

//get cart
router.get("/", authenticateMiddleware("user"), (req: Request, res: Response) =>
  cartController.getController(req, res)
);

export default router;
