import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuth: false,
  user: {},
  token: null,
  loading: false,
  error: null,
  currencyRates: {
    USD: 10,
    EUR: 20,
  },
};

const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    login(state, action) {
      state.isAuth = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout(state) {
      state.isAuth = false;
      state.user = {};
      state.token = null;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setCurrencyRate(state, action) {
      state.currencyRates = action.payload;
    },
  },
});

export const mainSlice = appStateSlice.reducer;
