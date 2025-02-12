import { ShippingAddress } from "../address.interface";
import { CartItem } from "../cart/cart.interface";
import { User } from "../user.interface";

export interface OrderItem extends CartItem {}

export interface Order {
    _id: string,
    user: User,
    name: string,
    email: string,
    address: ShippingAddress,
    phone: string,
    total: number,
    method: string,
    isPaid: boolean,
    items: OrderItem[],
    status: string,
    paymentId: string,
    createdAt: Date,
    updatedAt: Date,
}