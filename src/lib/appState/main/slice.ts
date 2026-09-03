import { createSlice } from '@reduxjs/toolkit';

type initialStateType = {
  shopView: 'table' | 'list';
};

const initialState: initialStateType = {
  shopView: 'table',
};

const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setShopView: (state, { payload }) => {
      state.shopView = payload;
    },
  },
});

export const { setShopView } = appStateSlice.actions;
export const mainSlice = appStateSlice.reducer;
