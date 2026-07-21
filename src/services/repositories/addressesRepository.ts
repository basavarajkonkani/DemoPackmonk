import { readList, writeList, generateId } from '../storage';

export interface Address {
  id: string;
  company: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

const STORE_NAME = 'addresses';

const SEED_ADDRESSES: Address[] = [
  {
    id: '1',
    company: 'Sharma Industries HQ',
    street: '123, Industrial Area, Sector 15',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400001',
    country: 'India',
    isDefault: true,
  },
  {
    id: '2',
    company: 'Warehouse - Pune',
    street: '456, Logistics Park, Hinjewadi',
    city: 'Pune',
    state: 'Maharashtra',
    zip: '411057',
    country: 'India',
    isDefault: false,
  },
];

export async function listAddresses(): Promise<Address[]> {
  return readList(STORE_NAME, SEED_ADDRESSES);
}

export async function createAddress(input: Omit<Address, 'id'>): Promise<Address> {
  const all = await listAddresses();
  const address: Address = { ...input, id: generateId('addr') };
  const updated = address.isDefault ? all.map((a) => ({ ...a, isDefault: false })) : all;
  await writeList(STORE_NAME, [...updated, address]);
  return address;
}

export async function updateAddress(address: Address): Promise<Address> {
  const all = await listAddresses();
  const updated = all.map((a) => {
    if (a.id === address.id) return address;
    return address.isDefault ? { ...a, isDefault: false } : a;
  });
  await writeList(STORE_NAME, updated);
  return address;
}

export async function deleteAddress(id: string): Promise<void> {
  const all = await listAddresses();
  await writeList(STORE_NAME, all.filter((a) => a.id !== id));
}

export async function setDefaultAddress(id: string): Promise<void> {
  const all = await listAddresses();
  const updated = all.map((a) => ({ ...a, isDefault: a.id === id }));
  await writeList(STORE_NAME, updated);
}
