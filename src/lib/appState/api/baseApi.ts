import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { AxiosRequestConfig, AxiosError } from 'axios';
import { apiIngco, serializeAxiosError } from '../user/operation';

export const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestConfig['headers'];
      responseType?: AxiosRequestConfig['responseType'];
    },
    unknown,
    unknown
  > =>
  async ({ url, method = 'GET', data, params, headers, responseType }, { signal }) => {
    try {
      const result = await apiIngco({
        url,
        method,
        data,
        params,
        headers,
        responseType,
        signal,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: serializeAxiosError(err),
      };
    }
  };

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    'Product',
    'Category',
    'Order',
    'User',
    'SupportTicket',
    'Cart',
    'Favorite',
    'Currency',
    'GmcStatus',
    'DashboardStats',
  ],
  endpoints: () => ({}), // Endpoints injected via code-splitting in separate files
});
