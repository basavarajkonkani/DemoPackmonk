import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as supportRepo from '../services/repositories/supportRepository';
import type { SupportTicket, TicketStatus } from '../services/repositories/supportRepository';

export type { SupportTicket, TicketStatus } from '../services/repositories/supportRepository';

interface SupportState {
  tickets: SupportTicket[];
  loading: boolean;
}

const initialState: SupportState = { tickets: [], loading: false };

export const fetchTickets = createAsyncThunk('support/fetchAll', async () => supportRepo.listTickets());

export const createTicketThunk = createAsyncThunk(
  'support/create',
  async (input: { subject: string; message: string }) => supportRepo.createTicket(input)
);

export const updateTicketStatusThunk = createAsyncThunk(
  'support/updateStatus',
  async ({ id, status }: { id: string; status: TicketStatus }) => {
    await supportRepo.updateTicketStatus(id, status);
    return { id, status };
  }
);

const supportSlice = createSlice({
  name: 'support',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(createTicketThunk.fulfilled, (state, action) => {
        state.tickets.unshift(action.payload);
      })
      .addCase(updateTicketStatusThunk.fulfilled, (state, action) => {
        const ticket = state.tickets.find((t) => t.id === action.payload.id);
        if (ticket) ticket.status = action.payload.status;
      });
  },
});

export default supportSlice.reducer;
export const selectTickets = (state: { support: SupportState }) => state.support.tickets;
