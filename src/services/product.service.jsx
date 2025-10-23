import { API } from "../config/api";
import { del, get, patch, postJson, put } from "../utils/axiosApi";

export const getProducts = (page) => {
  const products = get(API.PRODUCT + `?page=${page}`);
  return products;
};

export const addProduct = (data) => {
  const product = postJson(API.PRODUCT, data);
  return product;
};

export const editProduct = (data, id) => {
  const product = patch(API.PRODUCT + `/${id}`, data);
  return product;
};

export const deleteProduct = (productId) => {
  const product = del(API.PRODUCT + `/${productId}`);
  return product;
};

export const getProductById = (productId) => {
  return get(API.PRODUCT + `/${productId}`);
};
