'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Modal from 'react-modal';
import { useMediaQuery } from 'react-responsive';
import CurrencyRate from '../CurrencyRate';
import AuthButtons from './AuthButtons';

const HeaderFace = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const isTablet = useMediaQuery({ query: '(min-width: 768px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

  const openModal = () => {
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };
  // TODO: low prior - зробити меню бургер для мобільної верстки
  return (
    <header className="flex items-center justify-between bg-orangeLight px-5 py-2 font-medium md:px-[60px] md:py-4 lg:tracking-tight">
      <Link href="/" className="h-[31px] lg:h-[52px]">
        <Image
          src={'/logo.png'}
          width={isDesktop ? 198 : 125}
          height={isDesktop ? 52 : 31}
          alt="Ingco company logo"
          className="mb-4 inline-flex lg:mb-0"
        />
      </Link>
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
      {isTablet ? (
        <div className="flex items-center justify-between gap-5 lg:gap-10 xl:gap-20">
          <CurrencyRate />
          <AuthButtons />
        </div>
      ) : (
        <Link href="/login">
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
        </Link>
      )}
    </header>
  );
};

export default HeaderFace;
