/**
 * PacMonk Admin Web — Shared TypeScript types
 */

/* ─── User / Admin ──────────────────────────────────────────────────── */

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  avatar?: string;
  createdAt: string;
  isActive: boolean;
}

/* ─── Products ──────────────────────────────────────────────────────── */

export interface ProductImage {
  id: string;
  url: string;
  fileName: string;
  isPrimary: boolean;
  uploadedAt: string;
}

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
  imageUrl: string; // Primary image URL (for backward compatibility)
  images: ProductImage[]; // All product images with metadata
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ─── Orders ────────────────────────────────────────────────────────── */

export type OrderStatus =
  | 'pending_review'
  | 'artwork_approved'
  | 'in_production'
  | 'quality_check'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type ProductionStage =
  | 'received'
  | 'artwork_review'
  | 'artwork_approved'
  | 'cylinder_making'
  | 'printing'
  | 'lamination'
  | 'cutting'
  | 'packing'
  | 'dispatch'
  | 'delivered';

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded';
export type PaymentMethod = 'credit_card' | 'bank_transfer' | 'upi' | 'cheque' | 'cash';

export interface ArtworkFile {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'changes_requested';
  feedback?: string;
}

export interface OrderNote {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
  isInternal: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  companyName?: string;
  gstNumber?: string;
  contactDetails?: {
    phone: string;
    alternatePhone?: string;
    contactPerson?: string;
  };
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  subtotal: number;
  gstAmount: number;
  shippingCharges: number;
  shippingAddress: string;
  billingAddress?: string;
  createdAt: string;
  updatedAt: string;
  orderDate: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentDate?: string;
  productionStage: ProductionStage;
  artworks?: ArtworkFile[];
  notes?: OrderNote[];
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  material?: string;
  finish?: string;
  size?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customization?: string;
  imageUrl?: string;
}

/* ─── Customers ─────────────────────────────────────────────────────── */

export type CustomerType = 'retail' | 'business';
export type CustomerAccountStatus = 'active' | 'inactive' | 'suspended';
export type PaymentMethodPreference = 'credit_card' | 'bank_transfer' | 'upi' | 'cheque' | 'cash';

export interface CustomerNote {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

export interface CustomerDesign {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  description?: string;
}

export interface CustomerInvoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  amount: number;
  issuedDate: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  fileUrl?: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  quantity?: number;
  addedAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  resolvedAt?: string;
}

export interface CustomerAddress {
  id: string;
  type: 'billing' | 'shipping' | 'delivery';
  company?: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  companyName?: string;
  contactPerson?: string;
  panNumber?: string;
  gstNumber?: string;
  customerType: CustomerType;
  accountStatus: CustomerAccountStatus;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate?: string;
  preferredPaymentMethod: PaymentMethodPreference;
  creditLimit?: number;
  outstandingBalance?: number;
  createdAt: string;
  isActive: boolean;
  addresses: CustomerAddress[];
  notes?: CustomerNote[];
  designs?: CustomerDesign[];
  invoices?: CustomerInvoice[];
  wishlist?: WishlistItem[];
  supportTickets?: SupportTicket[];
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

/* ─── Inventory ─────────────────────────────────────────────────────── */

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  reorderLevel: number;
  location: string;
  lastRestockDate: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

/* ─── Pricing ────────────────────────────────────────────────────────── */

export interface PricingRule {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minQuantity: number;
  maxQuantity?: number;
  applicableProducts: string[];
  isActive: boolean;
  createdAt: string;
}

/* ─── Banner / Promo ────────────────────────────────────────────────── */

export interface Banner {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  displayLocation: 'home' | 'products' | 'checkout';
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface CouponCode {
  id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
}

/* ─── Analytics ─────────────────────────────────────────────────────── */

export interface DashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  activeCustomers: number;
  lowStockProducts: number;
  pendingOrders: number;
  supportTickets: number;
  orderGrowth: number;
  revenueGrowth: number;
  customerGrowth: number;
}

export interface SalesData {
  date: string;
  sales: number;
  orders: number;
  revenue: number;
}

/* ─── API Response ──────────────────────────────────────────────────── */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
