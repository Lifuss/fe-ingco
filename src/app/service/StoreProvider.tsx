'use client';
import { ReactNode, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { makePersistor } from '../../lib/appState/store';
import { injectStore } from '../../lib/appState/user/operation';

export default function StoreProvider({ children }: { children: ReactNode }) {
  const [{ store, persistor }] = useState(() => {
    const p = makePersistor();
    injectStore(p.store);
    return p;
  });

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
