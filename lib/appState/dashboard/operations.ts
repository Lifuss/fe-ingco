import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiIngco } from '../user/operation';
import { Order, User } from '@/lib/types';

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

export const createUserThunk = createAsyncThunk(
  'createUser',
  async (
    credentials: {
      firstName: string;
      lastName: string;
      surName: string;
      email: string;
      login: string;
      password: string;
      role: 'user' | 'admin';
      phone: string;
      edrpou?: string;
      about?: string;
      address?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiIngco.post('/users', credentials);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

interface NewProduct {
  _id: string;
  quantity: number;
  totalPriceByOneProduct: number;
  product: string;
  price: number;
}

interface UpdateOrder
  extends Omit<
    Order,
    'products' | 'user' | 'orderCode' | 'createdAt' | 'updatedAt'
  > {
  products: NewProduct[];
}

export const updateOrderThunk = createAsyncThunk(
  'updateOrder',
  async (
    { orderId, updateOrder }: { orderId: string; updateOrder: UpdateOrder },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiIngco.put(`/orders/${orderId}`, updateOrder);
      return data;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);
