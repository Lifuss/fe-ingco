'use client';

import Link from 'next/link';
import { Heart, ShoppingBasket } from 'lucide-react';
import { useAppSelector } from '@/lib/hooks';
import UserModal from '~/ui/modals/UserModal';
import Icon from '~/ui/assets/Icon';

export default function MobileActions() {
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
    <div className="flex items-center gap-2 lg:hidden">
      <Link
        href="/favorites"
        className="text-primary-600 hover:bg-primary-50 hover:text-primary-800 flex cursor-pointer items-center justify-center rounded-lg p-2 transition-colors"
        aria-label="Favorites"
      >
        <Heart size={22} className="fill-none stroke-current stroke-[2.3]" />
      </Link>

      <Link
        href="/cart"
        className="text-primary-600 hover:bg-primary-50 hover:text-primary-800 relative flex cursor-pointer items-center justify-center rounded-lg p-2 transition-colors"
        aria-label="Cart"
      >
        <div className="relative">
          <ShoppingBasket size={22} className="fill-none stroke-current stroke-[2.3]" />
          {itemsInCart > 0 && (
            <span className="bg-primary-800 absolute -top-1.5 -right-2 flex h-4.5 w-4.5 items-center justify-center rounded-full border border-white text-[9px] font-extrabold text-white shadow-sm">
              {itemsInCart}
            </span>
          )}
        </div>
      </Link>

      {isAuthenticated ? (
        <UserModal showLabel={false} />
      ) : (
        <Link
          href="/auth/login"
          className="text-primary-600 hover:bg-primary-50 hover:text-primary-800 flex cursor-pointer items-center justify-center rounded-lg p-2 transition-colors"
          aria-label="Profile"
        >
          <Icon icon="user" className="h-[22px] w-[22px] fill-none stroke-current stroke-[2.3]" />
        </Link>
      )}
    </div>
  );
}
