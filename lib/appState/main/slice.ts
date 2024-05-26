import { createSlice } from '@reduxjs/toolkit';
import {
  fetchCategoriesThunk,
  fetchCurrencyRatesThunk,
  fetchHistoryThunk,
  fetchMainTableDataThunk,
} from './operations';
import { Category, CurrencyRates, Product, Order } from '@/lib/types';
import { updateProductThunk } from '../dashboard/operations';
// Define the type for your payload
interface PayloadCurrencyRates {
  lastUpdate: string;
  USD: number;
  EUR: number;
  // ... your payload properties here
}
type initialStateType = {
  categories: Category[];
  currencyRates: CurrencyRates;
  tableLoading: boolean;
  page: number;
  limit: number;
  totalPages: number;
  products: Product[];
  history: Order[];
};
const initialState: initialStateType = {
  currencyRates: {
    USD: 0,
    EUR: 0,
    lastUpdate: new Date().toISOString(),
  },
  tableLoading: false,
  categories: [],
  page: 1,
  limit: 10,
  totalPages: 0,
  products: [],
  history: [],
};

const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrencyRatesThunk.fulfilled, (state, { payload }) => {
        state.currencyRates = payload as PayloadCurrencyRates;
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
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, { payload }) => {
        state.categories = payload;
      })
      .addCase(fetchHistoryThunk.fulfilled, (state, { payload }) => {
        state.history = payload.orders;
        state.page = payload.page;
        state.totalPages = payload.totalPages;
      })
      .addCase(updateProductThunk.fulfilled, (state, { payload }) => {
        const index = state.products.findIndex(
          (product) => product._id === payload._id,
        );
        state.products[index] = payload;
      });
  },
});

export const mainSlice = appStateSlice.reducer;
