'use client';

import Pagination from '@/app/ui/Pagination';
import Table from '@/app/ui/Table';
import AdminUserModal from '@/app/ui/modals/AdminUserModal';
import { fetchUsersThunk } from '@/lib/appState/dashboard/operations';
import { setCheckbox } from '@/lib/appState/dashboard/slice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { User } from '@/lib/types';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';

export enum CheckboxActionType {
  Admin = 'admin',
  IsUserVerified = 'isUserVerified',
  IsB2B = 'isB2B',
  isDeleted = 'isDeleted',
}

type UserTableRow = {
  emailCol: string;
  loginCol: string;
  activeDateCol: string;
  verificationStatusCol: boolean;
};

const UserTable = () => {
  const [isAdministrator, setIsAdministrator] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { users, totalPages, userTableCheckboxesStatus } = useAppSelector(
    (state) => state.dashboardSlice,
  );
  const { isB2B, isUserVerified, isDeleted } = userTableCheckboxesStatus;

  let page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;
  page = !page || page < 1 ? 1 : page;

  const query = searchParams.get('query') || '';
  const role: 'admin' | 'user' = isAdministrator ? 'admin' : 'user';

  useEffect(() => {
    dispatch(
      fetchUsersThunk({
        query,
        role,
        isB2B,
        isUserVerified,
        page,
        isDeleted,
        limit: 50,
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
      })),
    [users],
  );

  const columns = useMemo<ColumnDef<UserTableRow>[]>(
    () => [
      {
        header: 'E-mail',
        accessorKey: 'emailCol',
      },
      {
        header: 'Логін',
        accessorKey: 'loginCol',
      },
      {
        header: 'Активність',
        accessorKey: 'activeDateCol',
      },
      {
        header: 'Верифікація',
        accessorKey: 'verificationStatusCol',
        cell: ({ row }) => <div>{row.original.verificationStatusCol ? '✅' : '❌'}</div>,
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

  const handleCheckboxChange = (action: CheckboxActionType) => {
    if (action === CheckboxActionType.Admin) {
      setIsAdministrator((prev) => !prev);
    } else {
      dispatch(setCheckbox(action));
    }
  };

  return (
    <div>
      <div className="flex gap-4">
        <label
          className={clsx(
            'mb-2 flex w-fit items-center gap-2',
            (!isB2B && 'cursor-not-allowed opacity-50') ||
              (!isUserVerified && 'cursor-not-allowed opacity-50'),
          )}
        >
          Адміністратор
          <input
            disabled={!isB2B || !isUserVerified}
            type="checkbox"
            name="role"
            onChange={() => handleCheckboxChange(CheckboxActionType.Admin)}
          />
        </label>
        <label
          className={clsx(
            'mb-2 flex w-fit items-center gap-2',
            isAdministrator && 'cursor-not-allowed opacity-50',
          )}
        >
          Роздріб
          <input
            type="checkbox"
            name="isB2B"
            disabled={isAdministrator}
            checked={!isB2B}
            onChange={() => handleCheckboxChange(CheckboxActionType.IsB2B)}
          />
        </label>
        <label
          className={clsx(
            'mb-2 flex w-fit items-center gap-2',
            isAdministrator && 'cursor-not-allowed opacity-50',
          )}
        >
          Неверифіковані
          <input
            disabled={isAdministrator}
            type="checkbox"
            name="isVerified"
            checked={!isUserVerified}
            onChange={() => handleCheckboxChange(CheckboxActionType.IsUserVerified)}
          />
        </label>
        <label className={clsx('mb-2 flex w-fit items-center gap-2')}>
          Видалені
          <input
            type="checkbox"
            name="isDeleted"
            checked={isDeleted}
            onChange={() => handleCheckboxChange(CheckboxActionType.isDeleted)}
          />
        </label>
      </div>

      <Table
        columns={columns}
        data={data}
        headerColor="bg-blue-200"
        borderColor="border-gray-400"
        rowClickable={true}
        rowFunction={handleRowClick}
      />
      <AdminUserModal isOpen={isOpen} closeModal={closeModal} user={selectedUser} />
      <div className="mx-auto mt-5 w-fit">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
};

export default UserTable;
