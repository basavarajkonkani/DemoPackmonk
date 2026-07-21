/**
 * Price utility functions for calculating minimum and starting prices
 */

import { PackagingProduct } from '../store/configurableCatalogSlice';
import { POUCH_CATALOG, PouchType } from '../store/pouchSlice';

/**
 * Get the lowest price from a packaging product's all sizes/materials
 * Returns the minimum price considering all material multipliers
 */
export const getLowestPackagingPrice = (product: PackagingProduct): number => {
  const basePrice = product.basePrice;
  
  if (!product.materials || product.materials.length === 0) {
    return basePrice;
  }

  // Find the material with the lowest multiplier
  const lowestMultiplier = Math.min(...product.materials.map(m => m.multiplier));
  
  return basePrice * lowestMultiplier;
};

/**
 * Get the lowest price for a specific pouch type
 * Returns the minimum price across all capacity variants
 */
export const getLowestPouchPrice = (pouchType: PouchType): number => {
  const pouch = POUCH_CATALOG[pouchType];
  
  if (!pouch || !pouch.variants || pouch.variants.length === 0) {
    return 0;
  }

  // Find the variant with the lowest price
  return Math.min(...pouch.variants.map(v => v.pricePerPiece));
};

/**
 * Get the lowest capacity for a specific pouch type
 * This is useful for displaying "Starting at" price with capacity info
 */
export const getLowestCapacityForPouch = (pouchType: PouchType): string | null => {
  const pouch = POUCH_CATALOG[pouchType];
  
  if (!pouch || !pouch.variants || pouch.variants.length === 0) {
    return null;
  }

  // Find the variant with the lowest price
  const lowestVariant = pouch.variants.reduce((prev, current) => 
    prev.pricePerPiece < current.pricePerPiece ? prev : current
  );

  return lowestVariant.capacity;
};

/**
 * Format price display string like "Starting at ₹X.XX/pc (50g)"
 */
export const formatStartingPrice = (
  lowestPrice: number,
  capacity?: string,
  unit: string = '/pc'
): string => {
  const priceStr = `₹${lowestPrice.toFixed(2)}${unit}`;
  
  if (capacity) {
    return `${priceStr} (${capacity})`;
  }
  
  return priceStr;
};

/**
 * Get display text for lowest price with proper formatting
 * For packaging products
 */
export const getPackagingPriceDisplay = (product: PackagingProduct): {
  lowestPrice: number;
  displayText: string;
} => {
  const lowestPrice = getLowestPackagingPrice(product);
  
  return {
    lowestPrice,
    displayText: `₹${lowestPrice.toFixed(2)}/unit`,
  };
};

/**
 * Get display text for lowest price with proper formatting
 * For pouch products
 */
export const getPouchPriceDisplay = (pouchType: PouchType): {
  lowestPrice: number;
  capacity: string | null;
  displayText: string;
} => {
  const lowestPrice = getLowestPouchPrice(pouchType);
  const capacity = getLowestCapacityForPouch(pouchType);
  
  return {
    lowestPrice,
    capacity,
    displayText: capacity 
      ? `₹${lowestPrice.toFixed(2)}/pc (${capacity})`
      : `₹${lowestPrice.toFixed(2)}/pc`,
  };
};
