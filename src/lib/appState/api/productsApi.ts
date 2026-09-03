import { baseApi } from './baseApi';
import { Product } from '@/lib/types';
import { normalizeProduct } from '@/lib/utils';
import { GetProductsParams, GetProductsResponse, UpdateProductPayload } from './productsApi.types';

export * from './productsApi.types';

// ==========================================
// Query Helpers
// ==========================================

const formatCategoryParam = (category?: string | number): number | undefined => {
  if (category === undefined || category === null || category === '' || category === 'all') {
    return undefined;
  }
  const parsed = Number(category);
  return isNaN(parsed) ? undefined : parsed;
};

// ==========================================
// Products RTK Query Endpoints
// ==========================================

export const productsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<GetProductsResponse, GetProductsParams | void>({
      query: (params) => {
        const { query, q, category, ...rest } = params || {};
        return {
          url: '/products',
          params: {
            ...rest,
            q: q ?? (query ? query.trim() : undefined),
            category: formatCategoryParam(category),
          },
        };
      },
      transformResponse: (
        response: {
          products: unknown[];
          total: number;
          totalPages: number;
          page?: number;
          limit?: number;
          sort?: string;
        },
        _meta,
        arg,
      ): GetProductsResponse => {
        const rawProducts = Array.isArray(response?.products) ? response.products : [];
        return {
          products: rawProducts.map(normalizeProduct),
          total: response?.total ?? 0,
          totalPages: response?.totalPages ?? 1,
          page: response?.page ?? (arg && arg.page ? arg.page : 1),
          limit: response?.limit ?? (arg && arg.limit ? arg.limit : rawProducts.length),
          sort: response?.sort,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    getProductBySlug: build.query<Product, string>({
      query: (slug) => ({ url: `/products/${slug}` }),
      transformResponse: (res: unknown) => normalizeProduct(res),
      providesTags: (result) => (result ? [{ type: 'Product' as const, id: result.id }] : []),
    }),

    getProductById: build.query<Product, string | number>({
      query: (productId) => ({ url: `/products/id/${productId}` }),
      transformResponse: (res: unknown) => normalizeProduct(res),
      providesTags: (result) => (result ? [{ type: 'Product' as const, id: result.id }] : []),
    }),

    createProduct: build.mutation<Product, FormData>({
      query: (formData) => ({
        url: '/products',
        method: 'POST',
        data: formData,
      }),
      transformResponse: (res: unknown) => normalizeProduct(res),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    updateProduct: build.mutation<Product, UpdateProductPayload>({
      query: ({ formData, productId }) => ({
        url: `/products/${productId}`,
        method: 'PUT',
        data: formData,
      }),
      transformResponse: (res: unknown) => normalizeProduct(res),
      invalidatesTags: (result, _err, { productId }) => [
        { type: 'Product', id: result ? result.id : Number(productId) },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    deleteProduct: build.mutation<number, number>({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: 'DELETE',
      }),
      transformResponse: (_res, _meta, productId) => productId,
      invalidatesTags: (_res, _err, productId) => [
        { type: 'Product', id: productId },
        { type: 'Product', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
