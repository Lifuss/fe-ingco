import { createSlice } from '@reduxjs/toolkit';
import { fetchHistoryThunk } from './operations';
import { Order } from '@/lib/types';

type initialStateType = {
  shopView: 'table' | 'list';
  page: number;
  limit: number;
  totalPages: number;
  history: Order[];
};

const initialState: initialStateType = {
  shopView: 'table',
  page: 1,
  limit: 10,
  totalPages: 0,
  history: [],
};

const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setShopView: (state, { payload }) => {
      state.shopView = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchHistoryThunk.fulfilled, (state, { payload }) => {
      state.history = payload.orders;
      state.page = payload.page;
      state.totalPages = payload.totalPages;
    });
  },
});

export const { setShopView } = appStateSlice.actions;
export const mainSlice = appStateSlice.reducer;
