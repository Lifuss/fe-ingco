'use client';

import Link from 'next/link';
import { Heart, ShoppingBasket } from 'lucide-react';
import { useAppSelector } from '@/lib/hooks';
import UserModal from '~/ui/modals/UserModal';
import Icon from '~/ui/assets/Icon';

export default function HeaderActions() {
  const { isAuthenticated, isB2b, user, localStorageCart } = useAppSelector(
    (state) => state.persistedAuthReducer,
  );

  // Calculate items in cart based on B2B status
  const itemsInCart = isB2b
    ? user?.cart?.length || 0
    : isAuthenticated
      ? user?.retailCart?.length || 0
      : localStorageCart?.length || 0;

  return (
    <div className="hidden lg:flex items-center gap-6 shrink-0">
      {/* 1. Favorites Action */}
      <Link
        href="/favorites"
        className="flex flex-col items-center justify-center gap-1 font-sans text-[11px] font-bold text-primary-600 hover:text-primary-800 transition-colors cursor-pointer select-none"
      >
        <Heart size={22} className="stroke-current stroke-[2.3] fill-none" />
        <span>Обране</span>
      </Link>

      {/* 2. Cart Action */}
      <Link
        href="/cart"
        className="relative flex flex-col items-center justify-center gap-1 font-sans text-[11px] font-bold text-primary-600 hover:text-primary-800 transition-colors cursor-pointer select-none"
      >
        <div className="relative">
          <ShoppingBasket size={22} className="stroke-current stroke-[2.3] fill-none" />
          {itemsInCart > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-primary-800 text-white text-[9px] font-extrabold rounded-full w-4.5 h-4.5 flex items-center justify-center border border-white shadow-sm">
              {itemsInCart}
            </span>
          )}
        </div>
        <span>Кошик</span>
      </Link>

      {/* 3. Profile / Auth Action */}
      {isAuthenticated ? (
        <UserModal showLabel={true} />
      ) : (
        <Link
          href="/auth/login"
          className="flex flex-col items-center justify-center gap-1 font-sans text-[11px] font-bold text-primary-600 hover:text-primary-800 transition-colors cursor-pointer select-none"
        >
          <Icon
            icon="user"
            className="h-[22px] w-[22px] fill-none stroke-current stroke-[2.3] transition-colors"
          />
          <span>Профіль</span>
        </Link>
      )}
    </div>
  );
}
