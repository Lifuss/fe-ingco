import { fetchCurrencyRatesThunk } from '@/lib/appState/main/operations';
import { selectCurrency } from '@/lib/appState/main/selectors';
import { useAppDispatch } from '@/lib/hooks';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const CurrencyRate = () => {
  const currency = useSelector(selectCurrency);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCurrencyRatesThunk());
  }, [dispatch]);

  return (
    <ul
      className="text-sm lg:flex lg:text-base"
      title="Курс по долара та євро по Монобанку (оновлюється кожні 30 хвилин)"
    >
      <li className="border-b-2 border-black pr-1 lg:border-b-0 lg:border-r-2">
        USD: {currency?.USD}
      </li>
      <li className="lg:pl-1">EUR: {currency?.EUR}</li>
    </ul>
  );
};

export default CurrencyRate;
