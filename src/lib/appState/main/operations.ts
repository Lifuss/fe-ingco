import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiIngco, serializeAxiosError } from '../user/operation';

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
