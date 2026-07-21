import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Banner } from '../../types';
import { mockBanners } from '../../data/mockData';
import { readList, writeList, generateId } from '../../services/storage';

/**
 * CRITICAL FIX: This slice did not exist before. `BannersPage.tsx` was
 * reading `state.banners.items` (always `undefined`, since `banners` was
 * never registered as a reducer in store/index.ts) and managing all CRUD
 * in local component `useState`, meaning every banner added/edited was
 * lost on navigation away from the page. This slice + its registration in
 * store/index.ts fixes that.
 */

const STORE_NAME = 'banners';

interface BannersState {
  items: Banner[];
  loading: boolean;
  error: string | null;
}

const initialState: BannersState = {
  items: readList(STORE_NAME, mockBanners),
  loading: false,
  error: null,
};

const bannersSlice = createSlice({
  name: 'banners',
  initialState,
  reducers: {
    setBanners: (state, action: PayloadAction<Banner[]>) => {
      state.items = action.payload;
      writeList(STORE_NAME, state.items);
    },
    addBanner: (state, action: PayloadAction<Omit<Banner, 'id' | 'createdAt'>>) => {
      const banner: Banner = {
        ...action.payload,
        id: generateId('ban'),
        createdAt: new Date().toISOString().split('T')[0],
      };
      state.items.push(banner);
      writeList(STORE_NAME, state.items);
    },
    updateBanner: (state, action: PayloadAction<Banner>) => {
      const index = state.items.findIndex((b) => b.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        writeList(STORE_NAME, state.items);
      }
    },
    deleteBanner: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((b) => b.id !== action.payload);
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

export const { setBanners, addBanner, updateBanner, deleteBanner, setLoading, setError } =
  bannersSlice.actions;

export default bannersSlice.reducer;
