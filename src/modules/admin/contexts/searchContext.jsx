import { createContext, useState } from "react";

export const SearchContext = createContext();

const SearchProvider = ({ children }) => {
  const [keyword, setKeyword] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);

  // Quản lý tất cả filters trong 1 object
  const [filters, setFilters] = useState({
    sortKey: null,
    sortValue: null,
    status: null,
    minPrice: null,
    maxPrice: null,
  });

  // Helper function để reset filters
  const resetFilters = () => {
    setFilters({
      sortKey: null,
      sortValue: null,
      status: null,
      minPrice: null,
      maxPrice: null,
    });
  };

  // Helper function để update 1 hoặc nhiều filter
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <SearchContext.Provider
      value={{
        keyword,
        setKeyword,
        isSearch,
        setIsSearch,
        hasSearched,
        setHasSearched,
        page,
        setPage,
        filters,
        setFilters,
        resetFilters,
        updateFilters,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
