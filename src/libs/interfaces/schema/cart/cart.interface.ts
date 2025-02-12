import { Product } from "../product/product.interface";
import { Variant } from "../variant/variant.interface";

export interface Cart {
    _id: string;
    userId: string;
    items: CartItem[];
    subTotal: number;
    createdAt: Date | null;
    updatedAt: Date | null;
}
  
export interface CartItem {
    _id: string;
    productId: Product;
    variantId: Variant;
    quantity: number;
    price: number;
    total: number;
    createdAt: Date | null;
    updatedAt: Date | null;
}