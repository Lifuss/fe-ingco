import { Order } from '@/lib/types';

export interface OrderItemPayload {
  productId: number;
  quantity: number;
}

export interface CreateOrderB2bPayload {
  items: OrderItemPayload[];
  shippingAddress: string;
  comment?: string;
  usdRate?: number;
  paymentMethod?: 'CASH' | 'CARD' | 'ENTERPRISE';
}

export interface CreateOrderRetailPayload {
  items: OrderItemPayload[];
  shippingAddress: string;
  comment?: string;
  email: string;
  firstName: string;
  lastName: string;
  surName?: string;
  phone: string;
  turnstileToken: string;
  paymentMethod?: 'CASH' | 'CARD' | 'ENTERPRISE';
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
