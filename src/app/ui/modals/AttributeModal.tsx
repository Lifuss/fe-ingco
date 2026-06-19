'use client';

import { useState } from 'react';
import Modal from 'react-modal';
import AttributeForm from '../forms/AttributeForm';
import { toast } from 'react-toastify';
import { apiIngco } from '@/lib/appState/user/operation';
import { ProductAttribute } from '@/lib/types';
import { customModalStyles } from './CategoryModal';
import { Plus } from 'lucide-react';

interface AttributeModalCreateProps {
  onSuccess: () => void;
}

export const AttributeModalCreate = ({ onSuccess }: AttributeModalCreateProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSubmit = (data: {
    code: string;
    name: string;
    unit?: string;
    options?: string[];
  }) => {
    apiIngco.post('/attributes', data)
      .then(() => {
        toast.success(`Характеристику "${data.name}" успішно створено`);
        closeModal();
        onSuccess();
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Помилка створення характеристики';
        toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
      });
  };

  return (
    <>
      <button
        className="rounded-xl bg-blue-400 p-3.5 text-sm font-bold text-white transition-colors hover:bg-blue-700 cursor-pointer flex items-center gap-1.5 shadow-md shadow-blue-400/10"
        onClick={() => openModal()}
      >
        <Plus size={16} />
        <span>Створити нову характеристику</span>
      </button>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
        ariaHideApp={false}
      >
        <AttributeForm handleSubmit={handleSubmit} />
      </Modal>
    </>
  );
};

interface AttributeModalEditProps {
  isOpen: boolean;
  closeModal: () => void;
  defaultValue: ProductAttribute | null;
  onSuccess: () => void;
}

export const AttributeModalEdit = ({
  isOpen,
  closeModal,
  defaultValue,
  onSuccess,
}: AttributeModalEditProps) => {
  const handleSubmit = (data: {
    code: string;
    name: string;
    unit?: string;
    options?: string[];
  }) => {
    if (!defaultValue?.id) return;
    apiIngco.patch(`/attributes/${defaultValue.id}`, data)
      .then(() => {
        toast.success(`Характеристику "${data.name}" оновлено`);
        closeModal();
        onSuccess();
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Помилка оновлення характеристики';
        toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customModalStyles}
      ariaHideApp={false}
    >
      <AttributeForm handleSubmit={handleSubmit} defaultValue={defaultValue || undefined} />
    </Modal>
  );
};
