import express, { Request, Response } from "express";
import { ProductController } from "../controllers";
import { authenticateMiddleware } from "../middleware";

const router = express.Router();

const productController = new ProductController();

//create product
router.post(
  "/",
  authenticateMiddleware("admin"),
  (req: Request, res: Response) =>
    productController.createProductController(req, res)
);

//get all product
router.get("/", (req: Request, res: Response) =>
  productController.getAllProductsController(req, res)
);

//get product by type
router.get("/:type", (req: Request, res: Response) =>
  productController.getProductByTypeController(req, res)
);



export default router;