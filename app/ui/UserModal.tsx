'use client';
import Modal from 'react-modal';
import { avatarSVG } from './home/Header';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import Link from 'next/link';
import { logoutThunk } from '@/lib/appState/user/operation';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

const customModalStyles = {
  content: {
    width: '150px',
    left: 'auto',
    top: '70px',
    height: '170px',
    borderRadius: '8px',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
};
const customModalQuestionStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const User = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const user = useAppSelector((state) => state.persistedAuthReducer.user);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const openQuestionModal = () => setModalIsOpen(true);
  const closeQuestionModal = () => setModalIsOpen(false);

  const handleLogout = () => {
    dispatch(logoutThunk())
      .unwrap()
      .then(() => {
        router.push('/');
      });
  };

  return (
    <>
      <button
        className={clsx('relative', isOpen && 'text-white')}
        onClick={() => {
          openModal();
        }}
      >
        {avatarSVG}
        <div className="absolute bottom-0 h-[2px]  w-full bg-black max-sm:left-0 lg:right-[-3px] lg:top-0 lg:h-7 lg:w-[2px] lg:translate-y-[10%] 2xl:right-[-2px] 2xl:translate-y-[10%]"></div>
      </button>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={{
          ...customModalStyles,
          overlay: {
            backgroundColor: 'none',
          },
        }}
      >
        <div className="flex flex-col gap-2">
          <h3 className="text-left text-lg">{user.login}</h3>
          <Link
            href={'/shop/favorites'}
            className="relative pl-5 transition-colors hover:text-blue-500"
            onClick={closeModal}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-0 top-1 stroke-current"
            >
              <path
                d="M8.41398 13.8733C8.18732 13.9533 7.81398 13.9533 7.58732 13.8733C5.65398 13.2133 1.33398 10.46 1.33398 5.79334C1.33398 3.73334 2.99398 2.06667 5.04065 2.06667C6.25398 2.06667 7.32732 2.65334 8.00065 3.56001C8.67398 2.65334 9.75399 2.06667 10.9607 2.06667C13.0073 2.06667 14.6673 3.73334 14.6673 5.79334C14.6673 10.46 10.3473 13.2133 8.41398 13.8733Z"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Обране
          </Link>
          <Link
            href={'/shop/history'}
            className="relative pl-5 transition-colors hover:text-blue-500"
            onClick={closeModal}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-0 top-1 stroke-current"
            >
              <path
                d="M14.6673 6.66673V10.0001C14.6673 13.3334 13.334 14.6667 10.0007 14.6667H6.00065C2.66732 14.6667 1.33398 13.3334 1.33398 10.0001V6.00006C1.33398 2.66673 2.66732 1.3334 6.00065 1.3334H9.33398"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.6663 6.66673H11.9997C9.99967 6.66673 9.33301 6.00006 9.33301 4.00006V1.3334L14.6663 6.66673Z"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4.66699 8.66666H8.66699"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4.66699 11.3333H7.33366"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Історія
          </Link>
          <button
            onClick={openQuestionModal}
            className="relative pl-5 text-left transition-colors hover:text-blue-500"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-0 top-1 stroke-current"
            >
              <path
                d="M5.93359 5.03998C6.14026 2.63998 7.37359 1.65998 10.0736 1.65998H10.1603C13.1403 1.65998 14.3336 2.85331 14.3336 5.83331V10.18C14.3336 13.16 13.1403 14.3533 10.1603 14.3533H10.0736C7.39359 14.3533 6.16026 13.3866 5.94026 11.0266"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10.0007 7.99995H2.41406"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M3.90033 5.76662L1.66699 7.99996L3.90033 10.2333"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Вийти
          </button>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeQuestionModal}
          style={customModalQuestionStyles}
        >
          <p className="mb-4 w-fit text-xl">
            Ви точно бажаєте вийти зі свого профілю?
          </p>
          <div className="mx-auto flex w-fit gap-4">
            <button
              onClick={handleLogout}
              className="mx-auto w-20 rounded-lg bg-[#111827] px-4 py-4 text-lg text-white"
            >
              Так
            </button>
            <button
              onClick={closeQuestionModal}
              className="mx-auto w-20 rounded-lg bg-[#111827] px-4 py-4 text-lg text-white"
            >
              Ні
            </button>
          </div>
        </Modal>
      </Modal>
    </>
  );
};

export default User;
