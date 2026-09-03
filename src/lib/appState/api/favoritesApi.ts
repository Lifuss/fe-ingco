import { baseApi } from './baseApi';
import { Product } from '@/lib/types';
import { normalizeProduct } from '@/lib/utils';
import { setFavorites } from '../user/slice';

export * from './favoritesApi.types';

const normalizeFavoritesResponse = (res: unknown): Product[] => {
  const list = Array.isArray(res) ? res : [];
  return list.map(normalizeProduct);
};

const syncFavoritesWithStore = async (
  _productId: number,
  {
    dispatch,
    queryFulfilled,
  }: {
    dispatch: (action: ReturnType<typeof setFavorites>) => void;
    queryFulfilled: Promise<{ data: Product[] }>;
  },
) => {
  try {
    const { data } = await queryFulfilled;
    dispatch(setFavorites(data));
  } catch {
    // Handled in component
  }
};

export const favoritesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addFavorite: build.mutation<Product[], number>({
      query: (productId) => ({
        url: `/users/favorites/${productId}`,
        method: 'POST',
      }),
      transformResponse: normalizeFavoritesResponse,
      invalidatesTags: ['Favorite'],
      onQueryStarted: syncFavoritesWithStore,
    }),

    deleteFavorite: build.mutation<Product[], number>({
      query: (productId) => ({
        url: `/users/favorites/${productId}`,
        method: 'DELETE',
      }),
      transformResponse: normalizeFavoritesResponse,
      invalidatesTags: ['Favorite'],
      onQueryStarted: syncFavoritesWithStore,
    }),
  }),
  overrideExisting: false,
});

export const { useAddFavoriteMutation, useDeleteFavoriteMutation } = favoritesApi;
