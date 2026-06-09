import { fetchCurrencyRatesThunk } from '@/lib/appState/main/operations';
import { selectCurrency } from '@/lib/appState/main/selectors';
import { useAppDispatch } from '@/lib/hooks';
import { useEffect } from 'react';
import { useAppSelector } from '@/lib/hooks';

const CurrencyRate = () => {
  const currency = useAppSelector(selectCurrency);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCurrencyRatesThunk());
  }, [dispatch]);

  return (
    <ul
      className="flex gap-2 text-sm text-neutral-500"
      title="Курс валют (USD, EUR); оновлюється кожні 30 хвилин, джерела: Monobank → PrivatBank → НБУ → Fixer"
    >
      <li>USD: {currency?.USD.toFixed(2)}</li>
      <li>EUR: {currency?.EUR.toFixed(2)}</li>
    </ul>
  );
};

export default CurrencyRate;
