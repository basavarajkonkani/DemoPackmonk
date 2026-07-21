/**
 * Unified product catalog repository.
 *
 * BEFORE this refactor there were THREE independent, unsynced sources of
 * product data in this app:
 *   1. `adminSlice.products` (AdminProduct) — what admins edited
 *   2. `ReadyStockProductsScreen`'s local `READY_STOCK_PRODUCTS` array — what
 *      buyers actually saw on the "Products" tab
 *   3. `productsSlice` (PackagingProduct) — a separate configurable
 *      box/mailer/bag/tape catalog for the Design Studio flow
 *
 * Editing a product as an admin (#1) had zero effect on what buyers saw
 * (#2), because they were two different arrays. This repository merges
 * #1 and #2 into a single `CatalogProduct` model used by BOTH the admin
 * product management screens and the buyer-facing product list/detail
 * screens. #3 (configurable custom packaging) remains a separate
 * repository (`configurableCatalogRepository.ts`) because it is a
 * genuinely different product type (freely configurable dimensions/
 * materials vs. fixed ready-to-ship variants) — merging its schema into
 * this one would force awkward compromises on both sides.
 */
import { readList, writeList, generateId } from '../storage';

export interface CatalogSizeOption {
  id: string;
  code: string;
  dimensions: string;
  capacity: string;
  price: number;
}

export interface CatalogProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  material: string;
  finish: string;
  /** Single display size, e.g. "5x8 inch". Used when the product has no multi-size variants. */
  size: string;
  thickness: string;
  hasZipper: boolean;
  hasWindow: boolean;
  ecoRating: number;
  /** Base/lowest price shown in listings; kept in sync with sizeOptions when present. */
  price: number;
  stock: number;
  lowStockThreshold: number;
  moq: number;
  images: string[];
  /** Optional multi-size variants (used by ready-stock pouches with a size picker). */
  sizeOptions: CatalogSizeOption[];
  isActive: boolean;
  productCode?: string;
  sku?: string;
  createdAt: string;
  updatedAt: string;
}

const STORE_NAME = 'catalog_products';

