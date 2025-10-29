import Dashboard from "../modules/admin/pages/Dashboard";
import PrivateRoutes from "../modules/admin/components/PrivateRoutes";
import Login from "../modules/admin/pages/Login";
import LayoutDefault from "../modules/admin/layouts/LayoutDefault";
import { AuthProvider } from "../modules/admin/contexts/authContext";
import { Outlet } from "react-router-dom";
import PublicRoutes from "../modules/admin/components/PublicRoutes";
import Product from "../modules/admin/pages/product";
import Error from "../modules/admin/pages/Error";
import AddProduct from "../modules/admin/pages/product/addProduct";
import EditProduct from "../modules/admin/pages/product/editProduct";
import RestoreProducts from "../modules/admin/pages/Product/restoreProducts";

const adminRoute = [
  {
    path: "/admin",
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "auth/login",
        element: <PublicRoutes />,
        children: [
          {
            index: true,
            element: <Login />,
          },
        ],
      },
      {
        path: "auth",
        element: <PrivateRoutes />,
        children: [
          {
            element: <LayoutDefault />,
            children: [
              {
                index: true,
                path: "dashboard",
                element: <Dashboard />,
              },
              {
                path: "products",
                element: <Product />,
              },
              {
                path: "products/add",
                element: <AddProduct />,
              },
              {
                path: "products/edit/:id",
                element: <EditProduct />,
              },
              {
                path: "products/restore",
                element: <RestoreProducts />,
              },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <Error />,
      },
    ],
  },
];

export default adminRoute;
