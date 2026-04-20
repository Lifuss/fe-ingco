import { dashboardSlice } from './dashboard/slice';
import storage from 'redux-persist/lib/storage';
import { configureStore } from '@reduxjs/toolkit';
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
import { authSlice } from './user/slice';

const persistMainConfig = {
  key: 'main',
  whitelist: ['currencyRates', 'shopView'],
  storage,
};
const persistAuthConfig = {
  key: 'auth',
  whitelist: ['token', 'localStorageCart'],
  storage,
};

const persistedMainReducer = persistReducer(persistMainConfig, mainSlice);
const persistedAuthReducer = persistReducer(persistAuthConfig, authSlice);

export const makeStore = () =>
  configureStore({
    reducer: {
      persistedMainReducer,
      persistedAuthReducer,
      dashboardSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

export const makePersistor = () => persistStore(makeStore());

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<ReturnType<typeof makeStore>['getState']>;
export type AppDispatch = AppStore['dispatch'];
