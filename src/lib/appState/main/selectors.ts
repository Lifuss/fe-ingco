import { RootState } from '../store';
import { CurrencyRates } from '@/lib/types';

export const selectCurrency = (state: RootState): CurrencyRates => {
  const rates = state.persistedMainReducer.currencyRates;

  // Ensure we always return valid currency rates
  return {
    USD: rates?.USD || 41.0,
    EUR: rates?.EUR || 44.0,
    lastUpdate: rates?.lastUpdate || new Date().toISOString(),
  };
};

export const selectUSDRate = (state: RootState): number => {
  return state.persistedMainReducer.currencyRates?.USD || 41.0;
};

export const selectEURRate = (state: RootState): number => {
  return state.persistedMainReducer.currencyRates?.EUR || 44.0;
};
