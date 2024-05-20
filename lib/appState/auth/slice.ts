import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  addFavoriteProductThunk,
  addProductToCartThunk,
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
  },
  token: '',
  isAuthenticated: false,
  isLoading: false,
};

const authStateSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {},
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
      .addCase(addFavoriteProductThunk.fulfilled, (state, { payload }) => {
        state.user.favorites = payload;
      })
      .addCase(addProductToCartThunk.fulfilled, (state, { payload }) => {
        state.user.cart = payload;
      })
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
        },
      );
  },
});

export const authSlice = authStateSlice.reducer;
