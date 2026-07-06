'use client';

import Pagination from '@/app/ui/Pagination';
import Table from '@/app/ui/Table';
import { fetchOrdersThunk, updateOrderThunk } from '@/lib/appState/dashboard/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import AdminOrderModal from '@/app/ui/modals/AdminOrderModal';
import { Order, OrderStatusEnum } from '@/lib/types';
import { fetchCurrencyRatesThunk } from '@/lib/appState/main/operations';
import { selectUSDRate } from '@/lib/appState/main/selectors';
import { Button } from '@/app/ui/buttons/button';
import { printOrderExcel } from '@/lib/utils';
import clsx from 'clsx';
import {
  Layers,
  Clock,
  CreditCard,
  PackageOpen,
  Truck,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Eye,
  ChevronDown
} from 'lucide-react';
import { toast } from 'react-toastify';

type OrderTableRow = {
  numberCol: string;
  dateCol: string;
  loginCol: string;
  statusCol: string;
  commentCol: string;
  totalPrice: number;
  actionsCol: string;
};

export const orderStatusEnum = [
  'всі',
  'очікує підтвердження',
  'очікує оплати',
  'комплектується',
  'відправлено',
  'замовлення виконано',
  'замовлення скасовано',
] as const;

type StatusType = (typeof orderStatusEnum)[number];

