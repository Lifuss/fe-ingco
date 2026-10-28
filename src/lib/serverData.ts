import { cache } from 'react';
import axios from 'axios';
import { Product, Category } from './types';
import { normalizeProduct } from './utils';

const apiIngco = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API}/api`,
  timeout: 8000,
});

/**
 * Fetch a single product by its slug (Server-side with React cache)
 */
export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  if (!slug) return null;
  try {
    const { data } = await apiIngco.get(`/products/${slug}`);
    return normalizeProduct(data);
  } catch (error) {
    console.error(`Error fetching product by slug '${slug}':`, error);
    return null;
  }
});

/**
 * Fetch related products by category ID for cross-sell recommendations
 */
export const getRelatedProducts = cache(
  async (categoryId: string | number, limit = 5): Promise<Product[]> => {
    const catNum = Number(categoryId);
    if (!catNum || isNaN(catNum)) return [];
    try {
      const { data } = await apiIngco.get('/products', {
        params: {
          page: 1,
          limit,
          isRetail: true,
          category: catNum,
          sortValue: 'default',
        },
      });
      return Array.isArray(data?.products) ? data.products.map(normalizeProduct) : [];
    } catch (error) {
      console.error(`Error fetching related products for category '${categoryId}':`, error);
      return [];
    }
  },
);

/**
 * Fetch showcase products for the B2C landing page (HotOffers, SeriesComparison, etc.)
 */
export const getShowcaseProducts = cache(async (limit = 100): Promise<Product[]> => {
  try {
    const { data } = await apiIngco.get('/products', {
      params: {
        page: 1,
        limit,
        isRetail: true,
        sortValue: 'default',
      },
    });
    return Array.isArray(data?.products) ? data.products.map(normalizeProduct) : [];
  } catch (error) {
    console.error('Error fetching showcase products:', error);
    return [];
  }
});

/**
 * Fetch all categories for server components and navigation
 */
export const getServerCategories = cache(async (): Promise<Category[]> => {
  try {
    const { data } = await apiIngco.get('/categories');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching categories on server:', error);
    return [];
  }
});

export interface ServerProductsResponse {
  products: Product[];
  total: number;
  totalPages: number;
}

/**
 * Fetch a category by its slug (Server-side with React cache)
 */
export const getCategoryBySlug = cache(async (slug: string): Promise<Category | null> => {
  if (!slug) return null;
  try {
    const { data } = await apiIngco.get(`/categories/slug/${slug}`);
    return data || null;
  } catch (error) {
    console.error(`Error fetching category by slug '${slug}':`, error);
    return null;
  }
});

/**
 * Fetch initial retail products for a category page (SSR)
 */
export const getCategoryProducts = cache(
  async (categoryId: string | number, limit = 20): Promise<ServerProductsResponse> => {
    const catNum = Number(categoryId);
    if (!catNum || isNaN(catNum)) {
      return { products: [], total: 0, totalPages: 1 };
    }
    try {
      const { data } = await apiIngco.get('/products', {
        params: {
          page: 1,
          limit,
          isRetail: true,
          category: catNum,
          sortValue: 'default',
        },
      });
      return {
        products: Array.isArray(data?.products) ? data.products.map(normalizeProduct) : [],
        total: typeof data?.total === 'number' ? data.total : 0,
        totalPages: typeof data?.totalPages === 'number' ? data.totalPages : 1,
      };
    } catch (error) {
      console.error(`Error fetching category products for '${categoryId}':`, error);
      return { products: [], total: 0, totalPages: 1 };
    }
  },
);
