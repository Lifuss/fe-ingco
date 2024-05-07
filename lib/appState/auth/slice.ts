import { createSlice } from '@reduxjs/toolkit';
import { loginThunk } from './operation';

const initialState = {
  user: {
    id: '',
    email: '',
    name: '',
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
      state.user = payload.user;
    });
  },
});

export const authSlice = authStateSlice.reducer;
