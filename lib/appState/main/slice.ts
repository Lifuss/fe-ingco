import { createSlice } from '@reduxjs/toolkit';
import { fetchCurrencyRatesThunk } from './operations';

// Define the type for your payload
interface PayloadCurrencyRates {
  lastUpdate: string;
  USD: number;
  EUR: number;
  // ... your payload properties here
}

const initialState = {
  isAuth: false,
  user: {},
  token: null,
  loading: false,
  error: null,
  currencyRates: {
    USD: 0,
    EUR: 0,
    lastUpdate: new Date().toISOString(),
  },
};

const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCurrencyRatesThunk.fulfilled, (state, { payload }) => {
      state.currencyRates = payload as PayloadCurrencyRates;
    });
  },
});

export const mainSlice = appStateSlice.reducer;
