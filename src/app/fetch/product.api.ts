import { ImageObject } from "@/libs/interfaces/schema/imageobject/imageObject.interface";
import { ProductDataResponse, SingleProductDataResponse } from "@/libs/interfaces/schema/product-response.interface";
import { Variant } from "@/libs/interfaces/schema/variant/variant.interface";
import { checkTokenExp } from "@/libs/refreshtoken";
import { http } from "@/libs/utils/http";

export interface ProductsFilterOptions {
  search?: string;
  sort?: string;
  category?: string;
  "price[gte]"?: string;
  "price[lte]"?: string;
  sizes?: string[];
};

export interface CreateProduct {
    product_sku: string;
  
    title: string;
  
    description: string;
  
    content: string;
  
    price: number;
  
    images: ImageObject[];
  
    category: string;
  
    variants: Variant[];

    isPublished: boolean;
}

export interface UpdateProduct extends Partial<CreateProduct> {}
export interface PublishProduct {
  publish: boolean
}

export const productsApiRequest = {
  getProducts: (limit?: number, page?: number, filterOptions?: ProductsFilterOptions) => {
    let query = limit && page ? `limit=${limit}&page=${page}` : "";
    if (filterOptions) {
        for (const [key, value] of Object.entries(filterOptions)) {
            query += `&${key}=${value.toString()}`
        }
    }
    return http.get<ProductDataResponse>(`/products?${query}`);
  },
  getSingleProduct: (id: string) =>
    http.get<SingleProductDataResponse>(`/products/${id}`),
  getDeletedList: async(token: string, dispatch: any, limit?: number, page?: number, filterOptions?: ProductsFilterOptions) => {
    let accessToken = "";
    if (token) {
      const result = await checkTokenExp(token, dispatch);
      accessToken = result ? result : token;
    }
    let query = limit && page ? `limit=${limit}&page=${page}` : ''
    if (filterOptions) {
        for (const [key, value] of Object.entries(filterOptions)) {
            query += `&${key}=${value.toString()}`
        }
    }
    return http.get<ProductDataResponse>(`/products/deleted?${query}`, {token: accessToken} ) 
  },
  create: async(token: string, dispatch: any, body: CreateProduct) => {
      let accessToken = "";
      if (token) {
        const result = await checkTokenExp(token, dispatch);
        accessToken = result ? result : token;
      }
      return http.post<SingleProductDataResponse>('/products', body, {token: accessToken})
  },
  update: async(token: string, dispatch: any, id: string, body: UpdateProduct) => {
      let accessToken = "";
      if (token) {
        const result = await checkTokenExp(token, dispatch);
        accessToken = result ? result : token;
      }
      return http.patch<SingleProductDataResponse>(`/products/${id}`, body, {token: accessToken})
  },
  delete: async(token: string, dispatch: any, id: string) => {
    let accessToken = "";
    if (token) {
      const result = await checkTokenExp(token, dispatch);
      accessToken = result ? result : token;
    }
    return http.patch<SingleProductDataResponse>(`/products/${id}/delete`, {}, {token: accessToken})
  },
  restore: async(token: string, dispatch: any, id: string) => {
    let accessToken = "";
    if (token) {
      const result = await checkTokenExp(token, dispatch);
      accessToken = result ? result : token;
    }
    return http.patch<SingleProductDataResponse>(`/products/${id}/restore`, {}, {token: accessToken})
  },
  publish: async(token: string, dispatch: any, id: string, body: PublishProduct) => {
    let accessToken = "";
    if (token) {
      const result = await checkTokenExp(token, dispatch);
      accessToken = result ? result : token;
    }
    return http.patch<SingleProductDataResponse>(`/products/${id}/publish`, body, {token: accessToken})
  }
};
