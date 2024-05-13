import storage from 'redux-persist/lib/storage';
import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import { mainSlice } from './main/slice';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { authSlice } from './auth/slice';

const persistMainConfig = {
  key: 'main',
  whitelist: ['currencyRates'],
  storage,
};
const persistAuthConfig = {
  key: 'auth',
  whitelist: ['token'],
  storage,
};

const persistedMainReducer = persistReducer(persistMainConfig, mainSlice);
const persistedAuthReducer = persistReducer(persistAuthConfig, authSlice);

export const store = configureStore({
  reducer: {
    persistedMainReducer,
    persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(thunk),
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
