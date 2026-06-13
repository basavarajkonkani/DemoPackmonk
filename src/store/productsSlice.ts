import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProductMaterial {
  id: string;
  name: string;
  multiplier: number;
  description: string;
}

export interface DimensionConfig {
  length: number;
  width: number;
  height: number;
  minLength: number;
  maxLength: number;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  unit: string;
}

export interface BulkDiscount {
  minQuantity: number;
  discountPercent: number;
}

export interface PackagingProduct {
  id: string;
  name: string;
  category: 'box' | 'mailer' | 'bag' | 'tape';
  description: string;
  longDescription: string;
  minQuantity: number;
  basePrice: number;
  materials: ProductMaterial[];
  dimensions: DimensionConfig;
  bulkDiscounts: BulkDiscount[];
  ecoFriendlyRating: number; // 1–5
  strengthRating: number;    // 1–5
}

interface ProductsState {
  items: PackagingProduct[];
  selectedProductId: string | null;
}

const initialProducts: PackagingProduct[] = [
  /* ─────────────────────────── BOXES ─────────────────────────── */
  {
    id: 'corrugated-shipping-box',
    name: 'Corrugated Shipping Box',
    category: 'box',
    description: 'Sturdy double-walled boxes built to protect goods during tough transits.',
    longDescription: 'Industrial-grade corrugated shipping boxes with high-durability fluting, exceptional puncture resistance and stacking strength. Perfect for e-commerce, logistics, and heavy products. 100% recyclable from post-consumer waste.',
    minQuantity: 50,
    basePrice: 1.85,
    materials: [
      { id: 'kraft', name: 'Standard Kraft Brown', multiplier: 1.0, description: 'Natural unbleached cardboard. The ultimate eco-friendly look.' },
      { id: 'white-clay', name: 'White Claycoat', multiplier: 1.15, description: 'Semi-gloss white surface for vibrant exterior prints.' },
      { id: 'premium-kraft', name: 'Heavy-Duty Double Wall', multiplier: 1.35, description: 'Double thickness. Optimized for heavy or fragile payloads.' },
    ],
    dimensions: { length: 12, width: 10, height: 8, minLength: 6, maxLength: 24, minWidth: 4, maxWidth: 20, minHeight: 3, maxHeight: 18, unit: 'in' },
    bulkDiscounts: [
      { minQuantity: 100, discountPercent: 5 },
      { minQuantity: 250, discountPercent: 12 },
      { minQuantity: 500, discountPercent: 20 },
      { minQuantity: 1000, discountPercent: 30 },
    ],
    ecoFriendlyRating: 5,
    strengthRating: 5,
  },
  {
    id: 'mailer-box',
    name: 'Premium Mailer Box',
    category: 'box',
    description: 'Ideal for subscription boxes, retail presentation and premium unboxing.',
    longDescription: 'Roll-end tuck-front mailers create a memorable unboxing experience. Built with clean-fold edges and sturdy lock tabs — no tape required to assemble. A favourite for apparel, subscription services, cosmetics and electronics.',
    minQuantity: 100,
    basePrice: 1.45,
    materials: [
      { id: 'kraft', name: 'Standard Kraft Brown', multiplier: 1.0, description: 'Organic, rustic, minimalist aesthetic.' },
      { id: 'white-clay', name: 'White Bleached Kraft', multiplier: 1.12, description: 'Matte white finish. Ideal for premium colour prints.' },
      { id: 'premium-matte-black', name: 'Coated Matte Black', multiplier: 1.3, description: 'Deep velvet-black matte finish. Ultra-luxurious look.' },
    ],
    dimensions: { length: 9, width: 6, height: 3, minLength: 4, maxLength: 16, minWidth: 3, maxWidth: 12, minHeight: 1.5, maxHeight: 6, unit: 'in' },
    bulkDiscounts: [
      { minQuantity: 250, discountPercent: 8 },
      { minQuantity: 500, discountPercent: 15 },
      { minQuantity: 1000, discountPercent: 25 },
      { minQuantity: 2500, discountPercent: 35 },
    ],
    ecoFriendlyRating: 5,
    strengthRating: 4,
  },
  {
    id: 'rigid-gift-box',
    name: 'Rigid Luxury Gift Box',
    category: 'box',
    description: 'Magnetic closure rigid boxes with a premium soft-touch laminate finish.',
    longDescription: 'Our rigid gift boxes feature a strong 2mm greyboard core wrapped in art paper with soft-touch laminate. Magnetic flap closure adds a high-end feel. Perfect for luxury cosmetics, fragrance, jewellery, and corporate gifting. FSC-certified.',
    minQuantity: 50,
    basePrice: 3.20,
    materials: [
      { id: 'soft-touch-white', name: 'Soft Touch White', multiplier: 1.0, description: 'Velvety white surface. Feels premium in hand.' },
      { id: 'soft-touch-black', name: 'Soft Touch Black', multiplier: 1.1, description: 'Deep matte black. Ultra-luxury presentation.' },
      { id: 'foil-gold', name: 'Gold Foil Stamped', multiplier: 1.55, description: 'Hot gold foil stamping on art paper. Statement gifting.' },
    ],
    dimensions: { length: 10, width: 8, height: 4, minLength: 4, maxLength: 18, minWidth: 3, maxWidth: 14, minHeight: 1.5, maxHeight: 8, unit: 'in' },
    bulkDiscounts: [
      { minQuantity: 100, discountPercent: 8 },
      { minQuantity: 250, discountPercent: 15 },
      { minQuantity: 500, discountPercent: 22 },
      { minQuantity: 1000, discountPercent: 30 },
    ],
    ecoFriendlyRating: 3,
    strengthRating: 5,
  },

  /* ─────────────────────────── MAILERS ─────────────────────────── */
  {
    id: 'kraft-bubble-mailer',
    name: 'Kraft Bubble Mailer',
    category: 'mailer',
    description: 'Lightweight padded envelopes for shipping accessories, jewellery and books.',
    longDescription: 'Padded kraft envelopes with high-slip bubble wrap lining and a reliable peel-and-seal adhesive flap. Excellent cushioning and moisture protection while minimising postage costs.',
    minQuantity: 100,
    basePrice: 0.65,
    materials: [
      { id: 'kraft-bubble', name: 'Recycled Kraft Outer', multiplier: 1.0, description: 'Sustainably sourced kraft with protective bubble lining.' },
      { id: 'poly-bubble', name: 'Waterproof Poly Outer', multiplier: 1.1, description: 'Glossy weather-resistant poly film. Tear and water resistant.' },
    ],
    dimensions: { length: 10, width: 7, height: 0.5, minLength: 6, maxLength: 16, minWidth: 4, maxWidth: 12, minHeight: 0.1, maxHeight: 1, unit: 'in' },
    bulkDiscounts: [
      { minQuantity: 250, discountPercent: 5 },
      { minQuantity: 1000, discountPercent: 12 },
      { minQuantity: 2500, discountPercent: 20 },
      { minQuantity: 5000, discountPercent: 30 },
    ],
    ecoFriendlyRating: 3,
    strengthRating: 3,
  },
  {
    id: 'flat-bottom-pouch',
    name: 'Flat Bottom Pouch',
    category: 'mailer',
    description: 'Stand-alone retail-ready pouches with a flat base for maximum shelf appeal.',
    longDescription: 'Flat bottom pouches combine the capacity of a box with the flexibility of flexible packaging. Eight-panel construction allows the pouch to stand upright independently. Resealable zipper and tear notch. Ideal for premium food, coffee, pet treats, and nutraceuticals.',
    minQuantity: 500,
    basePrice: 0.88,
    materials: [
      { id: 'kraft-matte', name: 'Kraft Matte Laminate', multiplier: 1.0, description: 'Natural kraft matte finish. Premium shelf presence.' },
      { id: 'clear-window', name: 'Clear Window Film', multiplier: 1.15, description: 'Transparent front panel — show off your product.' },
      { id: 'foil-barrier', name: 'Foil Barrier Layer', multiplier: 1.3, description: 'Aluminium foil inner layer for max moisture & oxygen barrier.' },
    ],
    dimensions: { length: 10, width: 6, height: 4, minLength: 6, maxLength: 18, minWidth: 4, maxWidth: 10, minHeight: 2, maxHeight: 6, unit: 'in' },
    bulkDiscounts: [
      { minQuantity: 1000, discountPercent: 8 },
      { minQuantity: 2500, discountPercent: 15 },
      { minQuantity: 5000, discountPercent: 22 },
      { minQuantity: 10000, discountPercent: 32 },
    ],
    ecoFriendlyRating: 3,
    strengthRating: 4,
  },

  /* ─────────────────────────── BAGS ─────────────────────────── */
  {
    id: 'stand-up-pouch',
    name: 'Stand Up Pouch',
    category: 'bag',
    description: 'Resealable stand-up pouches perfect for food, coffee, snacks and supplements.',
    longDescription: 'Our stand-up pouches are made from multi-layer laminate films with a strong bottom gusset that lets them stand independently on shelf. Available with a resealable zipper for consumer convenience. High-resolution flexographic printing up to 9 colours.',
    minQuantity: 500,
    basePrice: 0.72,
    materials: [
      { id: 'kraft-window', name: 'Kraft + Clear Window', multiplier: 1.0, description: 'Natural kraft outer with a transparent product window.' },
      { id: 'full-matte', name: 'Full Matte Film', multiplier: 1.1, description: 'Opaque matte finish. Hides product for mystery & freshness.' },
      { id: 'holographic', name: 'Holographic Foil', multiplier: 1.5, description: 'Eye-catching rainbow holographic surface. Instant shelf presence.' },
    ],
    dimensions: { length: 8, width: 5, height: 3, minLength: 5, maxLength: 16, minWidth: 3, maxWidth: 10, minHeight: 2, maxHeight: 6, unit: 'in' },
    bulkDiscounts: [
      { minQuantity: 1000, discountPercent: 8 },
      { minQuantity: 2500, discountPercent: 15 },
      { minQuantity: 5000, discountPercent: 24 },
      { minQuantity: 10000, discountPercent: 35 },
    ],
    ecoFriendlyRating: 3,
    strengthRating: 4,
  },
  {
    id: 'compostable-mailer',
    name: 'Compostable Poly Mailer',
    category: 'bag',
    description: '100% biodegradable waterproof mailers for apparel and soft goods.',
    longDescription: 'Made from cornstarch and PBAT — breaks down in home compost within 180 days. Waterproof, tear-resistant, and features dual self-adhesive strips for easy returns and reusability. The sustainable choice for fashion and lifestyle brands.',
    minQuantity: 200,
    basePrice: 0.42,
    materials: [
      { id: 'biodegradable-pbat', name: 'Compostable Cornstarch', multiplier: 1.0, description: 'Matte green/cream compostable film. Silky soft yet resilient.' },
    ],
    dimensions: { length: 15, width: 12, height: 0.1, minLength: 8, maxLength: 22, minWidth: 6, maxWidth: 18, minHeight: 0.05, maxHeight: 0.5, unit: 'in' },
    bulkDiscounts: [
      { minQuantity: 500, discountPercent: 10 },
      { minQuantity: 1000, discountPercent: 18 },
      { minQuantity: 2500, discountPercent: 28 },
      { minQuantity: 10000, discountPercent: 40 },
    ],
    ecoFriendlyRating: 5,
    strengthRating: 3,
  },
  {
    id: 'laminated-roll',
    name: 'Laminated Roll Film',
    category: 'bag',
    description: 'Flexible laminated roll stock for form-fill-seal packaging machines.',
    longDescription: 'Our laminated roll film is compatible with all major FFS machines — vertical and horizontal. Multi-layer construction with barrier properties for moisture, oxygen and UV. Used in dairy, snack, confectionery and pharma industries. Custom width and print available.',
    minQuantity: 5,
    basePrice: 28.00, // per roll
    materials: [
      { id: 'bopp-laminate', name: 'BOPP Laminate', multiplier: 1.0, description: 'Bi-axially oriented polypropylene. Excellent clarity and gloss.' },
      { id: 'pet-foil', name: 'PET Foil Laminate', multiplier: 1.25, description: 'Polyester + aluminium foil. Superior barrier properties.' },
      { id: 'nylon-film', name: 'Nylon Barrier Film', multiplier: 1.4, description: 'High puncture and flex-crack resistance. Ideal for meats and cheeses.' },
    ],
    dimensions: { length: 5000, width: 10, height: 0.01, minLength: 1000, maxLength: 8000, minWidth: 4, maxWidth: 24, minHeight: 0.005, maxHeight: 0.03, unit: 'mm' },
    bulkDiscounts: [
      { minQuantity: 10, discountPercent: 5 },
      { minQuantity: 25, discountPercent: 12 },
      { minQuantity: 50, discountPercent: 20 },
      { minQuantity: 100, discountPercent: 28 },
    ],
    ecoFriendlyRating: 2,
    strengthRating: 4,
  },

  /* ─────────────────────────── TAPE ─────────────────────────── */
  {
    id: 'reinforced-paper-tape',
    name: 'Custom Reinforced Paper Tape',
    category: 'tape',
    description: 'Water-activated fiberglass tape that creates a tamper-evident molecular bond.',
    longDescription: 'Water-activated paper tape fuses instantly with corrugated surfaces, creating a molecular bond that is completely tamper-proof. Reinforced with fiberglass mesh — one strip seals heavy packaging safely. Print your logo or message for branded shipping.',
    minQuantity: 10,
    basePrice: 12.50,
    materials: [
      { id: 'paper-tape-kraft', name: 'Brown Reinforced Paper', multiplier: 1.0, description: 'Water-activated kraft backing. Strong and tamper evident.' },
      { id: 'paper-tape-white', name: 'White Reinforced Paper', multiplier: 1.08, description: 'Bleached white backing. High-contrast dark ink prints.' },
    ],
    dimensions: { length: 375, width: 3, height: 0.01, minLength: 100, maxLength: 500, minWidth: 2, maxWidth: 4, minHeight: 0.01, maxHeight: 0.02, unit: 'ft' },
    bulkDiscounts: [
      { minQuantity: 20, discountPercent: 8 },
      { minQuantity: 50, discountPercent: 15 },
      { minQuantity: 100, discountPercent: 25 },
    ],
    ecoFriendlyRating: 4,
    strengthRating: 5,
  },
  {
    id: 'bopp-tape',
    name: 'Printed BOPP Tape',
    category: 'tape',
    description: 'Crystal-clear or custom printed polypropylene tape for branded carton sealing.',
    longDescription: 'BOPP (Bi-Axially Oriented Polypropylene) tape offers superior clarity and adhesion. Up to 3-colour custom flexographic printing. Available in standard widths and lengths. Excellent temperature resistance and noise-free unwind for high-speed packing lines.',
    minQuantity: 24,
    basePrice: 4.80,
    materials: [
      { id: 'clear-bopp', name: 'Crystal Clear', multiplier: 1.0, description: 'Transparent tape. Invisible seal on light-coloured boxes.' },
      { id: 'tan-bopp', name: 'Tan / Brown BOPP', multiplier: 1.0, description: 'Classic tan look. Blends with kraft boxes seamlessly.' },
      { id: 'printed-bopp', name: 'Custom Printed BOPP', multiplier: 1.35, description: 'Up to 3 spot colours. Print your logo, pattern or message.' },
    ],
    dimensions: { length: 110, width: 2, height: 0.01, minLength: 50, maxLength: 200, minWidth: 1.5, maxWidth: 3, minHeight: 0.01, maxHeight: 0.02, unit: 'yd' },
    bulkDiscounts: [
      { minQuantity: 48, discountPercent: 7 },
      { minQuantity: 120, discountPercent: 15 },
      { minQuantity: 240, discountPercent: 22 },
    ],
    ecoFriendlyRating: 2,
    strengthRating: 4,
  },
];

const initialState: ProductsState = {
  items: initialProducts,
  selectedProductId: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    selectProduct: (state, action: PayloadAction<string>) => {
      state.selectedProductId = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProductId = null;
    },
  },
});

export const { selectProduct, clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;

export const selectProductsList = (state: { products: ProductsState }) => state.products.items;
export const selectCurrentProduct = (state: { products: ProductsState }) =>
  state.products.items.find((item) => item.id === state.products.selectedProductId) ?? null;
