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
    <div className="hidden shrink-0 items-center gap-6 lg:flex">
      {/* 1. Favorites Action */}
      <Link
        href="/favorites"
        className="text-primary-600 hover:text-primary-800 flex cursor-pointer flex-col items-center justify-center gap-1 font-sans text-[11px] font-bold transition-colors select-none"
      >
        <Heart size={22} className="fill-none stroke-current stroke-[2.3]" />
        <span>Обране</span>
      </Link>

      {/* 2. Cart Action */}
      <Link
        href="/cart"
        className="text-primary-600 hover:text-primary-800 relative flex cursor-pointer flex-col items-center justify-center gap-1 font-sans text-[11px] font-bold transition-colors select-none"
      >
        <div className="relative">
          <ShoppingBasket size={22} className="fill-none stroke-current stroke-[2.3]" />
          {itemsInCart > 0 && (
            <span className="bg-primary-800 absolute -top-1.5 -right-2 flex h-4.5 w-4.5 items-center justify-center rounded-full border border-white text-[9px] font-extrabold text-white shadow-sm">
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
          className="text-primary-600 hover:text-primary-800 flex cursor-pointer flex-col items-center justify-center gap-1 font-sans text-[11px] font-bold transition-colors select-none"
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
