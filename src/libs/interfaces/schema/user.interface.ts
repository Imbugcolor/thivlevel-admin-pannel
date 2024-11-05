import { AddressProfile } from "./address.interface";

export interface User {
    _id: string;
    username: string;
    email: string;
    avatar: string;
    phone?: string;
    address?: AddressProfile;
    dateOfbirth?: string;
    gender: string
    role: string[];
    authStrategy: string;
    createdAt: string;
    updatedAt: string;
}