const SEED_PRODUCTS: CatalogProduct[] = [
  {
    id: 'rs001',
    name: 'Gold Standy Pouch',
    description:
      'Premium gold standy pouch with excellent barrier properties, perfect for premium products and long shelf life.',
    category: 'Pouches',
    material: 'Metalized',
    finish: 'Gold',
    size: 'Medium',
    thickness: '120μ',
    hasZipper: false,
    hasWindow: false,
    ecoRating: 3,
    price: 2.45,
    stock: 3500,
    lowStockThreshold: 500,
    moq: 100,
    images: ['goldStandyPouch'],
    isActive: true,
    productCode: 'GSP',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    sizeOptions: [
      { id: 'GSP1', code: 'GSP1', dimensions: '10.5 × 17 × 3 cm', capacity: '100 g', price: 2.45 },
      { id: 'GSP2', code: 'GSP2', dimensions: '13.5 × 20.5 × 3.5 cm', capacity: '250 g', price: 3.85 },
      { id: 'GSP3', code: 'GSP3', dimensions: '15 × 20.5 × 3.5 cm', capacity: '500 g', price: 4.25 },
      { id: 'GSP4', code: 'GSP4', dimensions: '18 × 25 × 4 cm', capacity: '1000 g', price: 6.15 },
    ],
  },
  {
    id: 'rs002',
    name: 'Gold Standy Zipper Pouch',
    description:
      'Premium gold standy pouch with resealable zipper, ideal for high-value products requiring freshness.',
    category: 'Pouches',
    material: 'Metalized',
    finish: 'Gold',
    size: 'Medium',
    thickness: '130μ',
    hasZipper: true,
    hasWindow: false,
    ecoRating: 3,
    price: 3.15,
    stock: 2800,
    lowStockThreshold: 500,
    moq: 100,
    images: ['goldStandyZipperPouch'],
    isActive: true,
    productCode: 'GSZP',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    sizeOptions: [
      { id: 'GSZP1', code: 'GSZP1', dimensions: '10.5 × 17 × 3 cm', capacity: '100 g', price: 3.15 },
      { id: 'GSZP2', code: 'GSZP2', dimensions: '13.5 × 22 × 3.5 cm', capacity: '250 g', price: 5.15 },
      { id: 'GSZP3', code: 'GSZP3', dimensions: '16 × 23 × 3.5 cm', capacity: '500 g', price: 6.25 },
      { id: 'GSZP4', code: 'GSZP4', dimensions: '17 × 26.5 × 4 cm', capacity: '1000 g', price: 7.60 },
    ],
  },
  {
    id: 'rs003',
    name: 'Silver Standy Pouch',
    description: 'Classic silver metalized standy pouch with superior barrier protection for extended shelf life.',
    category: 'Pouches',
    material: 'Metalized',
    finish: 'Silver',
    size: 'Medium',
    thickness: '120μ',
    hasZipper: false,
    hasWindow: false,
    ecoRating: 3,
    price: 1.35,
    stock: 4200,
    lowStockThreshold: 500,
    moq: 100,
    images: ['silverStandyPouch'],
    isActive: true,
    productCode: 'SSP',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    sizeOptions: [
      { id: 'SSP1', code: 'SSP1', dimensions: '8.5 × 13.5 × 2.5 cm', capacity: '50 g', price: 1.35 },
      { id: 'SSP2', code: 'SSP2', dimensions: '10.5 × 17 × 3 cm', capacity: '100 g', price: 2.10 },
      { id: 'SSP3', code: 'SSP3', dimensions: '10.5 × 20.5 × 3.5 cm', capacity: '200 g', price: 2.50 },
      { id: 'SSP4', code: 'SSP4', dimensions: '13.5 × 20.5 × 3.5 cm', capacity: '250 g', price: 3.20 },
      { id: 'SSP5', code: 'SSP5', dimensions: '15 × 20.5 × 3.5 cm', capacity: '500 g', price: 3.60 },
      { id: 'SSP6', code: 'SSP6', dimensions: '18 × 25 × 4 cm', capacity: '1000 g', price: 5.25 },
      { id: 'SSP7', code: 'SSP7', dimensions: '20 × 30 × 5 cm', capacity: '2000 g', price: 6.96 },
    ],
  },
  {
    id: 'rs004',
    name: 'Silver Standy Zipper Pouch',
    description: 'Silver metalized pouch with zipper closure, perfect for snacks, dry fruits, and coffee.',
    category: 'Pouches',
    material: 'Metalized',
    finish: 'Silver',
    size: 'Medium',
    thickness: '130μ',
    hasZipper: true,
    hasWindow: false,
    ecoRating: 3,
    price: 2.10,
    stock: 3700,
    lowStockThreshold: 500,
    moq: 100,
    images: ['silverStandyZipperPouch'],
    isActive: true,
    productCode: 'SZSZP',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    sizeOptions: [
      { id: 'SZSZP1', code: 'SZSZP1', dimensions: '10 × 13.5 × 2.5 cm', capacity: '50 g', price: 2.10 },
      { id: 'SZSZP2', code: 'SZSZP2', dimensions: '10 × 17 × 3.5 cm', capacity: '100 g', price: 2.55 },
      { id: 'SZSZP3', code: 'SZSZP3', dimensions: '10.5 × 21 × 3.5 cm', capacity: '200 g', price: 3.05 },
      { id: 'SZSZP4', code: 'SZSZP4', dimensions: '13.5 × 22 × 3.5 cm', capacity: '250 g', price: 4.15 },
      { id: 'SZSZP5', code: 'SZSZP5', dimensions: '16 × 23 × 3.5 cm', capacity: '500 g', price: 5.00 },
      { id: 'SZSZP6', code: 'SZSZP6', dimensions: '17 × 26.5 × 4 cm', capacity: '1000 g', price: 6.05 },
      { id: 'SZSZP7', code: 'SZSZP7', dimensions: '20 × 30 × 5 cm', capacity: '2000 g', price: 8.10 },
    ],
  },
  {
    id: 'rs005',
    name: 'Milky Standy Pouch',
    description: 'Elegant milky white standy pouch, perfect for premium food products and cosmetics.',
    category: 'Pouches',
    material: 'BOPP',
    finish: 'Milky White',
    size: 'Medium',
    thickness: '100μ',
    hasZipper: false,
    hasWindow: false,
    ecoRating: 4,
    price: 2.10,
    stock: 3200,
    lowStockThreshold: 500,
    moq: 100,
    images: ['milkyStandyPouch'],
    isActive: true,
    productCode: 'MSP',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    sizeOptions: [
      { id: 'MSP1', code: 'MSP1', dimensions: '10.5 × 17 × 3 cm', capacity: '100 g', price: 2.10 },
      { id: 'MSP2', code: 'MSP2', dimensions: '13.5 × 20.5 × 3.5 cm', capacity: '250 g', price: 3.25 },
      { id: 'MSP3', code: 'MSP3', dimensions: '15 × 20.5 × 3.5 cm', capacity: '500 g', price: 3.60 },
      { id: 'MSP4', code: 'MSP4', dimensions: '18 × 25 × 4 cm', capacity: '1000 g', price: 5.25 },
    ],
  },
  {
    id: 'rs006',
    name: 'Milky Standy Zipper Pouch',
    description: 'Milky white standy pouch with resealable zipper, ideal for tea, spices, and wellness products.',
    category: 'Pouches',
    material: 'BOPP',
    finish: 'Milky White',
    size: 'Medium',
    thickness: '110μ',
    hasZipper: true,
    hasWindow: false,
    ecoRating: 4,
    price: 2.55,
    stock: 2900,
    lowStockThreshold: 500,
    moq: 100,
    images: ['milkyStandyZipperPouch'],
    isActive: true,
    productCode: 'MSZP',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    sizeOptions: [
      { id: 'MSZP1', code: 'MSZP1', dimensions: '10 × 17 × 3.5 cm', capacity: '100 g', price: 2.55 },
      { id: 'MSZP2', code: 'MSZP2', dimensions: '13.5 × 22 × 3.5 cm', capacity: '250 g', price: 4.15 },
      { id: 'MSZP3', code: 'MSZP3', dimensions: '16 × 23 × 3.5 cm', capacity: '500 g', price: 5.00 },
      { id: 'MSZP4', code: 'MSZP4', dimensions: '17 × 26.5 × 4 cm', capacity: '1000 g', price: 6.05 },
    ],
  },
  {
    id: 'rs007',
    name: 'Kraft Standy Pouch (Brown)',
    description: 'Eco-friendly kraft paper standy pouch, perfect for organic and natural products.',
    category: 'Pouches',
    material: 'Kraft',
    finish: 'Brown',
    size: 'Medium',
    thickness: '120μ',
    hasZipper: false,
    hasWindow: false,
    ecoRating: 5,
    price: 4.75,
    stock: 4500,
    lowStockThreshold: 500,
    moq: 100,
    images: ['kraftStandyPouchBrown'],
    isActive: true,
    productCode: 'KSP',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    sizeOptions: [
      { id: 'KSP1', code: 'KSP1', dimensions: '11 × 18.5 × 3 cm', capacity: '100 g', price: 4.75 },
      { id: 'KSP2', code: 'KSP2', dimensions: '13 × 21 × 4 cm', capacity: '200 g', price: 6.16 },
      { id: 'KSP3', code: 'KSP3', dimensions: '15 × 21 × 4 cm', capacity: '250 g', price: 6.83 },
      { id: 'KSP4', code: 'KSP4', dimensions: '15 × 24 × 4 cm', capacity: '500 g', price: 7.50 },
      { id: 'KSP5', code: 'KSP5', dimensions: '18 × 26 × 4 cm', capacity: '1000 g', price: 9.50 },
    ],
  },
  {
    id: 'rs008',
    name: 'Kraft Window Standy Pouch (Brown)',
    description: 'Brown kraft standy pouch with transparent window, ideal for showcasing organic products.',
    category: 'Pouches',
    material: 'Kraft',
    finish: 'Brown',
    size: 'Medium',
    thickness: '120μ',
    hasZipper: true,
    hasWindow: true,
    ecoRating: 5,
    price: 4.25,
    stock: 3100,
    lowStockThreshold: 500,
    moq: 100,
    images: ['kraftWindowStandyPouchBrown'],
    isActive: true,
    productCode: 'KWSPB',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    sizeOptions: [
      { id: 'KWSPB1', code: 'KWSP1', dimensions: '10 × 15 × 3 cm', capacity: '50 g', price: 4.25 },
      { id: 'KWSPB2', code: 'KWSP2', dimensions: '12 × 20 × 4 cm', capacity: '100 g', price: 5.42 },
      { id: 'KWSPB3', code: 'KWSP3', dimensions: '14 × 20 × 4 cm', capacity: '250 g', price: 5.75 },
      { id: 'KWSPB4', code: 'KWSP4', dimensions: '16 × 22 × 4 cm', capacity: '500 g', price: 7.16 },
      { id: 'KWSPB5', code: 'KWSP5', dimensions: '18 × 26 × 4 cm', capacity: '1000 g', price: 8.83 },
      { id: 'KWSPB6', code: 'KWSP6', dimensions: '20 × 30 × 5 cm', capacity: '2000 g', price: 11.58 },
      { id: 'KWSPB7', code: 'KWSP7', dimensions: '30 × 40 × 6 cm', capacity: '3000 g', price: 22.66 },
    ],
  },
  {
    id: 'rs009',
    name: 'Kraft Window Standy Pouch (White)',
    description: 'White kraft standy pouch with window, perfect for premium organic and artisanal products.',
    category: 'Pouches',
    material: 'Kraft',
    finish: 'White',
    size: 'Medium',
    thickness: '120μ',
    hasZipper: true,
    hasWindow: true,
    ecoRating: 5,
    price: 6.41,
    stock: 2500,
    lowStockThreshold: 500,
    moq: 100,
    images: ['kraftWindowStandyPouchWhite'],
    isActive: true,
    productCode: 'KWSPW',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    sizeOptions: [
      { id: 'KWSPW1', code: 'KWSP1', dimensions: '12 × 20 × 4 cm', capacity: '100 g', price: 6.41 },
      { id: 'KWSPW2', code: 'KWSP2', dimensions: '14 × 20 × 4 cm', capacity: '250 g', price: 7.50 },
      { id: 'KWSPW3', code: 'KWSP3', dimensions: '15 × 22 × 4 cm', capacity: '500 g', price: 8.50 },
      { id: 'KWSPW4', code: 'KWSP4', dimensions: '18 × 26 × 4 cm', capacity: '1000 g', price: 10.80 },
    ],
  },
];

