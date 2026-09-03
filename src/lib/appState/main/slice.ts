import { createSlice } from '@reduxjs/toolkit';
import {
  deleteProductThunk,
  fetchHistoryThunk,
  fetchMainTableDataThunk,
  getProductBySlugThunk,
} from './operations';
import { Product, Order } from '@/lib/types';
import { updateProductThunk } from '../dashboard/operations';

type initialStateType = {
  tableLoading: boolean;
  page: number;
  limit: number;
  totalPages: number;
  products: Product[];
  history: Order[];
  total: number;
  product: Product | null;
  productLoading: boolean;
  shopView: 'table' | 'list';
};
const initialState: initialStateType = {
  tableLoading: false,
  shopView: 'table',
  page: 1,
  limit: 10,
  totalPages: 0,
  total: 0,
  products: [],
  history: [],
  product: null,
  productLoading: false,
};

const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setShopView: (state, { payload }) => {
      state.shopView = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductBySlugThunk.pending, (state) => {
        state.productLoading = true;
        state.product = null;
      })
      .addCase(getProductBySlugThunk.fulfilled, (state, { payload }) => {
        state.product = payload;
        state.productLoading = false;
      })
      .addCase(getProductBySlugThunk.rejected, (state) => {
        state.productLoading = false;
        state.product = null;
      })
      .addCase(fetchMainTableDataThunk.pending, (state) => {
        state.tableLoading = true;
      })
      .addCase(fetchMainTableDataThunk.fulfilled, (state, { payload }) => {
        state.products = payload.products;
        state.tableLoading = false;
        state.page = payload.page;
        state.limit = payload.limit;
        state.totalPages = payload.totalPages;
        state.total = payload.total;
      })
      .addCase(fetchHistoryThunk.fulfilled, (state, { payload }) => {
        state.history = payload.orders;
        state.page = payload.page;
        state.totalPages = payload.totalPages;
      })
      .addCase(updateProductThunk.fulfilled, (state, { payload }) => {
        const index = state.products.findIndex((product) => product.id === payload.id);
        if (index !== -1) {
          state.products[index] = payload;
        }
      })
      .addCase(deleteProductThunk.fulfilled, (state, { payload }) => {
        state.products = state.products.filter((product) => product.id !== payload);
      });
  },
});

export const { setShopView } = appStateSlice.actions;
export const mainSlice = appStateSlice.reducer;
