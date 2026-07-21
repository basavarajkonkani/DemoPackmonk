import { readList, writeList, generateId } from '../storage';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  gst?: string;
  businessName: string;
  creditLimit: number;
  creditUsed: number;
  creditStatus: 'approved' | 'pending' | 'rejected';
  lifetimeValue: number;
  totalOrders: number;
  registeredAt: string;
  notes?: string;
  isActive: boolean;
}

const STORE_NAME = 'customers';

const SEED_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'ABC Traders',
    email: 'contact@abctraders.com',
    phone: '+91 98765 43210',
    gst: '29ABCDE1234F1Z5',
    businessName: 'ABC Trading Co.',
    creditLimit: 50000,
    creditUsed: 12000,
    creditStatus: 'approved',
    lifetimeValue: 125000,
    totalOrders: 45,
    registeredAt: '2023-06-15',
    isActive: true,
  },
  {
    id: '2',
    name: 'XYZ Foods',
    email: 'info@xyzfoods.com',
    phone: '+91 98765 43211',
    gst: '27XYZAB5678P1Q2',
    businessName: 'XYZ Foods Ltd',
    creditLimit: 30000,
    creditUsed: 8500,
    creditStatus: 'approved',
    lifetimeValue: 98000,
    totalOrders: 38,
    registeredAt: '2023-08-20',
    isActive: true,
  },
  {
    id: '3',
    name: 'Modern Spices',
    email: 'sales@modernspices.com',
    phone: '+91 98765 43212',
    businessName: 'Modern Spices',
    creditLimit: 0,
    creditUsed: 0,
    creditStatus: 'pending',
    lifetimeValue: 15000,
    totalOrders: 12,
    registeredAt: '2024-01-05',
    isActive: true,
  },
];

export async function listCustomers(): Promise<Customer[]> {
  return readList(STORE_NAME, SEED_CUSTOMERS);
}

export async function getCustomer(id: string): Promise<Customer | null> {
  const all = await listCustomers();
  return all.find((c) => c.id === id) ?? null;
}

export async function createCustomer(input: Omit<Customer, 'id' | 'registeredAt'>): Promise<Customer> {
  const all = await listCustomers();
  const customer: Customer = {
    ...input,
    id: generateId('cust'),
    registeredAt: new Date().toISOString().split('T')[0],
  };
  await writeList(STORE_NAME, [...all, customer]);
  return customer;
}

export async function updateCustomer(customer: Customer): Promise<Customer> {
  const all = await listCustomers();
  const updated = all.map((c) => (c.id === customer.id ? customer : c));
  await writeList(STORE_NAME, updated);
  return customer;
}

export async function deleteCustomer(id: string): Promise<void> {
  const all = await listCustomers();
  await writeList(STORE_NAME, all.filter((c) => c.id !== id));
}

export async function setCustomerCredit(
  id: string,
  creditLimit: number,
  creditStatus: Customer['creditStatus']
): Promise<Customer | null> {
  const all = await listCustomers();
  let result: Customer | null = null;
  const updated = all.map((c) => {
    if (c.id !== id) return c;
    result = { ...c, creditLimit, creditStatus };
    return result;
  });
  await writeList(STORE_NAME, updated);
  return result;
}
