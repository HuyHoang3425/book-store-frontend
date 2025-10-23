import axios from "axios";
import { API, BASE_URL } from "../config/api";

const axiosApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Request interceptor: gắn accessToken cho mọi request
axiosApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  config.headers = config.headers || {};
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false; // trạng thái refresh token
let refreshSubscribers = []; // queue các request đang chờ

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}
// Response interceptor: xử lý 401 + refresh token
axiosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (isRefreshing) {
        // Nếu đang refresh, push request vào queue và chờ
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosApi(originalRequest));
          });
        });
      }

      // Chưa refresh → bắt đầu refresh
      isRefreshing = true;

      try {
        // Gọi refresh token (dùng axiosApi)
        const res = await axios.post(
          API.AUTH.REFRESH,
          {},
          {
            baseURL: BASE_URL,
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        const accessToken = res.data.data.accessToken;

        localStorage.setItem("accessToken", accessToken);

        // Retry tất cả request đang chờ
        isRefreshing = false;
        onRefreshed(accessToken);
        // Retry request hiện tại
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosApi(originalRequest);
      } catch (err) {
        isRefreshing = false;
        refreshSubscribers = [];

        try {
          await axiosApi.postJson(API.AUTH.LOGOUT);
        } catch (e) {
          // ignore
        }

        localStorage.removeItem("accessToken");
        // window.location.href = "/admin/auth/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export const get = async (api) => {
  const res = await axiosApi.get(api);
  return res.data;
};

export const postJson = (api, data) => {
  return axiosApi.post(api, data, {
    headers: { "Content-Type": "application/json" },
  });
};

// Khi gửi FormData
export const postForm = (api, formData) => {
  return axiosApi.post(api, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const put = async (api, data) => {
  const res = await axiosApi.put(api, data);
  return res.data;
};

export const patch = async (api, data) => {
  const res = await axiosApi.patch(api, data);
  return res.data;
};

export const del = async (api) => {
  const res = await axiosApi.delete(api);
  return res.data;
};
