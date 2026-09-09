import { Product } from '@/lib/types';

export interface CartItem {
  id: number;
  userId: number;
  quantity: number;
  isRetail: boolean;
  productId: Product;
}

export interface GetCartParams {
  isRetail?: boolean;
}

export interface AddToCartPayload {
  productId: number;
  quantity: number;
  isRetail?: boolean;
}

export interface RemoveFromCartPayload {
  productId: number;
  quantity?: number;
  isRetail?: boolean;
}

export interface SyncCartItemPayload {
  productId: number;
  quantity: number;
}

export interface SyncCartPayload {
  items: SyncCartItemPayload[];
  isRetail?: boolean;
}
