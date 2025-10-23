import { API } from "../config/api";
import { postForm } from "../utils/axiosApi";

export const uploadImages = (formData) => {
  const data = postForm(API.UPLOAD.IMAGES, formData);
  return data;
};
