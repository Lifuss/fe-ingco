import { Order, User } from '@/lib/types';
import { createSlice } from '@reduxjs/toolkit';
import { fetchOrdersThunk, fetchUsersThunk } from './operations';

const initialState: { users: User[]; orders: Order[]; totalPages: number, page: number } = {
  users: [],
  orders: [],
  totalPages: 0,
  page: 1,
};

const Slice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.fulfilled, (state, { payload }) => {
        state.users = payload;
      })
      .addCase(fetchOrdersThunk.fulfilled, (state, { payload }) => {
        state.orders = payload.orders;
        state.totalPages = payload.totalPages;
      });
  },
});

export const dashboardSlice = Slice.reducer;
