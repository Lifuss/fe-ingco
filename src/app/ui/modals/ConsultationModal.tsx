'use client';

import React, { useState } from 'react';
import Modal from 'react-modal';
import { X, Phone, CheckCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/lib/hooks';
import { supportTicketThunk } from '@/lib/appState/main/operations';
import { customModalStyles } from './CategoryModal';

type ConsultationModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  productName: string;
  productArticle?: string;
};

const modifiedModalStyles = {
  overlay: {
    backgroundColor: 'rgba(15, 15, 14, 0.60)',
    zIndex: 9999,
  },
  content: {
    ...customModalStyles.content,
    width: '90%',
    maxWidth: '500px',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid #E5E3DD',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    overflow: 'visible',
  },
};

export default function ConsultationModal({
  isOpen,
  closeModal,
  productName,
  productArticle,
}: ConsultationModalProps) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAfterOpen = () => {
    setName('');
    setPhone('');
    const articleText = productArticle ? ` (Артикул: ${productArticle})` : '';
    setMessage(`Цікавить консультація щодо товару: ${productName}${articleText}`);
    setIsSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone || phone.trim().length < 9) {
      toast.error('Будь ласка, введіть коректний номер телефону (9 цифр)');
      return;
    }

    setIsSubmitting(true);

    dispatch(
      supportTicketThunk({
        name: name.trim() || 'Клієнт',
        email: 'consultation@ingco.ua',
        message: message.trim(),
        phone: `+380${phone}`,
      })
    )
      .unwrap()
      .then(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        toast.success('Заявку успішно надіслано! Спеціаліст зв’яжеться з вами.');
        setTimeout(() => {
          closeModal();
        }, 3000);
      })
      .catch(() => {
        setIsSubmitting(false);
        toast.error('Виникла помилка. Спробуйте пізніше.');
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onAfterOpen={handleAfterOpen}
      onRequestClose={closeModal}
      style={modifiedModalStyles}
      ariaHideApp={false}
    >
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
        aria-label="Закрити модальне вікно"
      >
        <X size={20} />
      </button>

      {isSubmitted ? (
        <div className="flex flex-col items-center justify-center text-center py-8 gap-4">
          <div className="w-16 h-16 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-green-600">
            <CheckCircle size={36} />
          </div>
          <h3 className="font-display font-bold text-xl text-neutral-900">Заявку прийнято!</h3>
          <p className="font-sans text-neutral-600 text-sm leading-relaxed max-w-xs">
            Наш спеціаліст зателефонує вам найближчим часом. Дякуємо за вибір INGCO!
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-primary-50 text-primary-500">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-neutral-900 leading-tight">
                Консультація спеціаліста
              </h3>
              <p className="text-xs text-neutral-500">Допоможемо з вибором та характеристиками</p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="modal-name-input" className="font-sans text-xs text-neutral-500 font-medium ml-1">
              Ваше ім’я
            </label>
            <input
              id="modal-name-input"
              type="text"
              placeholder="Введіть ваше ім’я"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="font-sans text-sm bg-neutral-50 border border-neutral-200 focus:border-primary-500 focus:bg-white rounded-md px-3.5 py-2 text-neutral-900 placeholder-neutral-400 outline-none transition-all focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="modal-phone-input" className="font-sans text-xs text-neutral-500 font-medium ml-1">
              Номер телефону *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-sans text-sm text-neutral-500 select-none">
                +380
              </span>
              <input
                id="modal-phone-input"
                type="tel"
                placeholder="93 123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                required
                className="w-full font-sans text-sm bg-neutral-50 border border-neutral-200 focus:border-primary-500 focus:bg-white rounded-md pl-14 pr-3.5 py-2 text-neutral-900 placeholder-neutral-400 outline-none transition-all focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="modal-message-input" className="font-sans text-xs text-neutral-500 font-medium ml-1">
              Повідомлення
            </label>
            <textarea
              id="modal-message-input"
              rows={3}
              placeholder="Ваш запит..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="font-sans text-sm bg-neutral-50 border border-neutral-200 focus:border-primary-500 focus:bg-white rounded-md px-3.5 py-2 text-neutral-900 placeholder-neutral-400 outline-none transition-all focus:ring-1 focus:ring-primary-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group w-full font-display font-semibold text-sm bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white rounded-md py-2.5 mt-2 transition-all duration-300 shadow-md shadow-primary-500/10 hover:shadow-primary-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed select-none"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Надсилання...</span>
              </>
            ) : (
              <>
                <Phone size={16} fill="currentColor" />
                <span>Замовити консультацію</span>
              </>
            )}
          </button>
        </form>
      )}
    </Modal>
  );
}
