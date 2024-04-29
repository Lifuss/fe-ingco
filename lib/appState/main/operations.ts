import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Currency } from '../../definitions';

export const fetchCurrencyRatesThunk = createAsyncThunk(
  'appState/fetchCurrencyRates',
  async (_, thunkApi) => {
    try {
      const { data } = await axios.get('https://api.monobank.ua/bank/currency');
      return data.filter(
        (rate: Currency) =>
          rate.currencyCodeA === 840 || rate.currencyCodeA === 978,
      );
    } catch (error) {
      thunkApi.rejectWithValue(error);
    }
  },
);
