import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../../../redux/authSlice";
import { notification } from "antd";
import { useState, useEffect } from "react";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Khi đăng nhập thành công → chuyển hướng
  useEffect(() => {
    if (isAuthenticated) {
      notification.success({
        message: "Đăng nhập thành công 🎉",
        duration: 2,
      });
      navigate("/dashboard"); // hoặc trang nào bạn muốn
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { email, password };

    try {
      const result = await dispatch(login(data)).unwrap();
      console.log("Login success:", result);
    } catch (err) {
      notification.error({
        message: err.response?.data?.message || "Sai email hoặc mật khẩu!",
        duration: 3,
      });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-[70%] h-[70%] bg-[#555] text-white rounded-4xl flex justify-center">
        <div className="w-1/2 p-5">
          <h1 className="text-4xl my-5">Đăng nhập</h1>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              type="text"
              required
              placeholder="Email"
              className="bg-white py-2 px-4 my-5 text-[#555]"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              required
              placeholder="Mật khẩu"
              className="bg-white py-2 px-4 my-5 text-[#555]"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-200 py-2 px-4 my-5 text-[#555] ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
