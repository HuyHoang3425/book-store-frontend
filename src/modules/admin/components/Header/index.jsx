import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Dropdown } from "antd";
import { useContext } from "react";
import {
  IoIosSearch,
  IoMdNotificationsOutline,
  IoIosArrowDown,
} from "react-icons/io";
import { AuthContext } from "../../contexts/authContext";
import {useDispatch, useSelector} from "react-redux";
import { logout } from "../../../../action/auth";

const itemsMenuDropdown = [
  {
    key: "profile",
    label: (
      <div className="flex gap-2">
        <UserOutlined />
        <span>Thông tin cá nhân</span>
      </div>
    ),
  },
  {
    key: "settings",
    label: (
      <div className="flex gap-2">
        <SettingOutlined />
        <span>Cài đặt</span>
      </div>
    ),
  },
  {
    type: "divider", // ngăn cách
  },
  {
    key: "logout",
    label: (
      <div className="flex gap-2">
        <LogoutOutlined />
        <span>Đăng xuất</span>
      </div>
    ),
  },
];

function HeaderDefault(props) {
  const { collapsed, handleClickCollapsed } = props;

  const auth = useSelector(state => state.authReducer);
  const dispatch = useDispatch();

  console.log(auth)

  const handleClick = () => {
    handleClickCollapsed();
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <header className="bg-white px-10 py-6 w-full flex items-center justify-between text-[#7F888F]">
        <div className="header__left" onClick={handleClick}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
        <div className="header__right flex gap-8 items-center">
          <div className="header__search flex relative">
            <input
              type="text"
              placeholder="Search..."
              className="rounded-4xl px-6 py-3 bg-[#F1F5F7] w-[300px] outline-none"
            />
            <IoIosSearch className=" text-2xl absolute top-1/2 right-4 -translate-y-1/2 flex items-center justify-center" />
          </div>
          <div className="header__notify">
            <IoMdNotificationsOutline className="text-2xl" />
          </div>
          <div className="header__avatar ml-10 flex gap-4 items-center">
            <Dropdown
              menu={{
                items: itemsMenuDropdown,
                onClick: ({ key }) => {
                  if (key === "logout") handleLogout();
                  if (key === "settings") {
                    console.log("Đi tới trang cài đặt");
                  }
                },
              }}
              trigger={["click"]}
              popupRender={(menus) => {
                return (
                  <>
                    <div className="info">
                      <div className="info__header text-center bg-[#666] text-[white] rounded-t-md py-2">
                        Chào mừng
                      </div>
                    </div>
                    <div className="info__body">{menus}</div>
                  </>
                );
              }}
            >
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="">xin chào, Huy Hoàng</div>
                <IoIosArrowDown />
              </div>
            </Dropdown>
            <img
              src="/assets/admin/anhtho123.jpg"
              alt=""
              className="w-[50px] h-[50px] rounded-full"
            />
          </div>
        </div>
      </header>
    </>
  );
}

export default HeaderDefault;
