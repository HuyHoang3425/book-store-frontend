import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/authContext";

function PublicRoutes() {
  const { isLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (isLogin) navigate("/admin/auth/dashboard", { replace: true });
  }, [isLogin, navigate]);
  return <Outlet />;
}

export default PublicRoutes;
