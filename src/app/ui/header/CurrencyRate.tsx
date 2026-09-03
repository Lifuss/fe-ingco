import { useGetCurrencyRatesQuery } from '@/lib/appState/api/currencyApi';

const CurrencyRate = () => {
  const { data: currencyData } = useGetCurrencyRatesQuery();
  const currency = {
    USD: currencyData?.USD || 44.0,
    EUR: currencyData?.EUR || 52.0,
    lastUpdate: currencyData?.lastUpdate || '',
  };

  return (
    <ul
      className="flex gap-2.5 text-xs font-medium text-neutral-600 md:text-sm"
      title="Курс валют (USD, EUR); оновлюється кожні 30 хвилин, джерела: Monobank → PrivatBank → НБУ → Fixer"
    >
      <li>USD: {currency.USD.toFixed(2)}</li>
      <li>EUR: {currency.EUR.toFixed(2)}</li>
    </ul>
  );
};

export default CurrencyRate;
