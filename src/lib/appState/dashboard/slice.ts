import { Order, SupportTicket, User } from '@/lib/types';
import { createSlice } from '@reduxjs/toolkit';
import {
  createUserThunk,
  deleteUserThunk,
  fetchSupportTicketsThunk,
  fetchOrdersThunk,
  fetchUsersStatsThunk,
  fetchUsersThunk,
  updateOrderThunk,
  updateUserThunk,
  updateSupportTicketThunk,
  restoreUserThunk,
} from './operations';
import { toast } from 'react-toastify';
import { getProductClicksThunk, getUserActivityThunk } from './statsOperations';
type InitialStateType = {
  users: User[];
  orders: Order[];
  supportTickets: SupportTicket[];
  totalPages: number;
  page: number;
  usersStats: {
    total: number;
    b2b: number;
    b2c: number;
    notVerified: number;
  };
  orderStats: {
    'очікує підтвердження': number;
    'очікує оплати': number;
    комплектується: number;
    відправлено: number;
    'замовлення виконано': number;
    'замовлення скасовано': number;
  };
  stats: { productClicks: object[]; activityUsers: User[] };
};

const initialState: InitialStateType = {
  users: [],
  orders: [],
  supportTickets: [],
  totalPages: 0,
  page: 1,
  usersStats: {
    total: 0,
    b2b: 0,
    b2c: 0,
    notVerified: 0,
  },
  orderStats: {
    'очікує підтвердження': 0,
    'очікує оплати': 0,
    комплектується: 0,
    відправлено: 0,
    'замовлення виконано': 0,
    'замовлення скасовано': 0,
  },
  stats: {
    productClicks: [],
    activityUsers: [],
  },
};

const Slice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.fulfilled, (state, { payload }) => {
        state.users = payload.users;
        state.totalPages = payload.totalPages;
      })
      .addCase(fetchOrdersThunk.fulfilled, (state, { payload }) => {
        state.orders = payload.orders;
        state.totalPages = payload.totalPages;
        if (payload.stats) {
          state.orderStats = payload.stats;
        }
      })
      .addCase(fetchSupportTicketsThunk.fulfilled, (state, { payload }) => {
        state.supportTickets = payload.tickets;
        state.totalPages = payload.totalPages;
      })
      .addCase(createUserThunk.fulfilled, (state, { payload }) => {
        state.users.push(payload);
      })
      .addCase(updateOrderThunk.fulfilled, (state, { payload }) => {
        const index = state.orders.findIndex((order) => order.orderCode === payload.orderCode);
        if (index !== -1) {
          state.orders[index] = payload;
        }
        toast.success('Замовлення успішно змінено');
      })
      .addCase(updateUserThunk.fulfilled, (state, { payload }) => {
        const index = state.users.findIndex((user) => user.id === payload.id);
        if (index !== -1) {
          state.users[index] = payload;
        }
        toast.success('Користувач успішно змінений');
      })
      .addCase(deleteUserThunk.fulfilled, (state, { payload }) => {
        state.users = state.users.filter((user) => user.id !== payload);
        toast.success('Користувач успішно видалений');
      })
      .addCase(restoreUserThunk.fulfilled, () => {
        toast.success('Користувач успішно відновлений');
      })
      .addCase(fetchUsersStatsThunk.fulfilled, (state, { payload }) => {
        state.usersStats = payload;
      })
      .addCase(updateSupportTicketThunk.fulfilled, (state, { payload }) => {
        state.supportTickets = state.supportTickets.filter(
          (ticket) => ticket.ticketNumber !== payload,
        );
      });
    builder
      .addCase(getProductClicksThunk.fulfilled, (state, { payload }) => {
        state.stats.productClicks = payload.productClicks;
      })
      .addCase(getUserActivityThunk.fulfilled, (state, { payload }) => {
        state.stats.activityUsers = payload.users;
      });
  },
});

export const dashboardSlice = Slice.reducer;
