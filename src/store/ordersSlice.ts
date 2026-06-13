import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from './cartSlice';

export type OrderStatus = 'pending_review' | 'artwork_approved' | 'in_production' | 'quality_check' | 'shipped' | 'delivered';

export interface OrderMilestone {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp: string | null;
  isCompleted: boolean;
}

export interface PackagingOrder {
  id: string;
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
  shippingAddress: {
    company: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  trackingNumber: string | null;
}

interface OrdersState {
  items: PackagingOrder[];
}

const mockOrders: PackagingOrder[] = [
  {
    id: 'PM-92041',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    status: 'in_production',
    subtotal: 512.50,
    setupFees: 25.00,
    shipping: 45.00,
    tax: 48.37,
    total: 630.87,
    estimatedDelivery: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
    shippingAddress: {
      company: 'ZenTech Logistics',
      street: '104 Innovation Way, Suite B',
      city: 'San Francisco',
      state: 'CA',
      zip: '94107',
      country: 'USA',
    },
    trackingNumber: null,
    milestones: [
      { status: 'pending_review', label: 'Order Submitted', description: 'Order files received and awaiting plate queue placement.', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString(), isCompleted: true },
      { status: 'artwork_approved', label: 'Artwork Approved', description: 'Pre-press team approved logo scale and ink colors.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(), isCompleted: true },
      { status: 'in_production', label: 'In Production', description: 'Die-cutting sheets are loaded. Ink printing is actively running.', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toLocaleDateString(), isCompleted: true },
      { status: 'quality_check', label: 'Quality Verification', description: 'Sample checks for box structural joints and color matching.', timestamp: null, isCompleted: false },
      { status: 'shipped', label: 'Shipped', description: 'Courier package pickup and tracking code issuance.', timestamp: null, isCompleted: false },
      { status: 'delivered', label: 'Delivered', description: 'Signed and delivered at the warehouse loading dock.', timestamp: null, isCompleted: false },
    ],
    items: [
      {
        cartId: 'cart-1',
        productId: 'mailer-box',
        name: 'Premium Mailer Box',
        category: 'box',
        quantity: 350,
        baseUnitPrice: 1.45,
        unitPrice: 1.46,
        setupFee: 25.00,
        totalPrice: 537.50, // 350 * 1.46 + 25
        design: {
          length: 10,
          width: 8,
          height: 3,
          materialId: 'white-clay',
          inkColor: '#0F8A3C', // forest green logo
          logoUri: 'mock-logo-url',
          logoScale: 1.2,
          logoPosX: 0,
          logoPosY: 0,
          customText: 'ECO-FRIENDLY PACKAGING',
          textColor: '#0F8A3C',
          textSize: 14
        }
      }
    ]
  },
  {
    id: 'PM-87612',
    date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
    status: 'delivered',
    subtotal: 126.00,
    setupFees: 0.00,
    shipping: 15.00,
    tax: 11.34,
    total: 152.34,
    estimatedDelivery: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
    shippingAddress: {
      company: 'ZenTech Logistics',
      street: '104 Innovation Way, Suite B',
      city: 'San Francisco',
      state: 'CA',
      zip: '94107',
      country: 'USA',
    },
    trackingNumber: '1Z999AA10123456784',
    milestones: [
      { status: 'pending_review', label: 'Order Submitted', description: 'Order received and checked out.', timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toLocaleDateString(), isCompleted: true },
      { status: 'artwork_approved', label: 'Artwork Approved', description: 'Design checks finished.', timestamp: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000).toLocaleDateString(), isCompleted: true },
      { status: 'in_production', label: 'In Production', description: 'Boxes cut and folded.', timestamp: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toLocaleDateString(), isCompleted: true },
      { status: 'quality_check', label: 'Quality Verification', description: 'Thickness check passed.', timestamp: new Date(Date.now() - 41 * 24 * 60 * 60 * 1000).toLocaleDateString(), isCompleted: true },
      { status: 'shipped', label: 'Shipped', description: 'Handed to UPS Ground.', timestamp: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toLocaleDateString(), isCompleted: true },
      { status: 'delivered', label: 'Delivered', description: 'Delivered and signed by J. Doe.', timestamp: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toLocaleDateString(), isCompleted: true },
    ],
    items: [
      {
        cartId: 'cart-2',
        productId: 'eco-poly-bag',
        name: 'Compostable Poly Mailer',
        category: 'bag',
        quantity: 300,
        baseUnitPrice: 0.42,
        unitPrice: 0.42,
        setupFee: 0.00,
        totalPrice: 126.00,
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
          textSize: 12
        }
      }
    ]
  }
];

const initialState: OrdersState = {
  items: mockOrders,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    placeOrder: (state, action: PayloadAction<PackagingOrder>) => {
      state.items.unshift(action.payload);
    },
  },
});

export const { placeOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
export const selectOrdersList = (state: { orders: OrdersState }) => state.orders.items;
export const selectActiveOrdersCount = (state: { orders: OrdersState }) =>
  state.orders.items.filter(order => order.status !== 'delivered').length;
export const selectTotalBusinessSpending = (state: { orders: OrdersState }) =>
  state.orders.items.reduce((sum, order) => sum + order.total, 0);
