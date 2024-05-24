import Search from '@/app/ui/search';
import Link from 'next/link';
import UserTable from '../tables/UserTable';

const Page = () => {
  return (
    <div className="w-4/5">
      <h1 className="mb-10 text-4xl">Категорії</h1>
      <div className="mb-10 flex justify-between">
        <Search placeholder="Назва категорії" />
        <Link
          href={'/dashboard/users/create'}
          className="rounded-xl bg-blue-400 p-4 text-lg text-white transition-colors hover:bg-blue-700"
        >
          Створити користувача
        </Link>
      </div>
      <UserTable />
    </div>
  );
};

export default Page;
