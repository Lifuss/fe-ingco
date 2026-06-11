import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  addFavoriteProductThunk,
  addProductToCartThunk,
  createOrderThunk,
  createRetailOrderThunk,
  deleteFavoriteProductThunk,
  deleteProductFromCartThunk,
  forgotPasswordThunk,
  getUserCartThunk,
  loginThunk,
  logoutThunk,
  refreshTokenThunk,
  registerThunk,
} from './operation';
import { Product } from '@/lib/types';
import { toast } from 'react-toastify';
import { normalizeUser } from '@/lib/utils';

const initialState = {
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
  localStorageCart: [] as {
    productId: Product;
    quantity: number;
    id: number;
  }[],
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
    addProductToLocalStorageCart: (state, { payload }) => {
      const product = state.localStorageCart.find((product) => product.id === payload.id);
      const addedQuantity = payload.quantity || 1;
      if (product) {
        product.quantity += addedQuantity;
      } else {
        state.localStorageCart.push({ ...payload, quantity: addedQuantity });
      }
    },
    removeProductFromLocalStorageCart: (state, { payload }) => {
      state.localStorageCart = state.localStorageCart.filter((product) => product.id !== payload);
    },
    decreaseProductQuantityInLocalStorageCart: (state, { payload }) => {
      state.localStorageCart.find((product) => {
        if (product.id === payload) {
          if (product.quantity === 1) {
            state.localStorageCart = state.localStorageCart.filter(
              (product) => product.id !== payload,
            );
          } else {
            product.quantity -= 1;
          }
        }
      });
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
      .addCase(createOrderThunk.fulfilled, (state) => {
        state.user.cart = [];
        state.isLoading = false;
      })
      .addCase(createRetailOrderThunk.fulfilled, (state) => {
        state.user.retailCart = [];
        state.localStorageCart = [];
        state.isLoading = false;
      })
      .addCase(forgotPasswordThunk.fulfilled, () => {
        toast.success(`Інструкцію для зміни паролю відправлено на пошту`);
      })
      .addMatcher(
        isAnyOf(
          getUserCartThunk.pending,
          addProductToCartThunk.pending,
          deleteProductFromCartThunk.pending,
          registerThunk.pending,
          logoutThunk.pending,
          loginThunk.pending,
          createOrderThunk.pending,
          createRetailOrderThunk.pending,
        ),
        (state) => {
          state.isLoading = true;
        },
      )
      .addMatcher(
        isAnyOf(
          getUserCartThunk.fulfilled,
          addProductToCartThunk.fulfilled,
          deleteProductFromCartThunk.fulfilled,
        ),
        (state, { payload, meta }) => {
          const isRetail = meta.arg && typeof meta.arg === 'object' && 'isRetail' in meta.arg ? (meta.arg as any).isRetail : false;
          if (isRetail) {
            state.user.retailCart = payload;
          } else {
            state.user.cart = payload;
          }
          state.isLoading = false;
        },
      )
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
          state.user.favorites = normalizedUser.favorites;
          state.user.cart = normalizedUser.cart;
          state.user.retailCart = normalizedUser.cartRetail;
          state.user.firstName = normalizedUser.firstName;
          state.user.lastName = normalizedUser.lastName;
          state.user.email = normalizedUser.email;
          state.user.phone = normalizedUser.phone;
          state.user.surName = normalizedUser.surName;
        },
      )
      .addMatcher(
        isAnyOf(addFavoriteProductThunk.fulfilled, deleteFavoriteProductThunk.fulfilled),
        (state, { payload }) => {
          state.user.favorites = payload;
        },
      )
      .addMatcher(
        isAnyOf(loginThunk.pending, registerThunk.pending, refreshTokenThunk.pending),
        (state) => {
          state.isLoading = true;
        },
      )
      .addMatcher(
        isAnyOf(
          getUserCartThunk.rejected,
          addProductToCartThunk.rejected,
          deleteProductFromCartThunk.rejected,
          createOrderThunk.rejected,
          createRetailOrderThunk.rejected,
          forgotPasswordThunk.rejected,
          logoutThunk.rejected,
        ),
        (state) => {
          state.isLoading = false;
        },
      )
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
  addProductToLocalStorageCart,
  increaseProductQuantityInLocalStorageCart,
  decreaseProductQuantityInLocalStorageCart,
  removeProductFromLocalStorageCart,
} = authStateSlice.actions;
export const authSlice = authStateSlice.reducer;
