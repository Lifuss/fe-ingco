import { Order, SupportTicket, User } from '@/lib/types';

export interface GmcStatusType {
  configured: boolean;
  merchantId: string | null;
  serviceAccountEmail: string | null;
  lastSyncAt: string | null;
  totalSynced: number;
  lastError: string | null;
  apiVersion?: string;
}

export interface OrderStats {
  'очікує підтвердження': number;
  'очікує оплати': number;
  комплектується: number;
  відправлено: number;
  'замовлення виконано': number;
  'замовлення скасовано': number;
}

export interface UsersStatsData {
  total: number;
  b2b: number;
  b2c: number;
  notVerified: number;
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  surName: string;
  email: string;
  login: string;
  password: string;
  role?: 'user' | 'admin' | string;
  phone: string;
  edrpou?: string;
  about?: string;
  address?: string;
  isB2B?: 'true' | 'false' | boolean;
}

export type UpdateUserPayload = Omit<User, 'token' | 'createdAt' | 'updatedAt'> & {
  password?: string;
  about?: string;
  isB2B?: boolean;
};

export interface GetUsersParams {
  page?: number;
  q?: string;
  role?: 'user' | 'admin' | 'all' | string;
  isB2B?: boolean;
  isUserVerified?: boolean;
  isDeleted?: 'true' | 'false' | 'only' | string;
  limit?: number;
}

export interface GetUsersResponse {
  users: User[];
  totalPages: number;
  total: number;
}

export interface GetDashboardOrdersParams {
  page?: number;
  q?: string;
  limit?: number;
  isRetail?: boolean;
  status?: string;
}

export interface GetDashboardOrdersResponse {
  orders: Order[];
  totalPages: number;
  stats: OrderStats;
}

export interface UpdateDashboardOrderPayload {
  orderId: number;
  updateOrder?: Partial<Order> | Record<string, unknown>;
  data?: Partial<Order> | Record<string, unknown>;
  isRetail?: boolean;
}

export interface GetSupportTicketsParams {
  q?: string;
  page?: number;
  limit?: number;
  isAnswered?: boolean;
}

export interface GetSupportTicketsResponse {
  tickets: SupportTicket[];
  totalPages: number;
}

export interface UpdateSupportTicketPayload {
  ticketId: number;
  isAnswered: boolean;
  ticketNumber?: number;
}

export interface StatsDateRangeParams {
  page?: number;
  limit?: number;
  startDate?: Date | string;
  endDate?: Date | string;
}

export interface GmcSyncResponse {
  success: boolean;
  count: number;
  error?: string;
}
