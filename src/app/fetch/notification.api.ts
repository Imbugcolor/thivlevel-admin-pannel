import { checkTokenExp } from "@/libs/refreshtoken";
import { http } from "@/libs/utils/http";


export interface NotificationsResponse {
    data: NotificationSchema[],
    page: string,
    total: number,
}

export const notificationRequest = {
    get: async(token: string, dispatch: any, limit: number, page: number) => {
        let accessToken = '';
        if (token) {
          const result = await checkTokenExp(token, dispatch)
          accessToken = result ? result  : token
        }
        const query = limit && page ? `limit=${limit}&page=${page}` : ''
        return http.get<NotificationsResponse>(`/notification/admin?${query}&sort=-createdAt`, { token: accessToken })
    },
}