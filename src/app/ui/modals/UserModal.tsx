'use client';

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import Link from 'next/link';
import { logoutThunk } from '@/lib/appState/user/operation';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import Icon from '../assets/Icon';
import { FileClock, LogOut, Table } from 'lucide-react';

const User = ({ showLabel = true }: { showLabel?: boolean }) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  
  const [isOpen, setIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const user = useAppSelector((state) => state.persistedAuthReducer.user);

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

  const pathVariants = pathname.includes('/shop') ? 'shop' : 'retail';

  return (
    <div className="relative flex items-center justify-center">
      {/* Profile Trigger Button */}
      <button
        onClick={toggleDropdown}
        className={clsx(
          isOpen ? 'text-primary-500' : 'text-neutral-500 hover:text-primary-500',
          showLabel
            ? 'flex flex-col items-center justify-center gap-1 font-sans text-[11px] font-bold tracking-wide cursor-pointer outline-none select-none'
            : 'flex items-center justify-center p-2 rounded-lg transition-colors cursor-pointer hover:bg-primary-50'
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
          <div
            className="fixed inset-0 z-40 cursor-default bg-transparent"
            onClick={closeModal}
          />
          
          {/* Dropdown container */}
          <div className="absolute right-0 top-full mt-2 w-[180px] bg-white border border-[#E5E3DD]/75 rounded-xl shadow-lg p-3.5 z-50 flex flex-col gap-2.5 font-sans select-none animate-fade-in">
            {/* User name header */}
            <h3 className="text-left text-sm font-bold text-neutral-800 border-b border-neutral-100 pb-1.5 px-1 truncate">
              {user?.login}
            </h3>

            {/* Menu Links */}
            <Link
              href={`/${pathVariants}/history`}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-neutral-600 hover:text-primary-500 hover:bg-neutral-50 transition-colors text-xs font-semibold"
              onClick={closeModal}
            >
              <FileClock size={15} className="text-neutral-500" />
              <span>Історія</span>
            </Link>

            {user?.role === 'admin' && (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-neutral-600 hover:text-primary-500 hover:bg-neutral-50 transition-colors text-xs font-semibold"
                onClick={closeModal}
              >
                <Table size={15} className="text-neutral-500" />
                <span>Адмін</span>
              </Link>
            )}

            <button
              onClick={openQuestionModal}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-neutral-600 hover:text-rose-600 hover:bg-rose-50/50 transition-colors cursor-pointer text-xs font-semibold"
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
        <div className="flex flex-col gap-6 text-center select-none font-sans">
          <div className="flex flex-col gap-2">
            <h3 className="font-display font-bold text-lg text-neutral-900 leading-tight">
              Вихід з профілю
            </h3>
            <p className="text-neutral-500 text-sm font-medium">
              Ви точно бажаєте вийти зі свого профілю?
            </p>
          </div>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-display font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md shadow-orange-500/10"
            >
              Так, вийти
            </button>
            <button
              onClick={closeQuestionModal}
              className="px-5 py-2 rounded-xl border border-neutral-300 hover:border-neutral-500 text-neutral-700 font-display font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer bg-white"
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
