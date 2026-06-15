/**
 * PacMonk — Quantity Validation Service
 * 
 * Centralized validation logic for quantity thresholds across all order entry points.
 * Enforces business rules for bulk orders (≥5000 units) and minimum order quantities.
 * 
 * @module quantityValidator
 */

import { Alert } from 'react-native';
import {
  ValidationResult,
  QuantityOptions,
  BulkOrderMessage,
  ContactInfo,
} from '../types/validation';
import {
  BULK_ORDER_THRESHOLD,
  QUANTITY_OPTIONS,
  MINIMUM_ORDER_QUANTITY,
  BULK_ORDER_CONTACT_PHONE,
  BULK_ORDER_CONTACT_EMAIL,
  BULK_ORDER_MESSAGE,
} from '../constants';

/** Default validation options used across order entry points */
export const DEFAULT_QUANTITY_OPTIONS: QuantityOptions = {
  quantitySteps: QUANTITY_OPTIONS,
  minimumOrderQuantity: MINIMUM_ORDER_QUANTITY,
  bulkOrderThreshold: BULK_ORDER_THRESHOLD,
};

/** Shows a native alert for bulk-order or minimum-quantity validation failures */
export function showQuantityValidationAlert(result: ValidationResult): void {
  if (!result.shouldShowAlert || !result.message) return;

  const title = result.alertType === 'bulk_order' ? 'Bulk Order' : 'Minimum Quantity';
  Alert.alert(title, result.message, [{ text: 'OK' }]);
}

/** Applies a validation result: shows alerts when needed and updates quantity if allowed */
export function applyQuantityValidationResult(
  result: ValidationResult,
  onApply: (quantity: number) => void
): void {
  if (!result.isValid) {
    showQuantityValidationAlert(result);
    if (result.newQuantity !== null) {
      onApply(result.newQuantity);
    }
    return;
  }

  if (result.shouldShowAlert) {
    showQuantityValidationAlert(result);
  }

  if (result.newQuantity !== null) {
    onApply(result.newQuantity);
  }
}

/**
 * QuantityValidator — Centralized service for validating quantity operations
 * 
 * This class provides pure validation functions for increment, decrement, and manual
 * input operations. All methods are side-effect free and return structured validation
 * results that UI components can use to determine appropriate actions.
 * 
 * **Business Rules Enforced:**
 * - Orders >= 5,000 units require sales team contact (bulk order threshold)
 * - Orders < 100 units are below minimum order quantity (MOQ)
 * - All quantities must align with predefined steps [100, 200, 300, 500, 1000, 3000, 5000]
 * 
 * @example
 * ```typescript
 * const validator = new QuantityValidator();
 * 
 * // Validate increment operation
 * const result = validator.validateQuantityIncrement(3000, {
 *   quantitySteps: QUANTITY_OPTIONS,
 *   minimumOrderQuantity: MINIMUM_ORDER_QUANTITY,
 *   bulkOrderThreshold: BULK_ORDER_THRESHOLD
 * });
 * 
 * if (!result.isValid && result.alertType === 'bulk_order') {
 *   Alert.alert('Bulk Order', result.message);
 * }
 * ```
 */
