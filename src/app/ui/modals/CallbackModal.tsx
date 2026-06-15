'use client';
import Modal from 'react-modal';
import React, { useState } from 'react';
import { X, PhoneCall } from 'lucide-react';
import { toast } from 'react-toastify';

const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '1rem',
    border: 'none',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    padding: '2rem',
    maxWidth: '450px',
    width: '90%',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
};

interface CallbackModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const CallbackModal = ({ isOpen, closeModal }: CallbackModalProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Будь ласка, заповніть усі обов'язкові поля");
      return;
    }

    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      toast.success("Запит надіслано! Менеджер зв'яжеться з вами найближчим часом.");
      setName('');
      setPhone('');
      setIsSubmitting(false);
      closeModal();
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customModalStyles}
      ariaHideApp={false}
    >
      <div className="relative flex flex-col font-sans">
        <button
          className="absolute -top-4 -right-4 text-gray-400 transition-colors hover:text-gray-600"
          onClick={closeModal}
          aria-label="Закрити"
        >
          <X size={20} />
        </button>

        <div className="mb-4 flex h-12 w-12 items-center justify-center self-center rounded-full bg-blue-100 text-blue-500">
          <PhoneCall size={24} />
        </div>

        <h3 className="mb-2 text-center text-xl font-bold text-gray-900">Зворотний зв&apos;язок</h3>
        <p className="mb-6 text-center text-sm leading-relaxed text-gray-500">
          Залиште ваші контакти, і ваш персональний менеджер передзвонить вам для узгодження оптових
          цін та умов.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase">
              Ваше ім&apos;я *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="focus:border-primary-500 w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none"
              placeholder="Іван Іванов"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase">
              Номер телефону *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="focus:border-primary-500 w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none"
              placeholder="+380"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary-500 hover:bg-primary-600 mt-2 w-full rounded-xl px-4 py-2.5 font-medium text-white shadow-sm transition-colors focus:outline-none disabled:bg-gray-400"
          >
            {isSubmitting ? 'Надсилання...' : 'Замовити дзвінок'}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default CallbackModal;
