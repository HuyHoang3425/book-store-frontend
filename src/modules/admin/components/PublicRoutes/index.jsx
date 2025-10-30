import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function PublicRoutes() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) navigate("/admin/auth/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);
  return <Outlet />;
}

export default PublicRoutes;
