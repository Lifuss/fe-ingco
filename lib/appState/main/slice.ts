import { createSlice } from '@reduxjs/toolkit';
import {
  createCategoryThunk,
  deleteCategoryThunk,
  deleteProductThunk,
  fetchCategoriesThunk,
  fetchCurrencyRatesThunk,
  fetchHistoryThunk,
  fetchMainTableDataThunk,
  getProductByIdThunk,
  getProductBySlugThunk,
  updateCategoryThunk,
} from './operations';
import { Category, CurrencyRates, Product, Order } from '@/lib/types';
import { updateProductThunk } from '../dashboard/operations';
import { toast } from 'react-toastify';

interface PayloadCurrencyRates {
  lastUpdate: string;
  USD: number;
  EUR: number;
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
  total: number;
  product: Product;
  shopView: 'table' | 'list';
};
const initialState: initialStateType = {
  currencyRates: {
    USD: 0,
    EUR: 0,
    lastUpdate: new Date().toISOString(),
  },
  tableLoading: false,
  categories: [],
  shopView: 'table',
  page: 1,
  limit: 10,
  totalPages: 0,
  total: 0,
  products: [],
  history: [],
  product: {
    _id: '',
    name: '',
    slug: '',
    article: '',
    description: '',
    price: 0,
    priceRetailRecommendation: 0,
    characteristics: [],
    countInStock: 0,
    image: '',
    warranty: 0,
    seoKeywords: '',
    category: null,
    sort: 0,
    createdAt: '',
    updatedAt: '',
  },
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
      .addCase(getProductBySlugThunk.fulfilled, (state, { payload }) => {
        state.product = payload;
      })
      .addCase(fetchCurrencyRatesThunk.fulfilled, (state, { payload }) => {
        state.currencyRates = payload as PayloadCurrencyRates;
      })
      .addCase(fetchCurrencyRatesThunk.rejected, (state, { payload }) => {
        if (
          payload &&
          typeof payload === 'object' &&
          'fallback' in payload &&
          'message' in payload
        ) {
          state.currencyRates = payload.fallback as PayloadCurrencyRates;
          toast.warning(payload.message as string);
        } else if (!state.currencyRates.USD) {
          state.currencyRates = {
            USD: 41.0,
            EUR: 44.0,
            lastUpdate: new Date().toISOString(),
          };
          toast.error(
            'Помилка завантаження курсу валют. Використовуються резервні значення.',
          );
        }
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
      })
      .addCase(createCategoryThunk.fulfilled, (state, { payload }) => {
        state.categories.push(payload);
      })
      .addCase(deleteProductThunk.fulfilled, (state, { payload }) => {
        state.products = state.products.filter(
          (product) => product._id !== payload,
        );
      })
      .addCase(updateCategoryThunk.fulfilled, (state, { payload }) => {
        const index = state.categories.findIndex(
          (category) => category._id === payload._id,
        );
        state.categories[index] = { ...state.categories[index], ...payload };
      })
      .addCase(deleteCategoryThunk.fulfilled, (state, { payload }) => {
        state.categories = state.categories.filter(
          (category) => category._id !== payload,
        );
      });
  },
});

export const { setShopView } = appStateSlice.actions;
export const mainSlice = appStateSlice.reducer;
