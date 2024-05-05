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
      className="lg-items-center text-sm lg:flex lg:gap-3 lg:text-lg lg:tracking-tight 2xl:gap-5 2xl:text-xl"
      title="Курс валют (USD, EUR) згідно курсу закупівлі в Монобанку, оновлення кожні 30хв."
    >
      <li className="relative">
        USD: {currency?.USD}
        <div className="absolute bottom-0 h-[2px] w-full bg-black max-sm:left-0 lg:right-[-8px] lg:top-0 lg:h-[1rem] lg:w-[2px] lg:translate-y-[22%]  2xl:right-[-12px]  2xl:translate-y-[36%]"></div>
      </li>
      <li>EUR: {currency?.EUR}</li>
    </ul>
  );
};

export default CurrencyRate;
