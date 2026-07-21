import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as profileRepo from '../services/repositories/profileRepository';
import type { CompanyProfile } from '../services/repositories/profileRepository';

export type { CompanyProfile } from '../services/repositories/profileRepository';

interface ProfileState {
  data: CompanyProfile | null;
  loading: boolean;
}

const initialState: ProfileState = { data: null, loading: false };

export const fetchProfile = createAsyncThunk('profile/fetch', async () => profileRepo.getProfile());

export const updateProfileThunk = createAsyncThunk('profile/update', async (profile: CompanyProfile) =>
  profileRepo.updateProfile(profile)
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default profileSlice.reducer;
export const selectCompanyProfile = (state: { profile: ProfileState }) => state.profile.data;
