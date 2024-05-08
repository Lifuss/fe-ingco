import { createSlice } from '@reduxjs/toolkit';
import { loginThunk } from './operation';

const initialState = {
  user: {
    isVerified: false,
    login: '',
    role: '',
  },
  token: '',
};

const authStateSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginThunk.fulfilled, (state, { payload }) => {
      state.token = payload.token;
      state.user.isVerified = payload.isVerified;
      state.user.login = payload.login;
      state.user.role = payload.role;
    });
  },
});

export const authSlice = authStateSlice.reducer;
