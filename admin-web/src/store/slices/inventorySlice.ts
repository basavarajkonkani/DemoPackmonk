import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InventoryItem } from '../../types';
import { mockInventory } from '../../data/mockData';
import { readList, writeList, generateId } from '../../services/storage';

const STORE_NAME = 'inventory';

interface InventoryState {
  items: InventoryItem[];
  loading: boolean;
  error: string | null;
}

function computeStatus(quantity: number, reorderLevel: number): InventoryItem['status'] {
  if (quantity <= 0) return 'out_of_stock';
  if (quantity < reorderLevel) return 'low_stock';
  return 'in_stock';
}

const initialState: InventoryState = {
  items: readList(STORE_NAME, mockInventory),
  loading: false,
  error: null,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setInventory: (state, action: PayloadAction<InventoryItem[]>) => {
      state.items = action.payload;
      state.error = null;
      writeList(STORE_NAME, state.items);
    },
    addInventoryItem: (state, action: PayloadAction<Omit<InventoryItem, 'id' | 'status'>>) => {
      const item: InventoryItem = {
        ...action.payload,
        id: generateId('inv'),
        status: computeStatus(action.payload.quantity, action.payload.reorderLevel),
      };
      state.items.push(item);
      writeList(STORE_NAME, state.items);
    },
    updateInventoryItem: (state, action: PayloadAction<InventoryItem>) => {
      const index = state.items.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        const updated = {
          ...action.payload,
          status: computeStatus(action.payload.quantity, action.payload.reorderLevel),
        };
        state.items[index] = updated;
        writeList(STORE_NAME, state.items);
      }
    },
    adjustStock: (state, action: PayloadAction<{ id: string; delta: number }>) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(0, item.quantity + action.payload.delta);
        item.status = computeStatus(item.quantity, item.reorderLevel);
        item.lastRestockDate = new Date().toISOString().split('T')[0];
        writeList(STORE_NAME, state.items);
      }
    },
    deleteInventoryItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      writeList(STORE_NAME, state.items);
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
  setInventory,
  addInventoryItem,
  updateInventoryItem,
  adjustStock,
  deleteInventoryItem,
  setLoading,
  setError,
} = inventorySlice.actions;

export default inventorySlice.reducer;
