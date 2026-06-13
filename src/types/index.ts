/**
 * PacMonk — Shared TypeScript types and navigation param lists
 */

/* ─── Navigation ────────────────────────────────────────────────────── */

export type RootStackParamList = {
  Onboarding: undefined;
  MainTabs: { screen?: keyof TabParamList } | undefined;
  ProductDetail: { productId: string };
  RequestQuote: { productId?: string } | undefined;
  AIRecommendations: undefined;
  ShipmentTracking: { orderId?: string } | undefined;
  Cart: undefined;
  Checkout: undefined;
  Notifications: undefined;
  PouchConfigurator: undefined;
  OrderPlaced: { orderId: string } | undefined;
};

export type TabParamList = {
  Home: undefined;
  Products: undefined;
  DesignStudio: undefined;
  Orders: undefined;
  Account: undefined;
};

/* ─── UI Helpers ────────────────────────────────────────────────────── */

export interface BadgeConfig {
  label: string;
  color: string;
  bg: string;
}

export interface SelectOption {
  id: string;
  label: string;
  icon?: string;
  color?: string;
}

/* ─── Quote ─────────────────────────────────────────────────────────── */

export interface QuoteEstimate {
  subtotal: number;
  gst: number;
  shipping: number;
  total: number;
  unitPrice: number;
  setupFee: number;
  hasDiscount: boolean;
  discountPercent: number;
}

/* ─── User / Company ─────────────────────────────────────────────────── */

export interface UserProfile {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  gstNumber: string;
  tier: 'starter' | 'growth' | 'enterprise';
  clientId: string;
  avatarInitials: string;
}

export interface ShippingAddress {
  company: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

/* ─── Payment ────────────────────────────────────────────────────────── */

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet';

export interface PaymentMethodConfig {
  id: PaymentMethod;
  label: string;
  icon: string;
  desc: string;
}

/* ─── AI ─────────────────────────────────────────────────────────────── */

export interface AIRecommendation {
  id: number;
  name: string;
  icon: string;
  category: string;
  tags: string[];
  tagColors: string[];
  benefit: string;
  price: string;
  moq: string;
  bg: string;
  iconColor: string;
}

export type AIInsightTag = {
  label: string;
  icon: string;
  color: string;
  bg: string;
};

/* ─── Misc ───────────────────────────────────────────────────────────── */

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'order' | 'shipment' | 'design' | 'promo';
  read: boolean;
  createdAt: string;
}
