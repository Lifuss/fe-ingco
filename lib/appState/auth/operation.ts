import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

export type RegisterCredentials = {
  email: string;
  lastName: string;
  firstName: string;
  surName: string;
  phone: string;
  edrpou: string;
  about: string;
};

export type LoginCredentials = {
  login: string;
  password: string;
};

// TODO: Change this to actual online API
export const apiIngco = axios.create({
  baseURL: 'http://localhost:3030/api',
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
    } catch (error) {
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
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await apiIngco.post('/users/register', credentials);
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      setToken(response.data.token);
      return response.data;
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
