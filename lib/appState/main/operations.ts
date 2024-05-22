import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { apiIngco } from '../user/operation';

export const fetchCurrencyRatesThunk = createAsyncThunk(
  'currencyRates/fetch',
  async (_, { rejectWithValue, getState }) => {
    try {
      let newBody: { lastUpdate?: string; USD?: number; EUR?: number } = {};
      const { persistedMainReducer: state } = getState() as RootState;

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
      rejectWithValue(error);
    }
  },
);

export const fetchMainTableDataThunk = createAsyncThunk(
  'mainTable/fetch',
  async (
    {
      page,
      query,
      category,
      limit = 10,
    }: { query: string; page: number; category?: string; limit?: number },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiIngco.get('/products', {
        params: { page, q: query, limit, category },
      });
      return data;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

export const fetchCategoriesThunk = createAsyncThunk(
  'categories/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiIngco.get('/categories');
      return data;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);
