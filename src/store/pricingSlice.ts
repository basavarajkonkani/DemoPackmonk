import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as pricingRepo from '../services/repositories/pricingRepository';
import type { PricingRule } from '../services/repositories/pricingRepository';

export type { PricingRule } from '../services/repositories/pricingRepository';

interface PricingState {
  rules: PricingRule[];
  loading: boolean;
  error: string | null;
}

const initialState: PricingState = { rules: [], loading: false, error: null };

export const fetchPricingRules = createAsyncThunk('pricing/fetchAll', async () => pricingRepo.listPricingRules());

export const createPricingRuleThunk = createAsyncThunk(
  'pricing/create',
  async (input: Omit<PricingRule, 'id'>) => pricingRepo.createPricingRule(input)
);

export const updatePricingRuleThunk = createAsyncThunk('pricing/update', async (rule: PricingRule) =>
  pricingRepo.updatePricingRule(rule)
);

export const deletePricingRuleThunk = createAsyncThunk('pricing/delete', async (id: string) => {
  await pricingRepo.deletePricingRule(id);
  return id;
});

const pricingSlice = createSlice({
  name: 'pricing',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPricingRules.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPricingRules.fulfilled, (state, action) => {
        state.loading = false;
        state.rules = action.payload;
      })
      .addCase(fetchPricingRules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load pricing rules';
      })
      .addCase(createPricingRuleThunk.fulfilled, (state, action) => {
        state.rules.push(action.payload);
      })
      .addCase(updatePricingRuleThunk.fulfilled, (state, action) => {
        const idx = state.rules.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.rules[idx] = action.payload;
      })
      .addCase(deletePricingRuleThunk.fulfilled, (state, action) => {
        state.rules = state.rules.filter((r) => r.id !== action.payload);
      });
  },
});

export default pricingSlice.reducer;
export const selectPricingRules = (state: { pricing: PricingState }) => state.pricing.rules;
