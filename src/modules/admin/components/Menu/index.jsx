import { Menu } from "antd";
import { Link } from "react-router-dom";
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
    label: <Link to="/dashboard">Dashboard</Link>,
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "dashboard-1",
        label: <Link to="dashboard">Tổng quan</Link>,
      },
      {
        key: "dashboard-2",
        label: "Thống kê",
      },
    ],
  },
  {
    key: "stories",
    label: <Link to="/admin/auth/products">Quản lý sản phẩm</Link>,
    icon: <BookOutlined />,
  },
  {
    key: "categories",
    label: "Danh mục",
    icon: <ReadOutlined />,
    children: [
      {
        key: "categories-list",
        label: "Danh sách danh mục",
      },
      {
        key: "categories-add",
        label: "Thêm danh mục",
      },
    ],
  },
  {
    key: "users",
    label: "Người dùng",
    icon: <UserOutlined />,
    children: [
      {
        key: "users-list",
        label: "Danh sách người dùng",
      },
      {
        key: "users-add",
        label: "Thêm quản trị viên",
      },
    ],
  },
  {
    key: "settings",
    label: "Cài đặt",
    icon: <SettingOutlined />,
  },
];

function MenuSider() {
  return (
    <Menu
      defaultSelectedKeys={["dashboard-1"]}
      defaultOpenKeys={["dashboard"]}
      mode="inline"
      items={items}
    />
  );
}

export default MenuSider;
