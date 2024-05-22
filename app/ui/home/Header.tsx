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
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import UserModal from '../UserModal';

export const avatarSVG = (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-9 w-9"
  >
    <path
      d="M6 27C6 25.4087 6.63214 23.8826 7.75736 22.7574C8.88258 21.6321 10.4087 21 12 21H24C25.5913 21 27.1174 21.6321 28.2426 22.7574C29.3679 23.8826 30 25.4087 30 27C30 27.7956 29.6839 28.5587 29.1213 29.1213C28.5587 29.6839 27.7956 30 27 30H9C8.20435 30 7.44129 29.6839 6.87868 29.1213C6.31607 28.5587 6 27.7956 6 27Z"
      stroke="#111827"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M18 15C20.4853 15 22.5 12.9853 22.5 10.5C22.5 8.01472 20.4853 6 18 6C15.5147 6 13.5 8.01472 13.5 10.5C13.5 12.9853 15.5147 15 18 15Z"
      stroke="#111827"
      strokeWidth="2"
    />
  </svg>
);

const Header = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const isTablet = useMediaQuery({ query: '(min-width: 768px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector(
    (state) => state.persistedAuthReducer,
  );

  const openModal = () => {
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };
  // TODO: low prior - зробити меню бургер для мобільної верстки

  return (
    <header className="flex items-center justify-between bg-orangeLight px-5 py-2 font-medium md:px-[60px] md:py-4 lg:tracking-tight">
      <Link href="/shop" className="h-[31px] lg:h-[52px]">
        <Image
          src={'/logo.png'}
          width={isDesktop ? 198 : 125}
          height={isDesktop ? 52 : 31}
          alt="Ingco company logo"
          className="mb-4 inline-flex lg:mb-0"
        />
      </Link>
      {pathname === '/' ? (
        <ul className="text-lg md:flex md:gap-6 lg:text-[20px] xl:gap-10 2xl:text-2xl">
          <li className="transition-colors ease-out hover:text-white">
            <Link href="/#aboutUs">Про нас</Link>
          </li>
          <li className="transition-colors ease-out hover:text-white">
            <Link href="/#aboutBrand">Бренд</Link>
          </li>
          <li className="transition-colors ease-out hover:text-white">
            <button
              onClick={openModal}
              className={clsx(
                'inline-flex items-baseline transition-colors ease-out hover:text-white',
                modalIsOpen && 'text-white',
              )}
            >
              Зв&apos;язатися
              <svg
                viewBox="0 0 16 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={clsx(
                  'ml-1 h-2 w-4 transition-transform ease-out',
                  modalIsOpen && 'rotate-180',
                )}
              >
                <path
                  d="M1.3335 1.33325L8.00016 7.99992L14.6668 1.33325"
                  stroke="#111827"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
                'absolute left-[48%] top-[90px] h-fit w-fit rounded-lg bg-white p-3 shadow-lg md:left-[51%] md:top-[55px] xl:left-[46%] xl:top-[70px] 2xl:left-[47%] 2xl:top-[60px]'
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
                <div className="transition-colors ease-out hover:text-white">
                  <button
                    onClick={openModal}
                    className={clsx(
                      'inline-flex items-baseline text-lg transition-colors ease-out hover:text-white',
                      modalIsOpen && 'text-white',
                    )}
                  >
                    Зв&apos;язатися
                    <svg
                      viewBox="0 0 16 9"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={clsx(
                        'ml-1 h-2 w-4 transition-transform ease-out',
                        modalIsOpen && 'rotate-180',
                      )}
                    >
                      <path
                        d="M1.3335 1.33325L8.00016 7.99992L14.6668 1.33325"
                        stroke="#111827"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
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
              </div>
              <div className="flex items-center justify-center gap-2">
                <UserModal />
                <Link href={'/shop/cart'} className="relative">
                  <svg
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                  >
                    <g clipPath="url(#clip0_986_725)">
                      <path
                        d="M35.7068 9.98441C35.6036 9.83786 35.4667 9.71824 35.3077 9.63563C35.1486 9.55303 34.972 9.50985 34.7928 9.50973H10.9169L9.1096 3.27723C8.40085 0.823043 6.71669 0.558105 6.02594 0.558105H1.207C0.589344 0.558105 0.0898438 1.05817 0.0898438 1.67523C0.0898438 2.29229 0.589906 2.79232 1.20697 2.79232H6.02534C6.17778 2.79232 6.64297 2.79232 6.96025 3.88863L13.1776 26.7379C13.3126 27.22 13.7519 27.553 14.253 27.553H29.4394C29.9108 27.553 30.3315 27.2577 30.4908 26.8138L35.8435 11.0048C35.9667 10.6622 35.9155 10.2808 35.7068 9.98441H35.7068ZM28.6532 25.3194H15.101L11.5448 11.7445H33.2045L28.6532 25.3194ZM26.4376 29.8171C24.884 29.8171 23.6251 31.076 23.6251 32.6296C23.6251 34.1832 24.884 35.4421 26.4376 35.4421C27.9912 35.4421 29.2501 34.1832 29.2501 32.6296C29.2501 31.076 27.9912 29.8171 26.4376 29.8171ZM16.3126 29.8171C14.759 29.8171 13.5001 31.076 13.5001 32.6296C13.5001 34.1832 14.759 35.4421 16.3126 35.4421C17.8662 35.4421 19.1251 34.1832 19.1251 32.6296C19.1251 31.076 17.8662 29.8171 16.3126 29.8171Z"
                        fill="#111827"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_986_725">
                        <rect width="36" height="36" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  {user.cart.length ? (
                    <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-xs leading-none">
                      {user.cart.length}
                    </div>
                  ) : null}
                </Link>
              </div>
            </>
          ) : (
            <>
              <CurrencyRate />
              <AuthButtons />
            </>
          )}
        </div>
      ) : (
        <Link href="/login">{avatarSVG}</Link>
      )}
    </header>
  );
};

export default Header;
