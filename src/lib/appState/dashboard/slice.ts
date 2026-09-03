import { createSlice } from '@reduxjs/toolkit';

export type { GmcStatusType } from '../api/dashboardApi';

/**
 * @deprecated All dashboard CRM state (users, orders, support tickets, stats, GMC)
 * has been migrated to RTK Query (`dashboardApi.ts`).
 * This slice is retained as an empty shell for store type backward compatibility until final cleanup.
 */
const Slice = createSlice({
  name: 'dashboard',
  initialState: {},
  reducers: {},
});

export const dashboardSlice = Slice.reducer;
