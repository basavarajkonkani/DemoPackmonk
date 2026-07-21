import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as invoicesRepo from '../services/repositories/invoicesRepository';
import type { Invoice } from '../services/repositories/invoicesRepository';

export type { Invoice } from '../services/repositories/invoicesRepository';

interface InvoicesState {
  items: Invoice[];
  loading: boolean;
}

const initialState: InvoicesState = { items: [], loading: false };

export const fetchInvoices = createAsyncThunk('invoices/fetchAll', async () => invoicesRepo.listInvoices());

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      });
  },
});

export default invoicesSlice.reducer;
export const selectInvoices = (state: { invoices: InvoicesState }) => state.invoices.items;
