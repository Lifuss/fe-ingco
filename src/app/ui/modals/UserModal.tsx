'use client';
import Modal from 'react-modal';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import Link from 'next/link';
import { logoutThunk } from '@/lib/appState/user/operation';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import Icon from '../assets/Icon';
import { FileClock, LogOut, Table } from 'lucide-react';

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
  const pathname = usePathname();
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
        toast.success('Ви успішно вийшли з профілю 😭');
        router.push('/');
      });
  };

  const pathVariants = pathname.includes('/shop') ? 'shop' : 'retail';

  return (
    <>
      <button
        className={clsx('relative', isOpen && 'text-white')}
        onClick={() => {
          openModal();
        }}
      >
        <Icon
          icon="user"
          className="h-9 w-9 fill-none stroke-current stroke-2 transition-colors ease-out hover:text-white"
        />
        <div className="absolute bottom-0 h-[2px] w-full bg-black max-sm:left-0 md:top-0 md:right-[-3px] md:h-7 md:w-[2px] md:translate-y-[10%] 2xl:right-[-2px] 2xl:translate-y-[10%]"></div>
      </button>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={{
          content: {
            ...customModalStyles.content,
            height: user.role === 'admin' ? '21%' : '170px',
          },
          overlay: {
            backgroundColor: 'none',
          },
        }}
      >
        <div className="flex flex-col gap-2">
          <h3 className="text-left text-lg">{user.login}</h3>
          <Link
            href={`/${pathVariants}/favorites`}
            className="relative pl-5 transition-colors hover:text-blue-500"
            onClick={closeModal}
          >
            <Icon
              icon="heart"
              className="absolute top-1 left-0 h-[18px] w-[18px] fill-inherit stroke-current stroke-2"
            />
            Обране
          </Link>
          <Link
            href={`/${pathVariants}/history`}
            className="relative pl-5 transition-colors hover:text-blue-500"
            onClick={closeModal}
          >
            <FileClock size={16} className="absolute top-1 left-0" />
            Історія
          </Link>
          {user.role === 'admin' && (
            <Link
              href={'/dashboard'}
              className="relative pl-5 transition-colors hover:text-blue-500"
            >
              <Table size={16} className="absolute top-1 left-0" />
              Адмін
            </Link>
          )}
          <button
            onClick={openQuestionModal}
            className="relative pl-5 text-left transition-colors hover:text-blue-500"
          >
            <LogOut size={16} className="absolute top-1 left-0" />
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
