import { readList, writeList } from '../storage';

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  imageKey: string;
  price: number;
  category: string;
  inStock: boolean;
  discount?: number;
  addedAt: string;
}

const STORE_NAME = 'wishlist';

const SEED_WISHLIST: WishlistItem[] = [
  {
    id: '1',
    productId: 'rs002',
    name: 'Gold Standy Zipper Pouch',
    imageKey: 'goldStandyZipperPouch',
    price: 16750,
    category: 'Premium Pouches',
    inStock: true,
    discount: 10,
    addedAt: '2024-01-10',
  },
  {
    id: '2',
    productId: 'rs003',
    name: 'Silver Standy Pouch',
    imageKey: 'silverStandyPouch',
    price: 12000,
    category: 'Metalized Pouches',
    inStock: true,
    addedAt: '2024-01-12',
  },
  {
    id: '3',
    productId: 'rs008',
    name: 'Kraft Window Standy Pouch (Brown)',
    imageKey: 'kraftWindowStandyPouchBrown',
    price: 14500,
    category: 'Eco-Friendly Pouches',
    inStock: true,
    discount: 15,
    addedAt: '2024-01-14',
  },
  {
    id: '4',
    productId: 'rs006',
    name: 'Milky Standy Zipper Pouch',
    imageKey: 'milkyStandyZipperPouch',
    price: 13500,
    category: 'Premium Pouches',
    inStock: true,
    addedAt: '2024-01-16',
  },
];

export async function listWishlist(): Promise<WishlistItem[]> {
  return readList(STORE_NAME, SEED_WISHLIST);
}

export async function isInWishlist(productId: string): Promise<boolean> {
  const all = await listWishlist();
  return all.some((w) => w.productId === productId);
}

export async function addToWishlist(item: Omit<WishlistItem, 'id' | 'addedAt'>): Promise<WishlistItem> {
  const all = await listWishlist();
  const existing = all.find((w) => w.productId === item.productId);
  if (existing) return existing;
  const newItem: WishlistItem = { ...item, id: `wish_${item.productId}`, addedAt: new Date().toISOString().split('T')[0] };
  await writeList(STORE_NAME, [...all, newItem]);
  return newItem;
}

export async function removeFromWishlist(id: string): Promise<void> {
  const all = await listWishlist();
  await writeList(STORE_NAME, all.filter((w) => w.id !== id));
}

export async function toggleWishlist(item: Omit<WishlistItem, 'id' | 'addedAt'>): Promise<boolean> {
  const all = await listWishlist();
  const existing = all.find((w) => w.productId === item.productId);
  if (existing) {
    await writeList(STORE_NAME, all.filter((w) => w.productId !== item.productId));
    return false;
  }
  const newItem: WishlistItem = { ...item, id: `wish_${item.productId}`, addedAt: new Date().toISOString().split('T')[0] };
  await writeList(STORE_NAME, [...all, newItem]);
  return true;
}
