'use client';

import Table from '@/app/ui/Table';
import AdminUserModal from '@/app/ui/modals/AdminUserModal';
import { fetchUsersThunk } from '@/lib/appState/dashboard/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { User } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Row } from 'react-table';

const UserTable = () => {
  const [isAdministrator, setIsAdministrator] = useState(false);
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
    dispatch(fetchUsersThunk({ query, role }));
  }, [dispatch, query, role]);

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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAdministrator(e.target.checked);
  };

  return (
    <div>
      <label className="mb-2 flex w-fit items-center gap-2">
        Адміністратор
        <input type="checkbox" name="role" onChange={handleCheckboxChange} />
      </label>
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
