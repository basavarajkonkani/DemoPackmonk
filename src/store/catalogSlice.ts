import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as catalogRepo from '../services/repositories/catalogRepository';
import type { CatalogProduct } from '../services/repositories/catalogRepository';

export type { CatalogProduct, CatalogSizeOption } from '../services/repositories/catalogRepository';

interface CatalogState {
  items: CatalogProduct[];
  selectedProductId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: CatalogState = {
  items: [],
  selectedProductId: null,
  loading: false,
  error: null,
};

export const fetchCatalog = createAsyncThunk('catalog/fetchAll', async () => {
  return catalogRepo.listProducts();
});

export const createCatalogProduct = createAsyncThunk(
  'catalog/create',
  async (input: Omit<CatalogProduct, 'id' | 'createdAt' | 'updatedAt' | 'price'> & { price?: number }) => {
    return catalogRepo.createProduct(input);
  }
);

export const updateCatalogProduct = createAsyncThunk(
  'catalog/update',
  async (product: CatalogProduct) => {
    return catalogRepo.updateProduct(product);
  }
);

export const deleteCatalogProduct = createAsyncThunk('catalog/delete', async (id: string) => {
  await catalogRepo.deleteProduct(id);
  return id;
});

export const toggleCatalogProductActive = createAsyncThunk(
  'catalog/toggleActive',
  async ({ id, isActive }: { id: string; isActive: boolean }) => {
    await catalogRepo.setProductActive(id, isActive);
    return { id, isActive };
  }
);

export const setCatalogProductStock = createAsyncThunk(
  'catalog/setStock',
  async ({ id, stock }: { id: string; stock: number }) => {
    await catalogRepo.setProductStock(id, stock);
    return { id, stock };
  }
);

export const setCatalogProductPrice = createAsyncThunk(
  'catalog/setPrice',
  async ({ id, price }: { id: string; price: number }) => {
    await catalogRepo.setProductPrice(id, price);
    return { id, price };
  }
);

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    selectProduct: (state, action: PayloadAction<string>) => {
      state.selectedProductId = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProductId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCatalog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCatalog.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCatalog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load products';
      })
      .addCase(createCatalogProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateCatalogProduct.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteCatalogProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      })
      .addCase(toggleCatalogProductActive.fulfilled, (state, action) => {
        const product = state.items.find((p) => p.id === action.payload.id);
        if (product) product.isActive = action.payload.isActive;
      })
      .addCase(setCatalogProductStock.fulfilled, (state, action) => {
        const product = state.items.find((p) => p.id === action.payload.id);
        if (product) product.stock = action.payload.stock;
      })
      .addCase(setCatalogProductPrice.fulfilled, (state, action) => {
        const product = state.items.find((p) => p.id === action.payload.id);
        if (product) product.price = action.payload.price;
      });
  },
});

export const { selectProduct, clearSelectedProduct } = catalogSlice.actions;
export default catalogSlice.reducer;

export const selectCatalogItems = (state: { catalog: CatalogState }) => state.catalog.items;
export const selectActiveCatalogItems = (state: { catalog: CatalogState }) =>
  state.catalog.items.filter((p) => p.isActive);
export const selectCurrentCatalogProduct = (state: { catalog: CatalogState }) =>
  state.catalog.items.find((item) => item.id === state.catalog.selectedProductId) ?? null;
export const selectCatalogLoading = (state: { catalog: CatalogState }) => state.catalog.loading;
