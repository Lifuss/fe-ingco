import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { CurrencyRates } from '@/lib/types';

const selectCurrencyRatesState = (state: RootState) => state.persistedMainReducer.currencyRates;

export const selectCurrency = createSelector([selectCurrencyRatesState], (rates): CurrencyRates => {
  return {
    USD: rates?.USD || 44.0,
    EUR: rates?.EUR || 52.0,
    lastUpdate: rates?.lastUpdate || '',
  };
});

export const selectUSDRate = (state: RootState): number => {
  return state.persistedMainReducer.currencyRates?.USD || 44.0;
};

export const selectEURRate = (state: RootState): number => {
  return state.persistedMainReducer.currencyRates?.EUR || 52.0;
};
