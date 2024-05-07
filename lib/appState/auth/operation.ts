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

      const { data } = await apiIngco.post('/users/login', credentials);
      console.log(data);

      return data;
    } catch (error) {
      thunkApi.rejectWithValue(error);
    }
  },
);
