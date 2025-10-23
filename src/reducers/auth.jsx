const initialState = {
  isLogin: !!localStorage.getItem("accessToken"),
  token: localStorage.getItem("accessToken") || null,
  user: null,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isLogin: true,
        token: action.payload.token,
        user: action.payload.user,
        error: null,
      };
    case "LOGIN_ERROR":
      return {
        ...state,
        isLogin: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        isLogin: false,
        token: null,
        user: null,
      };
    default:
      return state;
  }
};

export default authReducer;
