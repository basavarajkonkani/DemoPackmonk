/**
 * PacMonk shared formatting utilities
 */

/**
 * Format a number as currency.
 * e.g. formatCurrency(1234.5) → "₹1,234.50"
 */
export const formatCurrency = (amount: number, symbol = '₹'): string => {
  return `${symbol}${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Format a unit price.
 * e.g. formatUnitPrice(1.45) → "₹1.45/unit"
 */
export const formatUnitPrice = (price: number, symbol = '₹'): string => {
  return `${symbol}${price.toFixed(2)}/unit`;
};

/**
 * Format an ISO date string to a readable date.
 * e.g. formatDate("2026-06-10T09:00:00Z") → "Jun 10, 2026"
 */
export const formatDate = (iso: string): string => {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format a date to relative time.
 * e.g. "3 days ago", "just now", "in 5 days"
 */
export const formatRelativeTime = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const abs = Math.abs(diff);
  const past = diff > 0;

  if (abs < 60_000) return 'just now';
  if (abs < 3_600_000) {
    const mins = Math.round(abs / 60_000);
    return past ? `${mins}m ago` : `in ${mins}m`;
  }
  if (abs < 86_400_000) {
    const hrs = Math.round(abs / 3_600_000);
    return past ? `${hrs}h ago` : `in ${hrs}h`;
  }
  const days = Math.round(abs / 86_400_000);
  return past ? `${days} day${days > 1 ? 's' : ''} ago` : `in ${days} day${days > 1 ? 's' : ''}`;
};

/**
 * Truncate a string to a max length with ellipsis.
 */
export const truncate = (text: string, maxLength = 40): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 1).trimEnd() + '…';
};

/**
 * Convert a material ID to a human-readable name.
 * e.g. "premium-matte-black" → "Premium Matte Black"
 */
export const formatMaterialId = (id: string): string => {
  return id
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

/**
 * Format an order status to a display label.
 */
export const formatOrderStatus = (status: string): string => {
  const map: Record<string, string> = {
    pending_review: 'Artwork Review',
    artwork_approved: 'Ready for Press',
    in_production: 'In Production',
    quality_check: 'Quality Check',
    shipped: 'Shipped',
    delivered: 'Delivered',
  };
  return map[status] ?? 'Processing';
};

/**
 * Get badge color for an order status.
 */
export const getStatusColor = (status: string): { color: string; bg: string } => {
  const map: Record<string, { color: string; bg: string }> = {
    pending_review:  { color: '#D97706', bg: '#FEF3C7' },
    artwork_approved:{ color: '#0F8A3C', bg: '#DCFCE7' },
    in_production:   { color: '#D97706', bg: '#FEF3C7' },
    quality_check:   { color: '#7C3AED', bg: '#F3E8FF' },
    shipped:         { color: '#0284C7', bg: '#E0F2FE' },
    delivered:       { color: '#0F8A3C', bg: '#DCFCE7' },
  };
  return map[status] ?? { color: '#6B7280', bg: '#F3F4F6' };
};

/**
 * Calculate estimated delivery date string from order date.
 * Production takes 5–7 business days + 2–3 shipping days.
 */
export const calcEstimatedDelivery = (businessDays = 10): string => {
  const date = new Date();
  let added = 0;
  while (added < businessDays) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) added++; // skip weekends
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
