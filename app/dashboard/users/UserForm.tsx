'use client';
import { Button } from '@/app/ui/button';
import { useState } from 'react';

const inputStyle =
  'peer block w-full rounded-md border border-gray-200 py-[9px] pl-2 text-base outline-2 placeholder:text-gray-500';

interface UserFormProps {
  defaultValues?: {
    firstName: string;
    lastName: string;
    surName: string;
    email: string;
    login: string;
    password: string;
    role: string;
    phone: string;
    edrpou: string;
    about: string;
    address: string;
  };
  handleSubmit: (values: any) => void;
  isEditing?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  defaultValues,
  handleSubmit,
  isEditing = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    firstName,
    lastName,
    surName,
    email,
    login,
    password,
    role,
    phone,
    edrpou,
    about,
    address,
  } = defaultValues || {};

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-fit flex-col items-baseline justify-center gap-4 rounded-xl border border-blue-700 p-8 shadow-lg"
    >
      <div className="flex gap-2">
        <label>
          Ім&apos;я
          <input
            type="text"
            name="firstName"
            required
            className={inputStyle}
            defaultValue={isEditing ? firstName : ''}
          />
        </label>
        <label>
          Прізвище
          <input
            type="text"
            name="lastName"
            required
            className={inputStyle}
            defaultValue={isEditing ? lastName : ''}
          />
        </label>
        <label>
          По-батькові
          <input
            type="text"
            name="surName"
            required
            className={inputStyle}
            defaultValue={isEditing ? surName : ''}
          />
        </label>
      </div>
      <div className="flex gap-2">
        <label>
          Email
          <input
            type="email"
            name="email"
            required
            className={inputStyle}
            defaultValue={isEditing ? email : ''}
          />
        </label>
        <label>
          Логін
          <input
            type="text"
            name="login"
            required
            className={inputStyle}
            defaultValue={isEditing ? login : ''}
          />
        </label>
        <label className="relative">
          Пароль
          <button
            type="button"
            onClick={toggleShowPassword}
            className=" absolute right-0 top-0 text-blue-500 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-50"
          >
            {showPassword ? 'Сховати' : 'Показати'}
          </button>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            required
            className={inputStyle}
            defaultValue={isEditing ? password : ''}
          />
        </label>
      </div>
      <div className="flex gap-2">
        <label>
          Роль
          <select
            name="role"
            className={inputStyle}
            defaultValue={isEditing ? role : 'user'}
          >
            <option value="user">Клієнт</option>
            <option value="admin">Адміністратор</option>
          </select>
        </label>

        <label>
          Телефон
          <input
            type="tel"
            name="phone"
            required
            className={inputStyle}
            maxLength={12}
            minLength={9}
            defaultValue={isEditing ? phone : ''}
          />
        </label>
        <label>
          Код ЄДРПОУ
          <input
            type="text"
            name="edrpou"
            className={inputStyle}
            defaultValue={isEditing ? edrpou : ''}
          />
        </label>
      </div>
      <div className="flex gap-2">
        <label>
          Про себе
          <textarea
            name="about"
            className={inputStyle}
            defaultValue={isEditing ? about : ''}
          ></textarea>
        </label>
        <label>
          Адреса
          <textarea
            name="address"
            className={inputStyle}
            defaultValue={isEditing ? address : ''}
          ></textarea>
        </label>
      </div>
      <div className="flex flex-col gap-4">
        <Button className="px-4 text-lg" type="submit">
          {isEditing ? 'Зберегти' : 'Створити'}
        </Button>
        {isEditing && (
          <Button
            className="bg-red-300 px-4 text-lg hover:bg-red-500 focus-visible:bg-red-400"
            type="reset"
          >
            Cкасувати
          </Button>
        )}
      </div>
    </form>
  );
};

export default UserForm;
