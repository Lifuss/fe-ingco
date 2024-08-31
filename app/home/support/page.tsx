'use client';
import { Button } from '@/app/ui/buttons/button';
import { supportTicketThunk } from '@/lib/appState/main/operations';
import { useAppDispatch } from '@/lib/hooks';

const Page = () => {
  const dispatch = useAppDispatch();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get('name') as string;
    const email = form.get('email') as string;
    const message = form.get('message') as string;
    console.log(name, email, message);
    dispatch(supportTicketThunk({ name, email, message }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid place-content-center gap-4 py-20">
        <h1 className="mb-2 block text-center text-2xl font-medium">
          Підтримка
        </h1>
        <input
          className="block w-full rounded-2xl border border-[#1d1c1c] py-[20px] pl-4 text-base outline-2 placeholder:text-gray-500"
          id="name"
          type="text"
          name="name"
          placeholder="Ім'я*"
          min={2}
          max={60}
          required
        />
        <input
          className="block w-full rounded-2xl border border-[#1d1c1c] py-[20px] pl-4 text-base outline-2 placeholder:text-gray-500"
          id="email"
          type="email"
          name="email"
          placeholder="email*"
          required
        />
        <textarea
          className="block h-32 w-[320px] resize-y rounded-2xl border border-[#1d1c1c] py-[20px] pl-4 text-base outline-2 placeholder:text-gray-500"
          name="message"
          id="message"
          placeholder="Повідомлення*"
          minLength={10}
          maxLength={500}
          required
        ></textarea>

        <Button className="bg-orangeLight text-white hover:bg-orange-500">
          Скинути пароль
        </Button>
      </div>
    </form>
  );
};

export default Page;
