'use client';

import { fetchUsersStatsThunk } from '@/lib/appState/dashboard/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import { Users, Briefcase, User, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';

const UsersStats = () => {
  const dispatch = useAppDispatch();
  const { usersStats } = useAppSelector((state) => state.dashboardSlice);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    dispatch(fetchUsersStatsThunk());
  }, [dispatch]);

  const activeTab = searchParams.get('tab') || 'all';
  const activeVerified = searchParams.get('verified') || 'all';

  const updateFilters = (tab: string, verified: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    params.set('page', '1');
    if (tab) params.set('tab', tab);
    if (verified) params.set('verified', verified);
    router.push(`${pathname}?${params.toString()}`);
  };

  const statsData = [
    {
      id: 'total',
      label: 'Всього користувачів',
      value: usersStats?.total || 0,
      icon: <Users className="h-6 w-6 text-blue-600" />,
      iconBg: 'bg-blue-50',
      borderActive: 'border-blue-500 shadow-blue-100',
      active: activeTab === 'all' && activeVerified === 'all',
      onClick: () => updateFilters('all', 'all'),
    },
    {
      id: 'b2b',
      label: 'Гурт (B2B)',
      value: usersStats?.b2b || 0,
      icon: <Briefcase className="h-6 w-6 text-amber-600" />,
      iconBg: 'bg-amber-50',
      borderActive: 'border-amber-500 shadow-amber-100',
      active: activeTab === 'b2b',
      onClick: () => updateFilters('b2b', 'all'),
    },
    {
      id: 'b2c',
      label: 'Роздріб (B2C)',
      value: usersStats?.b2c || 0,
      icon: <User className="h-6 w-6 text-emerald-600" />,
      iconBg: 'bg-emerald-50',
      borderActive: 'border-emerald-500 shadow-emerald-100',
      active: activeTab === 'b2c',
      onClick: () => updateFilters('b2c', 'all'),
    },
    {
      id: 'unverified',
      label: 'Не верифіковані',
      value: usersStats?.notVerified || 0,
      icon: <ShieldAlert className="h-6 w-6 text-red-600" />,
      iconBg: 'bg-red-50',
      borderActive: 'border-red-500 shadow-red-100',
      active: activeVerified === 'unverified',
      hasAlert: (usersStats?.notVerified || 0) > 0,
      onClick: () => updateFilters('all', 'unverified'),
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => (
        <button
          key={stat.id}
          type="button"
          onClick={stat.onClick}
          className={clsx(
            'flex items-center justify-between rounded-2xl border bg-white p-6 text-left shadow-sm transition-all duration-200 select-none hover:-translate-y-0.5 hover:shadow-md active:scale-98',
            stat.active
              ? [stat.borderActive, 'border-2 shadow-md ring-1 ring-neutral-200/50']
              : 'border-neutral-200/60',
            stat.id === 'unverified' &&
              stat.hasAlert &&
              !stat.active &&
              'border-red-200 bg-red-50/10 shadow-sm shadow-red-50',
          )}
        >
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
              {stat.label}
            </span>
            <span
              className={clsx(
                'text-3xl font-extrabold text-neutral-800',
                stat.id === 'unverified' && stat.hasAlert && 'text-red-600',
              )}
            >
              {stat.value}
            </span>
          </div>
          <div className={clsx('rounded-xl p-3.5', stat.iconBg)}>{stat.icon}</div>
        </button>
      ))}
    </div>
  );
};

export default UsersStats;
