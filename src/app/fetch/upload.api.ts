import { ImageObject } from "@/libs/interfaces/schema/imageobject/imageObject.interface";
import { checkTokenExp } from "@/libs/refreshtoken";
import { http } from "@/libs/utils/http";

interface UploadResponse {
    message: string
    images: ImageObject[]
}

export const uploadApiRequest = {
  uploadImages: async (token: string, dispatch: any, formData: FormData) => {
    let accessToken = "";
    if (token) {
      const result = await checkTokenExp(token, dispatch);
      accessToken = result ? result : token;
    }
    return http.post<UploadResponse>("/upload/images", formData, { token: accessToken });
  },
};