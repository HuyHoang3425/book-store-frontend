import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";

const breadcrumbNameMap = {
  products: "Sản phẩm",
  add: "Thêm sản phẩm",
  edit: "Sửa sản phẩm",
};

function BreadcrumbContent() {
  const location = useLocation();
  const pathName = location.pathname;
  const pathNames = pathName
    .replace("/admin/auth/", "")
    .split("/")
    .filter((i) => i);

  const isDashboard =
    pathNames.length === 0 ||
    (pathNames.length === 1 && pathNames[0] === "dashboard");

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

  pathNames.forEach((name, index) => {
    const isId = /^[0-9a-fA-F]{24}$/i.test(name) || !breadcrumbNameMap[name];

    if (isId) {
      path += `/${name}`;
      return;
    }

    path += `/${name}`;

    const remainingItems = pathNames.slice(index + 1);
    const hasMoreBreadcrumbs = remainingItems.some(
      (item) => breadcrumbNameMap[item]
    );
    const isActive = !hasMoreBreadcrumbs;

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
