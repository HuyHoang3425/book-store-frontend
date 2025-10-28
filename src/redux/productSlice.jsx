import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProducts } from "../services/product.service";

// createAsyncThunk
export const fetchProducts = createAsyncThunk(
  "search/fetchProducts",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState().product;
    console.log(state);
    const { keyword, sortKey, sortValue, page } = state;
    try {
      const res = await getProducts({ keyword, sortKey, sortValue, page });
      return res.data || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message ||
          (keyword
            ? "Lỗi khi tìm kiếm sản phẩm"
            : "Lấy dữ liệu sản phẩm thất bại.")
      );
    }
  }
);

// Khởi tạo state
const initialState = {
  keyword: "",
  sortKey: "",
  sortValue: "",
  data: null,
  totalProducts: 0,
  page: 1,
  limit: 1,
  loading: false,
  error: null,
  isSearch: false,
  filters: {
    sort: null,
    action: null,
  },
};

// Tạo slice
const productSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setKeyword: (state, action) => {
      state.keyword = action.payload;
    },
    setSort: (state, action) => {
      state.sortKey = action.payload.sortKey;
      state.sortValue = action.payload.sortValue;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        sort: null,
        action: null,
      };
    },
    clearSearch: (state) => {
      state.keyword = "";
      state.data = null;
      state.loading = false;
      state.error = null;
      state.page = 1;
      state.sortKey = "";
      state.sortValue = "";
      state.isSearch = false;
    },
    setIsSearch: (state) => {
      state.isSearch = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (state.keyword.trim() !== "" && action.payload.products) {
          state.data = action.payload.products;
        }
        state.totalProducts =
          action.payload.totalProducts || state.totalProducts;
        state.limit = action.payload.limit || state.limit;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const {
  setKeyword,
  setSort,
  setPage,
  setFilters,
  clearSearch,
  setIsSearch,
  clearFilters,
} = productSlice.actions;
export default productSlice.reducer;
