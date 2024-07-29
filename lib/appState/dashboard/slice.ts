import { Order, User } from '@/lib/types';
import { createSlice } from '@reduxjs/toolkit';
import {
  createUserThunk,
  deleteUserThunk,
  fetchOrdersThunk,
  fetchUsersStatsThunk,
  fetchUsersThunk,
  updateOrderThunk,
  updateUserThunk,
} from './operations';
import { toast } from 'react-toastify';

const initialState: {
  users: User[];
  orders: Order[];
  totalPages: number;
  page: number;
  usersStats: {
    notVerified: number;
  };
} = {
  users: [],
  orders: [],
  totalPages: 0,
  page: 1,
  usersStats: {
    notVerified: 0,
  },
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
      })
      .addCase(createUserThunk.fulfilled, (state, { payload }) => {
        state.users.push(payload);
      })
      .addCase(updateOrderThunk.fulfilled, (state, { payload }) => {
        const index = state.orders.findIndex(
          (order) => order.orderCode === payload.orderCode,
        );
        state.orders[index] = payload;
        toast.success('Замовлення успішно змінено');
      })
      .addCase(updateUserThunk.fulfilled, (state, { payload }) => {
        const index = state.users.findIndex((user) => user._id === payload._id);
        state.users[index] = payload;
        toast.success('Користувач успішно змінений');
      })
      .addCase(deleteUserThunk.fulfilled, (state, { payload }) => {
        state.users = state.users.filter((user) => user._id !== payload);
        toast.success('Користувач успішно видалений');
      })
      .addCase(fetchUsersStatsThunk.fulfilled, (state, { payload }) => {
        state.usersStats = payload;
      });
  },
});

export const dashboardSlice = Slice.reducer;
