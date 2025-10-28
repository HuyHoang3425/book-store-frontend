import { IoIosSearch, IoMdNotificationsOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  clearFilters,
  clearSearch,
  fetchProducts,
  setIsSearch,
  setKeyword,
  setPage,
  setSort,
} from "../../../../redux/productSlice";
import { useEffect } from "react";

function Search() {
  const { keyword, sortKey, sortValue } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const handleSearch = () => {
    if (keyword.trim() && keyword.trim() !== "") {
      dispatch(setPage(1));
      dispatch(setSort({ sortKey: "", sortValue: "" }));
      dispatch(setIsSearch());
      dispatch(clearFilters());
      dispatch(fetchProducts());
    } else {
      dispatch(clearSearch());
    }
  };

  useEffect(() => {
    if (keyword.trim() && keyword.trim() !== "") {
      dispatch(fetchProducts());
    }
  }, [sortKey, sortValue]);

  const handleClear = () => {
    dispatch(clearSearch());
    dispatch(clearFilters());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleChange = (e) => {
    if (e.target.value && e.target.value.trim() !== "")
      dispatch(setKeyword(e.target.value));
    else dispatch(clearSearch());
  };
  return (
    <>
      <div className="header__search flex relative">
        <input
          type="text"
          placeholder="Search..."
          className="rounded-4xl px-6 py-3 bg-[#F1F5F7] w-[300px] outline-none"
          value={keyword}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        {keyword && (
          <button
            onClick={handleClear}
            className="absolute top-1/2 right-12 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}

        <IoIosSearch
          onClick={handleSearch}
          className="text-2xl absolute top-1/2 right-4 -translate-y-1/2 flex items-center justify-center cursor-pointer hover:text-blue-600"
        />
      </div>
      <div className="header__notify">
        <IoMdNotificationsOutline className="text-2xl" />
      </div>
    </>
  );
}

export default Search;
