import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

export const fetchCurrencyRatesThunk = createAsyncThunk(
  'currencyRates/fetch',
  async (_, thunkApi) => {
    try {
      let newBody: { lastUpdate?: string; USD?: number; EUR?: number } = {};
      const { persistedMainReducer: state } = thunkApi.getState() as RootState;

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
        newBody.USD = parseFloat(data[0].rateSell.toFixed(1));
        newBody.EUR = parseFloat(data[1].rateSell.toFixed(1));

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

export const fetchMainTableDataThunk = createAsyncThunk(
  'mainTable/fetch',
  async (_, thunkApi) => {
    try {
      const { data } = await axios.get('http://localhost:3030/api/products');
      console.log('data fetched >', data, '\n', 'time >', Date.now());
      return data;
    } catch (error) {
      thunkApi.rejectWithValue(error);
    }
  },
);
