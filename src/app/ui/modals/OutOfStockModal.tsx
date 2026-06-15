'use client';
import Modal from 'react-modal';
import React from 'react';
import { X, AlertCircle } from 'lucide-react';

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

interface OutOfStockModalProps {
  isOpen: boolean;
  closeModal: () => void;
  productName?: string;
  sku?: string;
}

const OutOfStockModal = ({ isOpen, closeModal, productName, sku }: OutOfStockModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customModalStyles}
      ariaHideApp={false}
    >
      <div className="relative flex flex-col items-center text-center font-sans">
        <button
          className="absolute -top-4 -right-4 text-gray-400 transition-colors hover:text-gray-600"
          onClick={closeModal}
          aria-label="Закрити"
        >
          <X size={20} />
        </button>

        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-500">
          <AlertCircle size={28} />
        </div>

        <h3 className="mb-2 text-xl font-bold text-gray-900">Товар очікується</h3>

        {productName && <p className="mb-1 text-sm font-semibold text-gray-700">{productName}</p>}
        {sku && <p className="mb-4 font-mono text-xs text-gray-400">SKU: {sku}</p>}

        <p className="mb-6 text-sm leading-relaxed text-gray-500">
          Наразі цього товару немає в наявності на складі. Ми очікуємо на найближчу поставку. Будь
          ласка, зверніться до нашої служби підтримки або відвідайте сторінку пізніше.
        </p>

        <button
          onClick={closeModal}
          className="bg-primary-500 hover:bg-primary-600 focus:ring-primary-500 w-full rounded-xl px-4 py-2.5 font-medium text-white shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
        >
          Зрозуміло
        </button>
      </div>
    </Modal>
  );
};

export default OutOfStockModal;
