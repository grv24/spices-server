import express, { Request, Response } from "express";
import { authenticateMiddleware } from "../middleware";
import { WishlistController } from "../controllers";

const router = express.Router();

const cartController = new WishlistController();
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

//remove product
router.delete(
  "/:id/:weight",
  authenticateMiddleware("user"),
  (req: Request, res: Response) =>
    cartController.removeProductController(req, res)
);

//clear wishlist
router.get(
  "/clear/product",
  authenticateMiddleware("user"),
  (req: Request, res: Response) =>
    cartController.clearWishtlistController(req, res)
);

export default router;
