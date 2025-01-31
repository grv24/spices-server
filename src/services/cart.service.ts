import { Cart, ICart } from "../models";

export class CartService {
  async createCart(data: ICart): Promise<ICart> {
    try {
      const newCart = new Cart(data);
      await newCart.save();
      return newCart;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }
}
