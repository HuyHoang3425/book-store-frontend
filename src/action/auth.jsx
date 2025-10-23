import { API } from "../config/api";
import { postJson } from "../utils/axiosApi";

export const login = (data) => async (dispatch) => {
  try {
    const res = await postJson(API.AUTH.LOGIN, data);
    const token = res.data.data.accessToken;

    localStorage.setItem("accessToken", token);

    dispatch({
      type: "LOGIN_SUCCESS",
      payload: {
        token,
        user: res.data.data.user,
      },
    });
  } catch (error) {
    dispatch({
      type: "LOGIN_ERROR",
      payload: error.response?.data || "Lỗi đăng nhập",
    });
  }
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  return { type: "LOGOUT" };
};
