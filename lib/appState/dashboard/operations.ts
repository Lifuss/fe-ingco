import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiIngco } from '../user/operation';
import { Order, User } from '@/lib/types';

// products thunks
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

// ----------------- users thunks
export const fetchUsersThunk = createAsyncThunk(
  'fetchUsers',
  async (
    {
      query: q = '',
      role = 'user',
      isB2B,
      isUserVerified,
      page = 1,
      limit = 25,
    }: {
      query: string;
      role: 'user' | 'admin';
      isB2B?: boolean;
      isUserVerified?: boolean;
      page: number;
      limit: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiIngco.get('/users', {
        params: { q, role, isB2B, isUserVerified, page, limit },
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

export const updateUserThunk = createAsyncThunk(
  'updateUser',
  async (
    user: Omit<User, 'token' | 'createdAt' | 'updatedAt'>,
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiIngco.put(`/users/${user._id}`, user);

      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const deleteUserThunk = createAsyncThunk(
  'deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      await apiIngco.delete(`/users/${userId}`);
      return userId;
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

// --------------- orders thunks
export const fetchOrdersThunk = createAsyncThunk(
  'fetchOrders',
  async (
    {
      query: q = '',
      page = 1,
      limit = 15,
      isRetail = false,
      status = 'всі',
    }: {
      query: string;
      page?: number;
      limit?: number;
      isRetail: boolean;
      status?:
        | 'всі'
        | 'очікує підтвердження'
        | 'очікує оплати'
        | 'комплектується'
        | 'відправлено'
        | 'замовлення виконано'
        | 'замовлення скасовано';
    },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiIngco.get('/orders/all', {
        params: { q, page, limit, isRetail, status },
      });
      return data;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

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

export const updateRetailOrderThunk = createAsyncThunk(
  'updateOrder',
  async (
    { orderId, updateOrder }: { orderId: string; updateOrder: UpdateOrder },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiIngco.put(
        `/orders/retail/${orderId}`,
        updateOrder,
      );
      return data;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

export const fetchUsersStatsThunk = createAsyncThunk(
  'fetchUsersStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiIngco.get('/users/stats');
      return data;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);
