import Search from '@/app/ui/search';
import Link from 'next/link';
import UserTable from '../tables/UserTable';

const Page = () => {
  return (
    <div className="w-4/5">
      <h1 className="mb-5 text-4xl">Користувачі</h1>
      <div className="mb-5 flex justify-between">
        <Search placeholder="Емайл або логін" />
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
