import { ImageObject } from "@/libs/interfaces/schema/imageobject/imageObject.interface";
import { checkTokenExp } from "@/libs/refreshtoken";
import { http } from "@/libs/utils/http";

interface UploadMutipleResponse {
  message: string
  images: ImageObject[]
}

export const uploadApiRequest = {
  uploadImage: async (formData: FormData) => http.post<ImageObject>("/upload/image", formData),
  uploadImages: async (token: string, dispatch: any, formData: FormData) => {
    let accessToken = "";
    if (token) {
      const result = await checkTokenExp(token, dispatch);
      accessToken = result ? result : token;
    }
    return http.post<UploadMutipleResponse>("/upload/images", formData, { token: accessToken });
  },
  destroyImages: async (token: string, dispatch: any, public_ids: string[]) => {
    let accessToken = "";
    if (token) {
      const result = await checkTokenExp(token, dispatch);
      accessToken = result ? result : token;
    }
    return http.post<{ msg: string }>("/upload/destroy", { public_ids }, { token: accessToken });
  },
};