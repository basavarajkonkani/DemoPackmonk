import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PricingRule } from '../../types';
import { readList, writeList, generateId } from '../../services/storage';

const STORE_NAME = 'pricing_rules';

const SEED_RULES: PricingRule[] = [
  {
    id: 'rule_001',
    name: 'Bulk Discount — 500+ units',
    description: 'Automatic 10% discount applied to orders of 500 units or more',
    type: 'percentage',
    value: 10,
    minQuantity: 500,
    applicableProducts: [],
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 'rule_002',
    name: 'Bulk Discount — 2000+ units',
    description: 'Automatic 20% discount applied to orders of 2000 units or more',
    type: 'percentage',
    value: 20,
    minQuantity: 2000,
    applicableProducts: [],
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 'rule_003',
    name: 'Rush Order Fee',
    description: 'Flat fee added for orders requiring delivery within 48 hours',
    type: 'fixed',
    value: 2500,
    minQuantity: 1,
    applicableProducts: [],
    isActive: true,
    createdAt: '2024-01-01',
  },
];

interface PricingState {
  rules: PricingRule[];
  loading: boolean;
  error: string | null;
}

const initialState: PricingState = {
  rules: readList(STORE_NAME, SEED_RULES),
  loading: false,
  error: null,
};

const pricingSlice = createSlice({
  name: 'pricing',
  initialState,
  reducers: {
    setPricingRules: (state, action: PayloadAction<PricingRule[]>) => {
      state.rules = action.payload;
      writeList(STORE_NAME, state.rules);
    },
    addPricingRule: (state, action: PayloadAction<Omit<PricingRule, 'id' | 'createdAt'>>) => {
      const rule: PricingRule = {
        ...action.payload,
        id: generateId('rule'),
        createdAt: new Date().toISOString().split('T')[0],
      };
      state.rules.push(rule);
      writeList(STORE_NAME, state.rules);
    },
    updatePricingRule: (state, action: PayloadAction<PricingRule>) => {
      const index = state.rules.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.rules[index] = action.payload;
        writeList(STORE_NAME, state.rules);
      }
    },
    deletePricingRule: (state, action: PayloadAction<string>) => {
      state.rules = state.rules.filter((r) => r.id !== action.payload);
      writeList(STORE_NAME, state.rules);
    },
  },
});

export const { setPricingRules, addPricingRule, updatePricingRule, deletePricingRule } =
  pricingSlice.actions;

export default pricingSlice.reducer;
