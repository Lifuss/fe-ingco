'use client';

import { Button } from '@/app/ui/buttons/button';
import { PasswordInput } from '@/app/ui/forms/PasswordInput';
import PasswordStrengthIndicator, {
  getPasswordCriteria,
} from '@/app/ui/forms/PasswordStrengthIndicator';
import TextPlaceholder from '@/app/ui/TextPlaceholder';
import { resetPasswordThunk } from '@/lib/appState/user/operation';
import { useAppDispatch } from '@/lib/hooks';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { toast } from 'react-toastify';

type PageProps = {
  params: Promise<{
    resetToken: string;
  }>;
};

const Page = ({ params }: PageProps) => {
  const { resetToken } = use(params);
  const [isAllow, setIsAllow] = useState<boolean>(Boolean(resetToken));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const pass = form.get('password') as string;
    const checkPassword = pass === (form.get('checkPassword') as string);
    if (!checkPassword) {
      toast.error('Паролі не співпадають');
      return;
    }

    const criteria = getPasswordCriteria(pass);
    const allValid = criteria.every((c) => c.isValid);
    if (!allValid) {
      toast.error('Пароль не відповідає вимогам безпеки');
      return;
    }

    setIsLoading(true);
    dispatch(
      resetPasswordThunk({
        resetToken,
        newPassword: pass,
      }),
    )
      .unwrap()
      .then(() => {
        toast.success('Пароль успішно змінено!');
        setTimeout(() => {
          router.replace('/auth/login');
        }, 500);
      })
      .catch((_err) => {
        toast.error('Посилання застаріло або невалідне');
        setIsAllow(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return isAllow ? (
    <form onSubmit={handleSubmit}>
      <div className="mx-auto mt-20 grid max-w-md place-content-center gap-4 px-4">
        <h1 className="mb-2 block text-center text-xl font-bold">Новий пароль</h1>
        <div>
          <label className="mb-2 block text-base" htmlFor="password">
            Пароль <span className="text-red">*</span>
          </label>
          <PasswordInput
            id="password"
            name="password"
            placeholder="Пароль"
            maxLength={20}
            disabled={isLoading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <PasswordStrengthIndicator password={password} />
        </div>
        <div>
          <label className="mb-2 block text-base" htmlFor="checkPassword">
            Повторіть пароль <span className="text-red">*</span>
          </label>
          <PasswordInput
            id="checkPassword"
            name="checkPassword"
            placeholder="Повторіть пароль"
            maxLength={20}
            disabled={isLoading}
            required
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-orange-light flex items-center justify-center gap-2 text-white hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Збереження...</span>
            </>
          ) : (
            'Скинути пароль'
          )}
        </Button>
      </div>
    </form>
  ) : (
    <div className="mx-auto flex w-fit flex-col gap-4 pt-20">
      <TextPlaceholder
        text="Це посилання не валідне або термін операції скидування вже закінчився"
        title="Неможливо змінити пароль по цьому посиланню"
      />
      <Button
        onClick={() => {
          router.replace('/auth/login');
        }}
        className="bg-orange-light text-white hover:bg-orange-500"
      >
        Увійти в кабінет
      </Button>
    </div>
  );
};

export default Page;