export class QuantityValidator {
  /**
   * Validates quantity increment operations.
   * 
   * Determines if the user can move to the next quantity step from their current quantity.
   * Blocks increments that would result in quantities >= bulk order threshold (5000).
   * 
   * **Preconditions:**
   * - `currentQuantity >= 0`
   * - `options.quantitySteps` is non-empty and sorted in ascending order
   * - `options.bulkOrderThreshold > 0`
   * - `options.minimumOrderQuantity > 0`
   * 
   * **Postconditions:**
   * - If `result.isValid === true`:
   *   - `result.newQuantity !== null`
   *   - `result.newQuantity < options.bulkOrderThreshold`
   *   - `result.newQuantity > currentQuantity` (quantity increased)
   * - If `result.isValid === false`:
   *   - `result.newQuantity === null`
   *   - `result.shouldShowAlert === true`
   *   - `result.alertType === 'bulk_order'`
   * 
   * **Algorithm:**
   * 1. Find current quantity's index in the quantity steps array
   * 2. If not found, use first step; if at last step, prevent increment
   * 3. Otherwise, calculate next step
   * 4. Check if next step would exceed bulk order threshold
   * 5. Return validation result with appropriate flags
   * 
   * @param currentQuantity - The user's current quantity selection
   * @param options - Validation configuration (steps, thresholds, MOQ)
   * @returns Structured validation result indicating validity and any alerts needed
   * 
   * @example
   * ```typescript
   * // Attempting to increment from 3000 (blocked)
   * const result = validator.validateQuantityIncrement(3000, options);
   * // result.isValid === false
   * // result.alertType === 'bulk_order'
   * 
   * // Attempting to increment from 1000 (allowed)
   * const result = validator.validateQuantityIncrement(1000, options);
   * // result.isValid === true
   * // result.newQuantity === 3000
   * ```
   */
  validateQuantityIncrement(
    currentQuantity: number,
    options: QuantityOptions
  ): ValidationResult {
    // Development mode assertion: verify preconditions
    if (__DEV__) {
      if (currentQuantity < 0) {
        throw new TypeError(
          `Precondition violation: currentQuantity must be >= 0, got ${currentQuantity}`
        );
      }
      if (!options.quantitySteps || options.quantitySteps.length === 0) {
        throw new TypeError(
          'Precondition violation: quantitySteps must be non-empty array'
        );
      }
      if (options.bulkOrderThreshold <= 0) {
        throw new TypeError(
          `Precondition violation: bulkOrderThreshold must be > 0, got ${options.bulkOrderThreshold}`
        );
      }
    }

    // Find current index in quantity steps
    const currentIndex = options.quantitySteps.indexOf(currentQuantity);

    let nextQuantity: number;

    if (currentIndex === -1) {
      // Current quantity not in steps, use first step
      nextQuantity = options.quantitySteps[0];
    } else if (currentIndex === options.quantitySteps.length - 1) {
      // Already at maximum step — cannot go higher
      return {
        isValid: false,
        newQuantity: null,
        shouldShowAlert: true,
        alertType: 'bulk_order',
        message: BULK_ORDER_MESSAGE,
      };
    } else {
      // Move to next step
      nextQuantity = options.quantitySteps[currentIndex + 1];
    }

    // Block only quantities strictly above the bulk threshold
    if (nextQuantity > options.bulkOrderThreshold) {
      return {
        isValid: false,
        newQuantity: null,
        shouldShowAlert: true,
        alertType: 'bulk_order',
        message: BULK_ORDER_MESSAGE,
      };
    }

    // At exactly the bulk threshold — allow selection but show sales notice
    if (nextQuantity >= options.bulkOrderThreshold) {
      return {
        isValid: true,
        newQuantity: nextQuantity,
        shouldShowAlert: true,
        alertType: 'bulk_order',
        message: BULK_ORDER_MESSAGE,
      };
    }

    // Valid increment below bulk threshold
    const result: ValidationResult = {
      isValid: true,
      newQuantity: nextQuantity,
      shouldShowAlert: false,
      alertType: null,
      message: null,
    };

    // Development mode assertion: verify postconditions
    if (__DEV__) {
      if (result.newQuantity !== null && result.newQuantity > options.bulkOrderThreshold) {
        throw new Error('Postcondition violation: valid result exceeded bulk threshold');
      }
    }

    return result;
  }

