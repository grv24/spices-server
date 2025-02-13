import { Request, Response } from "express";
import { ProductService } from "../services";
import { handleError } from "./user.controller";
import { serverlessUploadOnCloudinary } from "../config/cloudinary";

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
      const productId = req.params.id;
      const productData = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] }; // Explicit typing for files

      // Prepare the data to be updated, including handling image uploads
      const updatedData: any = { ...productData };

      // Ensure cardImages is initialized as an object
      if (!updatedData.cardImages) {
        updatedData.cardImages = {};
      }

      // Check if files exist and upload to Cloudinary
      if (
        files["bgImage"] &&
        Array.isArray(files["bgImage"]) &&
        files["bgImage"][0]
      ) {
        updatedData.cardImages.bgImage = await serverlessUploadOnCloudinary(
          files["bgImage"][0]
        );
      }

      if (
        files["productImage"] &&
        Array.isArray(files["productImage"]) &&
        files["productImage"][0]
      ) {
        updatedData.cardImages.productImage =
          await serverlessUploadOnCloudinary(files["productImage"][0]);
      }

      if (
        files["mainImage"] &&
        Array.isArray(files["mainImage"]) &&
        files["mainImage"][0]
      ) {
        updatedData.mainImage = await serverlessUploadOnCloudinary(
          files["mainImage"][0]
        );
      }

      // Call the service to update the product with the updated data and file URLs
      const updatedProduct = await productService.updateProduct(
        productId,
        updatedData,
        Object.values(files).flat()
      );

      // Respond with the updated product data
      res.status(200).json({
        status: true,
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      handleError(res, error);
    }
  }

  //get product by id
  async getProductByIdController(req: Request, res: Response) {
    try {
      console.log(req.params.id, "productId controller");
      const product = await productService.getProductById(req.params.id);
      res.status(200).json({
        status: true,
        message: "Product fetched successfully",
        data: product,
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      handleError(res, error);
    }
  }

  //search product
  async searchProduct(req: Request, res: Response) {
    try {
      const product = await productService.searchProduct(req.params.name);
      res.status(200).json({
        status: true,
        message: "Product fetched successfully",
        data: product,
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      handleError(res, error);
    }
  }
  //update price
  async updateProductPrice(req: Request, res: Response) {
    try {
      const product = await productService.updateProductPrice(req.params.id,req.body);
      res.status(200).json({
        status: true,
        message: "Product price updated successfully",
        data: product,
      });
    } catch (error) {
      console.error("Error in update product price:", error);
      handleError(res, error);
    }
  }
  //filter product
  async filterProduct(req:Request,res:Response){
    try {
      const {category,priceOrder} = req.params;
      const product = await productService.filterProduct(category,priceOrder)
    } catch (error) {
      console.error("Error in filter product:", error);
      handleError(res, error);
    }
  }
}