function lowestPrice(product: Pick<CatalogProduct, 'sizeOptions' | 'price'>): number {
  if (product.sizeOptions && product.sizeOptions.length > 0) {
    return Math.min(...product.sizeOptions.map((s) => s.price));
  }
  return product.price;
}

export async function listProducts(): Promise<CatalogProduct[]> {
  return readList(STORE_NAME, SEED_PRODUCTS);
}

export async function listActiveProducts(): Promise<CatalogProduct[]> {
  const all = await listProducts();
  return all.filter((p) => p.isActive);
}

export async function getProduct(id: string): Promise<CatalogProduct | null> {
  const all = await listProducts();
  return all.find((p) => p.id === id) ?? null;
}

export async function createProduct(
  input: Omit<CatalogProduct, 'id' | 'createdAt' | 'updatedAt' | 'price'> & { price?: number }
): Promise<CatalogProduct> {
  const all = await listProducts();
  const now = new Date().toISOString().split('T')[0];
  const product: CatalogProduct = {
    ...input,
    id: generateId('prod'),
    price: input.price ?? lowestPrice({ sizeOptions: input.sizeOptions, price: input.price ?? 0 }),
    createdAt: now,
    updatedAt: now,
  };
  const updated = [...all, product];
  await writeList(STORE_NAME, updated);
  return product;
}

