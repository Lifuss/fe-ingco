'use client';
import { FormEvent, useState } from 'react';
import Modal from 'react-modal';
import CategoryForm from '../forms/CategoryForm';
import { useAppDispatch } from '@/lib/hooks';
import { createCategoryThunk } from '@/lib/appState/main/operations';
import { toast } from 'react-toastify';

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
    const form = e.currentTarget as HTMLFormElement;
    const nameInput = form.elements.namedItem('name') as HTMLInputElement;
    const renderSortInput = form.elements.namedItem(
      'renderSort',
    ) as HTMLInputElement;

    if (nameInput && renderSortInput) {
      const name = nameInput.value.trim();
      const renderSort = Number(renderSortInput.value.trim());

      dispatch(createCategoryThunk({ name, renderSort }))
        .unwrap()
        .then(() => closeModal())
        .catch(
          (err) =>
            err.response.status === 409 &&
            toast.error('Категорія з такою назвою вже існує'),
        );
    }
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
