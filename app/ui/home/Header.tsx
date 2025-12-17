'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useMediaQuery } from 'react-responsive';
import CurrencyRate from '../CurrencyRate';
import AuthButtons from './AuthButtons';
import { usePathname } from 'next/navigation';
import Search from '../search';
import { useAppSelector } from '@/lib/hooks';
import UserModal from '../modals/UserModal';
import Icon from '../assets/Icon';

const Header = () => {
  const isTablet = useMediaQuery({ query: '(min-width: 768px)' });
  const pathname = usePathname();
  const { isAuthenticated, user, localStorageCart } = useAppSelector(
    (state) => state.persistedAuthReducer,
  );

  const isShop = pathname.includes('shop');

  return (
    <header className="flex items-center justify-between gap-2 bg-orangeLight px-5 py-2 font-medium md:px-[60px] md:py-4 lg:tracking-tight">
      <Link
        href={isShop ? '/shop' : '/'}
        className={clsx(
          'flex h-full items-center justify-center md:block',
          !isAuthenticated &&
            'w-[110px] md:w-[90px] lg:w-[120px] 2xl:w-[198px]',
        )}
      >
        <Image
          src={'/logo.png'}
          width={198}
          height={52}
          alt="Лого компанії INGCO"
        />
      </Link>
      {pathname === '/' || pathname.includes('home') ? (
        <ul className="text-lg md:flex md:items-center md:gap-2 md:text-base lg:text-[20px] xl:gap-10 2xl:text-2xl">
          <li className="transition-colors ease-out hover:text-white">
            <Link href="/home#aboutUs">Про нас</Link>
          </li>
          <li className="transition-colors ease-out hover:text-white">
            <Link href="/home#aboutBrand">Бренд</Link>
          </li>
          <li className="flex">
            <Link href="/home/contacts">Контакти</Link>
          </li>
          <li className="flex">
            <Link
              href="/"
              className="border-r border-black pr-1 transition-colors ease-out hover:text-white"
            >
              Роздріб
            </Link>
            <Link
              className="pl-1 transition-colors ease-out hover:text-white"
              href="/shop"
            >
              Гуртом
            </Link>
          </li>
        </ul>
      ) : (
        <Search placeholder="Пошук" />
      )}
      {isTablet ? (
        <div className="flex items-center justify-between gap-5 lg:gap-10 xl:gap-20">
          {isAuthenticated ? (
            <>
              <div className="flex gap-10">
                <CurrencyRate />
              </div>
              <div className="flex items-center justify-center gap-2">
                <UserModal />
                <Link
                  href={isShop ? '/shop/cart' : '/cart'}
                  className="relative"
                >
                  <Icon
                    icon="cart"
                    className={clsx(
                      'h-7 w-7 fill-current transition-colors ease-out hover:text-white',
                      pathname === '/shop/cart' && 'text-white ',
                    )}
                  />
                  {(isShop && user.cart.length) ||
                  (!isShop && user.retailCart?.length) ? (
                    <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-xs leading-none">
                      {isShop ? user.cart.length : user.retailCart.length}
                    </div>
                  ) : null}
                </Link>
              </div>
            </>
          ) : (
            <>
              <CurrencyRate />
              <AuthButtons />
              <Link href={isShop ? '/shop/cart' : '/cart'} className="relative">
                <Icon
                  icon="cart"
                  className={clsx(
                    'h-7 w-7 fill-current transition-colors ease-out hover:text-white',
                    pathname === '/shop/cart' && 'text-white ',
                  )}
                />
                {(isShop && user.cart.length) ||
                (!isShop && user.retailCart?.length) ||
                (!isAuthenticated && localStorageCart?.length) ? (
                  <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-xs leading-none">
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
      ) : (
        <Link href="/auth/login">
          <Icon
            icon="user"
            className="h-9 w-9 fill-none stroke-current stroke-2 transition-colors ease-out hover:text-white"
          />
        </Link>
      )}
    </header>
  );
};

export default Header;
