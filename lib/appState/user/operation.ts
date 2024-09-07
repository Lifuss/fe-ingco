import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

interface Register {
  email: string;
  lastName: string;
  firstName: string;
  surName: string;
  phone: string;
}

export interface RegisterB2BCredentials extends Register {
  edrpou: string;
  about: string;
}

export interface RegisterB2CCredentials extends Register {
  password: string;
}

export type LoginCredentials = {
  login: string;
  password: string;
};

export const apiIngco = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API}/api`,
});

const setToken = (token: string) => {
  apiIngco.defaults.headers.common.Authorization = `Bearer ${token}`;
};
const clearToken = () => {
  apiIngco.defaults.headers.common.Authorization = ``;
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await apiIngco.post('/users/login', credentials);

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      setToken(response.data.token);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorInfo = {
          message: error.message,
          name: error.name,
          code: error.code,
        };
        return rejectWithValue(errorInfo);
      }
      return rejectWithValue(error.message);
    }
  },
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterB2BCredentials, { rejectWithValue }) => {
    try {
      const response = await apiIngco.post('/users/register', credentials);
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      setToken(response.data.token);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorInfo = {
          message: error.message,
          name: error.name,
          code: error.code,
        };
        return rejectWithValue(errorInfo);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const registerClientThunk = createAsyncThunk(
  'auth/registerClient',
  async (credentials: RegisterB2CCredentials, { rejectWithValue }) => {
    try {
      const response = await apiIngco.post(
        '/users/register/client',
        credentials,
      );
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      setToken(response.data.token);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorInfo = {
          message: error.message,
          name: error.name,
          code: error.code,
        };
        return rejectWithValue(errorInfo);
      }

      return rejectWithValue(error.message);
    }
  },
);

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiIngco.delete('/users/logout');
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      clearToken();
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorInfo = {
          message: error.message,
          name: error.name,
          code: error.code,
        };
        return rejectWithValue(errorInfo);
      }

      return rejectWithValue(error.message);
    }
  },
);

export const refreshTokenThunk = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const savedToken = state.persistedAuthReducer.token;
    if (!savedToken) {
      return rejectWithValue('token was not found');
    }
    try {
      setToken(savedToken);
      const response = await apiIngco.get('/users/refresh');
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorInfo = {
          message: error.message,
          name: error.name,
          code: error.code,
        };
        return rejectWithValue(errorInfo);
      }

      return rejectWithValue(error.message);
    }
  },
);

export const addFavoriteProductThunk = createAsyncThunk(
  'auth/addFavoriteProduct',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await apiIngco.post(`/users/favorites/${productId}`);
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorInfo = {
          message: error.message,
          name: error.name,
          code: error.code,
        };
        return rejectWithValue(errorInfo);
      }

      return rejectWithValue(error.message);
    }
  },
);

export const deleteFavoriteProductThunk = createAsyncThunk(
  'auth/deleteFavoriteProduct',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await apiIngco.delete(`/users/favorites/${productId}`);
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorInfo = {
          message: error.message,
          name: error.name,
          code: error.code,
        };
        return rejectWithValue(errorInfo);
      }

      return rejectWithValue(error.message);
    }
  },
);

export const getUserCartThunk = createAsyncThunk(
  'cart/get',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiIngco.get('users/cart');
      return data.cart;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

export const getUserRetailCartThunk = createAsyncThunk(
  'cart/getRetail',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiIngco.get('users/cart/retail');
      return data.cart;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

export const addProductToCartThunk = createAsyncThunk(
  'cart/add',
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiIngco.post('users/cart', {
        productId,
        quantity,
      });
      return data.cart;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

export const addProductToRetailCartThunk = createAsyncThunk(
  'cart/addRetail',
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiIngco.post('users/cart/retail', {
        productId,
        quantity,
      });
      return data.cart;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const deleteProductFromCartThunk = createAsyncThunk(
  'cart/delete',
  async (
    { productId, quantity = 1 }: { productId: string; quantity: number },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiIngco.delete(`users/cart`, {
        data: { productId, quantity },
      });
      return data.cart;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

export const deleteProductFromRetailCartThunk = createAsyncThunk(
  'cart/deleteRetail',
  async (
    { productId, quantity = 1 }: { productId: string; quantity: number },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiIngco.delete(`users/cart/retail`, {
        data: { productId, quantity },
      });
      return data.cart;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

export const createOrderThunk = createAsyncThunk(
  'order/create',
  async (
    order: {
      products: {
        productId: string;
        quantity: number;
        price: number;
        totalPriceByOneProduct: number;
      }[];
      shippingAddress: string;
      totalPrice: number;
      comment: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiIngco.post('orders', order);
      return data;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

export const createRetailOrderThunk = createAsyncThunk(
  'order/createRetail',
  async (
    order: {
      products: {
        productId: string;
        quantity: number;
        price: number;
        totalPriceByOneProduct: number;
      }[];
      shippingAddress: string;
      totalPrice: number;
      comment: string;
      firstName: string;
      lastName: string;
      surName: string;
      phone: string;
      email: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiIngco.post('orders/retail', order);
      return data;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

export const forgotPasswordThunk = createAsyncThunk(
  'user/forgot',
  async ({ resetData }: { resetData: string }, { rejectWithValue }) => {
    try {
      await apiIngco.post('users/forgot', { resetData });
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

export const resetPasswordThunk = createAsyncThunk(
  'user/resetPassword',
  async (
    { resetToken, newPassword }: { resetToken: string; newPassword: string },
    { rejectWithValue },
  ) => {
    try {
      await apiIngco.post('users/resetPassword', { resetToken, newPassword });
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
