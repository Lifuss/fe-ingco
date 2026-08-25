'use client';
import { ReactNode, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { makePersistor } from '../../lib/appState/store';
import {
  injectStore,
  refreshTokenThunk,
  setToken,
  clearToken,
} from '../../lib/appState/user/operation';
import { clearAuthState } from '../../lib/appState/user/slice';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { getPersistedToken } from '../../lib/authUtils';

function AuthInitializer({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.persistedAuthReducer);
  const { token, user, isAuthenticated } = authState;

  useEffect(() => {
    const savedToken = token || getPersistedToken();
    if (savedToken) {
      // 1. Immediately ensure cookies match active token and role
      if (typeof window !== 'undefined') {
        const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
        const cookieToken = match ? decodeURIComponent(match[1]) : null;
        if (!cookieToken || cookieToken !== savedToken) {
          setToken(savedToken, user?.role);
        }
      }

      // 2. Validate and refresh session with backend
      dispatch(refreshTokenThunk(savedToken))
        .unwrap()
        .catch(() => {
          dispatch(clearAuthState());
        });
    } else if (!isAuthenticated) {
      clearToken();
    }
  }, [dispatch, token, user?.role, isAuthenticated]);

  return <>{children}</>;
}

export default function StoreProvider({ children }: { children: ReactNode }) {
  const [{ store, persistor }] = useState(() => {
    const p = makePersistor();
    injectStore(p.store);
    return p;
  });

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthInitializer>{children}</AuthInitializer>
      </PersistGate>
    </Provider>
  );
}
