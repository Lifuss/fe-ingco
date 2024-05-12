import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import https from 'https';

// TODO: Change this to actual online API
export const apiIngco = axios.create({
  baseURL: 'http://localhost:3030/api',
});

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: { login: string; password: string }, thunkApi) => {
    try {
      console.log(credentials);

      const response = await apiIngco.post('/users/login', credentials);

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      console.log('data >', response.data, 'time >', Date.now());

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorInfo = {
          message: error.message,
          name: error.name,
          code: error.code,
        };
        return thunkApi.rejectWithValue(errorInfo); 
      }

      return thunkApi.rejectWithValue(error.message);
    }
  },
);
