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
import { CheckboxActionType } from '@/app/dashboard/tables/UserTable';

type AllowedCheckboxActions = Exclude<
  CheckboxActionType,
  CheckboxActionType.Admin
>;
type InitialStateType = {
  users: User[];
  orders: Order[];
  supportTickets: SupportTicket[];
  totalPages: number;
  page: number;
  usersStats: {
    notVerified: number;
  };
  stats: { productClicks: {}[]; activityUsers: User[] };
  userTableCheckboxesStatus: Record<AllowedCheckboxActions, boolean>;
};

const initialState: InitialStateType = {
  users: [],
  orders: [],
  supportTickets: [],
  totalPages: 0,
  page: 1,
  usersStats: {
    notVerified: 0,
  },
  stats: {
    productClicks: [],
    activityUsers: [],
  },
  userTableCheckboxesStatus: {
    [CheckboxActionType.IsUserVerified]: true,
    [CheckboxActionType.IsB2B]: true,
    [CheckboxActionType.isDeleted]: false,
  },
};

const Slice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setCheckbox: (state, { payload }: { payload: AllowedCheckboxActions }) => {
      state.userTableCheckboxesStatus[payload] =
        !state.userTableCheckboxesStatus[payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.fulfilled, (state, { payload }) => {
        state.users = payload.users;
        state.totalPages = payload.totalPages;
      })
      .addCase(fetchOrdersThunk.fulfilled, (state, { payload }) => {
        state.orders = payload.orders;
        state.totalPages = payload.totalPages;
      })
      .addCase(fetchSupportTicketsThunk.fulfilled, (state, { payload }) => {
        state.supportTickets = payload.tickets;
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
      .addCase(restoreUserThunk.fulfilled, () => {
        toast.success('Користувач успішно відновлений');
      })
      .addCase(fetchUsersStatsThunk.fulfilled, (state, { payload }) => {
        state.usersStats = payload;
      })
      .addCase(updateSupportTicketThunk.fulfilled, (state, { payload }) => {
        state.supportTickets.filter(
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

export const { setCheckbox } = Slice.actions;
export const dashboardSlice = Slice.reducer;
