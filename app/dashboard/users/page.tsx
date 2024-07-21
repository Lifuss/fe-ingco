import Search from '@/app/ui/search';
import Link from 'next/link';
import UserTable from '../tables/UserTable';
import UsersStats from '@/app/ui/UsersStats';

const Page = () => {
  return (
    <div className="w-4/5">
      <h1 className="mb-5 text-4xl">Користувачі</h1>
      <div className="mb-5 flex justify-between">
        <Search placeholder="Емайл або логін" />
        <div>
          <UsersStats />
        </div>
        <Link
          href={'/dashboard/users/create'}
          className="w-[120px] rounded-xl bg-blue-400 py-2  text-center text-sm text-white transition-colors hover:bg-blue-700"
        >
          Створити користувача
        </Link>
      </div>
      <UserTable />
    </div>
  );
};

export default Page;
