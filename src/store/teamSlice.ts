import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as teamRepo from '../services/repositories/teamRepository';
import type { TeamMember } from '../services/repositories/teamRepository';

export type { TeamMember } from '../services/repositories/teamRepository';

interface TeamState {
  items: TeamMember[];
  loading: boolean;
}

const initialState: TeamState = { items: [], loading: false };

export const fetchTeam = createAsyncThunk('team/fetchAll', async () => teamRepo.listTeamMembers());

export const inviteTeamMemberThunk = createAsyncThunk(
  'team/invite',
  async (input: Omit<TeamMember, 'id' | 'addedAt' | 'isOwner'>) => teamRepo.inviteTeamMember(input)
);

export const updateTeamMemberThunk = createAsyncThunk('team/update', async (member: TeamMember) =>
  teamRepo.updateTeamMember(member)
);

export const removeTeamMemberThunk = createAsyncThunk('team/remove', async (id: string) => {
  await teamRepo.removeTeamMember(id);
  return id;
});

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeam.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(inviteTeamMemberThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateTeamMemberThunk.fulfilled, (state, action) => {
        const idx = state.items.findIndex((m) => m.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(removeTeamMemberThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((m) => m.id !== action.payload);
      });
  },
});

export default teamSlice.reducer;
export const selectTeam = (state: { team: TeamState }) => state.team.items;
