'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Modal from 'react-modal';
import { useMediaQuery } from 'react-responsive';
import CurrencyRate from '../CurrencyRate';
import AuthButtons from './AuthButtons';
import { usePathname } from 'next/navigation';
import Search from '../search';
import { useAppSelector } from '@/lib/hooks';
import UserModal from '../modals/UserModal';
import Icon from '../assets/Icon';

const Header = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const isTablet = useMediaQuery({ query: '(min-width: 768px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });
  const pathname = usePathname();
  const { isAuthenticated, user, localStorageCart } = useAppSelector(
    (state) => state.persistedAuthReducer,
  );

  const openModal = () => {
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };

  const isShop = pathname.includes('shop');

  return (
    <header className="flex items-center justify-between gap-2 bg-orangeLight px-5 py-2 font-medium md:px-[60px] md:py-4 lg:tracking-tight">
      <Link
        href={isShop ? '/shop' : '/retail'}
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
      {pathname.includes('home') ? (
        <ul className="text-lg md:flex md:items-center md:gap-2 md:text-base lg:text-[20px] xl:gap-10 2xl:text-2xl">
          <li className="transition-colors ease-out hover:text-white">
            <Link href="/home#aboutUs">Про нас</Link>
          </li>
          <li className="transition-colors ease-out hover:text-white">
            <Link href="/home#aboutBrand">Бренд</Link>
          </li>
          {/* Перейшли з модально вікна до сторінки */}
          {/* <li className="transition-colors ease-out hover:text-white">
            <button
              onClick={openModal}
              className={clsx(
                'inline-flex items-baseline transition-colors ease-out hover:text-white',
                modalIsOpen && 'text-white',
              )}
            >
              Зв&apos;язатися
              <Icon
                icon="arrow"
                className={clsx(
                  'ml-1 h-2 w-4 transition-transform ease-out',
                  modalIsOpen && 'rotate-180',
                )}
              />
            </button>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              contentLabel="Example Modal"
              style={{
                overlay: {
                  backgroundColor: 'none',
                },
              }}
              className={
                'absolute left-[48%] top-[90px] h-fit w-fit rounded-lg bg-white p-3 shadow-lg md:left-[38%] md:top-[55px] lg:left-[35%] xl:left-[36%] xl:top-[47px] 2xl:left-[41%] 2xl:top-[60px]'
              }
            >
              <div className="flex flex-col gap-2 text-blue-500 2xl:text-xl">
                <Link className="hover:text-gray-700" href="tel:+380988392107">
                  +380 98-83-92-107
                </Link>
                <Link className="hover:text-gray-700" href="tel:+380964123628">
                  +380 96-41-23-628
                </Link>
              </div>
            </Modal>
          </li> */}
          <li className="flex">
            <Link href="/home/contacts">Контакти</Link>
          </li>
          <li className="flex">
            <Link
              href="/retail"
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
                {/* {pathname !== '/home' && (
                  <div className="flex items-center transition-colors ease-out hover:text-white">
                    <button
                      onClick={openModal}
                      className={clsx(
                        'inline-flex items-baseline text-lg transition-colors ease-out hover:text-white',
                        modalIsOpen && 'text-white',
                      )}
                    >
                      Зв&apos;язатися
                      <Icon
                        icon="arrow"
                        className={clsx(
                          'ml-1 h-2 w-4 transition-transform ease-out',
                          modalIsOpen && 'rotate-180',
                        )}
                      />
                    </button>
                    <Modal
                      isOpen={modalIsOpen}
                      onRequestClose={closeModal}
                      contentLabel="Example Modal"
                      style={{
                        overlay: {
                          backgroundColor: 'none',
                        },
                      }}
                      className={
                        'absolute left-[48%] top-[90px] h-fit w-fit rounded-lg bg-white p-3 shadow-lg md:left-[51%] md:top-[55px] xl:left-[77%] xl:top-[60px] 2xl:left-[78%] 2xl:top-[60px]'
                      }
                    >
                      <div className="flex flex-col gap-2 text-blue-500 2xl:text-xl">
                        <Link
                          className="hover:text-gray-700"
                          href="tel:+380988392107"
                        >
                          +380 98-83-92-107
                        </Link>
                        <Link
                          className="hover:text-gray-700"
                          href="tel:+380964123628"
                        >
                          +380 96-41-23-628
                        </Link>
                      </div>
                    </Modal>
                  </div>
                )} */}
              </div>
              <div className="flex items-center justify-center gap-2">
                <UserModal />
                <Link
                  href={isShop ? '/shop/cart' : '/retail/cart'}
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
              <Link
                href={isShop ? '/shop/cart' : '/retail/cart'}
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
