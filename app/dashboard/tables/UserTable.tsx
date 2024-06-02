'use client';

import Table from '@/app/ui/Table';
import { fetchUsersThunk } from '@/lib/appState/dashboard/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Row } from 'react-table';

const UserTable = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const users = useAppSelector((state) => state.dashboardSlice.users);

  let page = searchParams.get('page')
    ? parseInt(searchParams.get('page') as string)
    : 1;
  page = !page || page < 1 ? 1 : page;
  let query = searchParams.get('query') || '';

  useEffect(() => {
    dispatch(fetchUsersThunk({ query }));
  }, [dispatch, query]);

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

  return (
    <div>
      <Table
        columns={columns}
        data={data}
        headerColor="bg-blue-200"
        borderColor="border-gray-400"
      />
      {/* <div className="mx-auto mt-5 w-fit">
        <Pagination totalPages={totalPages} />
      </div> */}
    </div>
  );
};

export default UserTable;
