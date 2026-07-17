import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/* ────────────────────── TYPES ────────────────────── */

export interface AdminProduct {
  id: string;
  name: string;
  category: string;
  material: string;
  size: string;
  thickness: string;
  zipperType?: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  moq: number;
  images: string[];
  description: string;
  isActive: boolean;
  variants?: string[];
  createdAt: string;
  updatedAt: string;
  productCode?: string;
  sku?: string;
  finish?: string;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  customerId: string;
  companyName: string;
  productName: string;
  productId: string;
  quantity: number;
  amount: number;
  status: 'pending' | 'in_production' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  productionStage: string;
  orderDate: string;
  deliveryDate?: string;
  timeline?: OrderTimeline[];
  notes?: string;
}

export interface OrderTimeline {
  stage: string;
  status: 'pending' | 'completed' | 'in_progress';
  timestamp: string;
  percentage: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  material: string;
  size: string;
  thickness: number;
  hasZip: boolean;
  stock: number;
  reorderPoint: number;
  price: number;
  lastRestocked: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  gst?: string;
  businessName: string;
  creditLimit: number;
  creditUsed: number;
  creditStatus: 'approved' | 'pending' | 'rejected';
  lifetimeValue: number;
  totalOrders: number;
  registeredAt: string;
  addresses?: string[];
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  status: 'active' | 'inactive' | 'scheduled';
  priority: number;
  startDate: string;
  endDate: string;
  targetUrl?: string;
  clicks: number;
  impressions: number;
}

export interface PricingRule {
  id: string;
  name: string;
  type: 'material' | 'rush' | 'print' | 'setup';
  value: number;
  description: string;
}

