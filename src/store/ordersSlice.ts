import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as ordersRepo from '../services/repositories/ordersRepository';
import type { Order, OrderStatus } from '../services/repositories/ordersRepository';

export type { Order, OrderStatus, OrderMilestone, ShippingAddress } from '../services/repositories/ordersRepository';
// Backward-compat alias used by a few screens
export type PackagingOrder = Order;

interface OrdersState {
  items: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk('orders/fetchAll', async () => {
  return ordersRepo.listOrders();
});

export const placeOrder = createAsyncThunk(
  'orders/place',
  async (order: Omit<Order, 'id' | 'milestones'> & { milestones?: Order['milestones'] }) => {
    return ordersRepo.createOrder(order);
  }
);

export const changeOrderStatus = createAsyncThunk(
  'orders/changeStatus',
  async ({ id, status }: { id: string; status: OrderStatus }) => {
    return ordersRepo.updateOrderStatus(id, status);
  }
);

export const cancelOrderThunk = createAsyncThunk('orders/cancel', async (id: string) => {
  return ordersRepo.cancelOrder(id);
});

export const addOrderNoteThunk = createAsyncThunk(
  'orders/addNote',
  async ({ id, note }: { id: string; note: string }) => {
    return ordersRepo.addOrderNote(id, note);
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load orders';
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });

    const applyUpdate = (state: OrdersState, action: PayloadAction<Order | null>) => {
      if (!action.payload) return;
      const idx = state.items.findIndex((o) => o.id === action.payload!.id);
      if (idx !== -1) state.items[idx] = action.payload;
    };
    builder.addCase(changeOrderStatus.fulfilled, applyUpdate);
    builder.addCase(cancelOrderThunk.fulfilled, applyUpdate);
    builder.addCase(addOrderNoteThunk.fulfilled, applyUpdate);
  },
});

export default ordersSlice.reducer;

export const selectOrdersList = (state: { orders: OrdersState }) => state.orders.items;
export const selectActiveOrdersCount = (state: { orders: OrdersState }) =>
  state.orders.items.filter((order) => order.status !== 'delivered' && order.status !== 'cancelled').length;
export const selectTotalBusinessSpending = (state: { orders: OrdersState }) =>
  state.orders.items.reduce((sum, order) => sum + order.total, 0);
export const selectOrdersLoading = (state: { orders: OrdersState }) => state.orders.loading;
