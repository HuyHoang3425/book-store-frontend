import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
function PrivateRoutes() {
  const { isLogin } = useContext(AuthContext);
  return <>{isLogin ? <Outlet /> : <Navigate to="/admin/auth/login" />}</>;
}

export default PrivateRoutes;
