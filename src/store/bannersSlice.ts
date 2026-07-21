import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as bannersRepo from '../services/repositories/bannersRepository';
import type { Banner } from '../services/repositories/bannersRepository';

export type { Banner } from '../services/repositories/bannersRepository';

interface BannersState {
  items: Banner[];
  loading: boolean;
  error: string | null;
}

const initialState: BannersState = { items: [], loading: false, error: null };

export const fetchBanners = createAsyncThunk('banners/fetchAll', async () => bannersRepo.listBanners());

export const createBannerThunk = createAsyncThunk(
  'banners/create',
  async (input: Omit<Banner, 'id' | 'clicks' | 'impressions'>) => bannersRepo.createBanner(input)
);

export const updateBannerThunk = createAsyncThunk('banners/update', async (banner: Banner) =>
  bannersRepo.updateBanner(banner)
);

export const deleteBannerThunk = createAsyncThunk('banners/delete', async (id: string) => {
  await bannersRepo.deleteBanner(id);
  return id;
});

export const setBannerStatusThunk = createAsyncThunk(
  'banners/setStatus',
  async ({ id, status }: { id: string; status: Banner['status'] }) => {
    await bannersRepo.setBannerStatus(id, status);
    return { id, status };
  }
);

const bannersSlice = createSlice({
  name: 'banners',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load banners';
      })
      .addCase(createBannerThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateBannerThunk.fulfilled, (state, action) => {
        const idx = state.items.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteBannerThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b.id !== action.payload);
      })
      .addCase(setBannerStatusThunk.fulfilled, (state, action) => {
        const banner = state.items.find((b) => b.id === action.payload.id);
        if (banner) banner.status = action.payload.status;
      });
  },
});

export default bannersSlice.reducer;
export const selectBanners = (state: { banners: BannersState }) => state.banners.items;
