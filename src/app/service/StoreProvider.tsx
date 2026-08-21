'use client';
import { ReactNode, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { makePersistor } from '../../lib/appState/store';
import { injectStore, refreshTokenThunk } from '../../lib/appState/user/operation';
import { clearAuthState } from '../../lib/appState/user/slice';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { getPersistedToken } from '../../lib/authUtils';
import { toast } from 'react-toastify';

function AuthInitializer({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.persistedAuthReducer);

  useEffect(() => {
    if (!isAuthenticated) {
      const token = getPersistedToken();
      if (token) {
        dispatch(refreshTokenThunk(token))
          .unwrap()
          .catch(() => {
            dispatch(clearAuthState());
            toast.info('Сесія закінчилася. Для взаємодії з акаунтом будь ласка, увійдіть знову.');
          });
      }
    }
  }, [dispatch, isAuthenticated]);

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
