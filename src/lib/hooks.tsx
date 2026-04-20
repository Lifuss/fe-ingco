import { useDispatch, useSelector, useStore } from 'react-redux';
import type { RootState, AppDispatch, AppStore } from '@/lib/appState/store';
import { useCallback } from 'react';
import { trackProductClickThunk } from './appState/main/operations';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export const useProductStats = () => {
  const dispatch = useAppDispatch();

  const logProductClick = useCallback(
    (productId: string) => {
      dispatch(trackProductClickThunk(productId));
    },
    [dispatch],
  );

  return { logProductClick };
};
