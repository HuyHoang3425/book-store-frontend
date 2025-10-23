import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";
const breadcrumbNameMap = {
  products: "Sản phẩm",
  add: "Thêm sản phẩm",
  edit: "Sửa sản phẩm",
};
function BreadcrumbContent() {
  const location = useLocation();
  const pathName = location.pathname
  const pathNames = pathName.replace("/admin/auth/", "")
    .split("/")
    .filter((i) => i);

  const isDashboard = pathNames.length === 1 && pathNames[0] === "dashboard";
  const items = [
    {
      title: isDashboard ? (
        "Dashboard"
      ) : (
        <Link to="/admin/auth/dashboard">Dashboard</Link>
      ),
    },
  ];

  let path = "/admin/auth";

  pathNames.forEach((name,index) => {
    path += `/${name}`;
    if (!breadcrumbNameMap[name]) return;
    const isActive = path === pathName || (pathNames.length - 2) === index;
    items.push({
      title: isActive ? (
        breadcrumbNameMap[name]
      ) : (
        <Link to={path}>{breadcrumbNameMap[name]}</Link>
      ),
    });
  });

  return (
    <>
      <Breadcrumb style={{ margin: "20px 20px 0px 20px" }} items={items} />
    </>
  );
}

export default BreadcrumbContent;
