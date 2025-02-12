import { http } from "@/libs/utils/http";
import {UsersDataResponse} from "@/libs/interfaces/response/user.response.interface";
import {checkTokenExp} from "@/libs/refreshtoken";

export interface UserFilterQuery {
    search?: string
    sort?: string
    role?: string
}

export const userAdminApiRequest = {
   getUsers: async (token: string, dispatch: any,limit?: number, page?: number, filterOptions?: UserFilterQuery) => {
       let accessToken = '';
       const result = await checkTokenExp(token, dispatch)
       accessToken = result ? result  : token
       let query = limit && page ? `limit=${limit}&page=${page}` : "";
       if (filterOptions) {
           for (const [key, value] of Object.entries(filterOptions)) {
               if (value) {
                   if ((value instanceof Array && value.length > 0) || value.length > 0) {
                       query += `&${key}=${value.toString()}`
                   }
               }
           }
       }
       return http.get<UsersDataResponse>(`/user/list?${query}`, { token: accessToken });
   }
};