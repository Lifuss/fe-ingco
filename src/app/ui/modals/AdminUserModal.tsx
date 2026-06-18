'use client';
import Modal from 'react-modal';
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
import { X, UserRound, KeyRound, MapPin, ClipboardList } from 'lucide-react';
import { generatePassword } from '@/lib/utils';

type AdminUserModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  user: User | null;
};

const modifiedStyles = {
  overlay: {
    backgroundColor: 'rgba(15, 15, 14, 0.4)',
    backdropFilter: 'blur(8px)',
    zIndex: 9999,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    background: 'transparent',
    padding: 0,
    overflow: 'visible',
  },
};

const AdminUserModal = ({ isOpen, closeModal, user }: AdminUserModalProps) => {
  const dispatch = useAppDispatch();
  const [selectedUser, setSelectedUser] = useState<User | null>(user);

  useEffect(() => {
    setSelectedUser(user);
  }, [user]);

  if (selectedUser === null) return null;

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
    const {
      token: _token,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      resetToken: _resetToken,
      ...userValidate
    } = normalizeUser;

    if (!selectedUser.isVerified && userValidate.isVerified && !userValidate.password) {
      toast.error(
        'Поле пароль обовʼязкове для заповнення, якщо ви хочете змінити статус верифікації',
      );
      return;
    }

    dispatch(updateUserThunk(userValidate))
      .unwrap()
      .then(() => {
        closeModal();
      })
      .catch((error) => {
        const status = error?.status || error?.response?.status;
        if (status === 409) {
          toast.error('Користувач з таким логіном або емейлом вже існує');
        } else {
          toast.error('Помилка при оновленні користувача');
        }
      });
  };

  const handleReset = () => {
    setSelectedUser(user);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={modifiedStyles} ariaHideApp={false}>
      <div className="animate-fade-in relative max-h-[95vh] w-full max-w-[850px] overflow-y-auto rounded-2xl border border-neutral-100 bg-white p-5 text-neutral-800 shadow-2xl md:p-6 lg:max-w-[1000px] xl:max-w-[1200px]">
        {/* Header bar */}
        <div className="mb-4 flex items-center justify-between border-b border-neutral-100 pb-4">
          <div>
            <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
              Клієнти
            </span>
            <h2 className="text-lg font-bold text-neutral-900 md:text-xl">
              Редагування користувача
            </h2>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="cursor-pointer rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
            aria-label="Закрити"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="text-sm">
          {/* Main Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Card 1: Personal Data */}
            <div className="flex flex-col gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-4">
              <h3 className="flex items-center gap-1.5 border-b border-neutral-200/50 pb-2 text-xs font-bold tracking-wider text-neutral-400 uppercase">
                <UserRound size={14} />
                Персональні дані
              </h3>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="lastName"
                  className="text-[11px] font-bold text-neutral-500 uppercase"
                >
                  Прізвище
                </label>
                <input
                  required
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={lastName || ''}
                  className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-semibold text-neutral-800 transition-colors focus:ring-1 focus:outline-none"
                  onChange={(e) => {
                    setSelectedUser({
                      ...selectedUser,
                      lastName: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="firstName"
                  className="text-[11px] font-bold text-neutral-500 uppercase"
                >
                  Ім&apos;я
                </label>
                <input
                  required
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={firstName || ''}
                  className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-semibold text-neutral-800 transition-colors focus:ring-1 focus:outline-none"
                  onChange={(e) => {
                    setSelectedUser({
                      ...selectedUser,
                      firstName: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="surName"
                  className="text-[11px] font-bold text-neutral-500 uppercase"
                >
                  По-батькові
                </label>
                <input
                  required
                  id="surName"
                  type="text"
                  name="surName"
                  value={surName || ''}
                  className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-semibold text-neutral-800 transition-colors focus:ring-1 focus:outline-none"
                  onChange={(e) => {
                    setSelectedUser({
                      ...selectedUser,
                      surName: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="phone" className="text-[11px] font-bold text-neutral-500 uppercase">
                  Телефон
                </label>
                <input
                  required
                  id="phone"
                  type="tel"
                  name="phone"
                  value={phone || ''}
                  className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-semibold text-neutral-800 transition-colors focus:ring-1 focus:outline-none"
                  onChange={(e) => {
                    setSelectedUser({
                      ...selectedUser,
                      phone: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="edrpou"
                  className="text-[11px] font-bold text-neutral-500 uppercase"
                >
                  ЄДРПОУ
                </label>
                <input
                  required
                  id="edrpou"
                  type="text"
                  name="edrpou"
                  value={edrpou || ''}
                  className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-semibold text-neutral-800 transition-colors focus:ring-1 focus:outline-none"
                  onChange={(e) => {
                    setSelectedUser({
                      ...selectedUser,
                      edrpou: e.target.value,
                    });
                  }}
                />
              </div>
            </div>

            {/* Card 2: Account & Security */}
            <div className="flex flex-col justify-between gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-4">
              <div className="flex flex-col gap-3">
                <h3 className="flex items-center gap-1.5 border-b border-neutral-200/50 pb-2 text-xs font-bold tracking-wider text-neutral-400 uppercase">
                  <KeyRound size={14} />
                  Акаунт та безпека
                </h3>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="email"
                    className="text-[11px] font-bold text-neutral-500 uppercase"
                  >
                    E-mail
                  </label>
                  <input
                    required
                    id="email"
                    type="email"
                    name="email"
                    value={email || ''}
                    className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-semibold text-neutral-800 transition-colors focus:ring-1 focus:outline-none"
                    onChange={(e) => {
                      setSelectedUser({
                        ...selectedUser,
                        email: e.target.value,
                      });
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="login"
                    className="text-[11px] font-bold text-neutral-500 uppercase"
                  >
                    Логін
                  </label>
                  <input
                    required
                    id="login"
                    type="text"
                    name="login"
                    value={login || ''}
                    className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-semibold text-neutral-800 transition-colors focus:ring-1 focus:outline-none"
                    onChange={(e) => {
                      setSelectedUser({
                        ...selectedUser,
                        login: e.target.value,
                      });
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase">
                    Статус верифікації
                  </span>
                  <div className="flex w-fit items-center gap-2.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 select-none">
                    <input
                      id="isVerified"
                      type="checkbox"
                      name="isVerified"
                      defaultChecked={isVerified}
                      className="text-primary-500 focus:ring-primary-500 accent-primary-500 h-4 w-4 cursor-pointer rounded border-gray-300"
                      onChange={(e) => {
                        setSelectedUser({
                          ...selectedUser,
                          isVerified: e.target.checked,
                        });
                      }}
                    />
                    <label
                      htmlFor="isVerified"
                      className="cursor-pointer text-sm font-semibold text-neutral-700"
                    >
                      {isVerified ? 'Верифікований ✅' : 'Неверифікований ❌'}
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="password"
                    className="text-[11px] font-bold text-neutral-500 uppercase"
                  >
                    Новий пароль
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="password"
                      type="text"
                      name="password"
                      value={selectedUser.password || ''}
                      placeholder="Введіть або згенеруйте..."
                      className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-semibold text-neutral-800 transition-colors focus:ring-1 focus:outline-none"
                      onChange={(e) => {
                        setSelectedUser({
                          ...selectedUser,
                          password: e.target.value,
                        });
                      }}
                    />
                    <Button
                      type="button"
                      className="bg-primary-500 hover:bg-primary-600 active:bg-primary-700 h-9 shrink-0 cursor-pointer rounded-xl border-none px-3.5 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:shadow"
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
                  </div>
                </div>
              </div>

              {/* Activity date */}
              <div className="mt-3 flex items-center justify-between rounded-lg border border-neutral-200/50 bg-neutral-200/40 p-2.5 text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                <span>Остання активність</span>
                <span className="font-extrabold text-neutral-700">
                  {new Date(updatedAt).toLocaleDateString('uk-UA')}
                </span>
              </div>
            </div>
          </div>

          {/* Address card */}
          <div className="mt-4 flex flex-col gap-2 rounded-xl border border-neutral-100 bg-neutral-50 p-4">
            <h3 className="flex items-center gap-1.5 border-b border-neutral-200/50 pb-2 text-xs font-bold tracking-wider text-neutral-400 uppercase">
              <MapPin size={14} />
              Адреса доставки
            </h3>
            <textarea
              id="address"
              name="address"
              value={address || ''}
              placeholder="Вкажіть область, місто, № відділення Нової Пошти або адресу..."
              className="focus:border-primary-500 focus:ring-primary-500 min-h-[60px] w-full resize-none rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-800 transition-colors focus:ring-1 focus:outline-none"
              onChange={(e) => {
                setSelectedUser({
                  ...selectedUser,
                  address: e.target.value,
                });
              }}
            />
          </div>

          {/* Orders list card */}
          {orders.length > 0 ? (
            <div className="mt-4">
              <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold tracking-wider text-neutral-400 uppercase">
                <ClipboardList size={14} />
                Історія замовлень ({orders.length})
              </h3>
              <div className="overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50/50 shadow-sm">
                <div className="max-h-[160px] overflow-y-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-neutral-200 bg-neutral-100/80 text-xs font-bold tracking-wider text-neutral-600 uppercase">
                        <th className="px-4 py-2.5">Код замовлення</th>
                        <th className="px-4 py-2.5">Статус</th>
                        <th className="px-4 py-2.5 text-right">Сума</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200/60 bg-white">
                      {orders.map((order) => (
                        <tr
                          key={order.id}
                          className="text-xs text-neutral-800 transition-colors hover:bg-neutral-50"
                        >
                          <td className="px-4 py-2.5 font-bold text-neutral-900">
                            {order.orderCode}
                          </td>
                          <td className="px-4 py-2.5 font-medium text-neutral-700">
                            {order.status}
                          </td>
                          <td className="px-4 py-2.5 text-right font-extrabold text-neutral-900">
                            ${order.totalPrice.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-neutral-100 bg-neutral-50 p-4 text-center">
              <h3 className="text-xs font-bold tracking-wider text-neutral-400 uppercase">
                Клієнт ще не здійснив жодного замовлення
              </h3>
            </div>
          )}

          {/* Bottom Action buttons */}
          <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-neutral-100 pt-4 sm:flex-row">
            <div className="flex w-full items-center gap-2.5 sm:w-auto">
              <Button
                type="reset"
                onClick={handleReset}
                className="h-10 cursor-pointer rounded-xl border-none bg-neutral-200 px-4 text-xs font-semibold text-neutral-700 shadow-sm transition-all duration-150 hover:bg-neutral-300 hover:shadow active:bg-neutral-400"
                title="Відновити дані до початкового стану"
              >
                Скинути
              </Button>
              <Button
                type="button"
                onClick={() => {
                  if (confirm('Ви впевнені, що хочете видалити користувача?')) {
                    dispatch(deleteUserThunk(selectedUser.id))
                      .unwrap()
                      .then(() => {
                        closeModal();
                      })
                      .catch(() => {
                        toast.error('Помилка при видаленні користувача');
                      });
                  }
                }}
                title="Видалити користувача"
                className="h-10 cursor-pointer rounded-xl border-none bg-red-100 px-4 text-xs font-semibold text-red-700 shadow-sm transition-all duration-150 hover:bg-red-200 hover:shadow"
              >
                Видалити
              </Button>
            </div>

            <div className="flex w-full items-center justify-end gap-2.5 sm:w-auto">
              <Button
                className="h-10 cursor-pointer rounded-xl border-none bg-emerald-100 px-4 text-xs font-semibold text-emerald-700 shadow-sm transition-all duration-150 hover:bg-emerald-200 hover:shadow"
                onClick={() => {
                  if (confirm('Відновити користувача?'))
                    dispatch(restoreUserThunk(selectedUser.id));
                }}
                type="button"
              >
                Відновити
              </Button>
              <Button
                type="submit"
                className="h-10 cursor-pointer rounded-xl border-none bg-emerald-600 px-5 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:bg-emerald-700 hover:shadow active:bg-emerald-800"
              >
                Зберегти
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AdminUserModal;
