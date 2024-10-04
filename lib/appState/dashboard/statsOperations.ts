import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiIngco } from '../user/operation';

export const getProductClicksThunk = createAsyncThunk(
  'stats/productClicks',
  async (
    {
      page = 1,
      limit = 10,
      startDate,
      endDate,
    }: { page: number; limit: number; startDate?: Date; endDate?: Date },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiIngco.get('/stats/products/clicks', {
        params: { page, limit, startDate, endDate },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getUserActivityThunk = createAsyncThunk(
  'stats/userActivity',
  async (
    {
      page = 1,
      limit = 100,
      startDate,
      endDate,
    }: {
      page: number;
      limit: number;
      startDate?: Date;
      endDate?: Date;
    },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiIngco.get('/stats/users/activity', {
        params: {
          page,
          limit,
          startDate,
          endDate,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
