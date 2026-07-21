import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Customer } from '../../types';
import { mockCustomers } from '../../data/mockData';
import { readList, writeList, generateId } from '../../services/storage';

const STORE_NAME = 'customers';

interface CustomersState {
  items: Customer[];
  selectedCustomer: Customer | null;
  loading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  items: readList(STORE_NAME, mockCustomers),
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
      writeList(STORE_NAME, state.items);
    },
    addCustomer: (state, action: PayloadAction<Omit<Customer, 'id' | 'createdAt'>>) => {
      const customer: Customer = {
        ...action.payload,
        id: generateId('cust'),
        createdAt: new Date().toISOString().split('T')[0],
      };
      state.items.push(customer);
      writeList(STORE_NAME, state.items);
    },
    updateCustomer: (state, action: PayloadAction<Customer>) => {
      const index = state.items.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        if (state.selectedCustomer?.id === action.payload.id) {
          state.selectedCustomer = action.payload;
        }
        writeList(STORE_NAME, state.items);
      }
    },
    deleteCustomer: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((c) => c.id !== action.payload);
      writeList(STORE_NAME, state.items);
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

export const {
  setCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  selectCustomer,
  setLoading,
  setError,
} = customersSlice.actions;

export default customersSlice.reducer;
