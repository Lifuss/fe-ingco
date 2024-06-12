import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  addFavoriteProductThunk,
  addProductToCartThunk,
  addProductToRetailCartThunk,
  createOrderThunk,
  createRetailOrderThunk,
  deleteFavoriteProductThunk,
  deleteProductFromCartThunk,
  deleteProductFromRetailCartThunk,
  getUserCartThunk,
  getUserRetailCartThunk,
  loginThunk,
  logoutThunk,
  refreshTokenThunk,
  registerThunk,
} from './operation';

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
  token: '',
  isAuthenticated: false,
  isLoading: false,
};

const authStateSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    clearAuthState: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerThunk.fulfilled, (state, { payload }) => {
        state.token = payload.token;
        state.user.isVerified = payload.isVerified;
        state.user.login = payload.login;
        state.user.role = payload.role;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(logoutThunk.fulfilled, (state, _) => {
        return (state = initialState);
      })
      .addCase(createOrderThunk.fulfilled, (state, _) => {
        state.user.cart = [];
      })
      .addCase(createRetailOrderThunk.fulfilled, (state, _) => {
        state.user.retailCart = [];
      })
      .addMatcher(
        isAnyOf(
          getUserCartThunk.fulfilled,
          addProductToCartThunk.fulfilled,
          deleteProductFromCartThunk.fulfilled,
        ),
        (state, { payload }) => {
          state.user.cart = payload;
        },
      )
      .addMatcher(
        isAnyOf(
          getUserRetailCartThunk.fulfilled,
          addProductToRetailCartThunk.fulfilled,
          deleteProductFromRetailCartThunk.fulfilled,
        ),
        (state, { payload }) => {
          state.user.retailCart = payload;
        },
      )
      .addMatcher(
        isAnyOf(loginThunk.fulfilled, refreshTokenThunk.fulfilled),
        (state, { payload }) => {
          state.token = payload.token;
          state.user.isVerified = payload.isVerified;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.user.login = payload.login;
          state.user.role = payload.role;
          state.user.favorites = payload.favorites;
          state.user.cart = payload.cart;
          state.user.retailCart = payload.cartRetail;
          state.user.firstName = payload.firstName;
          state.user.lastName = payload.lastName;
          state.user.email = payload.email;
          state.user.phone = payload.phone;
          state.user.surName = payload.surName;
        },
      )
      .addMatcher(
        isAnyOf(
          addFavoriteProductThunk.fulfilled,
          deleteFavoriteProductThunk.fulfilled,
        ),
        (state, { payload }) => {
          state.user.favorites = payload;
        },
      )
      .addMatcher(
        isAnyOf(
          loginThunk.pending,
          registerThunk.pending,
          refreshTokenThunk.pending,
        ),
        (state, _) => {
          state.isLoading = true;
        },
      )
      .addMatcher(
        isAnyOf(
          loginThunk.rejected,
          refreshTokenThunk.rejected,
          registerThunk.rejected,
        ),
        (state, _) => {
          state.isLoading = false;
          state.isAuthenticated = false;
          state.token = '';
        },
      );
  },
});

export const { clearAuthState } = authStateSlice.actions;
export const authSlice = authStateSlice.reducer;
