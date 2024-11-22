import { Category } from "@/libs/interfaces/schema/category/category.interface";
import { checkTokenExp } from "@/libs/refreshtoken";
import { http } from "@/libs/utils/http";

interface CreateCategory {
    name: string
}
interface UpdateCategory extends CreateCategory {}

export const categoryApiRequest = {
    get: async() =>  http.get<Category[]>('/category'),
    create: async(token: string, dispatch: any, body: CreateCategory) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token

        return http.post<Category>('/category', body, { token: accessToken })
    },
    update: async(token: string, dispatch: any, id: string, body: UpdateCategory) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token

        return http.patch<Category>(`/category/${id}`, body, { token: accessToken })
    },
    delete: async(token: string, dispatch: any, id: string) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token

        return http.delete<any>(`/category/${id}`,{ token: accessToken })
    },
}