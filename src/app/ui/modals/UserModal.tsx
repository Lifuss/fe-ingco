'use client';

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import Link from 'next/link';
import { logoutThunk } from '@/lib/appState/user/operation';
import { useRouter, usePathname } from 'next/navigation';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import Icon from '../assets/Icon';
import { FileClock, LogOut, Table } from 'lucide-react';

const User = ({ showLabel = true }: { showLabel?: boolean }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const user = useAppSelector((state) => state.persistedAuthReducer.user);

  // Close dropdown when pathname changes
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeModal = () => setIsOpen(false);

  const openQuestionModal = () => {
    setModalIsOpen(true);
    closeModal();
  };
  const closeQuestionModal = () => setModalIsOpen(false);

  const handleLogout = () => {
    dispatch(logoutThunk())
      .unwrap()
      .then(() => {
        toast.success('Ви успішно вийшли з профілю');
        router.push('/');
      })
      .finally(() => {
        closeQuestionModal();
      });
  };

  // Block body scroll when logout question modal is open
  useEffect(() => {
    if (modalIsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalIsOpen]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Profile Trigger Button */}
      <button
        onClick={toggleDropdown}
        className={clsx(
          isOpen ? 'text-primary-500' : 'hover:text-primary-500 text-neutral-500',
          showLabel
            ? 'flex cursor-pointer flex-col items-center justify-center gap-1 font-sans text-[11px] font-bold tracking-wide outline-none select-none'
            : 'hover:bg-primary-50 flex cursor-pointer items-center justify-center rounded-lg p-2 transition-colors',
        )}
      >
        <Icon
          icon="user"
          className="h-[22px] w-[22px] fill-none stroke-current stroke-[2.3] transition-colors"
        />
        {showLabel && <span>Профіль</span>}
      </button>

      {/* Profile Dropdown Menu */}
      {isOpen && (
        <>
          {/* Click-outside backdrop overlay (transparent) */}
          <div className="fixed inset-0 z-40 cursor-default bg-transparent" onClick={closeModal} />

          {/* Dropdown container */}
          <div className="animate-fade-in absolute top-full right-0 z-50 mt-2 flex w-[180px] flex-col gap-2.5 rounded-xl border border-[#E5E3DD]/75 bg-white p-3.5 font-sans shadow-lg select-none">
            {/* User name header */}
            <h3 className="truncate border-b border-neutral-100 px-1 pb-1.5 text-left text-sm font-bold text-neutral-800">
              {user?.login}
            </h3>

            {/* Menu Links */}
            <Link
              href="/history"
              className="hover:text-primary-500 flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:bg-neutral-50"
            >
              <FileClock size={15} className="text-neutral-500" />
              <span>Історія</span>
            </Link>

            {user?.role === 'admin' && (
              <Link
                href="/dashboard"
                className="hover:text-primary-500 flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:bg-neutral-50"
              >
                <Table size={15} className="text-neutral-500" />
                <span>Адмін</span>
              </Link>
            )}

            <button
              onClick={openQuestionModal}
              className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-semibold text-neutral-600 transition-colors hover:bg-rose-50/50 hover:text-rose-600"
            >
              <LogOut size={15} className="text-neutral-500" />
              <span>Вийти</span>
            </button>
          </div>
        </>
      )}

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeQuestionModal}
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: 'rgba(15, 15, 14, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          content: {
            position: 'relative',
            inset: 'auto',
            width: '90%',
            maxWidth: '420px',
            backgroundColor: '#FFFDFB',
            border: '1px solid #E5E3DD',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            overflow: 'hidden',
          },
        }}
      >
        <div className="flex flex-col gap-6 text-center font-sans select-none">
          <div className="flex flex-col gap-2">
            <h3 className="font-display text-lg leading-tight font-bold text-neutral-900">
              Вихід з профілю
            </h3>
            <p className="text-sm font-medium text-neutral-500">
              Ви точно бажаєте вийти зі свого профілю?
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleLogout}
              className="bg-primary-500 hover:bg-primary-600 active:bg-primary-700 font-display cursor-pointer rounded-xl px-5 py-2 text-xs font-bold tracking-wider text-white uppercase shadow-md shadow-orange-500/10 transition-colors"
            >
              Так, вийти
            </button>
            <button
              onClick={closeQuestionModal}
              className="font-display cursor-pointer rounded-xl border border-neutral-300 bg-white px-5 py-2 text-xs font-bold tracking-wider text-neutral-700 uppercase transition-colors hover:border-neutral-500"
            >
              Скасувати
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default User;
