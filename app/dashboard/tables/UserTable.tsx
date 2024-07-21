'use client';

import Table from '@/app/ui/Table';
import AdminUserModal from '@/app/ui/modals/AdminUserModal';
import { fetchUsersThunk } from '@/lib/appState/dashboard/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { User } from '@/lib/types';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Row } from 'react-table';

const UserTable = () => {
  const [isAdministrator, setIsAdministrator] = useState(false);
  const [isB2B, setIsB2B] = useState(true);
  const [isUserVerified, setIsUserVerified] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | any>();
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const users = useAppSelector((state) => state.dashboardSlice.users);

  let page = searchParams.get('page')
    ? parseInt(searchParams.get('page') as string)
    : 1;
  page = !page || page < 1 ? 1 : page;

  let query = searchParams.get('query') || '';
  let role: 'admin' | 'user' = isAdministrator ? 'admin' : 'user';

  useEffect(() => {
    dispatch(fetchUsersThunk({ query, role, isB2B, isUserVerified }));
  }, [dispatch, query, role, isB2B, isUserVerified]);

  const columns = useMemo(
    () => [
      {
        Header: 'E-mail',
        accessor: 'emailCol',
      },
      {
        Header: 'Логін',
        accessor: 'loginCol',
      },
      {
        Header: 'Дата активн',
        accessor: 'activeDateCol',
      },
      {
        Header: 'Статус верифікації',
        accessor: 'verificationStatusCol',
        Cell: ({ row }: { row: Row }) => (
          <div>{row.values.verificationStatusCol ? '✅' : '❌'}</div>
        ),
      },
    ],
    [],
  );

  const data = useMemo(
    () =>
      users?.map((user) => ({
        emailCol: user.email,
        loginCol: user.login,
        activeDateCol: new Date(user.updatedAt).toLocaleDateString(),
        verificationStatusCol: user.isVerified,
      })),
    [users],
  );

  const openModal = (login: string) => {
    const user = users.find((user) => user.login === login);
    setSelectedUser(user);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const handleRowClick = (data: { loginCol: string }) => {
    openModal(data.loginCol);
  };

  const handleCheckboxChange = (action: string) => {
    switch (action) {
      case 'admin':
        setIsAdministrator((prev) => !prev);
        break;
      case 'isB2B':
        setIsB2B((prev) => !prev);
        break;
      case 'isVerified':
        setIsUserVerified((prev) => !prev);
        break;
      default:
        break;
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
            onChange={() => handleCheckboxChange('admin')}
          />
        </label>
        <label
          className={clsx(
            'mb-2 flex w-fit items-center gap-2',
            isAdministrator && 'cursor-not-allowed opacity-50 ',
          )}
        >
          Роздріб
          <input
            type="checkbox"
            name="isB2B"
            disabled={isAdministrator}
            onChange={() => handleCheckboxChange('isB2B')}
          />
        </label>
        <label
          className={clsx(
            'mb-2 flex w-fit items-center gap-2',
            isAdministrator && 'cursor-not-allowed opacity-50 ',
          )}
        >
          Неверифіковані
          <input
            disabled={isAdministrator}
            type="checkbox"
            name="isVerified"
            onChange={() => handleCheckboxChange('isVerified')}
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
      <AdminUserModal
        isOpen={isOpen}
        closeModal={closeModal}
        user={selectedUser}
      />
      {/* <div className="mx-auto mt-5 w-fit">
        <Pagination totalPages={totalPages} />
      </div> */}
    </div>
  );
};

export default UserTable;
