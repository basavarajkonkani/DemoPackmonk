/**
 * Generic JSON persistence helper backed by AsyncStorage.
 *
 * This is the single seam between the app and its data source. Every
 * repository in `src/services/repositories` reads/writes through this
 * module. To swap in a real backend later, replace the body of `readList`
 * /`writeList` (or the repository functions themselves) with `fetch()`
 * calls — nothing in the UI layer (screens/components) needs to change
 * because they only ever talk to repositories, never to storage directly.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const NAMESPACE = '@pacmonk_data_';

function key(name: string): string {
  return `${NAMESPACE}${name}`;
}

/**
 * Reads a JSON collection from storage. If nothing is stored yet, seeds
 * storage with `seed` and returns it. This makes every repository's first
 * read idempotent and self-initializing.
 */
export async function readList<T>(name: string, seed: T[]): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(key(name));
    if (raw === null) {
      await AsyncStorage.setItem(key(name), JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as T[];
  } catch (error) {
    console.warn(`[storage] readList(${name}) failed, falling back to seed`, error);
    return seed;
  }
}

export async function writeList<T>(name: string, items: T[]): Promise<void> {
  try {
    await AsyncStorage.setItem(key(name), JSON.stringify(items));
  } catch (error) {
    console.warn(`[storage] writeList(${name}) failed`, error);
  }
}

export async function readValue<T>(name: string, seed: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key(name));
    if (raw === null) {
      await AsyncStorage.setItem(key(name), JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`[storage] readValue(${name}) failed, falling back to seed`, error);
    return seed;
  }
}

export async function writeValue<T>(name: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key(name), JSON.stringify(value));
  } catch (error) {
    console.warn(`[storage] writeValue(${name}) failed`, error);
  }
}

export async function clearNamespace(): Promise<void> {
  const allKeys = await AsyncStorage.getAllKeys();
  const ours = allKeys.filter((k) => k.startsWith(NAMESPACE));
  if (ours.length) await AsyncStorage.multiRemove(ours);
}

/** Simulates network latency for a more realistic async UX during development. */
export function withLatency<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

let idCounter = 0;
export function generateId(prefix: string): string {
  idCounter += 1;
  return `${prefix}_${Date.now()}_${idCounter}`;
}
