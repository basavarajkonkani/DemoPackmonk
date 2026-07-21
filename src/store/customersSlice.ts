import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as customersRepo from '../services/repositories/customersRepository';
import type { Customer } from '../services/repositories/customersRepository';

export type { Customer } from '../services/repositories/customersRepository';

interface CustomersState {
  items: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomersState = { items: [], loading: false, error: null };

export const fetchCustomers = createAsyncThunk('customers/fetchAll', async () => {
  return customersRepo.listCustomers();
});

export const createCustomerThunk = createAsyncThunk(
  'customers/create',
  async (input: Omit<Customer, 'id' | 'registeredAt'>) => customersRepo.createCustomer(input)
);

export const updateCustomerThunk = createAsyncThunk(
  'customers/update',
  async (customer: Customer) => customersRepo.updateCustomer(customer)
);

export const deleteCustomerThunk = createAsyncThunk('customers/delete', async (id: string) => {
  await customersRepo.deleteCustomer(id);
  return id;
});

export const setCustomerCreditThunk = createAsyncThunk(
  'customers/setCredit',
  async ({ id, creditLimit, creditStatus }: { id: string; creditLimit: number; creditStatus: Customer['creditStatus'] }) =>
    customersRepo.setCustomerCredit(id, creditLimit, creditStatus)
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load customers';
      })
      .addCase(createCustomerThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateCustomerThunk.fulfilled, (state, action) => {
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteCustomerThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      })
      .addCase(setCustomerCreditThunk.fulfilled, (state, action: PayloadAction<Customer | null>) => {
        if (!action.payload) return;
        const idx = state.items.findIndex((c) => c.id === action.payload!.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export default customersSlice.reducer;
export const selectCustomers = (state: { customers: CustomersState }) => state.customers.items;
export const selectCustomersLoading = (state: { customers: CustomersState }) => state.customers.loading;
