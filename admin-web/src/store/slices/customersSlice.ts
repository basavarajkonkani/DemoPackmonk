import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Customer } from '../../types';
import { mockCustomers } from '../../data/mockData';

interface CustomersState {
  items: Customer[];
  selectedCustomer: Customer | null;
  loading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  items: mockCustomers,
  selectedCustomer: null,
  loading: false,
  error: null,
};

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setCustomers: (state, action: PayloadAction<Customer[]>) => {
      state.items = action.payload;
      state.error = null;
    },
    updateCustomer: (state, action: PayloadAction<Customer>) => {
      const index = state.items.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    selectCustomer: (state, action: PayloadAction<Customer | null>) => {
      state.selectedCustomer = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCustomers, updateCustomer, selectCustomer, setLoading, setError } =
  customersSlice.actions;

export default customersSlice.reducer;
