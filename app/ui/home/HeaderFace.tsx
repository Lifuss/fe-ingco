'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import Modal from 'react-modal';

const HeaderFace = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };
  // TODO: implement actual links + responsive
  return (
    <header className="flex items-center justify-between bg-orangeLight px-5 py-2">
      <Image
        src={'/logo.png'}
        width={125}
        height={31}
        alt="Ingco company logo"
        className="mb-4 lg:mb-0"
      />
      <ul className="text-lg">
        <li>
          <a href="">Про нас</a>
        </li>
        <li>
          <a href="">Бренд</a>
        </li>
        <li>
          <button onClick={openModal} className="inline-flex items-baseline">
            Зв&apos;язатися
            <svg
              viewBox="0 0 16 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={clsx('ml-1 h-2 w-4', modalIsOpen && 'rotate-180')}
            >
              <path
                d="M1.3335 1.33325L8.00016 7.99992L14.6668 1.33325"
                stroke="#111827"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
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
              'absolute left-[48%] top-[90px] h-fit w-fit rounded-lg bg-white p-3'
            }
          >
            <div className="flex flex-col gap-2 text-blue-500 ">
              <a className="hover:text-gray-700" href="tel:+380988392107">
                +380 98-83-92-107
              </a>
              <a className="hover:text-gray-700" href="tel:+380964123628">
                +380 96-41-23-628
              </a>
            </div>
          </Modal>
        </li>
      </ul>
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-9 w-9"
      >
        <path
          d="M6 27C6 25.4087 6.63214 23.8826 7.75736 22.7574C8.88258 21.6321 10.4087 21 12 21H24C25.5913 21 27.1174 21.6321 28.2426 22.7574C29.3679 23.8826 30 25.4087 30 27C30 27.7956 29.6839 28.5587 29.1213 29.1213C28.5587 29.6839 27.7956 30 27 30H9C8.20435 30 7.44129 29.6839 6.87868 29.1213C6.31607 28.5587 6 27.7956 6 27Z"
          stroke="#111827"
          stroke-width="2"
          stroke-linejoin="round"
        />
        <path
          d="M18 15C20.4853 15 22.5 12.9853 22.5 10.5C22.5 8.01472 20.4853 6 18 6C15.5147 6 13.5 8.01472 13.5 10.5C13.5 12.9853 15.5147 15 18 15Z"
          stroke="#111827"
          stroke-width="2"
        />
      </svg>
    </header>
  );
};

export default HeaderFace;
