import { createSlice } from '@reduxjs/toolkit';
import {
  fetchCategoriesThunk,
  fetchCurrencyRatesThunk,
  fetchMainTableDataThunk,
} from './operations';

// Define the type for your payload
interface PayloadCurrencyRates {
  lastUpdate: string;
  USD: number;
  EUR: number;
  // ... your payload properties here
}

const initialState = {
  currencyRates: {
    USD: 0,
    EUR: 0,
    lastUpdate: new Date().toISOString(),
  },
  tableLoading: false,
  categories: [{ name: '', _id: '' }],
  page: 1,
  limit: 10,
  totalPages: 0,
  products: [
    {
      article: '',
      name: '',
      image: '',
      price: '',
      priceRetailRecommendation: '',
      countInStock: 0,
      _id: '',
    },
  ],
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
      });
  },
});

export const mainSlice = appStateSlice.reducer;
