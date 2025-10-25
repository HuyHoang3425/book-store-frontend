import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { searchProduct } from "../services/product.service";

// createAsyncThunk
export const fetchSearchData = createAsyncThunk(
  "search/fetchSearchData",
  async (query, sortKey, sorValue, { rejectWithValue }) => {
    try {
      // Nếu query rỗng, trả về null để hiển thị danh sách gốc
      if (!query || query.trim() === "") {
        return null;
      }

      const data = await searchProduct(query);
      return data.data.results || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Lỗi khi tìm kiếm sản phẩm"
      );
    }
  }
);

// Khởi tạo state
const initialState = {
  query: "",
  sortKey: null,
  sortValue: null,
  data: null,
  loading: false,
  error: null,
};

// Tạo slice
const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setSort: (state, action) => {
      state.sortKey = action.payload.sortKey;
      state.sortValue = action.payload.sorValue;
    },
    clearSearch: (state) => {
      state.query = "";
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchSearchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const { setQuery, setSort, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
