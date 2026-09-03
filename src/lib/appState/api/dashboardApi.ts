import { baseApi } from './baseApi';
import { Order, User } from '@/lib/types';
import { normalizeOrder, normalizeUser } from '@/lib/utils';
import {
  CreateUserPayload,
  GetDashboardOrdersParams,
  GetDashboardOrdersResponse,
  GetSupportTicketsParams,
  GetSupportTicketsResponse,
  GetUsersParams,
  GetUsersResponse,
  GmcStatusType,
  GmcSyncResponse,
  StatsDateRangeParams,
  UpdateDashboardOrderPayload,
  UpdateSupportTicketPayload,
  UpdateUserPayload,
  UsersStatsData,
} from './dashboardApi.types';

export * from './dashboardApi.types';

// ==========================================
// Payload & Query Parameter Helpers
// ==========================================

const formatUserPayload = (user: CreateUserPayload | UpdateUserPayload) => {
  const isB2b = 'isB2B' in user ? user.isB2B === 'true' || user.isB2B === true : undefined;

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    surName: user.surName,
    email: user.email,
    login: user.login,
    phone: user.phone,
    ...('password' in user && user.password ? { password: user.password } : {}),
    ...(user.role ? { role: user.role.toUpperCase() } : {}),
    ...(isB2b !== undefined ? { isB2b } : {}),
    ...('isVerified' in user ? { isVerified: user.isVerified } : {}),
    ...(user.edrpou !== undefined ? { edrpou: user.edrpou } : {}),
    ...(user.about !== undefined ? { about: user.about } : {}),
    ...(user.address !== undefined ? { address: user.address } : {}),
  };
};

const formatStatsParams = (params?: StatsDateRangeParams) => {
  if (!params) return undefined;
  const { startDate, endDate, ...rest } = params;
  return {
    ...rest,
    startDate: startDate instanceof Date ? startDate.toISOString() : startDate,
    endDate: endDate instanceof Date ? endDate.toISOString() : endDate,
  };
};

// ==========================================
// Dashboard RTK Query Endpoints
// ==========================================

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ----------------- 1. USERS -----------------
    getUsers: build.query<GetUsersResponse, GetUsersParams | void>({
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
      query: (credentials) => ({
        url: '/users',
        method: 'POST',
        data: formatUserPayload(credentials),
      }),
      transformResponse: (res: unknown) => normalizeUser(res),
      invalidatesTags: [{ type: 'User', id: 'LIST' }, 'DashboardStats'],
    }),

    updateUser: build.mutation<User, UpdateUserPayload>({
      query: (user) => ({
        url: `/users/${user.id}`,
        method: 'PUT',
        data: formatUserPayload(user),
      }),
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

    // ----------------- 2. ORDERS -----------------
    getDashboardOrders: build.query<GetDashboardOrdersResponse, GetDashboardOrdersParams | void>({
      query: (params) => ({
        url: '/orders/all',
        params: params || undefined,
      }),
      transformResponse: (response: {
        orders: unknown[];
        totalPages: number;
        stats: GetDashboardOrdersResponse['stats'];
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
      query: ({ orderId, updateOrder, data, isRetail = false }) => ({
        url: isRetail ? `/orders/retail/${orderId}` : `/orders/${orderId}`,
        method: 'PUT',
        data: data ?? updateOrder,
      }),
      transformResponse: (res: unknown) => normalizeOrder(res),
      invalidatesTags: (_res, _err, { orderId }) => [
        { type: 'Order', id: String(orderId) },
        { type: 'Order', id: 'LIST' },
      ],
    }),

    // ----------------- 3. SUPPORT TICKETS -----------------
    getSupportTickets: build.query<GetSupportTicketsResponse, GetSupportTicketsParams | void>({
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

    // ----------------- 4. STATS & ANALYTICS -----------------
    getUsersStats: build.query<UsersStatsData, void>({
      query: () => ({ url: '/users/stats' }),
      providesTags: ['DashboardStats'],
    }),

    getProductClicks: build.query<{ productClicks: object[] }, StatsDateRangeParams | void>({
      query: (params) => ({
        url: '/stats/products/clicks',
        params: formatStatsParams(params || undefined),
      }),
      providesTags: ['DashboardStats'],
    }),

    getUserActivity: build.query<{ users: User[] }, StatsDateRangeParams | void>({
      query: (params) => ({
        url: '/stats/users/activity',
        params: formatStatsParams(params || undefined),
      }),
      transformResponse: (response: { users: unknown[] }) => ({
        users: (response.users || []).map(normalizeUser),
      }),
      providesTags: ['DashboardStats'],
    }),

    // ----------------- 5. GOOGLE MERCHANT CENTER -----------------
    getGmcStatus: build.query<GmcStatusType, void>({
      query: () => ({ url: '/google-merchant/status' }),
      providesTags: ['GmcStatus'],
    }),

    syncGmcProducts: build.mutation<GmcSyncResponse, void>({
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
