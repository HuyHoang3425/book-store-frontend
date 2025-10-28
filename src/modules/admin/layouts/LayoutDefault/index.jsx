import { Breadcrumb, Card, Layout, notification } from "antd";
import MenuSider from "../../components/Menu";
import HeaderDefault from "../../components/Header";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import BreadcrumbContent from "../../components/Breadcrumb";
import SearchProvider from "../../contexts/searchContext";
const { Footer, Sider, Content } = Layout;

function LayoutDefault() {
  const [collapsed, setCollapsed] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const handleClickCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    <>
      {contextHolder}
      <Layout className="h-screen">
        <Sider width={300} collapsed={collapsed} theme="light">
          <div className="flex items-center justify-center gap-5 font-bold">
            {collapsed ? (
              <div className="sider__logo text-7xl mb-5">H</div>
            ) : (
              <>
                <div className="sider__logo text-7xl mb-5">H</div>
                <div className="sider__title">Admin</div>
              </>
            )}
          </div>
          <MenuSider />
        </Sider>

        <SearchProvider>
          <Layout>
            <HeaderDefault
              collapsed={collapsed}
              handleClickCollapsed={handleClickCollapsed}
            />

            {/* Trick: flex-grow cho Content */}
            <Content className="overflow-auto flex-1">
              <BreadcrumbContent />
              <Outlet context={{ notification: api }} />
            </Content>

            <Footer
              className="text-cente"
              style={{ background: "white", textAlign: "center" }}
            >
              Footer
            </Footer>
          </Layout>
        </SearchProvider>
      </Layout>
    </>
  );
}

export default LayoutDefault;
