import { createSlice } from '@reduxjs/toolkit';
import { loginThunk } from './operation';

const initialState = {
  user: {
    isVerified: false,
    login: '',
    role: '',
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
      .addCase(loginThunk.pending, (state, _) => {
        state.isLoading = true;
      })
      .addCase(loginThunk.fulfilled, (state, { payload }) => {
        state.token = payload.token;
        state.user.isVerified = payload.isVerified;
        state.user.login = payload.login;
        state.user.role = payload.role;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(loginThunk.rejected, (state, _) => {
        state.isAuthenticated = false;
        state.isLoading = false;
      });
  },
});

export const authSlice = authStateSlice.reducer;
