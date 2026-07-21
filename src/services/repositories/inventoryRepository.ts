import { readList, writeList, generateId } from '../storage';

export interface InventoryItem {
  id: string;
  name: string;
  material: string;
  size: string;
  thickness: number;
  hasZip: boolean;
  stock: number;
  reorderPoint: number;
  price: number;
  lastRestocked: string;
}

const STORE_NAME = 'inventory';

const SEED_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'Clear BOPP Pouch', material: 'clear', size: '5x8', thickness: 75, hasZip: true, stock: 1500, reorderPoint: 500, price: 12, lastRestocked: '2024-01-15' },
  { id: '2', name: 'Silver Metalized Pouch', material: 'silver', size: '8x12', thickness: 100, hasZip: false, stock: 250, reorderPoint: 500, price: 18, lastRestocked: '2024-01-10' },
  { id: '3', name: 'Kraft Paper Pouch', material: 'kraft', size: '6x9', thickness: 90, hasZip: true, stock: 3000, reorderPoint: 800, price: 15, lastRestocked: '2024-01-18' },
  { id: '4', name: 'Milky White Pouch', material: 'milky', size: '10x15', thickness: 120, hasZip: true, stock: 180, reorderPoint: 400, price: 20, lastRestocked: '2024-01-12' },
];

export async function listInventory(): Promise<InventoryItem[]> {
  return readList(STORE_NAME, SEED_INVENTORY);
}

export async function createInventoryItem(input: Omit<InventoryItem, 'id' | 'lastRestocked'>): Promise<InventoryItem> {
  const all = await listInventory();
  const item: InventoryItem = { ...input, id: generateId('inv'), lastRestocked: new Date().toISOString().split('T')[0] };
  await writeList(STORE_NAME, [...all, item]);
  return item;
}

export async function updateInventoryItem(item: InventoryItem): Promise<InventoryItem> {
  const all = await listInventory();
  const updated = all.map((i) => (i.id === item.id ? item : i));
  await writeList(STORE_NAME, updated);
  return item;
}

export async function setInventoryStock(id: string, stock: number): Promise<InventoryItem | null> {
  const all = await listInventory();
  let result: InventoryItem | null = null;
  const updated = all.map((i) => {
    if (i.id !== id) return i;
    result = { ...i, stock, lastRestocked: new Date().toISOString().split('T')[0] };
    return result;
  });
  await writeList(STORE_NAME, updated);
  return result;
}

export async function deleteInventoryItem(id: string): Promise<void> {
  const all = await listInventory();
  await writeList(STORE_NAME, all.filter((i) => i.id !== id));
}
