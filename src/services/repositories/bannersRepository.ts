import { readList, writeList, generateId } from '../storage';

export interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  status: 'active' | 'inactive' | 'scheduled';
  priority: number;
  startDate: string;
  endDate: string;
  targetUrl?: string;
  clicks: number;
  impressions: number;
}

const STORE_NAME = 'banners';

const SEED_BANNERS: Banner[] = [
  {
    id: '1',
    title: 'Summer Collection Launch',
    description: 'New pastel-colored pouches now available',
    imageUrl: 'banner-design-1.jpg',
    status: 'active',
    priority: 1,
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    targetUrl: '/products/summer',
    clicks: 1250,
    impressions: 15000,
  },
  {
    id: '2',
    title: 'Bulk Order Discount',
    description: 'Get 20% off on orders above 5000 units',
    imageUrl: 'offer-banner.jpg',
    status: 'active',
    priority: 2,
    startDate: '2024-01-10',
    endDate: '2024-02-28',
    targetUrl: '/promotions/bulk',
    clicks: 850,
    impressions: 12000,
  },
  {
    id: '3',
    title: 'New Custom Print Service',
    description: 'Design your own pouches with our new tool',
    imageUrl: 'banner-for-custom-print.jpg',
    status: 'scheduled',
    priority: 3,
    startDate: '2024-02-01',
    endDate: '2024-03-31',
    targetUrl: '/design-studio',
    clicks: 0,
    impressions: 0,
  },
];

export async function listBanners(): Promise<Banner[]> {
  return readList(STORE_NAME, SEED_BANNERS);
}

export async function createBanner(input: Omit<Banner, 'id' | 'clicks' | 'impressions'>): Promise<Banner> {
  const all = await listBanners();
  const banner: Banner = { ...input, id: generateId('banner'), clicks: 0, impressions: 0 };
  await writeList(STORE_NAME, [...all, banner]);
  return banner;
}

export async function updateBanner(banner: Banner): Promise<Banner> {
  const all = await listBanners();
  const updated = all.map((b) => (b.id === banner.id ? banner : b));
  await writeList(STORE_NAME, updated);
  return banner;
}

export async function deleteBanner(id: string): Promise<void> {
  const all = await listBanners();
  await writeList(STORE_NAME, all.filter((b) => b.id !== id));
}

export async function setBannerStatus(id: string, status: Banner['status']): Promise<void> {
  const all = await listBanners();
  const updated = all.map((b) => (b.id === id ? { ...b, status } : b));
  await writeList(STORE_NAME, updated);
}
