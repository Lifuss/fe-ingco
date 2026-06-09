'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, ShoppingBasket } from 'lucide-react';
import { useAppSelector } from '@/lib/hooks';
import UserModal from '~/ui/modals/UserModal';
import Icon from '~/ui/assets/Icon';

export default function MobileActions() {
  const pathname = usePathname();
  const { isAuthenticated, user, localStorageCart } = useAppSelector(
    (state) => state.persistedAuthReducer,
  );

  const isShop = pathname.includes('shop');

  // Calculate items in cart based on auth status and B2B vs B2C
  const itemsInCart = isShop
    ? user?.cart?.length || 0
    : isAuthenticated
      ? user?.retailCart?.length || 0
      : localStorageCart?.length || 0;

  return (
    <div className="flex lg:hidden items-center gap-2">
      <Link
        href={isShop ? '/shop/favorites' : '/favorites'}
        className="flex items-center justify-center p-2 rounded-lg text-primary-600 hover:bg-primary-50 hover:text-primary-800 transition-colors cursor-pointer"
        aria-label="Favorites"
      >
        <Heart size={22} className="stroke-current stroke-[2.3] fill-none" />
      </Link>

      <Link
        href={isShop ? '/shop/cart' : '/cart'}
        className="relative flex items-center justify-center p-2 rounded-lg text-primary-600 hover:bg-primary-50 hover:text-primary-800 transition-colors cursor-pointer"
        aria-label="Cart"
      >
        <div className="relative">
          <ShoppingBasket size={22} className="stroke-current stroke-[2.3] fill-none" />
          {itemsInCart > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-primary-800 text-white text-[9px] font-extrabold rounded-full w-4.5 h-4.5 flex items-center justify-center border border-white shadow-sm">
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
          className="flex items-center justify-center p-2 rounded-lg text-primary-600 hover:bg-primary-50 hover:text-primary-800 transition-colors cursor-pointer"
          aria-label="Profile"
        >
          <Icon
            icon="user"
            className="h-[22px] w-[22px] fill-none stroke-current stroke-[2.3]"
          />
        </Link>
      )}
    </div>
  );
}
