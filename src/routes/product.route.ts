import express, { Request, Response } from "express";
import { ProductController } from "../controllers";
import { authenticateMiddleware } from "../middleware";
import { upload } from "./banner.route";

const router = express.Router();

const productController = new ProductController();

//create product
router.post(
  "/",
  authenticateMiddleware("admin"),
  (req: Request, res: Response) =>
    productController.createProductController(req, res)
);

//update product
router.patch(
  "/:id",
  upload.fields([
    { name: "bgImage", maxCount: 1 },
    { name: "productImage", maxCount: 1 },
    { name: "mainImage", maxCount: 1 },
  ]),
  authenticateMiddleware("admin"),
  (req: Request, res: Response) =>
    productController.updateProductController(req, res)
);
//get all product
router.get("/", (req: Request, res: Response) =>
  productController.getAllProductsController(req, res)
);

//get product by type
router.get("/:type", (req: Request, res: Response) =>
  productController.getProductByTypeController(req, res)
);

//get by id 
router.get("/single/:id", (req: Request, res: Response) =>
  productController.getProductByIdController(req, res)
);

export default router;
