/**
 * PacMonk — Quantity Validation Types
 * 
 * Type definitions for the centralized quantity validation system.
 * These types support validation of quantity constraints across all order entry points,
 * ensuring bulk orders (≥5000 units) are properly routed to the sales team.
 */

/* ─── Validation Results ────────────────────────────────────────────── */

/**
 * Result of a quantity validation operation.
 * 
 * Contains the validity status, approved quantity (if valid), and alert information
 * for communicating validation failures to users.
 * 
 * @property isValid - Whether the requested quantity change is allowed
 * @property newQuantity - The approved quantity if valid, null if invalid
 * @property shouldShowAlert - Whether to display an alert to the user
 * @property alertType - Type of validation failure, or null if valid
 * @property message - User-friendly error message, or null if valid
 */
export interface ValidationResult {
  isValid: boolean;
  newQuantity: number | null;
  shouldShowAlert: boolean;
  alertType: 'bulk_order' | 'min_order' | null;
  message: string | null;
}

/* ─── Validation Configuration ──────────────────────────────────────── */

/**
 * Configuration options for quantity validation.
 * 
 * Defines the business rules for quantity constraints including allowed steps,
 * minimum order quantity, and the bulk order threshold.
 * 
 * @property quantitySteps - Array of valid quantity values (e.g., [100, 200, 300, 500, 1000, 3000, 5000])
 * @property minimumOrderQuantity - Minimum units required for any order (typically 100)
 * @property bulkOrderThreshold - Quantity at which orders must go through sales team (typically 5000)
 */
export interface QuantityOptions {
  quantitySteps: number[];
  minimumOrderQuantity: number;
  bulkOrderThreshold: number;
}

/* ─── Alert Messages ────────────────────────────────────────────────── */

/**
 * Structured message for bulk order alerts.
 * 
 * Displayed when users attempt to order quantities at or above the bulk threshold.
 * Provides clear guidance on contacting the sales team for special pricing.
 * 
 * @property title - Alert dialog title (e.g., "Bulk Order")
 * @property message - Detailed explanation of why the order requires sales contact
 * @property contactInfo - Sales team contact information (phone and email)
 */
export interface BulkOrderMessage {
  title: string;
  message: string;
  contactInfo: ContactInfo;
}

/**
 * Sales team contact information.
 * 
 * Used in bulk order alerts to provide users with direct contact methods
 * for placing large orders.
 * 
 * @property phone - Sales team phone number (e.g., "+91 98765 43210")
 * @property email - Sales team email address (e.g., "admin@packmonk.com")
 */
export interface ContactInfo {
  phone: string;
  email: string;
}

/* ─── Analytics Events (Future) ─────────────────────────────────────── */

/**
 * Event data for quantity change operations.
 * 
 * Captures metadata about quantity modifications for analytics and monitoring.
 * Can be used to track user behavior, validation failures, and conversion rates.
 * 
 * @property previousQuantity - Quantity before the change attempt
 * @property attemptedQuantity - Quantity the user tried to set
 * @property finalQuantity - Actual quantity after validation (may differ from attempted)
 * @property changeType - How the quantity was changed (button clicks or manual entry)
 * @property wasBlocked - Whether the validation blocked the change
 * @property blockReason - Reason for blocking, if applicable (bulk threshold or min order)
 * @property timestamp - When the change was attempted
 * @property source - Which part of the app initiated the change (cart, configurator, etc.)
 */
export interface QuantityChangeEvent {
  previousQuantity: number;
  attemptedQuantity: number;
  finalQuantity: number;
  changeType: 'increment' | 'decrement' | 'manual_input';
  wasBlocked: boolean;
  blockReason?: 'bulk_threshold' | 'min_order' | null;
  timestamp: Date;
  source: 'cart' | 'configurator' | 'checkout' | 'product_detail';
}
