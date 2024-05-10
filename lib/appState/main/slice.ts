import { rawData } from './../../../app/shop/page';
import { createSlice } from '@reduxjs/toolkit';
import { fetchCurrencyRatesThunk, fetchMainTableDataThunk } from './operations';

// Define the type for your payload
interface PayloadCurrencyRates {
  lastUpdate: string;
  USD: number;
  EUR: number;
  // ... your payload properties here
}

const initialState = {
  currencyRates: {
    USD: 0,
    EUR: 0,
    lastUpdate: new Date().toISOString(),
  },
  products: [
    {
      article: '',
      name: '',
      image: '',
      price: '',
      priceRetailRecommendation: '',
      countInStock: 0,
      _id: '',
    },
  ],
};

const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCurrencyRatesThunk.fulfilled, (state, { payload }) => {
      state.currencyRates = payload as PayloadCurrencyRates;
    });
    // TODO: now is throwing an error
    // .addCase(fetchMainTableDataThunk.fulfilled, (state, { payload }) => {
    //   state.products = payload;
    // });
  },
});

export const mainSlice = appStateSlice.reducer;
