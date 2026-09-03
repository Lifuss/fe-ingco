import { baseApi } from './baseApi';
import { apiIngco } from '../user/operation';
import { Category } from '@/lib/types';
import { toast } from 'react-toastify';

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query<Category[], string | void>({
      query: (q) => ({ url: '/categories', params: q ? { q } : undefined }),
      // Normalize cache key: both '' and undefined map to the same entry
      serializeQueryArgs: ({ queryArgs }) => `categories-${queryArgs || ''}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Category' as const, id })),
              { type: 'Category', id: 'LIST' },
            ]
          : [{ type: 'Category', id: 'LIST' }],
    }),

    createCategory: build.mutation<
      Category,
      {
        name: string;
        renderSort?: number;
        parentId?: number | null;
        showInMenu?: boolean;
        slug?: string;
        seoKeywords?: string;
        attributeIds?: number[];
      }
    >({
      query: ({ attributeIds: _ids, ...body }) => ({
        url: '/categories',
        method: 'POST',
        data: body,
      }),
      // No invalidatesTags here — manual invalidation after attributeIds assignment
      async onQueryStarted({ attributeIds }, { dispatch, queryFulfilled }) {
        try {
          const { data: newCategory } = await queryFulfilled;
          if (attributeIds && attributeIds.length > 0) {
            await apiIngco.post(`/categories/${newCategory.id}/attributes`, {
              attributeIds,
            });
          }
          // Invalidate only after all requests (category + attributes) have completed
          dispatch(baseApi.util.invalidateTags([{ type: 'Category', id: 'LIST' }]));
        } catch {
          // Still invalidate on error to keep cache consistent with server state
          dispatch(baseApi.util.invalidateTags([{ type: 'Category', id: 'LIST' }]));
          toast.error('Помилка при створенні категорії');
        }
      },
    }),

    updateCategory: build.mutation<
      Category,
      {
        id: number;
        name?: string;
        renderSort?: number;
        parentId?: number | null;
        showInMenu?: boolean;
        slug?: string;
        seoKeywords?: string;
        attributeIds?: number[];
      }
    >({
      query: ({ id, attributeIds: _ids, ...data }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        data,
      }),
      // No invalidatesTags here — manual invalidation after attributeIds assignment
      async onQueryStarted({ id, attributeIds }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          if (attributeIds !== undefined) {
            await apiIngco.post(`/categories/${id}/attributes`, {
              attributeIds,
            });
          }
          // Invalidate only after all requests (category + attributes) have completed
          dispatch(
            baseApi.util.invalidateTags([
              { type: 'Category', id },
              { type: 'Category', id: 'LIST' },
            ]),
          );
        } catch {
          dispatch(
            baseApi.util.invalidateTags([
              { type: 'Category', id },
              { type: 'Category', id: 'LIST' },
            ]),
          );
          toast.error('Помилка при оновленні категорії');
        }
      },
    }),

    reorderCategories: build.mutation<
      Category[],
      { id: number; parentId: number | null; targetIndex: number }
    >({
      query: (data) => ({ url: '/categories/reorder', method: 'POST', data }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),

    deleteCategory: build.mutation<void, number>({
      query: (categoryId) => ({
        url: `/categories/${categoryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, categoryId) => [
        { type: 'Category', id: categoryId },
        { type: 'Category', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useReorderCategoriesMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
