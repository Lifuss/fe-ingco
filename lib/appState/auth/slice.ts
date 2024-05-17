import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  addFavoriteProductThunk,
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
      .addMatcher(
        isAnyOf(loginThunk.fulfilled, refreshTokenThunk.fulfilled),
        (state, { payload }) => {
          state.token = payload.token;
          state.user.isVerified = payload.isVerified;
          state.user.login = payload.login;
          state.user.role = payload.role;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.user.favorites = payload.favorites;
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
