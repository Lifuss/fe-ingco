import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { AppStore, RootState } from '../store';
import { normalizeOrder } from '@/lib/utils';
import { toast } from 'react-toastify';

interface Register {
  email: string;
  lastName: string;
  firstName: string;
  surName: string;
  phone: string;
}

export interface RegisterB2BCredentials extends Register {
  edrpou: string;
  about?: string;
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

export const serializeAxiosError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || error.message,
      name: error.name,
      code: error.code,
      status: error.response?.status,
    };
  }
  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
    };
  }
  return String(error);
};

let cachedToken: string | null = null;

apiIngco.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      let authHeader: unknown = undefined;
      if (config.headers) {
        if (typeof config.headers.get === 'function') {
          authHeader = config.headers.get('Authorization') || config.headers.get('authorization');
        } else {
          authHeader = config.headers['Authorization'] || config.headers['authorization'];
        }
      }
      const hasAuth = !!authHeader;

      if (!hasAuth) {
        const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
        let token = match ? decodeURIComponent(match[1]) : null;

        if (!token) {
          if (cachedToken) {
            token = cachedToken;
          } else {
            try {
              const savedUserString = localStorage.getItem('persist:auth');
              if (savedUserString) {
                const savedUser = JSON.parse(savedUserString);
                if (savedUser?.token) {
                  try {
                    token = JSON.parse(savedUser.token);
                  } catch {
                    token = savedUser.token; // Fallback if token is already a plain string
                  }
                  cachedToken = token;
                }
              }
            } catch (e) {
              console.error('Interceptor failed to read persist:auth:', e);
            }
          }
        }

        if (token) {
          if (config.headers) {
            if (typeof config.headers.set === 'function') {
              config.headers.set('Authorization', `Bearer ${token}`);
            } else {
              config.headers['Authorization'] = `Bearer ${token}`;
            }
          }
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const COOKIE_FLAGS = `path=/; max-age=604800; SameSite=Lax${isLocalhost ? '' : '; Secure'}`;

const setToken = (token: string, role?: string) => {
  cachedToken = token;
  apiIngco.defaults.headers.common.Authorization = `Bearer ${token}`;
  if (typeof window !== 'undefined') {
    document.cookie = `token=${token}; ${COOKIE_FLAGS}`;
    if (role) {
      document.cookie = `role=${role.toLowerCase()}; ${COOKIE_FLAGS}`;
    }
  }
};
const clearToken = () => {
  cachedToken = null;
  apiIngco.defaults.headers.common.Authorization = ``;
  if (typeof window !== 'undefined') {
    const clearFlags = `path=/; max-age=0; SameSite=Lax${isLocalhost ? '' : '; Secure'}`;
    document.cookie = `token=; ${clearFlags}`;
    document.cookie = `role=; ${clearFlags}`;
  }
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await apiIngco.post('/users/login', credentials);

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      setToken(response.data.token, response.data.role);
      return response.data;
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
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

      return response.data;
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

export const registerClientThunk = createAsyncThunk(
  'auth/registerClient',
  async (credentials: RegisterB2CCredentials, { rejectWithValue }) => {
    try {
      const response = await apiIngco.post('/users/register/client', credentials);
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

export const logoutThunk = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const response = await apiIngco.delete('/users/logout');
    clearToken();
    return response.data;
  } catch (error) {
    clearToken();
    return rejectWithValue(serializeAxiosError(error));
  }
});

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

      setToken(response.data.token, response.data.role);
      return response.data;
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

export const addFavoriteProductThunk = createAsyncThunk(
  'auth/addFavoriteProduct',
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await apiIngco.post(`/users/favorites/${productId}`);
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

export const deleteFavoriteProductThunk = createAsyncThunk(
  'auth/deleteFavoriteProduct',
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await apiIngco.delete(`/users/favorites/${productId}`);
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

export const getUserCartThunk = createAsyncThunk(
  'cart/get',
  async (arg: { isRetail?: boolean } | undefined, { rejectWithValue }) => {
    try {
      const isRetail = arg?.isRetail ?? false;
      const { data } = await apiIngco.get(isRetail ? 'users/cart/retail' : 'users/cart');
      return data.cart;
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

export const addProductToCartThunk = createAsyncThunk(
  'cart/add',
  async (
    {
      productId,
      quantity,
      isRetail = false,
    }: { productId: number; quantity: number; isRetail?: boolean },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiIngco.post(isRetail ? 'users/cart/retail' : 'users/cart', {
        productId,
        quantity,
      });
      return data.cart;
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

export const deleteProductFromCartThunk = createAsyncThunk(
  'cart/delete',
  async (
    {
      productId,
      quantity = 1,
      isRetail = false,
    }: { productId: number; quantity?: number; isRetail?: boolean },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiIngco.delete(isRetail ? 'users/cart/retail' : 'users/cart', {
        data: { productId, quantity },
      });
      return data.cart;
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

export const createOrderThunk = createAsyncThunk(
  'order/create',
  async (
    order: {
      products: {
        productId: number;
        quantity: number;
        price: number;
        totalPriceByOneProduct: number;
      }[];
      shippingAddress: string;
      totalPrice: number;
      comment: string;
      usdRate?: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const payload = {
        items: order.products.map((p) => ({
          productId: p.productId,
          quantity: p.quantity,
        })),
        shippingAddress: order.shippingAddress,
        comment: order.comment,
        usdRate: order.usdRate,
      };
      const { data } = await apiIngco.post('orders', payload);
      return normalizeOrder(data);
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

export const createRetailOrderThunk = createAsyncThunk(
  'order/createRetail',
  async (
    order: {
      products: {
        productId: number;
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
      const payload = {
        items: order.products.map((p) => ({
          productId: p.productId,
          quantity: p.quantity,
        })),
        shippingAddress: order.shippingAddress,
        comment: order.comment,
        firstName: order.firstName,
        lastName: order.lastName,
        surName: order.surName,
        phone: order.phone,
        email: order.email,
      };
      const { data } = await apiIngco.post('orders/retail', payload);
      return normalizeOrder(data);
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

export const forgotPasswordThunk = createAsyncThunk(
  'user/forgot',
  async ({ resetData }: { resetData: string }, { rejectWithValue }) => {
    try {
      await apiIngco.post('users/forgot', { resetData });
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
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
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

let storeInstance: AppStore | null = null;

export const injectStore = (store: AppStore) => {
  storeInstance = store;
};

apiIngco.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (
        originalRequest.url?.includes('/users/refresh') ||
        originalRequest.url?.includes('/users/logout')
      ) {
        return Promise.reject(error);
      }

      if (storeInstance) {
        try {
          await storeInstance.dispatch(refreshTokenThunk()).unwrap();

          const state = storeInstance.getState();
          const newToken = state.persistedAuthReducer.token;
          if (newToken) {
            if (originalRequest.headers) {
              if (typeof originalRequest.headers.set === 'function') {
                originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
              } else {
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              }
            }
            return apiIngco(originalRequest);
          }
        } catch (refreshError) {
          storeInstance.dispatch(logoutThunk());

          if (typeof window !== 'undefined') {
            toast.error('Сесія завершилася. Будь ласка, увійдіть знову.');
            window.location.href = '/auth/login';
          }
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  },
);
