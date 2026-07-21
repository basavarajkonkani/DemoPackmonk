import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as repo from '../services/repositories/configurableCatalogRepository';
import type { PackagingProduct } from '../services/repositories/configurableCatalogRepository';

export type {
  PackagingProduct,
  ProductMaterial,
  DimensionConfig,
  BulkDiscount,
} from '../services/repositories/configurableCatalogRepository';

interface ConfigurableCatalogState {
  items: PackagingProduct[];
  selectedProductId: string | null;
  loading: boolean;
}

const initialState: ConfigurableCatalogState = {
  items: [],
  selectedProductId: null,
  loading: false,
};

export const fetchConfigurableCatalog = createAsyncThunk('configurableCatalog/fetchAll', async () =>
  repo.listConfigurableProducts()
);

const configurableCatalogSlice = createSlice({
  name: 'configurableCatalog',
  initialState,
  reducers: {
    selectConfigurableProduct: (state, action: PayloadAction<string>) => {
      state.selectedProductId = action.payload;
    },
    clearSelectedConfigurableProduct: (state) => {
      state.selectedProductId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfigurableCatalog.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConfigurableCatalog.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      });
  },
});

export const { selectConfigurableProduct, clearSelectedConfigurableProduct } = configurableCatalogSlice.actions;
export default configurableCatalogSlice.reducer;

export const selectConfigurableProductsList = (state: { configurableCatalog: ConfigurableCatalogState }) =>
  state.configurableCatalog.items;
export const selectCurrentConfigurableProduct = (state: { configurableCatalog: ConfigurableCatalogState }) =>
  state.configurableCatalog.items.find((p) => p.id === state.configurableCatalog.selectedProductId) ?? null;
