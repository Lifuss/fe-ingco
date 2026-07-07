import Search from '@/app/ui/search';
import Link from 'next/link';
import UserTable from '../tables/UserTable';
import UsersStats from '@/app/ui/dashboard/UsersStats';
import { Plus } from 'lucide-react';

const Page = () => {
  return (
    <div className="w-full max-w-[1200px]">
      {/* Title */}
      <h1 className="mb-6 text-4xl font-bold tracking-tight text-neutral-800">Користувачі</h1>

      {/* KPI Cards Grid */}
      <UsersStats />

      {/* Search and Action Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-md">
          <Search placeholder="Логін, ПІБ, email або телефон" variant="dashboard" />
        </div>
        <Link
          href={'/dashboard/users/create'}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-500 px-5 py-2.5 text-center text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-blue-600 active:scale-98"
        >
          <Plus size={16} className="stroke-[2.5]" />
          Створити користувача
        </Link>
      </div>

      {/* Table */}
      <UserTable />
    </div>
  );
};

export default Page;
