import { API } from "../config/api";
import { del, get, patch, postJson } from "../utils/axiosApi";

export const getProducts = ({
  keyword,
  page = 1,
  sortKey,
  sortValue,
  status,
  minPrice,
  maxPrice,
} = {}) => {
  const query = new URLSearchParams({ page });
  if (keyword) query.append("keyword", keyword);
  if (sortKey && sortValue) {
    query.append("sortKey", sortKey);
    query.append("sortValue", sortValue);
  }
  if (status) query.append("status", status);
  if (maxPrice) {
    query.append("maxPrice", maxPrice);
  }
  if (minPrice) {
    query.append("minPrice", minPrice);
  }
  return get(API.PRODUCT + `?` + query.toString());
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

export const updateProductByAction = (data) => {
  return patch(API.PRODUCT + "/action", data);
};
