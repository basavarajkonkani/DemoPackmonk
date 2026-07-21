import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order, OrderNote } from '../../types';
import { mockOrders } from '../../data/mockData';
import { readList, writeList } from '../../services/storage';

const STORE_NAME = 'orders';

interface OrdersState {
  items: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  items: readList(STORE_NAME, mockOrders),
  selectedOrder: null,
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.items = action.payload;
      state.error = null;
      writeList(STORE_NAME, state.items);
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      const index = state.items.findIndex((o) => o.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        if (state.selectedOrder?.id === action.payload.id) {
          state.selectedOrder = action.payload;
        }
        writeList(STORE_NAME, state.items);
      }
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: any }>) => {
      const order = state.items.find((o) => o.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
        order.updatedAt = new Date().toISOString();
        if (state.selectedOrder?.id === action.payload.orderId) {
          state.selectedOrder = order;
        }
        writeList(STORE_NAME, state.items);
      }
    },
    updateProductionStage: (state, action: PayloadAction<{ orderId: string; stage: any }>) => {
      const order = state.items.find((o) => o.id === action.payload.orderId);
      if (order) {
        order.productionStage = action.payload.stage;
        order.updatedAt = new Date().toISOString();
        if (state.selectedOrder?.id === action.payload.orderId) {
          state.selectedOrder = order;
        }
        writeList(STORE_NAME, state.items);
      }
    },
    addOrderNote: (state, action: PayloadAction<{ orderId: string; note: OrderNote }>) => {
      const order = state.items.find((o) => o.id === action.payload.orderId);
      if (order) {
        if (!order.notes) {
          order.notes = [];
        }
        order.notes.push(action.payload.note);
        order.updatedAt = new Date().toISOString();
        if (state.selectedOrder?.id === action.payload.orderId) {
          state.selectedOrder = order;
        }
        writeList(STORE_NAME, state.items);
      }
    },
    approveArtwork: (state, action: PayloadAction<{ orderId: string; artworkId: string }>) => {
      const order = state.items.find((o) => o.id === action.payload.orderId);
      if (order && order.artworks) {
        const artwork = order.artworks.find((a) => a.id === action.payload.artworkId);
        if (artwork) {
          artwork.status = 'approved';
          order.productionStage = 'artwork_approved';
          order.updatedAt = new Date().toISOString();
          if (state.selectedOrder?.id === action.payload.orderId) {
            state.selectedOrder = order;
          }
          writeList(STORE_NAME, state.items);
        }
      }
    },
    rejectArtwork: (state, action: PayloadAction<{ orderId: string; artworkId: string; feedback: string }>) => {
      const order = state.items.find((o) => o.id === action.payload.orderId);
      if (order && order.artworks) {
        const artwork = order.artworks.find((a) => a.id === action.payload.artworkId);
        if (artwork) {
          artwork.status = 'rejected';
          artwork.feedback = action.payload.feedback;
          order.updatedAt = new Date().toISOString();
          if (state.selectedOrder?.id === action.payload.orderId) {
            state.selectedOrder = order;
          }
          writeList(STORE_NAME, state.items);
        }
      }
    },
    selectOrder: (state, action: PayloadAction<Order | null>) => {
      state.selectedOrder = action.payload;
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
  setOrders, 
  updateOrder, 
  updateOrderStatus,
  updateProductionStage,
  addOrderNote,
  approveArtwork,
  rejectArtwork,
  selectOrder, 
  setLoading, 
  setError 
} = ordersSlice.actions;

export default ordersSlice.reducer;