export interface AdminState {
  products: AdminProduct[];
  orders: AdminOrder[];
  inventory: InventoryItem[];
  customers: AdminCustomer[];
  banners: Banner[];
  pricingRules: PricingRule[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filters: Record<string, any>;
}

const initialState: AdminState = {
  products: [
    {
      id: '1',
      name: 'Stand-Up Pouch',
      category: 'Pouches',
      material: 'BOPP',
      size: '5x8 inch',
      thickness: '75 micron',
      price: 12.5,
      stock: 1500,
      lowStockThreshold: 200,
      moq: 100,
      images: ['pouch1.jpg'],
      description: 'Clear BOPP stand-up pouch',
      isActive: true,
      variants: ['Clear', 'Metalized'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-20',
    },
    {
      id: '2',
      name: 'Kraft Paper Box',
      category: 'Boxes',
      material: 'Kraft Paper',
      size: '6x4x3 inch',
      thickness: '300 gsm',
      price: 25.0,
      stock: 150,
      lowStockThreshold: 200,
      moq: 50,
      images: ['box1.jpg'],
      description: 'Eco-friendly kraft paper box',
      isActive: true,
      createdAt: '2024-01-02',
      updatedAt: '2024-01-18',
    },
    {
      id: '3',
      name: 'Window Pouch',
      category: 'Pouches',
      material: 'BOPP+PE',
      size: '6x9 inch',
      thickness: '90 micron',
      price: 15.0,
      stock: 800,
      lowStockThreshold: 200,
      moq: 100,
      images: ['window-pouch.jpg'],
      description: 'Pouch with transparent window',
      isActive: false,
      createdAt: '2024-01-03',
      updatedAt: '2024-01-15',
    },
  ],
  orders: [
    {
      id: 'ORD-1001',
      customerName: 'Rahul Sharma',
      customerId: '1',
      companyName: 'Sharma Industries',
      productName: 'Stand-Up Pouch',
      productId: '1',
      quantity: 5000,
      amount: 62500,
      status: 'pending',
      productionStage: 'Awaiting Approval',
      orderDate: '2024-01-20',
      notes: 'Custom printing requested',
      timeline: [
        { stage: 'Order Confirmed', status: 'completed', timestamp: '2024-01-20', percentage: 100 },
        { stage: 'Design Approval', status: 'in_progress', timestamp: '2024-01-21', percentage: 50 },
        { stage: 'Production', status: 'pending', timestamp: '', percentage: 0 },
      ],
    },
    {
      id: 'ORD-1002',
      customerName: 'Priya Patel',
      customerId: '2',
      companyName: 'Patel Enterprises',
      productName: 'Kraft Paper Box',
      productId: '2',
      quantity: 2000,
      amount: 50000,
      status: 'in_production',
      productionStage: 'Printing Stage',
      orderDate: '2024-01-18',
      timeline: [
        { stage: 'Order Confirmed', status: 'completed', timestamp: '2024-01-18', percentage: 100 },
        { stage: 'Design Approval', status: 'completed', timestamp: '2024-01-19', percentage: 100 },
        { stage: 'Production', status: 'in_progress', timestamp: '2024-01-21', percentage: 60 },
      ],
    },
    {
      id: 'ORD-1003',
      customerName: 'Amit Kumar',
      customerId: '3',
      companyName: 'Kumar Foods',
      productName: 'Window Pouch',
      productId: '3',
      quantity: 3000,
      amount: 45000,
      status: 'shipped',
      productionStage: 'Dispatched',
      orderDate: '2024-01-15',
      deliveryDate: '2024-01-22',
      timeline: [
        { stage: 'Order Confirmed', status: 'completed', timestamp: '2024-01-15', percentage: 100 },
        { stage: 'Design Approval', status: 'completed', timestamp: '2024-01-16', percentage: 100 },
        { stage: 'Production', status: 'completed', timestamp: '2024-01-19', percentage: 100 },
        { stage: 'Shipped', status: 'in_progress', timestamp: '2024-01-21', percentage: 100 },
      ],
    },
  ],
  inventory: [
    {
      id: '1',
      name: 'Clear BOPP Pouch',
      material: 'clear',
      size: '5x8',
      thickness: 75,
      hasZip: true,
      stock: 1500,
      reorderPoint: 500,
      price: 12,
      lastRestocked: '2024-01-15',
    },
    {
      id: '2',
      name: 'Silver Metalized Pouch',
      material: 'silver',
      size: '8x12',
      thickness: 100,
      hasZip: false,
      stock: 250,
      reorderPoint: 500,
      price: 18,
      lastRestocked: '2024-01-10',
    },
    {
      id: '3',
      name: 'Kraft Paper Pouch',
      material: 'kraft',
      size: '6x9',
      thickness: 90,
      hasZip: true,
      stock: 3000,
      reorderPoint: 800,
      price: 15,
      lastRestocked: '2024-01-18',
    },
    {
      id: '4',
      name: 'Milky White Pouch',
      material: 'milky',
      size: '10x15',
      thickness: 120,
      hasZip: true,
      stock: 180,
      reorderPoint: 400,
      price: 20,
      lastRestocked: '2024-01-12',
    },
  ],
  customers: [
    {
      id: '1',
      name: 'ABC Traders',
      email: 'contact@abctraders.com',
      phone: '+91 98765 43210',
      gst: '29ABCDE1234F1Z5',
      businessName: 'ABC Trading Co.',
      creditLimit: 50000,
      creditUsed: 12000,
      creditStatus: 'approved',
      lifetimeValue: 125000,
      totalOrders: 45,
      registeredAt: '2023-06-15',
    },
    {
      id: '2',
      name: 'XYZ Foods',
      email: 'info@xyzfoods.com',
      phone: '+91 98765 43211',
      gst: '27XYZAB5678P1Q2',
      businessName: 'XYZ Foods Ltd',
      creditLimit: 30000,
      creditUsed: 8500,
      creditStatus: 'approved',
      lifetimeValue: 98000,
      totalOrders: 38,
      registeredAt: '2023-08-20',
    },
    {
      id: '3',
      name: 'Modern Spices',
      email: 'sales@modernspices.com',
      phone: '+91 98765 43212',
      businessName: 'Modern Spices',
      creditLimit: 0,
      creditUsed: 0,
      creditStatus: 'pending',
      lifetimeValue: 15000,
      totalOrders: 12,
      registeredAt: '2024-01-05',
    },
  ],
  banners: [
    {
      id: '1',
      title: 'Summer Collection Launch',
      description: 'New pastel-colored pouches now available',
      imageUrl: 'banner-design-1.jpg',
      status: 'active',
      priority: 1,
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      targetUrl: '/products/summer',
      clicks: 1250,
      impressions: 15000,
    },
    {
      id: '2',
      title: 'Bulk Order Discount',
      description: 'Get 20% off on orders above 5000 units',
      imageUrl: 'offer-banner.jpg',
      status: 'active',
      priority: 2,
      startDate: '2024-01-10',
      endDate: '2024-02-28',
      targetUrl: '/promotions/bulk',
      clicks: 850,
      impressions: 12000,
    },
    {
      id: '3',
      title: 'New Custom Print Service',
      description: 'Design your own pouches with our new tool',
      imageUrl: 'banner-for-custom-print.jpg',
      status: 'scheduled',
      priority: 3,
      startDate: '2024-02-01',
      endDate: '2024-03-31',
      targetUrl: '/design-studio',
      clicks: 0,
      impressions: 0,
    },
  ],
  pricingRules: [
    {
      id: '1',
      name: 'Material Markup',
      type: 'material',
      value: 20,
      description: 'Add 20% to base price for premium materials',
    },
    {
      id: '2',
      name: 'Rush Order Fee',
      type: 'rush',
      value: 500,
      description: '₹500 flat fee for orders < 48hrs',
    },
    {
      id: '3',
      name: 'Custom Print Charge',
      type: 'print',
      value: 50,
      description: '₹50 per color per 1000 units',
    },
    {
      id: '4',
      name: 'Setup Fee',
      type: 'setup',
      value: 1500,
      description: '₹1500 one-time setup charge',
    },
  ],
  loading: false,
  error: null,
  searchQuery: '',
  filters: {},
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    /* ────────────── PRODUCTS ────────────── */
    addProduct: (state, action: PayloadAction<AdminProduct>) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<AdminProduct>) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
    toggleProductStatus: (state, action: PayloadAction<string>) => {
      const product = state.products.find((p) => p.id === action.payload);
      if (product) {
        product.isActive = !product.isActive;
      }
    },
    updateProductStock: (state, action: PayloadAction<{ id: string; stock: number }>) => {
      const product = state.products.find((p) => p.id === action.payload.id);
      if (product) {
        product.stock = action.payload.stock;
      }
    },
    updateProductPrice: (state, action: PayloadAction<{ id: string; price: number }>) => {
      const product = state.products.find((p) => p.id === action.payload.id);
      if (product) {
        product.price = action.payload.price;
      }
    },

    /* ────────────── ORDERS ────────────── */
    addOrder: (state, action: PayloadAction<AdminOrder>) => {
      state.orders.push(action.payload);
    },
    updateOrder: (state, action: PayloadAction<AdminOrder>) => {
      const index = state.orders.findIndex((o) => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{ id: string; status: AdminOrder['status'] }>
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
        // Update timeline
        if (!order.timeline) order.timeline = [];
        order.productionStage = action.payload.status;
      }
    },
    updateOrderTimeline: (
      state,
      action: PayloadAction<{ orderId: string; stage: string; percentage: number }>
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.orderId);
      if (order && order.timeline) {
        const timelineItem = order.timeline.find((t) => t.stage === action.payload.stage);
        if (timelineItem) {
          timelineItem.percentage = action.payload.percentage;
          if (action.payload.percentage === 100) {
            timelineItem.status = 'completed';
          } else {
            timelineItem.status = 'in_progress';
          }
        }
      }
    },
    cancelOrder: (state, action: PayloadAction<string>) => {
      const order = state.orders.find((o) => o.id === action.payload);
      if (order) {
        order.status = 'cancelled';
      }
    },

