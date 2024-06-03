import { Order, User } from '@/lib/types';
import { createSlice } from '@reduxjs/toolkit';
import {
  createUserThunk,
  fetchOrdersThunk,
  fetchUsersThunk,
  updateOrderThunk,
} from './operations';
import { toast } from 'react-toastify';

const initialState: {
  users: User[];
  orders: Order[];
  totalPages: number;
  page: number;
} = {
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
      });
  },
});

export const dashboardSlice = Slice.reducer;
