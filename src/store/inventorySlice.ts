import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as inventoryRepo from '../services/repositories/inventoryRepository';
import type { InventoryItem } from '../services/repositories/inventoryRepository';

export type { InventoryItem } from '../services/repositories/inventoryRepository';

interface InventoryState {
  items: InventoryItem[];
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = { items: [], loading: false, error: null };

export const fetchInventory = createAsyncThunk('inventory/fetchAll', async () => inventoryRepo.listInventory());

export const createInventoryItemThunk = createAsyncThunk(
  'inventory/create',
  async (input: Omit<InventoryItem, 'id' | 'lastRestocked'>) => inventoryRepo.createInventoryItem(input)
);

export const updateInventoryItemThunk = createAsyncThunk(
  'inventory/update',
  async (item: InventoryItem) => inventoryRepo.updateInventoryItem(item)
);

export const setInventoryStockThunk = createAsyncThunk(
  'inventory/setStock',
  async ({ id, stock }: { id: string; stock: number }) => inventoryRepo.setInventoryStock(id, stock)
);

export const deleteInventoryItemThunk = createAsyncThunk('inventory/delete', async (id: string) => {
  await inventoryRepo.deleteInventoryItem(id);
  return id;
});

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load inventory';
      })
      .addCase(createInventoryItemThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateInventoryItemThunk.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(setInventoryStockThunk.fulfilled, (state, action: PayloadAction<InventoryItem | null>) => {
        if (!action.payload) return;
        const idx = state.items.findIndex((i) => i.id === action.payload!.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteInventoryItemThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      });
  },
});

export default inventorySlice.reducer;
export const selectInventory = (state: { inventory: InventoryState }) => state.inventory.items;
export const selectInventoryLoading = (state: { inventory: InventoryState }) => state.inventory.loading;
