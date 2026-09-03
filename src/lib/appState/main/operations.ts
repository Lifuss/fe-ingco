import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiIngco, serializeAxiosError } from '../user/operation';
import { normalizeOrder } from '@/lib/utils';

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
      turnstileToken,
    }: {
      name: string;
      email: string;
      message: string;
      phone: string;
      turnstileToken?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      await apiIngco.post('/users/support', { name, email, message, phone, turnstileToken });
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
