'use client';
import { Button } from '@/app/ui/buttons/button';
import TurnstileWidget from '@/app/ui/utils/TurnstileWidget';
import { supportTicketThunk } from '@/lib/appState/main/operations';
import { useAppDispatch } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

const SupportClient = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [turnstileKey, setTurnstileKey] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get('name') as string;
    const email = form.get('email') as string;
    const phone = form.get('phone') as string;
    const message = form.get('message') as string;
    dispatch(supportTicketThunk({ name, email, message, phone, turnstileToken }))
      .unwrap()
      .then(() => {
        toast.success('Повідомлення створено, очікуйте відповіді на електронні пошті', {
          autoClose: 5000,
        });
        router.push('/about-us');
      })
      .catch((err) => {
        setTurnstileKey((prev) => prev + 1);
        setTurnstileToken('');
        toast.error(err?.message || 'Виникла помилка зі сторони серверу, спробуйте пізніше');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid place-content-center gap-4 py-20">
        <h1 className="mb-2 block text-center text-2xl font-medium">Підтримка</h1>
        <input
          className="border-input-border block w-full rounded-2xl border py-[20px] pl-4 text-base outline-2 placeholder:text-gray-500"
          id="name"
          type="text"
          name="name"
          placeholder="Ім'я*"
          min={2}
          max={60}
          required
        />
        <input
          className="border-input-border block w-full rounded-2xl border py-[20px] pl-4 text-base outline-2 placeholder:text-gray-500"
          id="email"
          type="email"
          name="email"
          placeholder="email*"
          required
        />
        <input
          className="border-input-border block w-full rounded-2xl border py-[20px] pl-4 text-base outline-2 placeholder:text-gray-500"
          id="phone"
          type="phone"
          name="phone"
          placeholder="Ном. телефону*"
          required
        />
        <textarea
          className="border-input-border block h-32 w-[320px] resize-y rounded-2xl border py-[20px] pl-4 text-base outline-2 placeholder:text-gray-500"
          name="message"
          id="message"
          placeholder="Повідомлення*"
          minLength={10}
          maxLength={500}
          required
        ></textarea>

        <TurnstileWidget
          key={turnstileKey}
          action="support"
          onVerify={setTurnstileToken}
          onExpire={() => setTurnstileToken('')}
          className="my-1 flex justify-center"
        />

        <Button
          className="bg-orange-light text-white hover:bg-orange-500"
          title="Відправити своє повідомлення, відповідь надійде поштою вказаною в формі"
        >
          Відправити повідомлення
        </Button>
      </div>
    </form>
  );
};

export default SupportClient;
