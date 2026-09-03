import { baseApi } from './baseApi';
import { Order } from '@/lib/types';
import { normalizeOrder } from '@/lib/utils';
import { clearLocalStorageCart, setB2bCart, setRetailCart } from '../user/slice';
import {
  CreateOrderB2bPayload,
  CreateOrderRetailPayload,
  GetOrderHistoryParams,
  GetOrderHistoryResponse,
  OrderItemPayload,
} from './ordersApi.types';

export * from './ordersApi.types';

const extractOrderItems = (order: {
  items?: OrderItemPayload[];
  products?: OrderItemPayload[];
}): OrderItemPayload[] => {
  return (
    order.items ??
    (order.products
      ? order.products.map((p) => ({
          productId: p.productId,
          quantity: p.quantity,
        }))
      : [])
  );
};

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createOrder: build.mutation<Order, CreateOrderB2bPayload>({
      query: (order) => ({
        url: '/orders',
        method: 'POST',
        data: {
          items: extractOrderItems(order),
          shippingAddress: order.shippingAddress,
          comment: order.comment,
          usdRate: order.usdRate,
        },
      }),
      transformResponse: normalizeOrder,
      invalidatesTags: ['Cart', 'Order'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(setB2bCart([]));
        } catch {
          // Handled in component
        }
      },
    }),

    createRetailOrder: build.mutation<Order, CreateOrderRetailPayload>({
      query: (order) => ({
        url: '/orders/retail',
        method: 'POST',
        data: {
          items: extractOrderItems(order),
          shippingAddress: order.shippingAddress,
          comment: order.comment,
          firstName: order.firstName,
          lastName: order.lastName,
          surName: order.surName,
          phone: order.phone,
          email: order.email,
          turnstileToken: order.turnstileToken,
        },
      }),
      transformResponse: normalizeOrder,
      invalidatesTags: ['Cart', 'Order'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearLocalStorageCart());
          dispatch(setRetailCart([]));
        } catch {
          // Handled in component
        }
      },
    }),

    getOrderHistory: build.query<GetOrderHistoryResponse, GetOrderHistoryParams>({
      query: ({ page = 1, q = '', limit = 15, isRetail }) => ({
        url: '/orders',
        params: { page, q, limit, isRetail },
      }),
      transformResponse: (response: {
        orders?: unknown[];
        total?: number;
        totalPages?: number;
      }): GetOrderHistoryResponse => {
        const rawOrders = Array.isArray(response?.orders) ? response.orders : [];
        return {
          orders: rawOrders.map(normalizeOrder),
          total: response?.total ?? rawOrders.length,
          totalPages: response?.totalPages ?? 1,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.orders.map((o) => ({ type: 'Order' as const, id: o.id })),
              { type: 'Order' as const, id: 'LIST' },
            ]
          : [{ type: 'Order' as const, id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useCreateOrderMutation, useCreateRetailOrderMutation, useGetOrderHistoryQuery } =
  ordersApi;
