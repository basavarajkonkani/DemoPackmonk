import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as designsRepo from '../services/repositories/designsRepository';
import type { SavedDesign } from '../services/repositories/designsRepository';

export type { SavedDesign } from '../services/repositories/designsRepository';

interface DesignsState {
  items: SavedDesign[];
  loading: boolean;
}

const initialState: DesignsState = { items: [], loading: false };

export const fetchDesigns = createAsyncThunk('designs/fetchAll', async () => designsRepo.listDesigns());

export const duplicateDesignThunk = createAsyncThunk('designs/duplicate', async (id: string) =>
  designsRepo.duplicateDesign(id)
);

export const deleteDesignsThunk = createAsyncThunk('designs/delete', async (ids: string[]) => {
  await designsRepo.deleteDesigns(ids);
  return ids;
});

const designsSlice = createSlice({
  name: 'designs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDesigns.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDesigns.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(duplicateDesignThunk.fulfilled, (state, action) => {
        if (action.payload) state.items.push(action.payload);
      })
      .addCase(deleteDesignsThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((d) => !action.payload.includes(d.id));
      });
  },
});

export default designsSlice.reducer;
export const selectDesigns = (state: { designs: DesignsState }) => state.designs.items;