  /**
   * Validates quantity decrement operations.
   * 
   * Determines if the user can move to the previous quantity step from their current quantity.
   * Blocks decrements that would result in quantities < minimum order quantity (100).
   * 
   * **Preconditions:**
   * - `currentQuantity >= options.minimumOrderQuantity`
   * - `options.quantitySteps` is non-empty and sorted in ascending order
   * - `options.minimumOrderQuantity > 0`
   * 
   * **Postconditions:**
   * - If `result.isValid === true`:
   *   - `result.newQuantity !== null`
   *   - `result.newQuantity >= options.minimumOrderQuantity`
   *   - `result.newQuantity < currentQuantity` (quantity decreased)
   * - If `result.isValid === false`:
   *   - `result.newQuantity === null`
   *   - `result.shouldShowAlert === true`
   *   - `result.alertType === 'min_order'`
   * 
   * **Algorithm:**
   * 1. Find current quantity's index in the quantity steps array
   * 2. If not found or at first step, prevent decrement
   * 3. Otherwise, calculate previous step
   * 4. Check if previous step would be below minimum order quantity
   * 5. Return validation result with appropriate flags
   * 
   * @param currentQuantity - The user's current quantity selection
   * @param options - Validation configuration (steps, thresholds, MOQ)
   * @returns Structured validation result indicating validity and any alerts needed
   * 
   * @example
   * ```typescript
   * // Attempting to decrement from 100 (blocked)
   * const result = validator.validateQuantityDecrement(100, options);
   * // result.isValid === false
   * // result.alertType === 'min_order'
   * 
   * // Attempting to decrement from 500 (allowed)
   * const result = validator.validateQuantityDecrement(500, options);
   * // result.isValid === true
   * // result.newQuantity === 300
   * ```
   */
  validateQuantityDecrement(
    currentQuantity: number,
    options: QuantityOptions
  ): ValidationResult {
    // Development mode assertion: verify preconditions
    if (__DEV__) {
      if (currentQuantity < options.minimumOrderQuantity) {
        throw new TypeError(
          `Precondition violation: currentQuantity must be >= minimumOrderQuantity (${options.minimumOrderQuantity}), got ${currentQuantity}`
        );
      }
      if (!options.quantitySteps || options.quantitySteps.length === 0) {
        throw new TypeError(
          'Precondition violation: quantitySteps must be non-empty array'
        );
      }
    }

    const currentIndex = options.quantitySteps.indexOf(currentQuantity);

    let previousQuantity: number;

    if (currentIndex === -1 || currentIndex === 0) {
      // At or below minimum step
      return {
        isValid: false,
        newQuantity: null,
        shouldShowAlert: true,
        alertType: 'min_order',
        message: `Minimum order quantity is ${options.minimumOrderQuantity} units.`,
      };
    }

    // Move to previous step
    previousQuantity = options.quantitySteps[currentIndex - 1];

    // Ensure we don't go below minimum
    if (previousQuantity < options.minimumOrderQuantity) {
      return {
        isValid: false,
        newQuantity: null,
        shouldShowAlert: true,
        alertType: 'min_order',
        message: `Minimum order quantity is ${options.minimumOrderQuantity} units.`,
      };
    }

    // Valid decrement
    const result: ValidationResult = {
      isValid: true,
      newQuantity: previousQuantity,
      shouldShowAlert: false,
      alertType: null,
      message: null,
    };

    // Development mode assertion: verify postconditions
    if (__DEV__) {
      if (result.newQuantity !== null && result.newQuantity < options.minimumOrderQuantity) {
        throw new Error('Postcondition violation: valid result below minimum order quantity');
      }
      if (result.newQuantity !== null && result.newQuantity >= currentQuantity) {
        throw new Error('Postcondition violation: decrement did not reduce quantity');
      }
    }

    return result;
  }

