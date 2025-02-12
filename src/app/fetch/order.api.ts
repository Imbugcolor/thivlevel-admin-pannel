import { OrdersDataResponse } from "@/libs/interfaces/response/order-response.interface"
import { AddressFullObject, ShippingAddress } from "@/libs/interfaces/schema/address.interface"
import { Order } from "@/libs/interfaces/schema/order/order.interface"
import { checkTokenExp } from "@/libs/refreshtoken"
import { http } from "@/libs/utils/http"

export interface OrderFilterQuery {
    status?: string
    search?: string
    sort?: string
}
interface UpdateOrderStatus {
    status: string,
}

export interface UpdateOrder {
    name?: string,
    phone?: string,
    address?: ShippingAddress,
    isPaid?: boolean,
}

export const orderApiRequest = {
    getTotalRevenue: async(token: string, dispatch: any) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token

        return http.get<number>('/order/revenue/total', { token: accessToken })
    },
    getList: async(token: string, dispatch: any, limit?: number, page?: number, filterOptions?: OrderFilterQuery) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token

        let query = limit && page ? `limit=${limit}&page=${page}` : ''
        if (filterOptions) {
            for (const [key, value] of Object.entries(filterOptions)) {
                if (value) {
                  if ((value instanceof Array && value.length > 0) || value.length > 0) {
                    query += `&${key}=${value.toString()}`
                  } 
                }
            }
        }
        return http.get<OrdersDataResponse>(`/order/all?${query}`, { token: accessToken }) 
    },
    getOne: async(token: string, dispatch: any, id: string) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token

        return http.get<Order>(`/order/detail/${id}`, { token: accessToken })
    },
    updateStatus: async(token: string, dispatch: any, id: string, body: UpdateOrderStatus) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token

        return http.patch<Order>(`/order/status/${id}`, { status: body.status }, { token: accessToken })
    },
    update: async(token: string, dispatch: any, id: string, body: UpdateOrder) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token

        return http.patch<Order>(`/order/${id}`, body, { token: accessToken })
    },
}