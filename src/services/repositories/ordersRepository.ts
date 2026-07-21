/**
 * Orders repository — single source of truth for both the buyer-facing
 * order history and the admin order management screens. Previously
 * `ordersSlice` (buyer PackagingOrder shape) and `adminSlice.orders`
 * (AdminOrder shape) were two entirely separate, unsynced datasets.
 */
import { readList, writeList, generateId } from '../storage';
import { CartItem } from '../../store/cartSlice';

export type OrderStatus =
  | 'pending_review'
  | 'artwork_approved'
  | 'in_production'
  | 'quality_check'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderMilestone {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp: string | null;
  isCompleted: boolean;
}

export interface ShippingAddress {
  company: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  companyName: string;
  date: string;
  items: CartItem[];
  status: OrderStatus;
  milestones: OrderMilestone[];
  subtotal: number;
  setupFees: number;
  shipping: number;
  tax: number;
  total: number;
  estimatedDelivery: string;
  shippingAddress: ShippingAddress;
  trackingNumber: string | null;
  notes?: string;
}

const STORE_NAME = 'orders';

function buildMilestones(status: OrderStatus, baseDate: Date): OrderMilestone[] {
  const stages: { status: OrderStatus; label: string; description: string }[] = [
    { status: 'pending_review', label: 'Order Submitted', description: 'Order files received and awaiting plate queue placement.' },
    { status: 'artwork_approved', label: 'Artwork Approved', description: 'Pre-press team approved logo scale and ink colors.' },
    { status: 'in_production', label: 'In Production', description: 'Die-cutting sheets are loaded. Ink printing is actively running.' },
    { status: 'quality_check', label: 'Quality Verification', description: 'Sample checks for structural joints and color matching.' },
    { status: 'shipped', label: 'Shipped', description: 'Courier package pickup and tracking code issuance.' },
    { status: 'delivered', label: 'Delivered', description: 'Signed and delivered at the destination.' },
  ];
  const order = ['pending_review', 'artwork_approved', 'in_production', 'quality_check', 'shipped', 'delivered'];
  const currentIdx = order.indexOf(status === 'cancelled' ? 'pending_review' : status);
  return stages.map((s, idx) => ({
    ...s,
    isCompleted: idx <= currentIdx,
    timestamp: idx <= currentIdx ? new Date(baseDate.getTime() + idx * 60 * 60 * 1000).toLocaleDateString() : null,
  }));
}

const SEED_ORDERS: Order[] = [
  {
    id: 'PM-92041',
    customerId: 'cust_zentech',
    customerName: 'Rahul Sharma',
    companyName: 'ZenTech Logistics',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'in_production',
    subtotal: 512.5,
    setupFees: 25.0,
    shipping: 45.0,
    tax: 48.37,
    total: 630.87,
    estimatedDelivery: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    shippingAddress: {
      company: 'ZenTech Logistics',
      street: '104 Innovation Way, Suite B',
      city: 'San Francisco',
      state: 'CA',
      zip: '94107',
      country: 'USA',
    },
    trackingNumber: null,
    milestones: buildMilestones('in_production', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
    items: [
      {
        cartId: 'cart-1',
        productId: 'mailer-box',
        name: 'Premium Mailer Box',
        category: 'box',
        quantity: 350,
        baseUnitPrice: 1.45,
        unitPrice: 1.46,
        setupFee: 25.0,
        totalPrice: 537.5,
        design: {
          length: 10,
          width: 8,
          height: 3,
          materialId: 'white-clay',
          inkColor: '#0F8A3C',
          logoUri: 'mock-logo-url',
          logoScale: 1.2,
          logoPosX: 0,
          logoPosY: 0,
          customText: 'ECO-FRIENDLY PACKAGING',
          textColor: '#0F8A3C',
          textSize: 14,
        },
      },
    ],
  },
  {
    id: 'PM-87612',
    customerId: 'cust_zentech',
    customerName: 'Rahul Sharma',
    companyName: 'ZenTech Logistics',
    date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'delivered',
    subtotal: 126.0,
    setupFees: 0.0,
    shipping: 15.0,
    tax: 11.34,
    total: 152.34,
    estimatedDelivery: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    shippingAddress: {
      company: 'ZenTech Logistics',
      street: '104 Innovation Way, Suite B',
      city: 'San Francisco',
      state: 'CA',
      zip: '94107',
      country: 'USA',
    },
    trackingNumber: '1Z999AA10123456784',
    milestones: buildMilestones('delivered', new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)),
    items: [
      {
        cartId: 'cart-2',
        productId: 'eco-poly-bag',
        name: 'Compostable Poly Mailer',
        category: 'bag',
        quantity: 300,
        baseUnitPrice: 0.42,
        unitPrice: 0.42,
        setupFee: 0.0,
        totalPrice: 126.0,
        design: {
          length: 15,
          width: 12,
          height: 0.1,
          materialId: 'biodegradable-pbat',
          inkColor: '#000000',
          logoUri: null,
          logoScale: 1,
          logoPosX: 0,
          logoPosY: 0,
          customText: '',
          textColor: '#000000',
          textSize: 12,
        },
      },
    ],
  },
];

export async function listOrders(): Promise<Order[]> {
  return readList(STORE_NAME, SEED_ORDERS);
}

export async function listOrdersForCustomer(customerId: string): Promise<Order[]> {
  const all = await listOrders();
  return all.filter((o) => o.customerId === customerId);
}

export async function getOrder(id: string): Promise<Order | null> {
  const all = await listOrders();
  return all.find((o) => o.id === id) ?? null;
}

export async function createOrder(order: Omit<Order, 'id' | 'milestones'> & { milestones?: OrderMilestone[] }): Promise<Order> {
  const all = await listOrders();
  const newOrder: Order = {
    ...order,
    id: generateId('PM').replace('prod_', 'PM-').slice(0, 10).toUpperCase(),
    milestones: order.milestones ?? buildMilestones(order.status, new Date(order.date)),
  };
  await writeList(STORE_NAME, [newOrder, ...all]);
  return newOrder;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
  const all = await listOrders();
  let updatedOrder: Order | null = null;
  const updated = all.map((o) => {
    if (o.id !== id) return o;
    updatedOrder = { ...o, status, milestones: buildMilestones(status, new Date(o.date)) };
    return updatedOrder;
  });
  await writeList(STORE_NAME, updated);
  return updatedOrder;
}

export async function cancelOrder(id: string): Promise<Order | null> {
  return updateOrderStatus(id, 'cancelled');
}

export async function addOrderNote(id: string, note: string): Promise<Order | null> {
  const all = await listOrders();
  let updatedOrder: Order | null = null;
  const updated = all.map((o) => {
    if (o.id !== id) return o;
    updatedOrder = { ...o, notes: note };
    return updatedOrder;
  });
  await writeList(STORE_NAME, updated);
  return updatedOrder;
}
