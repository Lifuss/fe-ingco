'use no memo';
'use client';


import Pagination from '@/app/ui/Pagination';
import Table from '@/app/ui/Table';
import AdminUserModal from '@/app/ui/modals/AdminUserModal';
import { fetchUsersThunk } from '@/lib/appState/dashboard/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { User } from '@/lib/types';
import clsx from 'clsx';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';

type UserTableRow = {
  emailCol: string;
  loginCol: string;
  activeDateCol: string;
  verificationStatusCol: boolean;
};

const UserTable = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { users, totalPages } = useAppSelector((state) => state.dashboardSlice);

  // Read filters from URL search params for bookmarkable state
  const activeTab = searchParams.get('tab') || 'all';
  const activeVerified = searchParams.get('verified') || 'all';
  const query = searchParams.get('query') || '';

  let page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;
  page = !page || page < 1 ? 1 : page;

  // Map filters to backend service query params
  const { role, isB2B, isUserVerified, isDeleted } = useMemo(() => {
    let role: 'user' | 'admin' | 'all' = 'all';
    let isB2B: boolean | undefined = undefined;
    let isUserVerified: boolean | undefined = undefined;
    let isDeleted: 'true' | 'false' | 'only' = 'false';

    if (activeTab === 'b2b') {
      role = 'user';
      isB2B = true;
    } else if (activeTab === 'b2c') {
      role = 'user';
      isB2B = false;
    } else if (activeTab === 'admins') {
      role = 'admin';
    } else if (activeTab === 'deleted') {
      isDeleted = 'only';
    }

    if (activeVerified === 'verified') {
      isUserVerified = true;
    } else if (activeVerified === 'unverified') {
      isUserVerified = false;
    }

    return { role, isB2B, isUserVerified, isDeleted };
  }, [activeTab, activeVerified]);

  useEffect(() => {
    dispatch(
      fetchUsersThunk({
        query,
        role,
        isB2B,
        isUserVerified,
        page,
        isDeleted,
        limit: 20, // Clean paginated limit
      }),
    );
  }, [dispatch, query, role, isB2B, isUserVerified, isDeleted, page]);

  const data = useMemo<UserTableRow[]>(
    () =>
      users?.map((user) => ({
        emailCol: user.email,
        loginCol: user.login,
        activeDateCol: new Date(user.updatedAt).toLocaleDateString('uk-UA'),
        verificationStatusCol: user.isVerified,
      })) || [],
    [users],
  );

  const columns = useMemo<ColumnDef<UserTableRow>[]>(
    () => [
      {
        header: 'E-mail',
        accessorKey: 'emailCol',
        cell: ({ row }) => (
          <span className="font-medium text-neutral-800">{row.original.emailCol}</span>
        ),
      },
      {
        header: 'Логін',
        accessorKey: 'loginCol',
        cell: ({ row }) => (
          <span className="font-semibold text-neutral-700">{row.original.loginCol}</span>
        ),
      },
      {
        header: 'Активність',
        accessorKey: 'activeDateCol',
        cell: ({ row }) => (
          <span className="font-bold text-neutral-500">{row.original.activeDateCol}</span>
        ),
      },
      {
        header: 'Верифікація',
        accessorKey: 'verificationStatusCol',
        cell: ({ row }) => (
          <div className="flex justify-start">
            <span
              className={clsx(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset',
                row.original.verificationStatusCol
                  ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                  : 'bg-red-50 text-red-700 ring-red-600/20',
              )}
            >
              {row.original.verificationStatusCol ? 'Верифікований' : 'Неверифікований'}
            </span>
          </div>
        ),
      },
    ],
    [],
  );

  const openModal = (login: string) => {
    const user = users.find((user) => user.login === login) ?? null;
    setSelectedUser(user);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const handleRowClick = (targetRow: UserTableRow) => {
    openModal(targetRow.loginCol);
  };

  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    params.set('tab', tabId);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleVerifiedChange = (val: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    params.set('verified', val);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const tabs = [
    { id: 'all', label: 'Всі' },
    { id: 'b2b', label: 'B2B Гурт' },
    { id: 'b2c', label: 'B2C Роздріб' },
    { id: 'admins', label: 'Адміністратори' },
    { id: 'deleted', label: 'Видалені' },
  ];

  return (
    <div className="rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-sm">
      {/* Navigation Tabs */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-neutral-100 text-sm font-semibold select-none">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => handleTabChange(t.id)}
            className={clsx(
              '-mb-[2px] cursor-pointer border-b-2 px-4 pt-1 pb-3 transition-all duration-200',
              activeTab === t.id
                ? 'border-blue-500 font-bold text-blue-600'
                : 'border-transparent text-neutral-400 hover:border-neutral-200 hover:text-neutral-600',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Verification Filter Dropdown */}
      {activeTab !== 'admins' && activeTab !== 'deleted' && (
        <div className="mb-6 flex items-center gap-2">
          <span className="text-xs font-bold tracking-wider text-neutral-400 uppercase">
            Верифікація:
          </span>
          <select
            value={activeVerified}
            onChange={(e) => handleVerifiedChange(e.target.value)}
            className="cursor-pointer rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-1.5 text-xs font-semibold text-neutral-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">Всі користувачі</option>
            <option value="verified">Тільки верифіковані ✅</option>
            <option value="unverified">Не верифіковані ❌</option>
          </select>
        </div>
      )}

      {/* Main Table */}
      <div className="overflow-hidden rounded-xl border border-neutral-200/50 shadow-sm">
        <Table
          columns={columns}
          data={data}
          headerColor="bg-neutral-50/70"
          borderColor="border-neutral-200"
          rowClickable={true}
          rowFunction={handleRowClick}
        />
      </div>

      <AdminUserModal isOpen={isOpen} closeModal={closeModal} user={selectedUser} />

      <div className="mx-auto mt-6 w-fit">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
};

export default UserTable;
