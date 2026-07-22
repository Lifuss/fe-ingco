import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { apiIngco, serializeAxiosError } from '../user/operation';
import { toast } from 'react-toastify';
import { sortValueType } from '@/app/ui/catalog/FiltersBlock';
import { normalizeProduct, normalizeOrder } from '@/lib/utils';

export const fetchCurrencyRatesThunk = createAsyncThunk(
  'currencyRates/fetch',
  async (_, { rejectWithValue, signal }) => {
    try {
      const endpoint =
        typeof window !== 'undefined' ? `${window.location.origin}/api/currency` : '/api/currency';

      const { data } = await axios.get(endpoint, {
        headers: { 'Cache-Control': 'no-cache' },
        timeout: 8000, // 8s timeout to prevent hanging requests
        signal,
      });

      if (!data || !data.USD || !data.EUR) {
        throw new Error('Invalid currency data received');
      }

      const newBody = {
        lastUpdate: new Date().toISOString(),
        USD: parseFloat(Number(data.USD).toFixed(1)),
        EUR: parseFloat(Number(data.EUR).toFixed(1)),
      };

      if (!newBody.USD || !newBody.EUR || isNaN(newBody.USD) || isNaN(newBody.EUR)) {
        throw new Error('Currency rates not found or invalid');
      }
      return newBody;
    } catch (error) {
      const isCanceled =
        axios.isCancel(error) ||
        signal.aborted ||
        (error instanceof Error &&
          (error.name === 'CanceledError' ||
            error.message.toLowerCase().includes('aborted') ||
            error.message.toLowerCase().includes('canceled')));

      if (isCanceled) {
        return rejectWithValue('silent_cancel');
      }

      // Handle 404 gracefully (e.g. dev route recompiling or fast navigation unmounts) with fallback rates
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return {
          lastUpdate: new Date().toISOString(),
          USD: 44.0,
          EUR: 52.0,
        };
      }

      console.error('Currency fetch error:', error);

      return rejectWithValue(
        axios.isAxiosError(error) && error.response?.status === 429
          ? 'Занадто багато запитів до банку. Спробуйте пізніше.'
          : 'Помилка отримання курсу валют',
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const { persistedMainReducer: state } = getState() as RootState;
      if (
        state.currencyRates?.lastUpdate &&
        Date.now() - new Date(state.currencyRates.lastUpdate).getTime() <= 1800000 &&
        state.currencyRates.USD
      ) {
        return false;
      }
      return true;
    },
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
      filters,
    }: {
      query: string;
      page: number;
      category?: string;
      limit?: number;
      sortValue: sortValueType;
      isRetail: boolean;
      filters?: string;
    },
    { rejectWithValue, signal },
  ) => {
    try {
      const { data } = await apiIngco.get('/products', {
        params: { page, q: query, limit, category, sortValue, isRetail, filters },
        signal,
      });
      return { ...data, products: data.products.map(normalizeProduct) };
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

export const getProductByIdThunk = createAsyncThunk(
  'product/fetch',
  async (productId: string, { rejectWithValue }) => {
    try {
      const { data } = await apiIngco.get(`/products/id/${productId}`);
      return normalizeProduct(data);
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

export const getProductBySlugThunk = createAsyncThunk(
  'product/fetchBySlug',
  async (productSlug: string, { rejectWithValue }) => {
    try {
      const { data } = await apiIngco.get(`/products/${productSlug}`);
      return normalizeProduct(data);
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
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
      return rejectWithValue(serializeAxiosError(error));
    }
  },
  {
    condition: (query, { getState }) => {
      if (query === '') {
        const { persistedMainReducer: state } = getState() as RootState;
        if (state.categories && state.categories.length > 0) {
          return false;
        }
      }
      return true;
    },
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
    { rejectWithValue, signal },
  ) => {
    try {
      const { data } = await apiIngco.get('/orders', {
        params: { page, q, limit, isRetail },
        signal,
      });
      return {
        ...data,
        orders: (data.orders || []).map(normalizeOrder),
      };
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

export const deleteProductThunk = createAsyncThunk(
  'product/delete',
  async (productId: number, { rejectWithValue }) => {
    try {
      await apiIngco.delete(`/products/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

export const createCategoryThunk = createAsyncThunk(
  'category/create',
  async (
    {
      name,
      renderSort,
      parentId,
      showInMenu,
      slug,
      seoKeywords,
      attributeIds,
    }: {
      name: string;
      renderSort?: number;
      parentId?: number | null;
      showInMenu?: boolean;
      slug?: string;
      seoKeywords?: string;
      attributeIds?: number[];
    },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiIngco.post('/categories', {
        name,
        renderSort,
        parentId,
        showInMenu,
        slug,
        seoKeywords,
      });
      if (attributeIds && attributeIds.length > 0) {
        await apiIngco.post(`/categories/${data.id}/attributes`, { attributeIds });
      }
      return data;
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

export const updateCategoryThunk = createAsyncThunk(
  'category/update',
  async (
    {
      id,
      name,
      renderSort,
      parentId,
      showInMenu,
      slug,
      seoKeywords,
      attributeIds,
    }: {
      id: number;
      name?: string;
      renderSort?: number;
      parentId?: number | null;
      showInMenu?: boolean;
      slug?: string;
      seoKeywords?: string;
      attributeIds?: number[];
    },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiIngco.put(`/categories/${id}`, {
        name,
        renderSort,
        parentId,
        showInMenu,
        slug,
        seoKeywords,
      });
      if (attributeIds !== undefined) {
        await apiIngco.post(`/categories/${id}/attributes`, { attributeIds });
      }
      return data;
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

export const reorderCategoryThunk = createAsyncThunk(
  'category/reorder',
  async (
    { id, parentId, targetIndex }: { id: number; parentId: number | null; targetIndex: number },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiIngco.post('/categories/reorder', {
        id,
        parentId,
        targetIndex,
      });
      return data;
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

export const deleteCategoryThunk = createAsyncThunk(
  'category/delete',
  async (categoryId: number, { rejectWithValue }) => {
    try {
      await apiIngco.delete(`/categories/${categoryId}`);
      return categoryId;
    } catch (error) {
      toast.error("В категорії існують прив'язані товари, видаліть їх, або змініть категорію");
      return rejectWithValue(serializeAxiosError(error));
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
      return rejectWithValue(serializeAxiosError(error));
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
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

export const trackProductClickThunk = createAsyncThunk(
  'product/trackProductClick',
  async (productId: number, { rejectWithValue }) => {
    try {
      await apiIngco.get(`/stats/products/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);
