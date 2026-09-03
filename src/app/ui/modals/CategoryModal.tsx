'use client';
import { FormEvent, useState } from 'react';
import Modal from 'react-modal';
import CategoryForm from '../forms/CategoryForm';
import { useCreateCategoryMutation } from '@/lib/appState/api/categoriesApi';
import { toast } from 'react-toastify';

export const customModalStyles: Modal.Styles = {
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
    width: 'calc(100% - 32px)',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto',
    borderRadius: '16px',
    padding: '24px',
    border: 'none',
  },
};

export const CategoryModalCreate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [createCategory] = useCreateCategoryMutation();
  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const nameInput = form.elements.namedItem('name') as HTMLInputElement;
    const slugInput = form.elements.namedItem('slug') as HTMLInputElement;
    const seoKeywordsInput = form.elements.namedItem('seoKeywords') as HTMLInputElement;
    const parentIdSelect = form.elements.namedItem('parentId') as HTMLSelectElement;
    const showInMenuInput = form.elements.namedItem('showInMenu') as HTMLInputElement;

    if (nameInput) {
      const name = nameInput.value.trim();
      const slug = slugInput ? slugInput.value.trim() : '';
      const seoKeywords = seoKeywordsInput ? seoKeywordsInput.value.trim() : '';
      const parentId = parentIdSelect && parentIdSelect.value ? Number(parentIdSelect.value) : null;
      const showInMenu = showInMenuInput ? showInMenuInput.checked : true;

      createCategory({
        name,
        slug,
        seoKeywords,
        parentId,
        showInMenu,
      })
        .unwrap()
        .then(() => {
          toast.success('Категорію успішно створено');
          closeModal();
        })
        .catch((err) => {
          if (err?.status === 409 || err?.response?.status === 409) {
            toast.error('Категорія з такою назвою вже існує');
          } else {
            toast.error('Не вдалося створити категорію');
          }
        });
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
