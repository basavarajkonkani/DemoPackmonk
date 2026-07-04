/**
 * PacMonk — Shared TypeScript types and navigation param lists
 */

/* ─── Navigation ────────────────────────────────────────────────────── */

export type RootStackParamList = {
  Onboarding: undefined;
  SignIn: undefined;
  SignUp: undefined;
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
  Orders: undefined;
  DesignStudio: undefined;
  Account: undefined;
  Cart: undefined;
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

export type UserRole = 'buyer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  companyName?: string;
  gstNumber?: string;
  companyAddress?: string;
  createdAt: string;
  isActive: boolean;
}

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
  id: string;
  company: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  addedAt: string;
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

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface Artwork {
  id: string;
  userId: string;
  name: string;
  fileUrl: string;
  thumbnail?: string;
  status: 'pending' | 'approved' | 'rejected';
  orderId?: string;
  uploadedAt: string;
}

/* ─── Admin Types ────────────────────────────────────────────────────── */

export interface Product {
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
  imageUrl: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface BannerPromo {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export interface CouponCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}
