import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
function PrivateRoutes() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <>{isAuthenticated ? <Outlet /> : <Navigate to="/admin/auth/login" />}</>
  );
}

export default PrivateRoutes;
