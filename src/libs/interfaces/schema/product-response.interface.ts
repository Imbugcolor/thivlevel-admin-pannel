import { Product } from "./product/product.interface";

export interface ProductDataResponse {
    page: string,
    total: number,
    data: Product[],
}

export interface SingleProductDataResponse extends Product {}