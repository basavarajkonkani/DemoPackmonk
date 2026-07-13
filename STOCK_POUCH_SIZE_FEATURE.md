# Stock Pouch Size Selection Feature

## Overview
The Ready Stock Products detail screen now includes a **"Select Size"** section that allows users to choose from multiple pouch sizes, each with its own price. The price and capacity update dynamically based on the selected size.

## What Changed

### 1. **ReadyStockProductDetailScreen.tsx**
- Added `SizeOption` interface with `id`, `dimensions`, `capacity`, and `price` fields
- Updated `ReadyStockProduct` interface to include optional `sizeOptions` array
- Added state management for selected size: `selectedSizeId`
- Dynamically calculate current price and capacity based on selected size
- Updated cart item creation to use selected size's price and capacity
- Added new "Select Size" UI section with size option cards
- Updated specifications section to show standardized specs (Micron, Material, Sealing, Heat Resistance)
- Changed quantity section title to "Quantity (pieces)"
- Simplified price summary to show just "Subtotal"

### 2. **ReadyStockProductsScreen.tsx**
- Updated all 9 ready stock products with `sizeOptions` array
- Each product now has 7 size options ranging from 50g to 2000g
- Prices vary by size (e.g., Clear Standy Pouch: ₹1.30 to ₹6.55 per piece)

## Size Options Structure

Each product includes size options like:
```javascript
sizeOptions: [
  { 
    id: 'size1', 
    dimensions: '8.5 × 13.5 × 2.5 cm', 
    capacity: 'CSP1 - 50 g', 
    price: 1.30 
  },
  // ... more sizes
  { 
    id: 'size7', 
    dimensions: '20 × 30 × 5 cm', 
    capacity: 'CSP7 - 2000 g', 
    price: 6.55 
  },
]
```

## UI Components

### Size Option Card
- Shows dimensions, capacity, and price
- Selected size is highlighted with green border and light blue background
- Radio button indicator on the right
- Tap to select different sizes

## Features

✅ **Dynamic Pricing**: Price updates when size is selected
✅ **Dynamic Capacity**: Capacity updates in cart based on selected size
✅ **Radio Selection**: Clear visual indication of selected size
✅ **Responsive Design**: Works with existing bottom navigation and sticky footer
✅ **Accessible**: Follows design patterns from mockups

## How It Works

1. User navigates to Ready Stock Product Detail
2. First size option is pre-selected by default
3. User can tap any size option card to select it
4. Price and capacity update automatically
5. Quantity selector updates based on current price
6. "Add to Cart" uses the selected size's price and capacity

## Integration Notes

- All 9 existing ready stock products now have size options
- Backward compatible - works with or without sizeOptions
- Prices in product data are multiplied by quantity for total
- Cart stores the selected size information with the product

## Example Usage

When adding to cart with a selected size:
```javascript
const cartItem = {
  // ...
  capacity: selectedSize.capacity,  // e.g., "CSP3 - 200 g"
  unitPrice: currentPrice,           // e.g., 2.35
  totalPrice: currentPrice * quantity,
  // ...
}
```