    /* ────────────── INVENTORY ────────────── */
    updateInventoryStock: (
      state,
      action: PayloadAction<{ id: string; stock: number }>
    ) => {
      const item = state.inventory.find((i) => i.id === action.payload.id);
      if (item) {
        item.stock = action.payload.stock;
        item.lastRestocked = new Date().toISOString().split('T')[0];
      }
    },
    addInventoryItem: (state, action: PayloadAction<InventoryItem>) => {
      state.inventory.push(action.payload);
    },
    updateInventoryItem: (state, action: PayloadAction<InventoryItem>) => {
      const index = state.inventory.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.inventory[index] = action.payload;
      }
    },

    /* ────────────── CUSTOMERS ────────────── */
    addCustomer: (state, action: PayloadAction<AdminCustomer>) => {
      state.customers.push(action.payload);
    },
    updateCustomer: (state, action: PayloadAction<AdminCustomer>) => {
      const index = state.customers.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
    },
    updateCustomerCredit: (
      state,
      action: PayloadAction<{ id: string; creditLimit: number; creditStatus: 'approved' | 'pending' | 'rejected' }>
    ) => {
      const customer = state.customers.find((c) => c.id === action.payload.id);
      if (customer) {
        customer.creditLimit = action.payload.creditLimit;
        customer.creditStatus = action.payload.creditStatus;
      }
    },

    /* ────────────── BANNERS ────────────── */
    addBanner: (state, action: PayloadAction<Banner>) => {
      state.banners.push(action.payload);
    },
    updateBanner: (state, action: PayloadAction<Banner>) => {
      const index = state.banners.findIndex((b) => b.id === action.payload.id);
      if (index !== -1) {
        state.banners[index] = action.payload;
      }
    },
    deleteBanner: (state, action: PayloadAction<string>) => {
      state.banners = state.banners.filter((b) => b.id !== action.payload);
    },
    updateBannerStatus: (
      state,
      action: PayloadAction<{ id: string; status: Banner['status'] }>
    ) => {
      const banner = state.banners.find((b) => b.id === action.payload.id);
      if (banner) {
        banner.status = action.payload.status;
      }
    },
    recordBannerImpression: (state, action: PayloadAction<string>) => {
      const banner = state.banners.find((b) => b.id === action.payload);
      if (banner) {
        banner.impressions += 1;
      }
    },
    recordBannerClick: (state, action: PayloadAction<string>) => {
      const banner = state.banners.find((b) => b.id === action.payload);
      if (banner) {
        banner.clicks += 1;
      }
    },

    /* ────────────── PRICING ────────────── */
    addPricingRule: (state, action: PayloadAction<PricingRule>) => {
      state.pricingRules.push(action.payload);
    },
    updatePricingRule: (state, action: PayloadAction<PricingRule>) => {
      const index = state.pricingRules.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.pricingRules[index] = action.payload;
      }
    },
    deletePricingRule: (state, action: PayloadAction<string>) => {
      state.pricingRules = state.pricingRules.filter((r) => r.id !== action.payload);
    },

    /* ────────────── SEARCH & FILTERS ────────────── */
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action: PayloadAction<Record<string, any>>) => {
      state.filters = action.payload;
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
  // Products
  addProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  updateProductStock,
  updateProductPrice,
  // Orders
  addOrder,
  updateOrder,
  updateOrderStatus,
  updateOrderTimeline,
  cancelOrder,
  // Inventory
  updateInventoryStock,
  addInventoryItem,
  updateInventoryItem,
  // Customers
  addCustomer,
  updateCustomer,
  updateCustomerCredit,
  // Banners
  addBanner,
  updateBanner,
  deleteBanner,
  updateBannerStatus,
  recordBannerImpression,
  recordBannerClick,
  // Pricing
  addPricingRule,
  updatePricingRule,
  deletePricingRule,
  // Search & Filters
  setSearchQuery,
  setFilters,
  setLoading,
  setError,
} = adminSlice.actions;

export default adminSlice.reducer;