  /**
   * Validates manually entered quantity values.
   * 
   * Sanitizes and validates user-provided quantity input, rounding to the nearest
   * valid quantity step when necessary. Enforces both bulk order threshold and
   * minimum order quantity constraints.
   * 
   * **Preconditions:**
   * - `inputQuantity` is a valid number (not NaN)
   * - `options.bulkOrderThreshold > 0`
   * - `options.minimumOrderQuantity > 0`
   * - `options.quantitySteps` is non-empty and sorted in ascending order
   * 
   * **Postconditions:**
   * - If `result.isValid === true`:
   *   - `result.newQuantity !== null`
   *   - `options.minimumOrderQuantity <= result.newQuantity < options.bulkOrderThreshold`
   *   - `result.newQuantity ∈ options.quantitySteps`
   * - If `result.isValid === false` and `result.alertType === 'bulk_order'`:
   *   - `result.newQuantity === null`
   *   - Input quantity was >= bulkOrderThreshold
   * - If `result.isValid === false` and `result.alertType === 'min_order'`:
   *   - `result.newQuantity === options.minimumOrderQuantity`
   *   - Input quantity was <= 0 or < minimumOrderQuantity
   * 
   * **Algorithm:**
   * 1. Check if input is non-positive (≤ 0)
   * 2. Check if input exceeds bulk order threshold (≥ 5000)
   * 3. Check if input is below minimum order quantity (< 100)
   * 4. If valid range, find nearest quantity step
   * 5. Return validation result with snapped quantity
   * 
   * @param inputQuantity - The quantity value entered by the user
   * @param options - Validation configuration (steps, thresholds, MOQ)
   * @returns Structured validation result with nearest valid quantity or error
   * 
   * @example
   * ```typescript
   * // User enters 6000 (blocked)
   * const result = validator.validateQuantityInput(6000, options);
   * // result.isValid === false
   * // result.alertType === 'bulk_order'
   * 
   * // User enters 750 (snapped to nearest step)
   * const result = validator.validateQuantityInput(750, options);
   * // result.isValid === true
   * // result.newQuantity === 1000 (nearest step)
   * 
   * // User enters 50 (below MOQ)
   * const result = validator.validateQuantityInput(50, options);
   * // result.isValid === false
   * // result.alertType === 'min_order'
   * // result.newQuantity === 100 (clamped to MOQ)
   * ```
   */
  validateQuantityInput(
    inputQuantity: number,
    options: QuantityOptions
  ): ValidationResult {
    // Development mode assertion: verify preconditions
    if (__DEV__) {
      if (isNaN(inputQuantity)) {
        throw new TypeError(
          `Precondition violation: inputQuantity must be a valid number, got NaN`
        );
      }
      if (options.bulkOrderThreshold <= 0) {
        throw new TypeError(
          `Precondition violation: bulkOrderThreshold must be > 0, got ${options.bulkOrderThreshold}`
        );
      }
      if (options.minimumOrderQuantity <= 0) {
        throw new TypeError(
          `Precondition violation: minimumOrderQuantity must be > 0, got ${options.minimumOrderQuantity}`
        );
      }
      if (!options.quantitySteps || options.quantitySteps.length === 0) {
        throw new TypeError(
          'Precondition violation: quantitySteps must be non-empty array'
        );
      }
    }

    // Check if input is non-positive
    if (inputQuantity <= 0) {
      return {
        isValid: false,
        newQuantity: options.minimumOrderQuantity,
        shouldShowAlert: true,
        alertType: 'min_order',
        message: `Quantity must be at least ${options.minimumOrderQuantity} units.`,
      };
    }

    // Block only quantities strictly above the bulk threshold
    if (inputQuantity > options.bulkOrderThreshold) {
      return {
        isValid: false,
        newQuantity: null,
        shouldShowAlert: true,
        alertType: 'bulk_order',
        message: BULK_ORDER_MESSAGE,
      };
    }

    // Check minimum order quantity
    if (inputQuantity < options.minimumOrderQuantity) {
      return {
        isValid: false,
        newQuantity: options.minimumOrderQuantity,
        shouldShowAlert: true,
        alertType: 'min_order',
        message: `Minimum order quantity is ${options.minimumOrderQuantity} units.`,
      };
    }

    // Valid input - find nearest quantity step
    const nearestStep = this.findNearestQuantityStep(
      inputQuantity,
      options.quantitySteps
    );

    // At or above bulk threshold — allow but show sales notice
    if (nearestStep >= options.bulkOrderThreshold) {
      return {
        isValid: true,
        newQuantity: nearestStep,
        shouldShowAlert: true,
        alertType: 'bulk_order',
        message: BULK_ORDER_MESSAGE,
      };
    }

    const result: ValidationResult = {
      isValid: true,
      newQuantity: nearestStep,
      shouldShowAlert: false,
      alertType: null,
      message: null,
    };

    // Development mode assertion: verify postconditions
    if (__DEV__) {
      if (result.newQuantity === null) {
        throw new Error('Postcondition violation: valid result has null newQuantity');
      }
      if (result.newQuantity < options.minimumOrderQuantity) {
        throw new Error('Postcondition violation: valid result below minimum order quantity');
      }
      if (result.newQuantity > options.bulkOrderThreshold) {
        throw new Error('Postcondition violation: valid result exceeded bulk threshold');
      }
      if (!options.quantitySteps.includes(result.newQuantity)) {
        throw new Error('Postcondition violation: valid result not in quantitySteps array');
      }
    }

    return result;
  }

