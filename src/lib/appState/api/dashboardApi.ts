import { baseApi } from './baseApi';
import { Order, SupportTicket, User } from '@/lib/types';
import { normalizeOrder, normalizeUser } from '@/lib/utils';

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

export interface GetDashboardOrdersParams {
  page?: number;
  q?: string;
  limit?: number;
  isRetail?: boolean;
  status?: string;
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

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ----------------- USERS -----------------
    getUsers: build.query<
      { users: User[]; totalPages: number; total: number },
      GetUsersParams | void
    >({
      query: (params) => {
        const { role, isB2B, q, ...rest } = params || {};
        return {
          url: '/users',
          params: {
            ...rest,
            q: q || undefined,
            role: role === 'all' ? undefined : role?.toUpperCase(),
            isB2b: isB2B,
          },
        };
      },
      transformResponse: (response: { users: unknown[]; totalPages: number; total: number }) => ({
        ...response,
        users: (response.users || []).map(normalizeUser),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.users.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    createUser: build.mutation<User, CreateUserPayload>({
      query: (credentials) => {
        const payload: Record<string, unknown> = {
          firstName: credentials.firstName,
          lastName: credentials.lastName,
          surName: credentials.surName,
          email: credentials.email,
          login: credentials.login,
          password: credentials.password,
          phone: credentials.phone,
          role: credentials.role ? credentials.role.toUpperCase() : undefined,
          isB2b: credentials.isB2B === 'true' || credentials.isB2B === true,
        };

        if (credentials.edrpou !== undefined) payload.edrpou = credentials.edrpou;
        if (credentials.about !== undefined) payload.about = credentials.about;
        if (credentials.address !== undefined) payload.address = credentials.address;

        return {
          url: '/users',
          method: 'POST',
          data: payload,
        };
      },
      transformResponse: (res: unknown) => normalizeUser(res),
      invalidatesTags: [{ type: 'User', id: 'LIST' }, 'DashboardStats'],
    }),

    updateUser: build.mutation<User, UpdateUserPayload>({
      query: (user) => {
        const payload: Record<string, unknown> = {
          firstName: user.firstName,
          lastName: user.lastName,
          surName: user.surName,
          email: user.email,
          login: user.login,
          phone: user.phone,
          isVerified: user.isVerified,
          isB2b: user.isB2B,
        };

        if (user.role) payload.role = user.role.toUpperCase();
        if (user.password) payload.password = user.password;
        if (user.edrpou !== undefined) payload.edrpou = user.edrpou;
        if (user.about !== undefined) payload.about = user.about;
        if (user.address !== undefined) payload.address = user.address;

        return {
          url: `/users/${user.id}`,
          method: 'PUT',
          data: payload,
        };
      },
      transformResponse: (res: unknown) => normalizeUser(res),
      invalidatesTags: (_res, _err, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
        'DashboardStats',
      ],
    }),

    deleteUser: build.mutation<number, number>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }, 'DashboardStats'],
    }),

    restoreUser: build.mutation<number, number>({
      query: (userId) => ({
        url: `/users/restore/${userId}`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }, 'DashboardStats'],
    }),

    // ----------------- ORDERS -----------------
    getDashboardOrders: build.query<
      { orders: Order[]; totalPages: number; stats: OrderStats },
      GetDashboardOrdersParams | void
    >({
      query: (params) => ({
        url: '/orders/all',
        params: params || undefined,
      }),
      transformResponse: (response: {
        orders: unknown[];
        totalPages: number;
        stats: OrderStats;
      }) => ({
        ...response,
        orders: (response.orders || []).map(normalizeOrder),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.orders.map(({ orderCode }) => ({
                type: 'Order' as const,
                id: orderCode,
              })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),

    updateDashboardOrder: build.mutation<Order, UpdateDashboardOrderPayload>({
      query: ({ orderId, updateOrder, data, isRetail = false }) => {
        const body = data ?? updateOrder;
        return {
          url: isRetail ? `/orders/retail/${orderId}` : `/orders/${orderId}`,
          method: 'PUT',
          data: body,
        };
      },
      transformResponse: (res: unknown) => normalizeOrder(res),
      invalidatesTags: (_res, _err, { orderId }) => [
        { type: 'Order', id: String(orderId) },
        { type: 'Order', id: 'LIST' },
      ],
    }),

    // ----------------- SUPPORT TICKETS -----------------
    getSupportTickets: build.query<
      { tickets: SupportTicket[]; totalPages: number },
      GetSupportTicketsParams | void
    >({
      query: (params) => ({
        url: '/users/support',
        params: params || undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.tickets.map(({ id }) => ({
                type: 'SupportTicket' as const,
                id,
              })),
              { type: 'SupportTicket', id: 'LIST' },
            ]
          : [{ type: 'SupportTicket', id: 'LIST' }],
    }),

    updateSupportTicket: build.mutation<void, UpdateSupportTicketPayload>({
      query: ({ ticketId, isAnswered }) => ({
        url: `/users/support/${ticketId}`,
        method: 'PATCH',
        data: { isAnswered },
      }),
      invalidatesTags: [{ type: 'SupportTicket', id: 'LIST' }],
    }),

    // ----------------- STATS & ANALYTICS -----------------
    getUsersStats: build.query<UsersStatsData, void>({
      query: () => ({ url: '/users/stats' }),
      providesTags: ['DashboardStats'],
    }),

    getProductClicks: build.query<{ productClicks: object[] }, StatsDateRangeParams | void>({
      query: (params) => {
        const { startDate, endDate, ...rest } = params || {};
        return {
          url: '/stats/products/clicks',
          params: {
            ...rest,
            startDate: startDate instanceof Date ? startDate.toISOString() : startDate,
            endDate: endDate instanceof Date ? endDate.toISOString() : endDate,
          },
        };
      },
      providesTags: ['DashboardStats'],
    }),

    getUserActivity: build.query<{ users: User[] }, StatsDateRangeParams | void>({
      query: (params) => {
        const { startDate, endDate, ...rest } = params || {};
        return {
          url: '/stats/users/activity',
          params: {
            ...rest,
            startDate: startDate instanceof Date ? startDate.toISOString() : startDate,
            endDate: endDate instanceof Date ? endDate.toISOString() : endDate,
          },
        };
      },
      transformResponse: (response: { users: unknown[] }) => ({
        users: (response.users || []).map(normalizeUser),
      }),
      providesTags: ['DashboardStats'],
    }),

    // ----------------- GOOGLE MERCHANT CENTER -----------------
    getGmcStatus: build.query<GmcStatusType, void>({
      query: () => ({ url: '/google-merchant/status' }),
      providesTags: ['GmcStatus'],
    }),

    syncGmcProducts: build.mutation<{ success: boolean; count: number; error?: string }, void>({
      query: () => ({
        url: '/google-merchant/sync',
        method: 'POST',
      }),
      invalidatesTags: ['GmcStatus'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useRestoreUserMutation,
  useGetDashboardOrdersQuery,
  useUpdateDashboardOrderMutation,
  useGetSupportTicketsQuery,
  useUpdateSupportTicketMutation,
  useGetUsersStatsQuery,
  useGetProductClicksQuery,
  useGetUserActivityQuery,
  useGetGmcStatusQuery,
  useSyncGmcProductsMutation,
} = dashboardApi;
