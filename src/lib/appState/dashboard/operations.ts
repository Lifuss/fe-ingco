import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiIngco, serializeAxiosError } from '../user/operation';
import { Order, User } from '@/lib/types';
import { normalizeProduct, normalizeOrder, normalizeUser } from '@/lib/utils';

// products thunks
export const createProductThunk = createAsyncThunk(
  'createProduct',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const { data } = await apiIngco.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

export const updateProductThunk = createAsyncThunk(
  'updateProduct',
  async (
    { formData, productId }: { formData: FormData; productId: string },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiIngco.put(`/products/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return normalizeProduct(data);
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

// ----------------- users thunks
export const fetchUsersThunk = createAsyncThunk(
  'fetchUsers',
  async (
    {
      query: q = '',
      role = 'user',
      isB2B,
      isUserVerified,
      isDeleted,
      page = 1,
      limit = 25,
    }: {
      query: string;
      role: 'user' | 'admin';
      isB2B?: boolean;
      isUserVerified?: boolean;
      isDeleted?: boolean;
      page: number;
      limit: number;
    },
    { rejectWithValue, signal },
  ) => {
    try {
      const { data } = await apiIngco.get('/users', {
        params: { q, role: role.toUpperCase(), isB2B, isUserVerified, isDeleted, page, limit },
        signal,
      });
      return {
        ...data,
        users: (data.users || []).map(normalizeUser),
      };
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

export const createUserThunk = createAsyncThunk(
  'createUser',
  async (
    credentials: {
      firstName: string;
      lastName: string;
      surName: string;
      email: string;
      login: string;
      password: string;
      role: 'user' | 'admin';
      phone: string;
      edrpou?: string;
      about?: string;
      address?: string;
      isB2B: 'true' | 'false';
    },
    { rejectWithValue },
  ) => {
    try {
      const payload = {
        ...credentials,
        role: credentials.role ? credentials.role.toUpperCase() : undefined,
      };
      const { data } = await apiIngco.post('/users', payload);
      return normalizeUser(data);
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

export const updateUserThunk = createAsyncThunk(
  'updateUser',
  async (user: Omit<User, 'token' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const payload = {
        ...user,
        role: user.role ? user.role.toUpperCase() : undefined,
      };
      const { data } = await apiIngco.put(`/users/${user.id}`, payload);

      return normalizeUser(data);
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

export const restoreUserThunk = createAsyncThunk(
  'restoreUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      await apiIngco.post(`/users/restore/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

export const deleteUserThunk = createAsyncThunk(
  'deleteUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      await apiIngco.delete(`/users/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

interface NewProduct {
  id: number;
  quantity: number;
  totalPriceByOneProduct: number;
  product: number;
  price: number;
}

interface UpdateOrder extends Omit<
  Order,
  'products' | 'user' | 'orderCode' | 'createdAt' | 'updatedAt'
> {
  products: NewProduct[];
}

// --------------- orders thunks
export const fetchOrdersThunk = createAsyncThunk(
  'fetchOrders',
  async (
    {
      query: q = '',
      page = 1,
      limit = 15,
      isRetail = false,
      status = 'всі',
    }: {
      query: string;
      page?: number;
      limit?: number;
      isRetail: boolean;
      status?:
        | 'всі'
        | 'очікує підтвердження'
        | 'очікує оплати'
        | 'комплектується'
        | 'відправлено'
        | 'замовлення виконано'
        | 'замовлення скасовано';
    },
    { rejectWithValue, signal },
  ) => {
    try {
      const { data } = await apiIngco.get('/orders/all', {
        params: { q, page, limit, isRetail, status },
        signal,
      });
      return {
        ...data,
        orders: (data.orders || []).map(normalizeOrder),
      };
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

export const updateOrderThunk = createAsyncThunk(
  'updateOrder',
  async (
    { orderId, updateOrder, isRetail = false }: { orderId: number; updateOrder: UpdateOrder; isRetail?: boolean },
    { rejectWithValue },
  ) => {
    try {
      const payload: Record<string, any> = {};
      const fields: (keyof UpdateOrder)[] = [
        'status',
        'isPaid',
        'declarationNumber',
        'comment',
        'shippingAddress',
      ];
      for (const field of fields) {
        if (updateOrder[field] !== undefined) {
          payload[field] = updateOrder[field];
        }
      }

      const url = isRetail ? `/orders/retail/${orderId}` : `/orders/${orderId}`;
      const { data } = await apiIngco.put(url, payload);
      return normalizeOrder(data);
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

export const fetchUsersStatsThunk = createAsyncThunk(
  'fetch/UsersStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiIngco.get('/users/stats');
      return data;
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

export const fetchSupportTicketsThunk = createAsyncThunk(
  'fetch/SupportTickets',
  async (
    {
      query: q = '',
      page = 1,
      limit = 25,
      isAnswered = false,
    }: {
      isAnswered: boolean;
      query: string;
      page: number;
      limit: number;
    },
    { rejectWithValue, signal },
  ) => {
    try {
      const { data } = await apiIngco.get('/users/support', {
        params: {
          q,
          page,
          limit,
          isAnswered,
        },
        signal,
      });
      return data;
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);

export const updateSupportTicketThunk = createAsyncThunk(
  'update/SupportTickets',
  async (
    {
      ticketId,
      isAnswered = true,
      ticketNumber,
    }: {
      ticketId: number;
      isAnswered: boolean;
      ticketNumber: number;
    },
    { rejectWithValue },
  ) => {
    try {
      await apiIngco.patch(`/users/support/${ticketId}`, {
        isAnswered,
      });
      return ticketNumber;
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
);
