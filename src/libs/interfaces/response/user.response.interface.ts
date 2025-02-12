import {User} from "@/libs/interfaces/schema/user.interface";

export interface UsersDataResponse {
    page: string,
    total: number,
    data: User[],
}