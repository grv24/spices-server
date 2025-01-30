import mongoose from "mongoose";
import { serverlessUploadOnCloudinary } from "../config/cloudinary";
import { Product, IProduct } from "../models";

export class ProductService {
  // create product
  async createProduct(productData: IProduct): Promise<IProduct> {
    const product = new Product(productData);
    await product.save();
    return product;
  }
  // get all product
  async getAllProducts(): Promise<IProduct[]> {
    return Product.find();
  }
  //get single product
  async getProductById(productId: string): Promise<IProduct | null> {
    if (!productId) {
      throw new Error("Product ID is required");
    }

    const product = await Product.findById(productId);
    return product;
  }
  //update product
  async updateProduct(
    productId: string,
    productData: Partial<IProduct>,
    files?: Express.Multer.File[]
  ): Promise<IProduct | null> {
    if (!productId) {
      throw new Error("Product ID is required");
    }

    // Prepare the data to be updated, including handling files
    const updatedData: any = { ...productData };

    // If files are provided, upload them to Cloudinary and update the data
    if (files && files.length > 0) {
      for (const file of files) {
        try {
          const fieldName = file.fieldname; // Get field name
          updatedData[fieldName] = await serverlessUploadOnCloudinary(file);
        } catch (error) {
          console.error(
            `Error uploading ${file.fieldname} to Cloudinary:`,
            error
          );
          throw new Error(
            `Error uploading ${file.fieldname} image to Cloudinary`
          );
        }
      }
    }

    // Perform the product update in the database
    const product = await Product.findByIdAndUpdate(
      productId,
      updatedData,
      { new: true, runValidators: true } // Enforce schema validation
    );

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }

  // get Product By Type
  async getProductByType(type: string): Promise<IProduct[]> {
    const updatedType = type.replace(/-/g, " ");
    return Product.find({ productType: updatedType });
  }

  //search product
  async searchProduct(name: string): Promise<IProduct[]> {
    const product = await Product.find({
      productName: { $regex: name, $options: "i" },
    }).exec();
    return product;
  }

  //update product price
  async updateProductPrice(id: string, updateData: Partial<IProduct>) {
    try {
      const existingProduct = await Product.findById(id);
      if (!existingProduct) {
        throw new Error("Product not found");
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
          $set: {
            productWeight: {
              ...existingProduct.productWeight,
              ...updateData.productWeight,
            },
            productPrice: {
              ...existingProduct.productPrice,
              ...updateData.productPrice,
            },
            productQuantity: {
              ...existingProduct.productQuantity,
              ...updateData.productQuantity,
            },
            totalQuantity:
              updateData.totalQuantity ?? existingProduct.totalQuantity,
          },
        },
        { new: true, runValidators: true }
      );

      return updatedProduct;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }
}
