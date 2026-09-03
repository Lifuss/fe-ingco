import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface CurrencyRatesResponse {
  USD: number;
  EUR: number;
}

interface CurrencyRates {
  lastUpdate: string;
  USD: number;
  EUR: number;
}

const FALLBACK_RATES: CurrencyRates = {
  lastUpdate: new Date().toISOString(),
  USD: 44.0,
  EUR: 52.0,
};

export const currencyApi = createApi({
  reducerPath: 'currencyApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }), // Same-origin for Next.js API routes
  tagTypes: ['Currency'],
  endpoints: (build) => ({
    getCurrencyRates: build.query<CurrencyRates, void>({
      query: () => ({
        url: 'api/currency',
        headers: { 'Cache-Control': 'no-cache' },
        timeout: 8000,
      }),
      transformResponse: (response: CurrencyRatesResponse) => {
        // Validation — preserving logic from current fetchCurrencyRatesThunk
        if (!response?.USD || !response?.EUR) {
          return FALLBACK_RATES;
        }

        const USD = parseFloat(Number(response.USD).toFixed(2));
        const EUR = parseFloat(Number(response.EUR).toFixed(2));

        if (!USD || !EUR || isNaN(USD) || isNaN(EUR)) {
          return FALLBACK_RATES;
        }

        return {
          lastUpdate: new Date().toISOString(),
          USD,
          EUR,
        };
      },
      transformErrorResponse: (response) => {
        // 404 fallback — preserving behavior from current thunk (dev route recompile)
        if (response.status === 404) {
          return FALLBACK_RATES;
        }
        return response;
      },
      keepUnusedDataFor: 1800, // 30 minutes auto-cache (replaces manual condition check)
      providesTags: ['Currency'],
    }),
  }),
});

export const { useGetCurrencyRatesQuery } = currencyApi;
