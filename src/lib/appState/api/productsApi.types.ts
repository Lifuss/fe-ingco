import { Product } from '@/lib/types';
import { sortValueType } from '@/app/ui/catalog/FiltersBlock';

export interface GetProductsParams {
  page?: number;
  query?: string;
  q?: string;
  category?: string | number;
  limit?: number;
  sortValue?: sortValueType | string;
  isRetail?: boolean;
  filters?: string;
}

export interface GetProductsResponse {
  products: Product[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  sort?: string;
}

export interface UpdateProductPayload {
  productId: string | number;
  formData: FormData;
}

export interface QuickUpdateProductFields {
  name?: string;
  priceRetailRecommendation?: number;
  rrcSale?: number;
  countInStock?: number;
}

export interface QuickUpdateProductPayload {
  id: number;
  data: QuickUpdateProductFields;
}

export interface BatchQuickUpdateItem {
  id: number;
  data: QuickUpdateProductFields;
}

export interface BatchQuickUpdatePayload {
  items: BatchQuickUpdateItem[];
}

export interface BatchQuickUpdateResponse {
  success: boolean;
  updatedCount: number;
  items: Product[];
}
