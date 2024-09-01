'use client';

import Pagination from '@/app/ui/Pagination';
import Table from '@/app/ui/Table';
import SupportTicketModal from '@/app/ui/modals/SupportTicketModal';
import { fetchSupportTicketsThunk } from '@/lib/appState/dashboard/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { SupportTicket } from '@/lib/types';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const SupportTable = () => {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | any>();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { supportTickets, totalPages } = useAppSelector(
    (state) => state.dashboardSlice,
  );
  let page = searchParams.get('page')
    ? parseInt(searchParams.get('page') as string)
    : 1;
  page = !page || page < 1 ? 1 : page;

  let query = searchParams.get('query') || '';

  useEffect(() => {
    dispatch(
      fetchSupportTicketsThunk({
        query,
        isAnswered,
        page,
        limit: 30,
      }),
    );
  }, [dispatch, page, isAnswered, query, supportTickets]);

  const columns = useMemo(
    () => [
      {
        Header: 'Номер',
        accessor: 'numberCol',
      },
      {
        Header: 'E-mail',
        accessor: 'emailCol',
      },
      {
        Header: 'Ім`я',
        accessor: 'nameCol',
      },
      {
        Header: 'Дата',
        accessor: 'activeDateCol',
      },
    ],
    [],
  );

  const data = useMemo(
    () =>
      supportTickets?.map((ticket) => ({
        numberCol: ticket.ticketNumber,
        emailCol: ticket.email,
        nameCol: ticket.name,
        activeDateCol: new Date(ticket.updatedAt).toLocaleDateString('uk-UA'),
        ticketId: ticket._id,
      })),
    [supportTickets],
  );

  const openModal = (ticketId: string) => {
    const ticket = supportTickets.find((ticket) => ticket._id === ticketId);
    setSelectedTicket(ticket);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const handleRowClick = (data: { ticketId: string }) => {
    openModal(data.ticketId);
  };

  const handleCheckboxChange = () => {
    setIsAnswered((prev) => !prev);
  };

  return (
    <div>
      <div className="flex gap-4">
        <label className={clsx('mb-2 flex w-fit items-center gap-2')}>
          Архівовані
          <input
            type="checkbox"
            name="role"
            onChange={() => handleCheckboxChange()}
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
      <SupportTicketModal
        isOpen={isOpen}
        closeModal={closeModal}
        ticket={selectedTicket}
      />
      <div className="mx-auto mt-5 w-fit">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
};

export default SupportTable;
