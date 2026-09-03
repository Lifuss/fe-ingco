import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { CurrencyRates } from '@/lib/types';
import { currencyApi } from '../api/currencyApi';

const selectCurrencyResult = currencyApi.endpoints.getCurrencyRates.select();

export const selectCurrency = createSelector(
  [(state: RootState) => selectCurrencyResult(state)],
  (result): CurrencyRates => ({
    USD: result?.data?.USD || 44.0,
    EUR: result?.data?.EUR || 52.0,
    lastUpdate: result?.data?.lastUpdate || '',
  }),
);

export const selectUSDRate = (state: RootState): number => {
  const result = selectCurrencyResult(state);
  return result?.data?.USD || 44.0;
};

export const selectEURRate = (state: RootState): number => {
  const result = selectCurrencyResult(state);
  return result?.data?.EUR || 52.0;
};
