import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  forgotPasswordThunk,
  loginThunk,
  logoutThunk,
  refreshTokenThunk,
  registerThunk,
} from './operation';
import { Product } from '@/lib/types';
import { toast } from 'react-toastify';
import { normalizeUser } from '@/lib/utils';

interface AuthUserState {
  isVerified: boolean;
  login: string;
  role: string;
  favorites: Product[];
  cart: { quantity: number; id: number; productId: Product }[];
  retailCart: { quantity: number; id: number; productId: Product }[];
  firstName: string;
  lastName: string;
  surName: string;
  email: string;
  phone: string;
}

interface AuthState {
  user: AuthUserState;
  localStorageCart: {
    productId: Product;
    quantity: number;
    id: number;
  }[];
  token: string;
  isAuthenticated: boolean;
  isB2b: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: {
    isVerified: false,
    login: '',
    role: '',
    favorites: [],
    cart: [],
    retailCart: [],
    firstName: '',
    lastName: '',
    surName: '',
    email: '',
    phone: '',
  },
  localStorageCart: [],
  token: '',
  isAuthenticated: false,
  isB2b: false,
  isLoading: false,
};

const authStateSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    clearAuthState: () => {
      return initialState;
    },
    clearLocalStorageCart: (state) => {
      state.localStorageCart = [];
    },
    setFavorites: (state, { payload }) => {
      state.user.favorites = payload;
    },
    setB2bCart: (state, { payload }) => {
      state.user.cart = payload;
    },
    setRetailCart: (state, { payload }) => {
      state.user.retailCart = payload;
    },
    addProductToLocalStorageCart: (state, { payload }) => {
      const product = state.localStorageCart.find((p) => p.id === payload.id);
      const addedQuantity = payload.quantity || 1;
      if (product) {
        product.quantity += addedQuantity;
      } else {
        state.localStorageCart.push({ ...payload, quantity: addedQuantity });
      }
    },
    removeProductFromLocalStorageCart: (state, { payload }) => {
      state.localStorageCart = state.localStorageCart.filter((p) => p.id !== payload);
    },
    decreaseProductQuantityInLocalStorageCart: (state, { payload }) => {
      const product = state.localStorageCart.find((p) => p.id === payload);
      if (product) {
        if (product.quantity <= 1) {
          state.localStorageCart = state.localStorageCart.filter((p) => p.id !== payload);
        } else {
          product.quantity -= 1;
        }
      }
    },
    increaseProductQuantityInLocalStorageCart: (state, { payload }) => {
      state.localStorageCart = state.localStorageCart.map((product) =>
        product.id === payload ? { ...product, quantity: product.quantity + 1 } : product,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerThunk.fulfilled, (state, { payload }) => {
        state.token = payload.token;
        const normalizedUser = normalizeUser(payload);
        state.user.isVerified = normalizedUser.isVerified;
        state.user.login = normalizedUser.login;
        state.user.role = normalizedUser.role;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        Object.assign(state, initialState);
      })
      .addCase(logoutThunk.rejected, (state) => {
        Object.assign(state, initialState);
      })
      .addCase(forgotPasswordThunk.fulfilled, () => {
        toast.success(`Інструкцію для зміни паролю відправлено на пошту`);
      })
      .addMatcher(
        isAnyOf(loginThunk.fulfilled, refreshTokenThunk.fulfilled),
        (state, { payload }) => {
          state.token = payload.token;
          state.isAuthenticated = true;
          state.isB2b = payload.isB2b;
          state.isLoading = false;
          const normalizedUser = normalizeUser(payload);
          state.user.isVerified = normalizedUser.isVerified;
          state.user.login = normalizedUser.login;
          state.user.role = normalizedUser.role;
          state.user.favorites = normalizedUser.favorites as unknown as Product[];
          state.user.cart = normalizedUser.cart as unknown as {
            quantity: number;
            id: number;
            productId: Product;
          }[];
          state.user.retailCart = (normalizedUser.cartRetail || []) as unknown as {
            quantity: number;
            id: number;
            productId: Product;
          }[];
          state.user.firstName = normalizedUser.firstName;
          state.user.lastName = normalizedUser.lastName;
          state.user.email = normalizedUser.email;
          state.user.phone = normalizedUser.phone;
          state.user.surName = normalizedUser.surName;
        },
      )
      .addMatcher(
        isAnyOf(
          loginThunk.pending,
          registerThunk.pending,
          refreshTokenThunk.pending,
          logoutThunk.pending,
        ),
        (state) => {
          state.isLoading = true;
        },
      )
      .addMatcher(isAnyOf(forgotPasswordThunk.rejected, logoutThunk.rejected), (state) => {
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(loginThunk.rejected, refreshTokenThunk.rejected, registerThunk.rejected),
        (state) => {
          state.isLoading = false;
          state.isAuthenticated = false;
          state.token = '';
        },
      );
  },
});

export const {
  clearAuthState,
  clearLocalStorageCart,
  setFavorites,
  setB2bCart,
  setRetailCart,
  addProductToLocalStorageCart,
  increaseProductQuantityInLocalStorageCart,
  decreaseProductQuantityInLocalStorageCart,
  removeProductFromLocalStorageCart,
} = authStateSlice.actions;

export const authSlice = authStateSlice.reducer;
