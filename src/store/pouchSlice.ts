/**
 * Pouch Configurator Slice
 * Manages the step-by-step pouch ordering wizard state.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PouchType = 'plain' | 'printed' | 'kraft';
export type WindowOption = 'with_window' | 'without_window';
export type MaterialType = 'metalised' | 'non_metalised';
export type CapacityOption = '50g' | '100g' | '250g' | '500g' | '1kg';

export interface PouchDimensions {
  width: number;
  height: number;
  unit: string;
}

export interface PouchConfig {
  pouchType: PouchType | null;
  windowOption: WindowOption | null;
  materialType: MaterialType | null;
  capacity: CapacityOption | null;
  quantity: number;
  artworkUri: string | null;
  needsDesignAssistance: boolean;
}

interface PouchState {
  config: PouchConfig;
  currentStep: number;
}

const INITIAL_CONFIG: PouchConfig = {
  pouchType: null,
  windowOption: null,
  materialType: null,
  capacity: null,
  quantity: 5000,
  artworkUri: null,
  needsDesignAssistance: false,
};

const initialState: PouchState = {
  config: INITIAL_CONFIG,
  currentStep: 1,
};

const pouchSlice = createSlice({
  name: 'pouch',
  initialState,
  reducers: {
    setPouchType: (state, action: PayloadAction<PouchType>) => {
      state.config.pouchType = action.payload;
      // Reset window if kraft (no window supported)
      if (action.payload === 'kraft') {
        state.config.windowOption = 'without_window';
      }
      // Reset artwork if plain
      if (action.payload === 'plain') {
        state.config.artworkUri = null;
        state.config.needsDesignAssistance = false;
      }
    },
    setWindowOption: (state, action: PayloadAction<WindowOption>) => {
      state.config.windowOption = action.payload;
    },
    setMaterialType: (state, action: PayloadAction<MaterialType>) => {
      state.config.materialType = action.payload;
    },
    setCapacity: (state, action: PayloadAction<CapacityOption>) => {
      state.config.capacity = action.payload;
    },
    setQuantity: (state, action: PayloadAction<number>) => {
      state.config.quantity = action.payload;
    },
    setArtworkUri: (state, action: PayloadAction<string | null>) => {
      state.config.artworkUri = action.payload;
    },
    setNeedsDesignAssistance: (state, action: PayloadAction<boolean>) => {
      state.config.needsDesignAssistance = action.payload;
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    applyRecommendation: (state, action: PayloadAction<Partial<PouchConfig>>) => {
      state.config = { ...state.config, ...action.payload };
    },
    resetPouchConfig: (state) => {
      state.config = INITIAL_CONFIG;
      state.currentStep = 1;
    },
  },
});

export const {
  setPouchType,
  setWindowOption,
  setMaterialType,
  setCapacity,
  setQuantity,
  setArtworkUri,
  setNeedsDesignAssistance,
  setCurrentStep,
  applyRecommendation,
  resetPouchConfig,
} = pouchSlice.actions;

export default pouchSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectPouchConfig = (state: { pouch: PouchState }) => state.pouch.config;
export const selectCurrentStep = (state: { pouch: PouchState }) => state.pouch.currentStep;

// ─── Constants ────────────────────────────────────────────────────────────────
export const CAPACITY_DIMENSIONS: Record<CapacityOption, PouchDimensions> = {
  '50g':  { width: 100, height: 160, unit: 'mm' },
  '100g': { width: 120, height: 190, unit: 'mm' },
  '250g': { width: 160, height: 240, unit: 'mm' },
  '500g': { width: 190, height: 290, unit: 'mm' },
  '1kg':  { width: 220, height: 340, unit: 'mm' },
};

export const MOQ_BY_CAPACITY: Record<CapacityOption, number> = {
  '50g':  10000,
  '100g': 7500,
  '250g': 5000,
  '500g': 3000,
  '1kg':  2000,
};

// Base prices per unit (in ₹) for pricing engine
const BASE_PRICE: Record<PouchType, number> = {
  plain:   2.5,
  printed: 3.8,
  kraft:   3.2,
};
const WINDOW_PREMIUM: Record<WindowOption, number> = {
  with_window:    0.6,
  without_window: 0.0,
};
const MATERIAL_PREMIUM: Record<MaterialType, number> = {
  metalised:     0.5,
  non_metalised: 0.0,
};
const CAPACITY_FACTOR: Record<CapacityOption, number> = {
  '50g':  0.7,
  '100g': 0.85,
  '250g': 1.0,
  '500g': 1.25,
  '1kg':  1.6,
};

/** Delivery timeline in working days */
export const DELIVERY_TIMELINE = '12 – 15 Days';

/**
 * Calculate estimated total price in ₹ for a pouch configuration.
 */
export function calculatePouchPrice(config: PouchConfig): number {
  if (
    !config.pouchType ||
    !config.windowOption ||
    !config.materialType ||
    !config.capacity
  ) {
    return 0;
  }
  const base = BASE_PRICE[config.pouchType];
  const win  = WINDOW_PREMIUM[config.windowOption];
  const mat  = MATERIAL_PREMIUM[config.materialType];
  const cap  = CAPACITY_FACTOR[config.capacity];
  const unitPrice = (base + win + mat) * cap;
  const qty = Math.max(config.quantity, 1);
  // Volume discount
  let discount = 0;
  if (qty >= 20000) discount = 0.20;
  else if (qty >= 10000) discount = 0.15;
  else if (qty >= 5000)  discount = 0.10;
  else if (qty >= 2000)  discount = 0.05;

  const total = unitPrice * qty * (1 - discount);
  return Math.round(total);
}

/**
 * Generate human-readable label for each pouch type.
 */
export const POUCH_TYPE_LABELS: Record<PouchType, string> = {
  plain:   'Plain Pouch',
  printed: 'Printed Pouch',
  kraft:   'Kraft Pouch',
};
export const WINDOW_LABELS: Record<WindowOption, string> = {
  with_window:    'With Window',
  without_window: 'Without Window',
};
export const MATERIAL_LABELS: Record<MaterialType, string> = {
  metalised:     'Metalised',
  non_metalised: 'Non-Metalised',
};
