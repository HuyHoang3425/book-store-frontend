import { API } from "../config/api";
import { del, get, patch, postJson, put } from "../utils/axiosApi";

export const getProducts = (page) => {
  return get(API.PRODUCT + `?page=${page}`);
};

export const addProduct = (data) => {
  return postJson(API.PRODUCT, data);
};

export const editProduct = (data, id) => {
  return patch(API.PRODUCT + `/${id}`, data);
};

export const deleteProduct = (productId) => {
  return del(API.PRODUCT + `/${productId}`);
};

export const getProductById = (productId) => {
  return get(API.PRODUCT + `/${productId}`);
};

export const searchProduct = (keyword, page = 1, sortKey, sortValue) => {
  const query = new URLSearchParams({ page });
  if (keyword) {
    query.append("keyword", keyword);
  }
  if (sortKey && sortValue) {
    query.append("sortKey", sortKey);
    query.append("sortValue", sortValue);
  }
  return get(API.SEARCH + `/products?` + query);
};
