'use client';
import { FormEvent, useState } from 'react';
import Modal from 'react-modal';
import CategoryForm from '../forms/CategoryForm';
import { useAppDispatch } from '@/lib/hooks';
import { createCategoryThunk } from '@/lib/appState/main/operations';
import { toast } from 'react-toastify';

export const customModalStyles = {
  overlay: {
    backgroundColor: 'rgba(15, 15, 14, 0.6)',
    backdropFilter: 'blur(4px)',
    zIndex: 9999,
  },
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
  const [attributeIds, setAttributeIds] = useState<number[]>([]);
  const dispatch = useAppDispatch();
  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setAttributeIds([]);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const nameInput = form.elements.namedItem('name') as HTMLInputElement;
    const parentIdSelect = form.elements.namedItem('parentId') as HTMLSelectElement;
    const showInMenuInput = form.elements.namedItem('showInMenu') as HTMLInputElement;

    if (nameInput) {
      const name = nameInput.value.trim();
      const parentId = parentIdSelect && parentIdSelect.value ? Number(parentIdSelect.value) : null;
      const showInMenu = showInMenuInput ? showInMenuInput.checked : true;

      dispatch(createCategoryThunk({ name, parentId, showInMenu, attributeIds }))
        .unwrap()
        .then(() => closeModal())
        .catch(
          (err) =>
            (err?.status === 409 || err?.response?.status === 409) &&
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
        <CategoryForm
          handleSubmit={handleSubmit}
          selectedAttributeIds={attributeIds}
          setSelectedAttributeIds={setAttributeIds}
        />
      </Modal>
    </>
  );
};
