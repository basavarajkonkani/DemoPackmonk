/**
 * PacMonk — App-wide constants
 */

export const APP_NAME = 'PacMonk';
export const APP_VERSION = '1.0.0';
export const APP_TAGLINE = 'End-to-End Packaging & Print Solutions';

/* ─── Brand Colors ─────────────────────────────────────────────────── */
export const COLORS = {
  primary: '#0F8A3C',
  primaryDark: '#0A6B2E',
  primaryLight: '#DCFCE7',
  secondary: '#1E1E1E',
  accent: '#F59E0B',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#E5E7EB',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#0F8A3C',
} as const;

/* ─── Category Colors ──────────────────────────────────────────────── */
export const CATEGORY_COLORS: Record<string, { bg: string; iconColor: string; icon: string }> = {
  box:    { bg: '#DCFCE7', iconColor: '#0F8A3C', icon: 'box-open' },
  mailer: { bg: '#DCFCE7', iconColor: '#0F8A3C', icon: 'mail-bulk' },
  bag:    { bg: '#FEF3C7', iconColor: '#D97706', icon: 'shopping-bag' },
  tape:   { bg: '#F3E8FF', iconColor: '#7C3AED', icon: 'tape' },
};

/* ─── Order Status Config ──────────────────────────────────────────── */
export type OrderStatus =
  | 'pending_review'
  | 'artwork_approved'
  | 'in_production'
  | 'quality_check'
  | 'shipped'
  | 'delivered';

export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending_review:   { label: 'Artwork Review',   color: '#D97706', bg: '#FEF3C7' },
  artwork_approved: { label: 'Ready for Press',  color: '#0F8A3C', bg: '#DCFCE7' },
  in_production:    { label: 'In Production',    color: '#D97706', bg: '#FEF3C7' },
  quality_check:    { label: 'Quality Check',    color: '#7C3AED', bg: '#F3E8FF' },
  shipped:          { label: 'Shipped',          color: '#0284C7', bg: '#E0F2FE' },
  delivered:        { label: 'Delivered',        color: '#0F8A3C', bg: '#DCFCE7' },
};

/* ─── Production Milestones ────────────────────────────────────────── */
export const PRODUCTION_MILESTONES = [
  { status: 'pending_review',   icon: 'file-alt',       label: 'Order Submitted',   desc: 'Artwork files received and queued for pre-press.' },
  { status: 'artwork_approved', icon: 'check-circle',   label: 'Artwork Approved',  desc: 'Pre-press team approved logo, scale and ink colours.' },
  { status: 'in_production',    icon: 'industry',       label: 'In Production',     desc: 'Die-cutting and ink printing in progress.' },
  { status: 'quality_check',    icon: 'microscope',     label: 'Quality Check',     desc: 'Sample inspection for joints, colour and thickness.' },
  { status: 'shipped',          icon: 'truck',          label: 'Shipped',           desc: 'Handed to courier partner with tracking number.' },
  { status: 'delivered',        icon: 'box-open',       label: 'Delivered',         desc: 'Signed and delivered at destination.' },
] as const;

/* ─── Tax / Fees ───────────────────────────────────────────────────── */
export const GST_RATE = 0.09;
export const DEFAULT_SHIPPING_FEE = 35.0;
export const PRINT_SETUP_FEE = 25.0;
export const PRINT_COST_PER_UNIT = 0.18;

/* ─── Delivery ─────────────────────────────────────────────────────── */
export const PRODUCTION_DAYS = { min: 5, max: 7 };
export const SHIPPING_DAYS = { min: 2, max: 3 };

/* ─── Pagination ───────────────────────────────────────────────────── */
export const PRODUCTS_PER_PAGE = 10;

/* ─── Contact ──────────────────────────────────────────────────────── */
export const SUPPORT_EMAIL = 'support@pacmonk.com';
export const SUPPORT_PHONE = '+91-80-4567-8900';
export const WHATSAPP_NUMBER = '+919876543210';

/* ─── Social / Legal ───────────────────────────────────────────────── */
export const WEBSITE = 'https://pacmonk.com';
export const PRIVACY_URL = 'https://pacmonk.com/privacy';
export const TERMS_URL = 'https://pacmonk.com/terms';

/* ─── Storage Keys ─────────────────────────────────────────────────── */
export const ONBOARDING_KEY = '@pacmonk_onboarding_done';
