import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postJson } from "../../../../utils/axiosApi";
import { API } from "../../../../config/api";
import { AuthContext } from "../../contexts/authContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email,
      password,
    };

    try {
      const res = await postJson(API.AUTH.LOGIN, data);
      login(res.data.data.accessToken);
      // navigate("/admin/auth/dashboard");
    } catch (err) {
      alert("lỗi không lưu")
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
              className="bg-blue-200 py-2 px-4 my-5 text-[#555]"
            >
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
