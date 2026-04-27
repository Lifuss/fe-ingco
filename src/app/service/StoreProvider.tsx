'use client';
import { ReactNode, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { makeStore, makePersistor } from '../../lib/appState/store';

export default function StoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => makeStore());
  const [persistor] = useState(() => makePersistor());

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
