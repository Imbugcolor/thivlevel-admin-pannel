import { Category } from "../category/category.interface";
import { ImageObject } from "../imageobject/imageObject.interface";
import { Review } from "../review/review.interface";
import { Variant } from "../variant/variant.interface";

export interface Product {
    _id: string
    product_sku: string,
    title: string,
    description?: string,
    content?: string,
    images: ImageObject[],
    variants?: Variant[],
    price: number,
    sold?: number,
    rating?: number,
    numReviews?: number,
    category?: Category,
    reviews?: Review[],
    isPublished: boolean,
    isDeleted: boolean,
    createdAt?: string,
    updatedAt?: string,
    deletedAt?: string,
}