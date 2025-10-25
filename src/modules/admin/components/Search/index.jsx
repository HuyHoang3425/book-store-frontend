import { IoIosSearch, IoMdNotificationsOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSearch,
  fetchSearchData,
  setQuery,
} from "../../../../redux/searchSlice";
import { useEffect } from "react";

function Search() {
  const { query } = useSelector((state) => state.search);
  const dispatch = useDispatch();

  const handleSearch = () => {
    if (query.trim()) {
      dispatch(fetchSearchData(query));
    }
  };

  const handleClear = () => {
    dispatch(clearSearch());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <div className="header__search flex relative">
        <input
          type="text"
          placeholder="Search..."
          className="rounded-4xl px-6 py-3 bg-[#F1F5F7] w-[300px] outline-none"
          value={query}
          onChange={(e) => dispatch(setQuery(e.target.value))}
          onKeyDown={handleKeyDown}
        />

        {query && (
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
