import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PackagingProduct } from './productsSlice';
import { PouchType, WindowOption, MaterialType, CapacityOption } from './pouchSlice';

export interface CustomDesignConfig {
  length: number;
  width: number;
  height: number;
  materialId: string;
  inkColor: string;
  logoUri: string | null;
  logoScale: number;
  logoPosX: number;
  logoPosY: number;
  customText: string;
  textColor: string;
  textSize: number;
}

/** Configuration summary stored in the cart for pouch orders */
export interface PouchCartConfig {
  pouchType: PouchType;
  windowOption: WindowOption;
  materialType: MaterialType;
  capacity: CapacityOption;
  artworkUri: string | null;
  needsDesignAssistance: boolean;
  dimensions: { width: number; height: number; unit: string };
  finish?: string;
  zip?: string;
  thickness?: number;
}

export interface CartItem {
  cartId: string;
  productId: string;
  name: string;
  /** 'pouch' for configurator-based items; existing categories remain */
  category: 'box' | 'mailer' | 'bag' | 'tape' | 'pouch';
  design: CustomDesignConfig;
  /** Only set when category === 'pouch' */
  pouchConfig?: PouchCartConfig;
  quantity: number;
  baseUnitPrice: number;
  unitPrice: number;
  totalPrice: number;
  setupFee: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

// Pricing engine helper
export const calculateItemPrice = (
  product: PackagingProduct,
  design: CustomDesignConfig,
  quantity: number
) => {
  // 1. Base price
  let price = product.basePrice;

  // 2. Material multiplier
  const material = product.materials.find(m => m.id === design.materialId);
  const materialMultiplier = material ? material.multiplier : 1.0;
  price *= materialMultiplier;

  // 3. Dimension adjustment (surface area ratio)
  if (product.category === 'box' || product.category === 'mailer') {
    const defaultSA = 2 * (product.dimensions.length * product.dimensions.width + 
                           product.dimensions.width * product.dimensions.height + 
                           product.dimensions.height * product.dimensions.length);
    const customSA = 2 * (design.length * design.width + 
                          design.width * design.height + 
                          design.height * design.length);
    const areaRatio = customSA / defaultSA;
    // Scale price by area ratio with a factor of 0.6 (damping extreme values)
    const dimensionMultiplier = 1 + (areaRatio - 1) * 0.6;
    price *= Math.max(0.5, dimensionMultiplier);
  } else if (product.category === 'bag') {
    const defaultSA = product.dimensions.length * product.dimensions.width;
    const customSA = design.length * design.width;
    const areaRatio = customSA / defaultSA;
    const dimensionMultiplier = 1 + (areaRatio - 1) * 0.5;
    price *= Math.max(0.6, dimensionMultiplier);
  } else if (product.category === 'tape') {
    // Length & width adjustment
    const defaultArea = product.dimensions.length * product.dimensions.width;
    const customArea = design.length * design.width;
    const areaRatio = customArea / defaultArea;
    price *= areaRatio;
  }

  // 4. Custom print setup fee and per-unit print cost
  let setupFee = 0;
  let printCostPerUnit = 0;

  const hasCustomPrint = design.logoUri !== null || design.customText.trim() !== '' || design.inkColor !== '#000000';
  if (hasCustomPrint) {
    setupFee = 25.00; // Plates setup fee
    printCostPerUnit = 0.18; // Cost of custom ink/unit
  }

  // Unit price before discount
  let finalUnitPrice = price + printCostPerUnit;

  // 5. Volume discount
  let discountPercent = 0;
  const applicableDiscount = [...product.bulkDiscounts]
    .sort((a, b) => b.minQuantity - a.minQuantity)
    .find(d => quantity >= d.minQuantity);
  
  if (applicableDiscount) {
    discountPercent = applicableDiscount.discountPercent;
  }

  finalUnitPrice = finalUnitPrice * (1 - discountPercent / 100);

  return {
    unitPrice: Number(finalUnitPrice.toFixed(2)),
    setupFee,
    totalPrice: Number((finalUnitPrice * quantity + setupFee).toFixed(2)),
  };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.cartId !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ cartId: string; quantity: number; product: PackagingProduct }>) => {
      const { cartId, quantity, product } = action.payload;
      const item = state.items.find(item => item.cartId === cartId);
      if (item) {
        item.quantity = quantity;
        const prices = calculateItemPrice(product, item.design, quantity);
        item.unitPrice = prices.unitPrice;
        item.setupFee = prices.setupFee;
        item.totalPrice = prices.totalPrice;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.totalPrice, 0);
export const selectCartItemCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);
