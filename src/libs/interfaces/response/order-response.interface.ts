import { Order } from "../schema/order/order.interface";

export interface OrdersDataResponse {
    page: string,
    total: number,
    data: Order[],
}