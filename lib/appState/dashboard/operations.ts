import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiIngco } from '../user/operation';

export const fetchUsersThunk = createAsyncThunk(
  'fetchUsers',
  async ({ query: q = '' }: { query: string }, { rejectWithValue }) => {
    try {
      const { data } = await apiIngco.get('/users', { params: { q } });
      return data;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

export const fetchOrdersThunk = createAsyncThunk(
  'fetchOrders',
  async (
    {
      query: q = '',
      page = 1,
      limit = 15,
    }: { query: string; page?: number; limit?: number },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiIngco.get('/orders/all', {
        params: { q, page, limit },
      });
      return data;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

export const createProductThunk = createAsyncThunk(
  'createProduct',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const { data } = await apiIngco.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

export const updateProductThunk = createAsyncThunk(
  'updateProduct',
  async (
    { formData, productId }: { formData: FormData; productId: string },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiIngco.put(`/products/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);
