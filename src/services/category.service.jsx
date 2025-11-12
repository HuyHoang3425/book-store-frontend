import { API } from "../config/api";
import { del, get, patch, postJson } from "../utils/axiosApi";

export const getCategories = ({ page = 1 } = {}) => {
  console.log("page", page);
  const query = new URLSearchParams({ page });
  return get(API.CATEGORY + `?` + query.toString());
};

export const addCategory = (data) => {
  return postJson(API.CATEGORY, data);
};

export const getCategoryById = (categoryId) => {
  return get(API.CATEGORY + `/${categoryId}`);
};

export const eidtCategoryById = (categoryId, data) => {
  return patch(API.CATEGORY + `/${categoryId}`, data);
};

export const deleteCategoryById = (categoryId) => {
  return del(API.CATEGORY + `/${categoryId}`);
};
