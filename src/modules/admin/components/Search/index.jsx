import { IoIosSearch, IoMdNotificationsOutline } from "react-icons/io";
import { useContext, useEffect } from "react";
import { SearchContext } from "../../contexts/searchContext";

function Search() {
  const {
    keyword,
    setKeyword,
    setIsSearch,
    setHasSearched,
    hasSearched,
    setPage,
    resetFilters,
  } = useContext(SearchContext);

  useEffect(() => {
    if (keyword.trim() === "" && hasSearched) {
      setIsSearch(true);
      setPage(1);
      resetFilters(); // Reset tất cả filters
      setHasSearched(false);
    }
  }, [keyword, hasSearched]);

  const handleSearch = () => {
    if (keyword.trim() !== "") {
      setIsSearch(true);
      setHasSearched(true);
      setPage(1);
      resetFilters(); // Reset tất cả filters khi search
    }
  };

  const handleClear = () => {
    setKeyword("");
    setPage(1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleChange = (e) => {
    setKeyword(e.target.value);
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
