'use client';

import { fetchUsersStatsThunk } from '@/lib/appState/dashboard/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import React, { useEffect } from 'react';

const UsersStats = () => {
  const dispatch = useAppDispatch();
  const { notVerified } = useAppSelector(
    (state) => state.dashboardSlice.usersStats,
  );

  useEffect(() => {
    console.log('UsersStats');
    dispatch(fetchUsersStatsThunk());
  }, [dispatch]);

  return (
    <div className="rounded-lg border border-gray-400 px-4 py-2">
      Не верифікованих: <strong> {notVerified}</strong>
    </div>
  );
};

export default UsersStats;