  /**
   * Finds the nearest valid quantity step for a given input.
   * 
   * Uses minimum distance algorithm to snap arbitrary quantities to the closest
   * predefined step. This ensures all quantities align with business constraints.
   * 
   * **Preconditions:**
   * - `quantitySteps.length > 0`
   * - `quantitySteps` is sorted in ascending order
   * - `inputQuantity > 0`
   * 
   * **Postconditions:**
   * - Returns a number from the `quantitySteps` array
   * - Returned value minimizes `|inputQuantity - step|` for all steps in array
   * - Return value `∈ quantitySteps`
   * 
   * **Loop Invariants:**
   * - For each iteration `i`, `nearestStep` contains the closest step found in `quantitySteps[0..i-1]`
   * - `minDifference === |inputQuantity - nearestStep|`
   * - `nearestStep ∈ quantitySteps[0..i-1]`
   * 
   * **Algorithm:**
   * 1. Initialize with first step as nearest
   * 2. Iterate through all steps, calculating distance from input
   * 3. Track step with minimum distance
   * 4. Return closest step
   * 
   * @param inputQuantity - The quantity to snap to nearest step
   * @param quantitySteps - Array of valid quantity steps (sorted ascending)
   * @returns The quantity step closest to the input value
   * 
   * @example
   * ```typescript
   * // Exact match
   * findNearestQuantityStep(500, [100, 200, 300, 500, 1000])
   * // Returns: 500
   * 
   * // Between steps (closer to 500)
   * findNearestQuantityStep(750, [100, 200, 300, 500, 1000])
   * // Returns: 1000
   * 
   * // Between steps (closer to 300)
   * findNearestQuantityStep(350, [100, 200, 300, 500, 1000])
   * // Returns: 300
   * ```
   */
  findNearestQuantityStep(
    inputQuantity: number,
    quantitySteps: number[]
  ): number {
    // Development mode assertion: verify preconditions
    if (__DEV__) {
      if (!quantitySteps || quantitySteps.length === 0) {
        throw new TypeError(
          'Precondition violation: quantitySteps must be non-empty array'
        );
      }
      if (inputQuantity <= 0) {
        throw new TypeError(
          `Precondition violation: inputQuantity must be > 0, got ${inputQuantity}`
        );
      }
    }

    let nearestStep = quantitySteps[0];
    let minDifference = Math.abs(inputQuantity - nearestStep);

    // Loop invariant: nearestStep is the closest step found so far
    // Loop invariant: minDifference = |inputQuantity - nearestStep|
    for (let i = 1; i < quantitySteps.length; i++) {
      const currentStep = quantitySteps[i];
      const difference = Math.abs(inputQuantity - currentStep);

      if (difference < minDifference) {
        nearestStep = currentStep;
        minDifference = difference;
      }
    }

    // Development mode assertion: verify postconditions
    if (__DEV__) {
      if (!quantitySteps.includes(nearestStep)) {
        throw new Error('Postcondition violation: nearestStep not in quantitySteps array');
      }
      // Verify optimality: no other step should be closer
      for (const step of quantitySteps) {
        const stepDistance = Math.abs(inputQuantity - step);
        const nearestDistance = Math.abs(inputQuantity - nearestStep);
        if (stepDistance < nearestDistance) {
          throw new Error(
            `Postcondition violation: found closer step ${step} than ${nearestStep}`
          );
        }
      }
    }

    return nearestStep;
  }

  /**
   * Gets the bulk order message with contact information.
   * 
   * Returns a structured message object containing the title, detailed message,
   * and sales team contact information. Used by UI components to display consistent
   * bulk order alerts across the application.
   * 
   * @returns Structured bulk order message with contact details
   * 
   * @example
   * ```typescript
   * const message = validator.getBulkOrderMessage();
   * Alert.alert(
   *   message.title,
   *   `${message.message}\n\nContact: ${message.contactInfo.phone}`,
   *   [{ text: 'OK' }]
   * );
   * ```
   */
  getBulkOrderMessage(): BulkOrderMessage {
    const contactInfo: ContactInfo = {
      phone: BULK_ORDER_CONTACT_PHONE,
      email: BULK_ORDER_CONTACT_EMAIL,
    };

    return {
      title: 'Bulk Order',
      message: BULK_ORDER_MESSAGE,
      contactInfo,
    };
  }
}

/**
 * Default singleton instance of QuantityValidator.
 * 
 * Provides a ready-to-use validator instance that can be imported and used
 * directly without instantiation. All validation methods are instance methods
 * but have no internal state, so a single instance is sufficient.
 * 
 * @example
 * ```typescript
 * import { quantityValidator } from './utils/quantityValidator';
 * 
 * const result = quantityValidator.validateQuantityIncrement(3000, options);
 * ```
 */
export const quantityValidator = new QuantityValidator();

/**
 * Default export: QuantityValidator class
 * Named exports: quantityValidator instance
 */
export default QuantityValidator;
