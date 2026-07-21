import { readList, writeList, generateId } from '../storage';

export interface SavedDesign {
  id: string;
  name: string;
  productType: string;
  thumbnailKey: string;
  createdAt: string;
  lastModified: string;
  dimensions: string;
  colors: number;
}

const STORE_NAME = 'saved_designs';

const SEED_DESIGNS: SavedDesign[] = [
  {
    id: '1',
    name: 'Premium Coffee Pouch Design',
    productType: 'Gold Standy Pouch',
    thumbnailKey: 'goldStandyPouch',
    createdAt: '2024-01-15',
    lastModified: '2024-01-20',
    dimensions: '10x15 cm',
    colors: 4,
  },
  {
    id: '2',
    name: 'Organic Tea Packaging',
    productType: 'Kraft Window Standy Pouch',
    thumbnailKey: 'kraftWindowStandyPouchBrown',
    createdAt: '2024-01-10',
    lastModified: '2024-01-18',
    dimensions: '8x12 cm',
    colors: 3,
  },
  {
    id: '3',
    name: 'Premium Snack Packaging',
    productType: 'Silver Standy Zipper Pouch',
    thumbnailKey: 'silverStandyZipperPouch',
    createdAt: '2024-01-08',
    lastModified: '2024-01-19',
    dimensions: '12x18 cm',
    colors: 6,
  },
  {
    id: '4',
    name: 'Wellness Product Pouch',
    productType: 'Milky Standy Pouch',
    thumbnailKey: 'milkyStandyPouch',
    createdAt: '2024-01-05',
    lastModified: '2024-01-15',
    dimensions: '15x20 cm',
    colors: 5,
  },
];

export async function listDesigns(): Promise<SavedDesign[]> {
  return readList(STORE_NAME, SEED_DESIGNS);
}

export async function duplicateDesign(id: string): Promise<SavedDesign | null> {
  const all = await listDesigns();
  const original = all.find((d) => d.id === id);
  if (!original) return null;
  const now = new Date().toISOString().split('T')[0];
  const copy: SavedDesign = { ...original, id: generateId('design'), name: `${original.name} (Copy)`, createdAt: now, lastModified: now };
  await writeList(STORE_NAME, [...all, copy]);
  return copy;
}

export async function deleteDesigns(ids: string[]): Promise<void> {
  const all = await listDesigns();
  await writeList(STORE_NAME, all.filter((d) => !ids.includes(d.id)));
}
