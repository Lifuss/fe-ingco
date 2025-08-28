import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { apiIngco } from '../user/operation';
import { toast } from 'react-toastify';
import { sortValueType } from '@/app/ui/FiltersBlock';

export const fetchCurrencyRatesThunk = createAsyncThunk(
  'currencyRates/fetch',
  async (_, { rejectWithValue, getState }) => {
    try {
      let newBody: { lastUpdate?: string; USD?: number; EUR?: number } = {};
      const { persistedMainReducer: state } = getState() as RootState;

      if (
        !state.currencyRates?.lastUpdate ||
        Date.now() - new Date(state.currencyRates.lastUpdate).getTime() >
          1800000 ||
        !state.currencyRates.USD
      ) {
        newBody = {
          lastUpdate: new Date().toISOString(),
        };

        const { data } = await axios.get('/api/currency', {
          headers: { 'Cache-Control': 'no-cache' },
        });

        if (!data || !data.USD || !data.EUR) {
          throw new Error('Invalid currency data received');
        }

        newBody.USD = parseFloat(Number(data.USD).toFixed(1));
        newBody.EUR = parseFloat(Number(data.EUR).toFixed(1));

        if (
          !newBody.USD ||
          !newBody.EUR ||
          isNaN(newBody.USD) ||
          isNaN(newBody.EUR)
        ) {
          throw new Error('Currency rates not found or invalid');
        }
        return newBody;
      } else {
        return state.currencyRates;
      }
    } catch (error: any) {
      console.error('Currency fetch error:', error);
      // Return fallback values instead of crashing
      return rejectWithValue({
        message:
          error.response?.status === 429
            ? 'Занадто багато запитів до банку. Спробуйте пізніше.'
            : 'Помилка отримання курсу валют',
        fallback: {
          USD: 41.0, // Fallback USD rate
          EUR: 44.0, // Fallback EUR rate
          lastUpdate: new Date().toISOString(),
        },
      });
    }
  },
);

export const fetchMainTableDataThunk = createAsyncThunk(
  'mainTable/fetch',
  async (
    {
      page,
      query,
      category,
      limit = 30,
      sortValue,
      isRetail = true,
    }: {
      query: string;
      page: number;
      category?: string;
      limit?: number;
      sortValue: sortValueType;
      isRetail: boolean;
    },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiIngco.get('/products', {
        params: { page, q: query, limit, category, sortValue, isRetail },
      });
      return data;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

export const getProductByIdThunk = createAsyncThunk(
  'product/fetch',
  async (productId: string, { rejectWithValue }) => {
    try {
      const { data } = await apiIngco.get(`/products/${productId}`);
      return data;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

export const getProductBySlugThunk = createAsyncThunk(
  'product/fetch',
  async (productSlug: string, { rejectWithValue }) => {
    try {
      const { data } = await apiIngco.get(`/products/${productSlug}`);
      return data;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);
export const fetchCategoriesThunk = createAsyncThunk(
  'categories/fetch',
  async (query: string, { rejectWithValue }) => {
    try {
      const { data } = await apiIngco.get('/categories', {
        params: { q: query },
      });
      return data;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

export const fetchHistoryThunk = createAsyncThunk(
  'history/fetch',
  async (
    {
      page = 1,
      q = '',
      limit = 15,
      isRetail,
    }: { page: number; q: string; limit?: number; isRetail: boolean },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiIngco.get('/orders', {
        params: { page, q, limit, isRetail },
      });
      return data;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

export const deleteProductThunk = createAsyncThunk(
  'product/delete',
  async (productId: string, { rejectWithValue }) => {
    try {
      await apiIngco.delete(`/products/${productId}`);
      return productId;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

export const createCategoryThunk = createAsyncThunk(
  'category/create',
  async (
    { name, renderSort }: { name: string; renderSort: number },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiIngco.post('/categories', { name, renderSort });
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const updateCategoryThunk = createAsyncThunk(
  'category/update',
  async (
    { id, name, renderSort }: { id: string; name: string; renderSort: number },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiIngco.put(`/categories/${id}`, {
        name,
        renderSort,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const deleteCategoryThunk = createAsyncThunk(
  'category/delete',
  async (categoryId: string, { rejectWithValue }) => {
    try {
      await apiIngco.delete(`/categories/${categoryId}`);
      return categoryId;
    } catch (error) {
      toast.error(
        "В категорії існують прив'язані товари, видаліть їх, або змініть категорію",
      );
      rejectWithValue(error);
    }
  },
);

export const fetchExcelFileThunk = createAsyncThunk(
  'excel/fetch',
  async (sheetType: string, { rejectWithValue }) => {
    try {
      const { status, data } = await apiIngco.get('/products/sheets', {
        params: { sheetType },
        responseType: 'blob',
      });
      if (status === 202) {
        return {
          message: 'Файл формується, спробуйте через декілька секунд',
          type: 'info',
          status: status,
        };
      }
      return { blob: data, type: 'success', status: status };
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

export const supportTicketThunk = createAsyncThunk(
  'users/support',
  async (
    {
      name,
      email,
      message,
      phone,
    }: {
      name: string;
      email: string;
      message: string;
      phone: string;
    },
    { rejectWithValue },
  ) => {
    try {
      await apiIngco.post('/users/support', { name, email, message, phone });
      return;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const trackProductClickThunk = createAsyncThunk(
  'product/trackProductClick',
  async (productId: string) => {
    await apiIngco.get(`/stats/products/${productId}`);
    return productId;
  },
);
