'use client';
import { FormEvent, useState } from 'react';
import Modal from 'react-modal';
import CategoryForm from '../forms/CategoryForm';
import { useAppDispatch } from '@/lib/hooks';
import { createCategoryThunk } from '@/lib/appState/main/operations';

export const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export const CategoryModalCreate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputElement = e.currentTarget[0] as HTMLInputElement;
    dispatch(createCategoryThunk(inputElement.value as string))
      .unwrap()
      .then(() => closeModal())
      .catch((err) => alert(err.message));
  };
  return (
    <>
      <button
        className="rounded-xl bg-blue-400 p-4 text-lg text-white transition-colors hover:bg-blue-700"
        onClick={() => openModal()}
      >
        Створити нову категорію
      </button>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
        ariaHideApp={false}
      >
        <CategoryForm handleSubmit={handleSubmit} />
      </Modal>
    </>
  );
};
