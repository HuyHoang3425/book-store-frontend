// src/config/api.js
export const BASE_URL = "http://localhost:3000/api/v1";

export const API = {
  AUTH: {
    REGISTER: `/auth/register`,
    LOGIN: `/auth/login`,
    REFRESH: `/auth/refresh-token`,
    LOGOUT: `/auth/logout`,
  },
  PRODUCT: {
    GET:'products'
  }
};
