import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  AppstoreOutlined,
  BookOutlined,
  ReadOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";

const items = [
  {
    key: "dashboard",
    label: <Link to="/admin/auth/dashboard">Dashboard</Link>,
    icon: <AppstoreOutlined />,
    // children: [
    //   {
    //     key: "dashboard-1",
    //     label: <Link to="dashboard">Tổng quan</Link>,
    //   },
    //   {
    //     key: "dashboard-2",
    //     label: "Thống kê",
    //   },
    // ],
  },
  {
    key: "products",
    label: <Link to="/admin/auth/products">Quản lý sản phẩm</Link>,
    icon: <BookOutlined />,
  },
  {
    key: "categories",
    label: <Link to="/admin/auth/categories">Quản lý danh mục</Link>,
    icon: <ReadOutlined />,
  },
  {
    key: "users",
    label: "Người dùng",
    icon: <UserOutlined />,
  },
  {
    key: "settings",
    label: "Cài đặt",
    icon: <SettingOutlined />,
  },
];

function MenuSider() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean).slice(2);
  const selectedKey = pathSegments[0]
  const openKey = selectedKey;
  return (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      defaultOpenKeys={[openKey]}
      items={items}
    />
  );
}

export default MenuSider;
