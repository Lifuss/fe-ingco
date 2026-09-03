import { baseApi } from './baseApi';
import { normalizeProduct } from '@/lib/utils';
import { CartItem, GetCartParams, AddToCartPayload, RemoveFromCartPayload } from './cartApi.types';

export * from './cartApi.types';

interface RawCartResponse {
  status?: string;
  cart?: Array<{
    id: number;
    userId: number;
    quantity: number;
    isRetail: boolean;
    productId: unknown;
  }>;
}

const getCartUrl = (isRetail?: boolean) => (isRetail ? '/users/cart/retail' : '/users/cart');
const getCartTag = (isRetail?: boolean) => [
  { type: 'Cart' as const, id: isRetail ? 'RETAIL' : 'B2B' },
];

const normalizeCartResponse = (res: unknown): CartItem[] => {
  const raw = res as RawCartResponse;
  const items = Array.isArray(raw?.cart) ? raw.cart : [];
  return items.map((item) => ({
    id: item.id,
    userId: item.userId,
    quantity: item.quantity,
    isRetail: item.isRetail,
    productId: normalizeProduct(item.productId),
  }));
};

export const cartApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCart: build.query<CartItem[], GetCartParams | void>({
      query: (params) => ({
        url: getCartUrl(params?.isRetail),
      }),
      transformResponse: normalizeCartResponse,
      providesTags: (_result, _error, arg) => getCartTag(arg?.isRetail),
    }),

    addToCart: build.mutation<CartItem[], AddToCartPayload>({
      query: ({ productId, quantity, isRetail }) => ({
        url: getCartUrl(isRetail),
        method: 'POST',
        data: { productId, quantity },
      }),
      transformResponse: normalizeCartResponse,
      invalidatesTags: (_result, _error, arg) => getCartTag(arg.isRetail),
    }),

    deleteFromCart: build.mutation<CartItem[], RemoveFromCartPayload>({
      query: ({ productId, quantity = 1, isRetail }) => ({
        url: getCartUrl(isRetail),
        method: 'DELETE',
        data: { productId, quantity },
      }),
      transformResponse: normalizeCartResponse,
      invalidatesTags: (_result, _error, arg) => getCartTag(arg.isRetail),
    }),
  }),
  overrideExisting: false,
});

export const { useGetCartQuery, useAddToCartMutation, useDeleteFromCartMutation } = cartApi;