export async function updateProduct(product: CatalogProduct): Promise<CatalogProduct> {
  const all = await listProducts();
  const next: CatalogProduct = {
    ...product,
    price: lowestPrice(product),
    updatedAt: new Date().toISOString().split('T')[0],
  };
  const updated = all.map((p) => (p.id === product.id ? next : p));
  await writeList(STORE_NAME, updated);
  return next;
}

export async function deleteProduct(id: string): Promise<void> {
  const all = await listProducts();
  await writeList(STORE_NAME, all.filter((p) => p.id !== id));
}

export async function setProductActive(id: string, isActive: boolean): Promise<void> {
  const all = await listProducts();
  const updated = all.map((p) => (p.id === id ? { ...p, isActive, updatedAt: new Date().toISOString().split('T')[0] } : p));
  await writeList(STORE_NAME, updated);
}

export async function setProductStock(id: string, stock: number): Promise<void> {
  const all = await listProducts();
  const updated = all.map((p) => (p.id === id ? { ...p, stock, updatedAt: new Date().toISOString().split('T')[0] } : p));
  await writeList(STORE_NAME, updated);
}

export async function setProductPrice(id: string, price: number): Promise<void> {
  const all = await listProducts();
  const updated = all.map((p) => (p.id === id ? { ...p, price, updatedAt: new Date().toISOString().split('T')[0] } : p));
  await writeList(STORE_NAME, updated);
}
