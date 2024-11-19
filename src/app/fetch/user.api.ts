import { NEXT_SERVER_URL } from "@/config";
import { AddressProfile } from "@/libs/interfaces/schema/address.interface";
import { User } from "@/libs/interfaces/schema/user.interface";
import { checkTokenExp } from "@/libs/refreshtoken";
import { http } from "@/libs/utils/http";
import { ThunkDispatch } from "@reduxjs/toolkit";


interface RegisterRequest {
  username: string,
  email: string,
  password: string,
}

interface ActiveResponse {
  message: string,
  user: User,
}

interface UpdateProfileRequest {
  username?: string,
  phone?: string,
  address?: AddressProfile,
  gender?: string,
  dateOfbirth?: string,
}

interface UpdatePasswordRequest {
  old_password: string,
  new_password: string,
}

interface ResetPasswordRequest {
  id: string,
  token: string,
  password: string,
}

export const userApiRequest = {
  register: (body: RegisterRequest) => http.post<{ message: string}>('/user/register', body),
  active: (token: string) => http.get<ActiveResponse>(`/user/active/${token}`), 
  getUserCurrent: (token: string) => http.get("/user/current", { token }),
  updatePhoto: async(token: string, dispatch: any, formData: FormData) => {
    let accessToken = '';
    if (token) {
      const result = await checkTokenExp(token, dispatch)
      accessToken = result ? result  : token
    }
    return http.patch<User>('/user/photo', formData, { token: accessToken })
  },
  updateProfile: async(token: string, dispatch: any, body: UpdateProfileRequest) => {
    let accessToken = '';
    if (token) {
      const result = await checkTokenExp(token, dispatch)
      accessToken = result ? result  : token
    }
    return http.patch<User>('/user/update', body, { token: accessToken })
  },
  updatePassword: async(token: string, dispatch: any, body: UpdatePasswordRequest) => {
    let accessToken = '';
    if (token) {
      const result = await checkTokenExp(token, dispatch)
      accessToken = result ? result  : token
    }
    return http.patch<User>('/user/password', body, { token: accessToken })
  },
  logOut: async (token?: string, dispatch?: ThunkDispatch<any, any, any>) => {
    try {
        let accessToken = '';
        if (token) {
          const result = await checkTokenExp(token, dispatch)
          accessToken = result ? result  : token
        }
        const res = await fetch(`${NEXT_SERVER_URL}/api/user`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": accessToken ? accessToken : '',
            },
        })

        if (!res.ok) {
            const errorData = await res.json();
            console.log(errorData);
            throw Error(errorData);
        }
        
        return window.location.href = '/auth';
    } catch (error: any) {
        console.log(error)
        throw new Error(error)
    }
  },
  forgotPassword: async(email: string) =>  http.post<{ message: string }>('/user/forgotpassword', { email }),
  verifyTokenRecovery: async(id: string, token: string) =>  http.get<{ message: string }>(`/user/verify-password-recovery?id=${id}&token=${token}`),
  resetPassword: async(body: ResetPasswordRequest) => http.patch<{ message: string}>('/user/reset-password', body)
};