import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";

// Map các segment cha
const parentMap = {
  products: "Sản phẩm",
  categories: "Danh mục sản phẩm",
  orders: "Đơn hàng", // ví dụ thêm module mới
};

// Map các hành động con
const actionMap = {
  add: "Thêm",
  edit: "Sửa",
  restore: "Khôi phục",
};

function BreadcrumbContent() {
  const location = useLocation();
  const pathNames = location.pathname
    .replace("/admin/auth/", "")
    .split("/")
    .filter((i) => i);

  // Nếu đang ở dashboard
  if (
    pathNames.length === 0 ||
    (pathNames.length === 1 && pathNames[0] === "dashboard")
  ) {
    return (
      <Breadcrumb
        style={{ margin: "20px 20px 0 20px" }}
        items={[{ title: "Dashboard" }]}
      />
    );
  }

  const items = [];
  let path = "/admin/auth";

  pathNames.forEach((name, index) => {
    const isId = /^[0-9a-fA-F]{24}$/.test(name); // kiểm tra ID MongoDB
    path += `/${name}`;

    if (isId) return; // bỏ qua nếu là ID

    let title = "";

    if (index === 0 && parentMap[name]) {
      // segment cha đầu tiên
      title = parentMap[name];
    } else if (index > 0 && actionMap[name]) {
      // segment con là hành động
      const parent = pathNames[index - 1];
      title = `${actionMap[name]} ${parentMap[parent] || ""}`.trim();
    } else {
      // các segment khác nếu cần
      title = name;
    }

    const isLast = index === pathNames.length - 1;
    items.push({
      title: isLast ? title : <Link to={path}>{title}</Link>,
    });
  });

  // Thêm Dashboard đầu tiên
  items.unshift({ title: <Link to="/admin/auth/dashboard">Dashboard</Link> });

  return <Breadcrumb style={{ margin: "20px 20px 0 20px" }} items={items} />;
}

export default BreadcrumbContent;
