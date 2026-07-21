import { readList, writeList } from '../storage';

export type NotificationType = 'order' | 'shipment' | 'design' | 'promo';

export interface AppNotification {
  id: string;
  type: NotificationType;
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const STORE_NAME = 'notifications';

const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: '1',
    type: 'order',
    icon: 'check-circle',
    iconColor: '#0F8A3C',
    iconBg: '#DCFCE7',
    title: 'Order PM-92041 In Production',
    body: 'Your corrugated shipping boxes are now being printed and die-cut.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    type: 'design',
    icon: 'paint-brush',
    iconColor: '#7C3AED',
    iconBg: '#F5F3FF',
    title: 'Artwork Approved',
    body: 'Pre-press team has approved your artwork for PM-92041. Production begins shortly.',
    time: '5 hours ago',
    read: false,
  },
  {
    id: '3',
    type: 'promo',
    icon: 'tag',
    iconColor: '#D97706',
    iconBg: '#FEF3C7',
    title: 'Flash Sale — 20% Off Mailer Boxes',
    body: 'Order 500+ Premium Mailer Boxes this week and save 20%. Use code PACK20.',
    time: '1 day ago',
    read: false,
  },
  {
    id: '4',
    type: 'shipment',
    icon: 'truck',
    iconColor: '#0F8A3C',
    iconBg: '#DCFCE7',
    title: 'Order PM-87612 Delivered',
    body: 'Your compostable poly mailers have been delivered and signed at the warehouse.',
    time: '3 days ago',
    read: true,
  },
  {
    id: '5',
    type: 'order',
    icon: 'file-invoice-dollar',
    iconColor: '#0F8A3C',
    iconBg: '#DCFCE7',
    title: 'Invoice Ready — PM-87612',
    body: 'Your GST invoice for ₹14,256 is now available for download.',
    time: '5 days ago',
    read: true,
  },
  {
    id: '6',
    type: 'design',
    icon: 'robot',
    iconColor: '#7C3AED',
    iconBg: '#F5F3FF',
    title: 'AI Packaging Recommendations Updated',
    body: "We've found 4 new packaging products based on your order history.",
    time: '1 week ago',
    read: true,
  },
];

export async function listNotifications(): Promise<AppNotification[]> {
  return readList(STORE_NAME, SEED_NOTIFICATIONS);
}

export async function markNotificationRead(id: string): Promise<void> {
  const all = await listNotifications();
  const updated = all.map((n) => (n.id === id ? { ...n, read: true } : n));
  await writeList(STORE_NAME, updated);
}

export async function markAllNotificationsRead(): Promise<void> {
  const all = await listNotifications();
  await writeList(STORE_NAME, all.map((n) => ({ ...n, read: true })));
}
