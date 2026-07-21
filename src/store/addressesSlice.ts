import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as addressesRepo from '../services/repositories/addressesRepository';
import type { Address } from '../services/repositories/addressesRepository';

export type { Address } from '../services/repositories/addressesRepository';

interface AddressesState {
  items: Address[];
  loading: boolean;
}

const initialState: AddressesState = { items: [], loading: false };

export const fetchAddresses = createAsyncThunk('addresses/fetchAll', async () => addressesRepo.listAddresses());

export const createAddressThunk = createAsyncThunk(
  'addresses/create',
  async (input: Omit<Address, 'id'>) => addressesRepo.createAddress(input)
);

export const updateAddressThunk = createAsyncThunk('addresses/update', async (address: Address) =>
  addressesRepo.updateAddress(address)
);

export const deleteAddressThunk = createAsyncThunk('addresses/delete', async (id: string) => {
  await addressesRepo.deleteAddress(id);
  return id;
});

export const setDefaultAddressThunk = createAsyncThunk('addresses/setDefault', async (id: string) => {
  await addressesRepo.setDefaultAddress(id);
  return id;
});

const addressesSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(createAddressThunk.fulfilled, (state, action) => {
        if (action.payload.isDefault) state.items.forEach((a) => (a.isDefault = false));
        state.items.push(action.payload);
      })
      .addCase(updateAddressThunk.fulfilled, (state, action) => {
        if (action.payload.isDefault) state.items.forEach((a) => (a.isDefault = false));
        const idx = state.items.findIndex((a) => a.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteAddressThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((a) => a.id !== action.payload);
      })
      .addCase(setDefaultAddressThunk.fulfilled, (state, action) => {
        state.items.forEach((a) => (a.isDefault = a.id === action.payload));
      });
  },
});

export default addressesSlice.reducer;
export const selectAddresses = (state: { addresses: AddressesState }) => state.addresses.items;
