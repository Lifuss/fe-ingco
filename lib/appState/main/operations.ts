import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

export const fetchCurrencyRatesThunk = createAsyncThunk(
  'currencyRates/fetch',
  async (_, thunkApi) => {
    try {
      let newBody: { lastUpdate?: string; USD?: number; EUR?: number } = {};
      const state = thunkApi.getState() as RootState;

      if (
        Date.now() - new Date(state.currencyRates.lastUpdate).getTime() >
          1800000 ||
        !state.currencyRates.USD
      ) {
        newBody = {
          lastUpdate: new Date().toISOString(),
        };

        const { data } = await axios.get(
          'https://api.monobank.ua/bank/currency',
        );
        newBody.USD = data[0].rateBuy;
        newBody.EUR = data[1].rateBuy;

        if (!newBody.USD || !newBody.EUR) {
          throw new Error('Currency rates not found');
        }
        return newBody;
      } else {
        return state.currencyRates;
      }
    } catch (error) {
      thunkApi.rejectWithValue(error);
    }
  },
);
