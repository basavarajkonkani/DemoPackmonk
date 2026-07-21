/**
 * Generic JSON persistence helper backed by localStorage.
 *
 * Mirrors the mobile app's src/services/storage.ts pattern so this admin
 * dashboard's data survives page refreshes instead of resetting to seed
 * data on every reload (previously all Redux slices here just held mock
 * data in memory with zero persistence). To swap in a real backend later,
 * replace the bodies of readList/writeList with fetch() calls.
 */

const NAMESPACE = 'pacmonk_admin_';

function key(name: string): string {
  return `${NAMESPACE}${name}`;
}

export function readList<T>(name: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(key(name));
    if (raw === null) {
      localStorage.setItem(key(name), JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as T[];
  } catch (error) {
    console.warn(`[storage] readList(${name}) failed, falling back to seed`, error);
    return seed;
  }
}

export function writeList<T>(name: string, items: T[]): void {
  try {
    localStorage.setItem(key(name), JSON.stringify(items));
  } catch (error) {
    console.warn(`[storage] writeList(${name}) failed`, error);
  }
}

export function readValue<T>(name: string, seed: T): T {
  try {
    const raw = localStorage.getItem(key(name));
    if (raw === null) {
      localStorage.setItem(key(name), JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`[storage] readValue(${name}) failed, falling back to seed`, error);
    return seed;
  }
}

export function writeValue<T>(name: string, value: T): void {
  try {
    localStorage.setItem(key(name), JSON.stringify(value));
  } catch (error) {
    console.warn(`[storage] writeValue(${name}) failed`, error);
  }
}

let idCounter = 0;
export function generateId(prefix: string): string {
  idCounter += 1;
  return `${prefix}_${Date.now()}_${idCounter}`;
}