const OrderTable = ({ isRetail = false }: { isRetail: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openDropdownCode, setOpenDropdownCode] = useState<string | null>(null);
  
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { orders, totalPages, orderStats } = useAppSelector((state) => state.dashboardSlice);
  const usdRate = useAppSelector(selectUSDRate);

  const openModal = (id: string) => {
    const order = orders.find((order) => order.orderCode === id) ?? null;
    setSelectedOrder(order);
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);

  // Read status, page, query from URL search parameters
  let page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;
  page = !page || page < 1 ? 1 : page;
  
  const query = searchParams.get('query') || '';
  const status = (searchParams.get('status') as StatusType) || 'всі';

  useEffect(() => {
    dispatch(fetchOrdersThunk({ page, query, limit: 20, isRetail, status }));
  }, [dispatch, page, query, isRetail, status]);

  const handleRowClick = (targetRow: OrderTableRow) => {
    openModal(targetRow.numberCol);
  };

  const handleStatusChange = (order: Order, newStatus: OrderStatusEnum) => {
    if (order.status === newStatus) return;

    if (
      confirm(
        `Ви впевнені, що хочете змінити статус замовлення №${order.orderCode} на "${newStatus}"?`
      )
    ) {
      const normalizeProducts =
        order.products
          ?.filter((product) => product?.product?.id)
          ?.map((product) => ({
            id: product.id,
            quantity: product.quantity || 0,
            totalPriceByOneProduct: product.totalPriceByOneProduct || 0,
            product: product.product.id,
            price: product.price || 0,
          })) || [];

      const updatedOrder = {
        ...order,
        products: normalizeProducts,
        status: newStatus,
      };

      const {
        user: _user,
        orderCode: _orderCode,
        createdAt: _createdAt,
        updatedAt: _updatedAt,
        usdRate: _usdRate,
        ...updatedOrderWithoutUser
      } = updatedOrder;

      dispatch(
        updateOrderThunk({
          orderId: order.id,
          updateOrder: updatedOrderWithoutUser,
          isRetail,
        })
      )
        .unwrap()
        .then(() => {
          // Refetch order statistics & table list to reflect counts change
          dispatch(fetchOrdersThunk({ page, query, limit: 20, isRetail, status }));
        })
        .catch(() => {
          toast.error('Не вдалося оновити статус замовлення');
        });
    }
  };

  const handleExcelClick = async (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    toast.info(`Формування Excel файлу для замовлення №${order.orderCode}...`);
    await printOrderExcel(order);
  };

  const handleFilterClick = (statusValue: StatusType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('status', statusValue);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const getStatusStyle = (st: OrderStatusEnum) => {
    switch (st) {
      case OrderStatusEnum.OrderCompleted:
        return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
      case OrderStatusEnum.OrderCancelled:
        return 'bg-red-50 text-red-700 ring-red-600/20';
      case OrderStatusEnum.PendingConfirmation:
        return 'bg-amber-50 text-amber-700 ring-amber-600/20';
      case OrderStatusEnum.PendingPayment:
        return 'bg-blue-50 text-blue-700 ring-blue-600/20';
      case OrderStatusEnum.BeingCompiled:
        return 'bg-cyan-50 text-cyan-700 ring-cyan-600/20';
      case OrderStatusEnum.Shipped:
        return 'bg-indigo-50 text-indigo-700 ring-indigo-600/20';
      default:
        return 'bg-neutral-50 text-neutral-700 ring-neutral-600/20';
    }
  };

  const data = useMemo<OrderTableRow[]>(() => {
    return orders.map((order) => ({
      numberCol: order.orderCode,
      dateCol: new Date(order.createdAt).toLocaleDateString('uk-UA'),
      loginCol: '', // Rendered dynamically inside cells
      statusCol: order.status,
      commentCol: order.comment,
      totalPrice: !isRetail ? Math.ceil(order.totalPrice * usdRate) : order.totalPrice,
      actionsCol: '', // Rendered dynamically
    }));
  }, [orders, usdRate, isRetail]);

  const columns = useMemo<ColumnDef<OrderTableRow>[]>(
    () => [
      {
        header: 'Номер',
        accessorKey: 'numberCol',
        cell: ({ row }) => (
          <span className="font-bold text-neutral-900">№ {row.original.numberCol}</span>
        ),
      },
      {
        header: 'Дата',
        accessorKey: 'dateCol',
        cell: ({ row }) => (
          <span className="text-neutral-500 font-bold">{row.original.dateCol}</span>
        ),
      },
      {
        header: 'Клієнт',
        accessorKey: 'loginCol',
        cell: ({ row }) => {
          const order = orders.find((o) => o.orderCode === row.original.numberCol);
          if (!order) return <span className="text-neutral-400">—</span>;

          let name = '';
          let subDetails = '';
          let phone = '';
          let email = '';

          if (order.user) {
            if ('userId' in order.user && order.user.userId) {
              const u = order.user.userId;
              name = `${u.firstName || ''} ${u.lastName || ''}`.trim() || order.user.login;
              phone = u.phone || '';
              email = u.email || '';
              if (u.edrpou) {
                subDetails = `B2B · ЄДРПОУ: ${u.edrpou}`;
              } else {
                subDetails = 'B2B Клієнт';
              }
            } else if ('firstName' in order.user) {
              const u = order.user;
              name = `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Користувач B2B';
              phone = u.phone || '';
              email = u.email || '';
              subDetails = 'B2B Клієнт';
            } else {
              name = order.user.login || 'Користувач B2B';
              subDetails = 'B2B Клієнт';
            }
          } else {
            name = `${order.guestFirstName || ''} ${order.guestLastName || ''}`.trim() || 'Гість';
            phone = order.guestPhone || '';
            email = order.guestEmail || '';
            subDetails = 'Роздрібний гість';
          }

          return (
            <div className="flex flex-col gap-0.5 text-xs text-neutral-800">
              <span className="font-bold text-neutral-900">{name}</span>
              {subDetails && (
                <span className="font-bold text-blue-600 text-[10px] uppercase tracking-wider">
                  {subDetails}
                </span>
              )}
              <div className="flex flex-col text-[10px] text-neutral-400 font-semibold mt-0.5">
                {phone && <span>📞 {phone}</span>}
                {email && <span>✉️ {email}</span>}
              </div>
            </div>
          );
        },
      },
      {
        header: 'Статус',
        accessorKey: 'statusCol',
        cell: ({ row }) => {
          const order = orders.find((o) => o.orderCode === row.original.numberCol);
          if (!order) return <span className="text-neutral-700">{row.original.statusCol}</span>;

          const handleStatusClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            setOpenDropdownCode(openDropdownCode === order.orderCode ? null : order.orderCode);
          };

          return (
            <div className="relative">
              <button
                type="button"
                onClick={handleStatusClick}
                className={clsx(
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset cursor-pointer transition-all hover:brightness-95',
                  getStatusStyle(order.status)
                )}
              >
                <span>{order.status}</span>
                <ChevronDown size={11} className="stroke-[3]" />
              </button>

              {openDropdownCode === order.orderCode && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdownCode(null);
                    }}
                  />
                  <div className="absolute left-0 mt-1.5 z-50 w-56 rounded-xl bg-white p-1 shadow-lg border border-neutral-200/80 animate-fade-in">
                    {Object.values(OrderStatusEnum).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownCode(null);
                          handleStatusChange(order, st);
                        }}
                        className={clsx(
                          'block w-full rounded-lg px-3 py-1.5 text-left text-xs font-bold text-neutral-700 hover:bg-neutral-50 hover:text-black transition-colors duration-150',
                          order.status === st && 'bg-blue-50 text-blue-600'
                        )}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        },
      },
      {
        header: 'Коментар',
        accessorKey: 'commentCol',
        cell: ({ row }) => (
          <span
            className={clsx(
              'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold',
              row.original.commentCol
                ? 'bg-amber-50 text-amber-800'
                : 'bg-neutral-50 text-neutral-400'
            )}
          >
            {row.original.commentCol ? 'Так' : 'Немає'}
          </span>
        ),
      },
      {
        header: 'Сума зам. грн',
        accessorKey: 'totalPrice',
        cell: ({ row }) => (
          <span className="font-extrabold text-neutral-800">
            {row.original.totalPrice.toLocaleString('uk-UA')} ₴
          </span>
        ),
      },
      {
        header: 'Дії',
        accessorKey: 'actionsCol',
        cell: ({ row }) => {
          const order = orders.find((o) => o.orderCode === row.original.numberCol);
          if (!order) return null;

          return (
            <div className="flex items-center justify-center gap-1.5">
              <button
                type="button"
                onClick={(e) => handleExcelClick(e, order)}
                title="Скачати Excel"
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-neutral-50 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 border border-neutral-200/40"
              >
                <FileSpreadsheet size={16} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(order.orderCode);
                }}
                title="Детальніше"
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-neutral-50 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 border border-neutral-200/40"
              >
                <Eye size={16} />
              </button>
            </div>
          );
        },
      },
    ],
    [orders, openDropdownCode],
  );

  // Compute status cards stats
  const statsList = useMemo(() => {
    const totalCount = Object.values(orderStats || {}).reduce((a, b) => a + b, 0);

    return [
      {
        id: 'всі',
        label: 'Всі замовлення',
        count: totalCount,
        color: 'border-blue-500 shadow-blue-50 text-blue-600',
        bg: 'bg-blue-50/50',
        icon: <Layers size={18} />,
        active: status === 'всі',
      },
      {
        id: 'очікує підтвердження',
        label: 'Очікує підтвердження',
        count: orderStats?.['очікує підтвердження'] || 0,
        color: 'border-amber-500 shadow-amber-50 text-amber-600',
        bg: 'bg-amber-50/50',
        icon: <Clock size={18} />,
        active: status === 'очікує підтвердження',
      },
      {
        id: 'очікує оплати',
        label: 'Очікує оплати',
        count: orderStats?.['очікує оплати'] || 0,
        color: 'border-blue-500 shadow-blue-50 text-blue-600',
        bg: 'bg-blue-50/50',
        icon: <CreditCard size={18} />,
        active: status === 'очікує оплати',
      },
      {
        id: 'комплектується',
        label: 'Комплектується',
        count: orderStats?.['комплектується'] || 0,
        color: 'border-cyan-500 shadow-cyan-50 text-cyan-600',
        bg: 'bg-cyan-50/50',
        icon: <PackageOpen size={18} />,
        active: status === 'комплектується',
      },
      {
        id: 'відправлено',
        label: 'Відправлено',
        count: orderStats?.['відправлено'] || 0,
        color: 'border-indigo-500 shadow-indigo-50 text-indigo-600',
        bg: 'bg-indigo-50/50',
        icon: <Truck size={18} />,
        active: status === 'відправлено',
      },
      {
        id: 'замовлення виконано',
        label: 'Виконано',
        count: orderStats?.['замовлення виконано'] || 0,
        color: 'border-emerald-500 shadow-emerald-50 text-emerald-600',
        bg: 'bg-emerald-50/50',
        icon: <CheckCircle2 size={18} />,
        active: status === 'замовлення виконано',
      },
      {
        id: 'замовлення скасовано',
        label: 'Скасовано',
        count: orderStats?.['замовлення скасовано'] || 0,
        color: 'border-red-500 shadow-red-50 text-red-600',
        bg: 'bg-red-50/50',
        icon: <XCircle size={18} />,
        active: status === 'замовлення скасовано',
      },
    ];
  }, [orderStats, status]);

  if (usdRate === 41.0) {
    return (
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl">Використовується резервний курс валюти</h2>
        <p className="text-gray-600">USD: {usdRate} (резервний курс)</p>
        <Button
          className="text-white"
          onClick={() => {
            dispatch(fetchCurrencyRatesThunk());
          }}
        >
          Спробувати оновити курс
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Interactive Status Cards Row */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 select-none">
        {statsList.map((st) => (
          <button
            key={st.id}
            type="button"
            onClick={() => handleFilterClick(st.id as StatusType)}
            className={clsx(
              'flex flex-col justify-between rounded-xl border p-4 text-left shadow-sm transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:scale-98',
              st.active
                ? [st.color, st.bg, 'border-2 ring-1 ring-neutral-100 shadow-md']
                : 'border-neutral-200/60 bg-white hover:shadow-md'
            )}
          >
            <div className="flex w-full items-center justify-between gap-1.5 text-neutral-400">
              <span className="text-[10px] font-bold uppercase tracking-wider truncate">
                {st.label}
              </span>
              <span className={clsx(st.active ? st.color : 'text-neutral-400')}>
                {st.icon}
              </span>
            </div>
            <span className={clsx('text-xl font-extrabold mt-2', st.active ? 'text-neutral-900' : 'text-neutral-800')}>
              {st.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-xl border border-neutral-200/50 shadow-sm">
        <Table
          columns={columns}
          data={data}
          headerColor="bg-neutral-50/70"
          borderColor="border-neutral-200"
          scrollTrigger={page}
        />
      </div>

      <div className="mx-auto mt-6 w-fit">
        <Pagination totalPages={totalPages} />
      </div>

      <AdminOrderModal
        closeModal={closeModal}
        isOpen={isOpen}
        order={selectedOrder}
        isRetail={isRetail}
      />
    </div>
  );
};

export default OrderTable;
