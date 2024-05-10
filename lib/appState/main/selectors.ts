import { RootState } from '../store';

export const selectCurrency = (state: RootState) =>
  state.persistedMainReducer.currencyRates;
export const selectProducts = (state: RootState) =>
  state.persistedMainReducer.products;
