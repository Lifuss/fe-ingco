'use client';
import Modal from 'react-modal';
import { customModalStyles } from './CategoryModal';
import { SupportTicket, User } from '@/lib/types';
import { useAppDispatch } from '@/lib/hooks';
import { useEffect, useState } from 'react';
import { Button } from '../buttons/button';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import { updateSupportTicketThunk } from '@/lib/appState/dashboard/operations';

type SupportTicketModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  ticket: SupportTicket;
};

const modifiedStyles = {
  ...customModalStyles,
  content: {
    ...customModalStyles.content,
    width: '768px',
    overflow: 'auto',
    maxHeight: '95vh',
  },
};

const SupportTicketModal = ({
  isOpen,
  closeModal,
  ticket,
}: SupportTicketModalProps) => {
  const dispatch = useAppDispatch();
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket>(ticket);

  useEffect(() => {
    setSelectedTicket(ticket);
  }, [ticket]);
  if (!selectedTicket) return null;

  const {
    name,
    email,
    updatedAt,
    message,
    isAnswered,
    ticketNumber,
    _id,
    phone,
  } = selectedTicket;

  const handleButton = () => {
    dispatch(
      updateSupportTicketThunk({
        ticketId: _id,
        isAnswered: !isAnswered,
        ticketNumber,
      }),
    )
      .unwrap()
      .then(() => {
        toast.success(
          isAnswered
            ? 'Звернення витягнуто з архіву'
            : 'Звернення успішно виконано',
        );
        closeModal();
      })
      .catch((err) => {
        toast.error('Виникла помилка на сервері');
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={modifiedStyles}
      ariaHideApp={false}
    >
      <div onClick={closeModal} className="absolute right-2 top-2">
        <X size={24} absoluteStrokeWidth className="cursor-pointer" />
      </div>
      <h2 className="font-lg mb-5 font-medium">Звернення №{ticketNumber}</h2>
      <div className="mb-5 flex gap-5">
        <ul className="flex flex-col gap-2 font-medium">
          <li>Дата</li>
          <li>Ім&apos;я</li>
          <li>Email</li>
          <li>Ном. тел.</li>
          <li>Повідомлення</li>
        </ul>
        <ul className="flex flex-col gap-2">
          <li>{new Date(updatedAt).toLocaleDateString('uk-UA')}</li>
          <li>{name}</li>
          <li>{email}</li>
          <li>{phone}</li>
          <li>{message}</li>
        </ul>
      </div>
      <div>
        <Button className="text-white" onClick={handleButton}>
          {isAnswered ? 'Витягти з архіву' : 'Виконано (Архівувати)'}
        </Button>
      </div>
    </Modal>
  );
};

export default SupportTicketModal;
