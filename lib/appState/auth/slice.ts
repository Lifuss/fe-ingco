import { createSlice } from '@reduxjs/toolkit';

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
  extraReducers: (builder) => {},
});

export const authSlice = authStateSlice.reducer;
