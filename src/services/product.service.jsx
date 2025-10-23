import { API } from "../config/api";
import { del, get, postForm, put } from "../utils/axiosApi";

export const getProducts = async (page) => {
  const products = await get(API.PRODUCT.GET + `?page=${page}`);
  return products;
};

export const addProduct = async (data) => {
  const product = await postForm(API.PRODUCT.GET, data);
  return product;
};

export const editProduct = async (data, id) => {
  const product = await put(API.PRODUCT.GET + `/${id}`, data);
  return product;
};

export const deleteProduct = async (id) => {
  const product = await del(API.PRODUCT.GET + `/${id}`);
  return product;
}
