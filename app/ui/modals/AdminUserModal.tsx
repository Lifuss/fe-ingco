'use client';
import Modal from 'react-modal';
import { customModalStyles } from './CategoryModal';
import { User } from '@/lib/types';
import { useAppDispatch } from '@/lib/hooks';
import { useEffect, useState } from 'react';
import { Button } from '../buttons/button';
import {
  deleteUserThunk,
  restoreUserThunk,
  updateUserThunk,
} from '@/lib/appState/dashboard/operations';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

type AdminUserModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  user: User;
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

const AdminUserModal = ({ isOpen, closeModal, user }: AdminUserModalProps) => {
  const dispatch = useAppDispatch();
  const [selectedUser, setSelectedUser] = useState<User>(user);

  useEffect(() => {
    setSelectedUser(user);
  }, [user]);
  if (!selectedUser) return null;

  const {
    email,
    login,
    firstName,
    lastName,
    surName,
    phone,
    edrpou,
    address,
    orders,
    isVerified,
    updatedAt,
  } = selectedUser;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const normalizeUser = {
      ...selectedUser,
      isVerified: form.isVerified.checked,
    };
    const { token, createdAt, updatedAt, resetToken, ...userValidate } =
      normalizeUser;

    if (!user.isVerified && userValidate.isVerified && !userValidate.password) {
      toast.error(
        'Поле пароль обовязкове для заповнення, якщо ви хочете змінити статус верифікації',
      );
      return;
    }

    dispatch(updateUserThunk(userValidate))
      .unwrap()
      .then(() => {
        closeModal();
      })
      .catch((error) => {
        if (error.response.status === 409) {
          toast.error('Користувач з таким логіном або емейлом вже існує');
        } else {
          toast.error('Помилка при оновленні користувача');
        }
      });
  };

  const handleReset = () => {
    setSelectedUser(user);
  };
  const generatePassword = () => {
    const length = 8;
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let retVal = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset[Math.floor(Math.random() * n)];
    }
    return retVal;
  };

  const dataToRender = [
    {
      label: 'E-mail',
      type: 'email',
      value: email,
      name: 'email',
      required: true,
    },
    {
      label: 'Логін',
      type: 'text',
      value: login,
      name: 'login',
      required: true,
    },
    {
      label: "Ім'я",
      type: 'text',
      value: firstName,
      name: 'firstName',
      required: true,
    },
    {
      label: 'Прізвище',
      type: 'text',
      value: lastName,
      name: 'lastName',
      required: true,
    },
    {
      label: 'По-батькові',
      type: 'text',
      value: surName,
      name: 'surName',
      required: true,
    },
    {
      label: 'Телефон',
      type: 'tel',
      value: phone,
      name: 'phone',
      required: true,
    },
    {
      label: 'ЄДРПОУ',
      type: 'text',
      value: edrpou,
      name: 'edrpou',
      required: true,
    },
    {
      label: 'Статус верифікації',
      value: isVerified ? '✅' : '',
      name: 'isVerified',
      type: 'checkbox',
    },
    {
      label: 'Новий пароль',
      value: selectedUser.password,
      name: 'password',
      type: 'text',
      renderExtras: () => (
        <Button
          className="ml-2"
          onClick={(e) => {
            e.preventDefault();
            const newPassword = generatePassword();
            setSelectedUser({
              ...selectedUser,
              password: newPassword,
            });
          }}
        >
          Згенерувати
        </Button>
      ),
    },
  ];

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
      <h2 className="font-lg mb-4 font-medium">Редагування користувача</h2>
      <form onSubmit={handleSubmit} className="mb-2 text-lg">
        {dataToRender.map(
          ({ label, value, name, type, renderExtras, required }) => (
            <div
              key={label}
              className="mb-2 flex gap-5 border-b border-gray-400 pb-2 text-base"
            >
              {name === 'isVerified' ? (
                <div className="flex items-center gap-2">
                  <label htmlFor={name}>{label}</label>
                  <input
                    id={name}
                    type={type}
                    name={name}
                    defaultChecked={!!value}
                    onChange={(e) => {
                      setSelectedUser({
                        ...selectedUser,
                        [name]: e.target.checked,
                      });
                    }}
                  />
                  <span>{!!value ? '✅' : '❌'}</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <label className="block w-[100px]" htmlFor={name}>
                    {label}
                  </label>
                  <input
                    required={required}
                    id={name}
                    type={type}
                    name={name}
                    defaultValue={value}
                    className="min-w-[250px] rounded-md border-gray-200"
                    onChange={(e) => {
                      setSelectedUser({
                        ...selectedUser,
                        [name]: e.target.value,
                      });
                    }}
                  />
                  {renderExtras && renderExtras()}
                </div>
              )}
            </div>
          ),
        )}
        <div className="mb-2 flex">
          <label className="block w-[100px]" htmlFor={address}>
            Адреса
          </label>
          <textarea
            id={address}
            name="address"
            defaultValue={address}
            className="min-h-[100px] min-w-[250px] resize-none rounded-md border-gray-200"
            onChange={(e) => {
              setSelectedUser({
                ...selectedUser,
                address: e.target.value,
              });
            }}
          />
        </div>
        <div
          key={updatedAt}
          className="mb-2 flex gap-5 border-b border-gray-400 pb-2 text-base"
        >
          <p>Дата активності</p>
          <p>{new Date(updatedAt).toLocaleDateString('uk-UA')}</p>
        </div>
        <div className="mt-5 flex justify-between">
          <div className="flex gap-4">
            <Button
              type="reset"
              onClick={handleReset}
              className="bg-slate-300 hover:bg-slate-400"
              title="Відновити дані до початкового стану"
            >
              Скинути
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (confirm('Ви впевнені, що хочете видалити користувача?')) {
                  dispatch(deleteUserThunk(user._id))
                    .unwrap()
                    .then(() => {
                      closeModal();
                    })
                    .catch((error) => {
                      toast.error('Помилка при видаленні користувача');
                    });
                }
              }}
              title="Видалити користувача"
              className="bg-red-300 hover:bg-red-400"
            >
              Видалити
            </Button>
          </div>
          <Button
            className="bg-green-200 hover:bg-green-400 focus:bg-green-400 active:bg-green-400 "
            onClick={() => {
              if (confirm('Відновити користувача?'))
                dispatch(restoreUserThunk(user._id));
            }}
            type="button"
          >
            Відновити
          </Button>
          <Button
            className="bg-green-300 hover:bg-green-500 focus:bg-green-500 active:bg-green-500"
            type="submit"
          >
            Зберегти
          </Button>
        </div>
      </form>
      {orders.length > 0 ? (
        <div>
          <div>
            <h3 className="w-full text-lg font-medium">Замовлення:</h3>
          </div>
          <ul>
            <li className="grid grid-cols-3 border-b border-gray-200">
              <p className="font-medium">Номер</p>
              <p className="font-medium">Статус</p>
              <p className="font-medium">Сума $</p>
            </li>
            {orders.map((order) => (
              <li
                key={order._id}
                className="grid grid-cols-3 border-b border-gray-200"
              >
                <p>{order.orderCode}</p>
                <p>{order.status}</p>
                <p>{order.totalPrice.toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <h3 className="w-full text-lg font-medium">
          Клієнт ще не здійснив жодного замовлення
        </h3>
      )}
    </Modal>
  );
};

export default AdminUserModal;
