import { NavLink } from "react-router-dom";
import { FaMagnifyingGlass } from "react-icons/fa6";
function HeaderDefault() {
  return (
    <>
      <header className="flex items-center justify-between bg-night text-white px-6 py-3 shadow-md fixed top-0 z-999 w-full">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src="/assets/client/logo.png"
            alt="logo"
            className="h-10 object-contain"
          />
          <span className="text-2xl font-bold">Tuth Book</span>
        </div>

        {/* Search */}
        <div className="flex items-center bg-white rounded-lg overflow-hidden">
          <input
            placeholder="Bạn cần sách gì..."
            className="px-3 py-2 !w-[100px] outline-none text-black"
          />
          <button className="px-3 text-black hover:text-blue-600">
            <FaMagnifyingGlass />
          </button>
        </div>

        {/* Nav */}
        <nav>
          <ul className="flex gap-6 font-medium">
            <li>
              <NavLink
                to="/comics"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-400 font-semibold"
                    : "hover:text-blue-300"
                }
              >
                Truyện tranh
              </NavLink>
            </li>
            <li>
              <NavLink to="/novels" className="hover:text-blue-300">
                Tiểu thuyết
              </NavLink>
            </li>
            <li>
              <NavLink to="/manga" className="hover:text-blue-300">
                Manga
              </NavLink>
            </li>
            <li>
              <NavLink to="/light-novel" className="hover:text-blue-300">
                Light Novel
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="hover:text-blue-300">
                Giới thiệu
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Auth Buttons */}
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-[#333] transition">
            Đăng nhập
          </button>
          <button className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition">
            Đăng ký
          </button>
        </div>
      </header>
    </>
  );
}
export default HeaderDefault;
