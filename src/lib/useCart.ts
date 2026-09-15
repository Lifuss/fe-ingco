'use client';

import { useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector, useIsB2B } from '@/lib/hooks';
import { selectCurrency } from '@/lib/appState/main/selectors';
import {
  useGetCartQuery,
  useAddToCartMutation,
  useDeleteFromCartMutation,
} from '@/lib/appState/api/cartApi';
import {
  addProductToLocalStorageCart,
  removeProductFromLocalStorageCart,
  increaseProductQuantityInLocalStorageCart,
  decreaseProductQuantityInLocalStorageCart,
  setProductQuantityInLocalStorageCart,
  clearLocalStorageCart,
} from '@/lib/appState/user/slice';
import { Product } from '@/lib/types';
import { getEffectiveRetailPrice } from '@/lib/utils';

export interface UnifiedCartItem {
  id: number;
  productId: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export function useCart() {
  const dispatch = useAppDispatch();
  const isB2b = useIsB2B();
  const { isAuthenticated, localStorageCart } = useAppSelector(
    (state) => state.persistedAuthReducer,
  );
  const currency = useAppSelector(selectCurrency);

  const isRetail = !isB2b;
  const {
    data: serverCart = [],
    isLoading: isServerLoading,
    isFetching,
  } = useGetCartQuery({ isRetail }, { skip: !isAuthenticated });

  const [addToCartMutation, { isLoading: isAdding }] = useAddToCartMutation();
  const [deleteFromCartMutation, { isLoading: isDeleting }] = useDeleteFromCartMutation();

  const items = useMemo<UnifiedCartItem[]>(() => {
    const rawItems = isAuthenticated ? serverCart : localStorageCart;
    return (rawItems || []).map((item) => {
      const p = item.productId;
      const unitPrice = isAuthenticated && isB2b ? Number(p.price) : getEffectiveRetailPrice(p);
      return {
        id: item.id,
        productId: p,
        quantity: item.quantity,
        unitPrice,
        totalPrice: unitPrice * item.quantity,
      };
    });
  }, [isAuthenticated, isB2b, serverCart, localStorageCart]);

  const { totalQuantity, totalPrice } = useMemo(() => {
    return items.reduce(
      (acc, item) => ({
        totalQuantity: acc.totalQuantity + item.quantity,
        totalPrice: acc.totalPrice + item.totalPrice,
      }),
      { totalQuantity: 0, totalPrice: 0 },
    );
  }, [items]);

  const itemCount = items.length;

  const addToCart = useCallback(
    async (product: Product, quantity = 1) => {
      if (isAuthenticated) {
        return addToCartMutation({
          productId: product.id,
          quantity,
          isRetail,
        }).unwrap();
      } else {
        const { price: _p, priceBulk: _pb, ...restProduct } = product;
        dispatch(
          addProductToLocalStorageCart({
            productId: restProduct as Product,
            quantity,
            id: product.id,
          }),
        );
      }
    },
    [isAuthenticated, isRetail, addToCartMutation, dispatch],
  );

  const updateQuantity = useCallback(
    async (productId: number, operation: 'increment' | 'decrement') => {
      if (isAuthenticated) {
        if (operation === 'increment') {
          return addToCartMutation({ productId, quantity: 1, isRetail }).unwrap();
        } else {
          return deleteFromCartMutation({ productId, quantity: 1, isRetail }).unwrap();
        }
      } else {
        if (operation === 'increment') {
          dispatch(increaseProductQuantityInLocalStorageCart(productId));
        } else {
          dispatch(decreaseProductQuantityInLocalStorageCart(productId));
        }
      }
    },
    [isAuthenticated, isRetail, addToCartMutation, deleteFromCartMutation, dispatch],
  );

  const setQuantity = useCallback(
    async (productId: number, newQuantity: number) => {
      const targetQty = Math.max(1, Math.floor(newQuantity));
      const currentItem = items.find((i) => i.productId.id === productId);
      if (!currentItem || currentItem.quantity === targetQty) return;

      if (isAuthenticated) {
        const delta = targetQty - currentItem.quantity;
        if (delta > 0) {
          return addToCartMutation({ productId, quantity: delta, isRetail }).unwrap();
        } else if (delta < 0) {
          return deleteFromCartMutation({
            productId,
            quantity: Math.abs(delta),
            isRetail,
          }).unwrap();
        }
      } else {
        dispatch(setProductQuantityInLocalStorageCart({ id: productId, quantity: targetQty }));
      }
    },
    [isAuthenticated, isRetail, items, addToCartMutation, deleteFromCartMutation, dispatch],
  );

  const removeItem = useCallback(
    async (productId: number, quantity?: number) => {
      if (isAuthenticated) {
        return deleteFromCartMutation({ productId, quantity, isRetail }).unwrap();
      } else {
        dispatch(removeProductFromLocalStorageCart(productId));
      }
    },
    [isAuthenticated, isRetail, deleteFromCartMutation, dispatch],
  );

  const clearCart = useCallback(() => {
    if (!isAuthenticated) {
      dispatch(clearLocalStorageCart());
    }
  }, [isAuthenticated, dispatch]);

  return {
    items,
    itemCount,
    totalQuantity,
    totalPrice,
    isLoading: isAuthenticated ? isServerLoading : false,
    isFetching,
    isUpdating: isAdding || isDeleting,
    isB2b,
    isRetail,
    currency,
    addToCart,
    updateQuantity,
    setQuantity,
    removeItem,
    clearCart,
  };
}
