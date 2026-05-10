'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Heart, ShoppingBasket } from 'lucide-react';
import { useAppSelector } from '@/lib/hooks';
import { cn } from '@/lib/utils';

import CurrencyRate from '../CurrencyRate';
import AuthButtons from './AuthButtons';
import Search from '../search';
import UserModal from '../modals/UserModal';
import Icon from '../assets/Icon';
import { Button } from '@/components/ui/button';

const Logo = ({ isB2b, isAuthenticated }: { isB2b: boolean; isAuthenticated: boolean }) => {
  return (
    <Link
      href={isB2b ? '/shop' : '/'}
      className={cn(
        'flex h-full shrink-0 items-center justify-center md:block',
        !isAuthenticated && 'w-[90px] md:w-[90px] lg:w-[120px] 2xl:w-[198px]',
      )}
    >
      <Image
        src={'/logo.png'}
        width={198}
        height={52}
        alt="Лого компанії INGCO"
        className="h-auto w-[90px] md:w-[90px] lg:w-[120px] 2xl:w-[198px]"
      />
    </Link>
  );
};

const SubHeader = () => {
  const { isB2b } = useAppSelector((state) => state.persistedAuthReducer);
  return (
    <nav className="flex items-center justify-between border-b border-orange-200 bg-gray-100 py-2">
      <ul className="flex items-center gap-2">
        <li className="transition-colors ease-out hover:text-orange-500">
          <Link href={isB2b ? '/shop' : '/'}>Магазин</Link>
        </li>
        <li className="transition-colors ease-out hover:text-orange-500">
          <Link href="/home#aboutBrand">Сервіс</Link>
        </li>
        <li className="transition-colors ease-out hover:text-orange-500">
          <Link href="/legal/returns#guarantee">Гарантія</Link>
        </li>
        <li className="transition-colors ease-out hover:text-orange-500">
          <Link href="/home#aboutUs">Про нас</Link>
        </li>
      </ul>

      <ul className="flex items-center gap-8">
        <li className="transition-colors ease-out hover:text-orange-500">
          <Link href="/home/contacts">Звʼязок</Link>
        </li>
        <li>
          <CurrencyRate />
        </li>
      </ul>
    </nav>
  );
};

const Header = () => {
  const pathname = usePathname();
  const { isAuthenticated, isB2b, user, localStorageCart } = useAppSelector(
    (state) => state.persistedAuthReducer,
  );

  const isShop = pathname.includes('shop');
  const itemsInCart = isShop ? user.cart.length : user.retailCart?.length;

  return (
    <header className="bg-gray-100 px-6">
      <SubHeader />
      <div className="flex min-w-0 items-center justify-between gap-2 overflow-hidden font-medium md:px-[60px] md:py-4 lg:tracking-tight">
        <Logo isB2b={isB2b} isAuthenticated={isAuthenticated} />

        <div className="flex items-center gap-4">
          <Button size={'lg'}>
            <LayoutGrid className="size-4" data-icon="inline-start" />
            Каталог
          </Button>
          <Search placeholder="Пошук" />
        </div>

        <div className="hidden items-center justify-between gap-5 md:flex lg:gap-10 xl:gap-20">
          {isAuthenticated ? (
            <div className="flex items-center justify-center gap-2">
              <UserModal />
              <Link
                href={`/${isShop ? 'shop' : 'retail'}/favorites`}
                className="transition-colors hover:text-blue-500"
              >
                <Heart className="size-4" />
                Обране
              </Link>
              <Link href={isShop ? '/shop/cart' : '/cart'} className="relative">
                <ShoppingBasket
                  className="size-4 after:absolute after:-right-1 after:-bottom-1 after:z-50 after:flex after:size-4 after:items-center after:justify-center after:rounded-full after:bg-orange-500 after:text-xs after:text-white after:content-[attr(data-count)]"
                  data-count={itemsInCart}
                />
                Кошик
              </Link>
            </div>
          ) : (
            <>
              <AuthButtons />
              <Link href={isShop ? '/shop/cart' : '/cart'} className="relative">
                <Icon
                  icon="cart"
                  className={cn(
                    'h-7 w-7 fill-current transition-colors ease-out hover:text-white',
                    (pathname === '/shop/cart' || pathname === '/cart') && 'text-white',
                  )}
                />
                {(isShop && user.cart.length) ||
                (!isShop && user.retailCart?.length) ||
                (!isAuthenticated && localStorageCart?.length) ? (
                  <div className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-xs leading-none">
                    {isShop
                      ? user.cart.length
                      : isAuthenticated
                        ? user.retailCart.length
                        : localStorageCart.length}
                  </div>
                ) : null}
              </Link>
            </>
          )}
        </div>

        <Link href="/auth/login" className="shrink-0 md:hidden">
          <Icon
            icon="user"
            className="h-9 w-9 fill-none stroke-current stroke-2 transition-colors ease-out hover:text-white"
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
