'use client';

import { fetchUsersStatsThunk } from '@/lib/appState/dashboard/operations';
import { setCheckbox } from '@/lib/appState/dashboard/slice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import clsx from 'clsx';
import React, { useEffect } from 'react';

const UsersStats = () => {
  const dispatch = useAppDispatch();
  const { usersStats, userTableCheckboxesStatus } = useAppSelector(
    (state) => state.dashboardSlice,
  );

  useEffect(() => {
    dispatch(fetchUsersStatsThunk());
  }, [dispatch]);

  const handleBoxClick = () => {
    dispatch(setCheckbox('isUserVerified'));
  };

  return (
    <div
      onClick={() => {
        handleBoxClick();
      }}
      className={clsx(
        'rounded-lg border border-gray-400 px-4 py-2 transition-all hover:scale-110 active:bg-gray-400',
        !userTableCheckboxesStatus.isUserVerified && 'bg-gray-400',
        usersStats.notVerified >= 1 &&
          'border-red-400 shadow-md shadow-red-700',
      )}
    >
      Не верифікованих: <strong> {usersStats.notVerified}</strong>
    </div>
  );
};

export default UsersStats;
