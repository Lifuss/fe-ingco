'use client';

import React from 'react';
import Modal from 'react-modal';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Button } from '../buttons/button';

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Підтвердити',
  cancelText = 'Скасувати',
  type = 'warning',
}: ConfirmModalProps) {
  const iconMap = {
    danger: <AlertCircle className="h-6 w-6 text-red-500" />,
    warning: <AlertTriangle className="h-6 w-6 text-amber-500" />,
    info: <Info className="h-6 w-6 text-blue-500" />,
  };

  const buttonClassMap = {
    danger: 'bg-red-500 hover:bg-red-600 active:bg-red-700 focus:bg-red-600',
    warning: 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 focus:bg-primary-600',
    info: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:bg-blue-600',
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
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
          width: '95%',
          maxWidth: '440px',
          backgroundColor: '#FFFDFB',
          border: '1px solid #E5E3DD',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          overflow: 'hidden',
        },
      }}
    >
      <div className="flex flex-col gap-5 font-sans select-none">
        {/* Header / Icon */}
        <div className="flex items-start gap-4">
          <div className="flex shrink-0 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 p-2.5">
            {iconMap[type]}
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="font-display text-lg leading-tight font-bold text-neutral-900">
              {title}
            </h3>
            <p className="text-sm leading-relaxed font-medium text-neutral-500">{message}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-2 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="font-display cursor-pointer rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-xs font-bold tracking-wider text-neutral-700 uppercase transition-colors hover:border-neutral-500"
          >
            {cancelText}
          </button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`${buttonClassMap[type]} font-display cursor-pointer rounded-xl px-5 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-colors`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
