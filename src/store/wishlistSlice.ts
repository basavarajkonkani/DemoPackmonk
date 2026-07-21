import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as wishlistRepo from '../services/repositories/wishlistRepository';
import type { WishlistItem } from '../services/repositories/wishlistRepository';

export type { WishlistItem } from '../services/repositories/wishlistRepository';

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
}

const initialState: WishlistState = { items: [], loading: false };

export const fetchWishlist = createAsyncThunk('wishlist/fetchAll', async () => wishlistRepo.listWishlist());

export const toggleWishlistThunk = createAsyncThunk(
  'wishlist/toggle',
  async (item: Omit<WishlistItem, 'id' | 'addedAt'>) => {
    const added = await wishlistRepo.toggleWishlist(item);
    return { item, added };
  }
);

export const removeFromWishlistThunk = createAsyncThunk('wishlist/remove', async (id: string) => {
  await wishlistRepo.removeFromWishlist(id);
  return id;
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(toggleWishlistThunk.fulfilled, (state, action) => {
        if (action.payload.added) {
          state.items.push({
            ...action.payload.item,
            id: `wish_${action.payload.item.productId}`,
            addedAt: new Date().toISOString().split('T')[0],
          });
        } else {
          state.items = state.items.filter((w) => w.productId !== action.payload.item.productId);
        }
      })
      .addCase(removeFromWishlistThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((w) => w.id !== action.payload);
      });
  },
});

export default wishlistSlice.reducer;
export const selectWishlist = (state: { wishlist: WishlistState }) => state.wishlist.items;
export const selectIsWishlisted = (productId: string) => (state: { wishlist: WishlistState }) =>
  state.wishlist.items.some((w) => w.productId === productId);
