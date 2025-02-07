import { IProduct } from "../models";

export type Weight = "100g" | "250g" | "500g" | "1kg" | "2kg" | "3kg";

export const CheckProductAvailability = (product: IProduct, weight: Weight) => {
  if (
    product?.productWeight?.[weight] &&
    product?.productQuantity?.[weight] > 0
  ) {
    return {
      available: true,
      price: product.productPrice?.[weight] ?? "Price not available",
      product,
    };
  } else {
    return {
      available: false,
      message: "Weight not available or out of stock",
      product,
    };
  }
};
