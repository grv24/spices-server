import { Request, Response } from "express";
import { ProductService } from "../services";
import { handleError } from "./user.controller";

// Initialize the UserService instance
const productService = new ProductService();

export class ProductController {
  // create product
  async createProductController(req: Request, res: Response) {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json({
        status: true,
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      handleError(res, error);
    }
  }

  // get all product
  async getAllProductsController(req: Request, res: Response) {
    try {
      const products = await productService.getAllProducts();
      res.status(200).json({
        status: true,
        message: "Products fetched successfully",
        data: products,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      handleError(res, error);
    }
  }

  //get product according to their type
  async getProductByTypeController(req: Request, res: Response) {
    try {
      const products = await productService.getProductByType(req.params.type);
      res.status(200).json({
        status: true,
        message: "Products fetched successfully",
        data: products,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      handleError(res, error);
    }
  }

  //update product
  async updateProductController(req: Request, res: Response) {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      res.status(200).json({
        status: true,
        message: "Product updated successfully",
        data: product,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      handleError(res, error);
    }
  }
}
