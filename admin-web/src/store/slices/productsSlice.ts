import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types';
import { mockProducts } from '../../data/mockData';
import { readList, writeList } from '../../services/storage';

const STORE_NAME = 'products';

interface ProductsState {
  items: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: readList(STORE_NAME, mockProducts),
  selectedProduct: null,
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
      state.error = null;
      writeList(STORE_NAME, state.items);
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
      writeList(STORE_NAME, state.items);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...action.payload, updatedAt: new Date().toISOString().split('T')[0] };
        writeList(STORE_NAME, state.items);
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
      writeList(STORE_NAME, state.items);
    },
    selectProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
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
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  selectProduct,
  setLoading,
  setError,
} = productsSlice.actions;

export default productsSlice.reducer;
