import { Order } from '@/lib/types';

export interface OrderItemPayload {
  productId: number;
  quantity: number;
}

export interface CreateOrderB2bPayload {
  products?: OrderItemPayload[];
  items?: OrderItemPayload[];
  shippingAddress?: string;
  comment?: string;
  usdRate?: number;
  totalPrice?: number;
}

export interface CreateOrderRetailPayload {
  products?: OrderItemPayload[];
  items?: OrderItemPayload[];
  shippingAddress?: string;
  comment?: string;
  email: string;
  firstName: string;
  lastName: string;
  surName: string;
  phone: string;
  turnstileToken?: string;
  totalPrice?: number;
}

export interface GetOrderHistoryParams {
  page?: number;
  q?: string;
  limit?: number;
  isRetail: boolean;
}

export interface GetOrderHistoryResponse {
  orders: Order[];
  total: number;
  totalPages: number;
}
