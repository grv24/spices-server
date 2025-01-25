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
    productData: Partial<IProduct>
  ): Promise<IProduct | null> {
    if (!productId) {
      throw new Error("Product ID is required");
    }
    const product = await Product.findByIdAndUpdate(productId, productData, {
      new: true,
    });
    return product;
  }

  // get Product By Type
  async getProductByType(type: string): Promise<IProduct[]> {
    const updatedType = type.replace(/-/g, " ");
    return Product.find({ productType: updatedType });
  }
}
