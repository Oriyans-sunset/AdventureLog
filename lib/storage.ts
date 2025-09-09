// Thin storage wrapper that always uses AsyncStorage.
import AsyncStorage from '@react-native-async-storage/async-storage';

type StorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

const storage: StorageLike = AsyncStorage;

export function getStorage(): StorageLike {
  return storage;
}

const STORE_KEY = 'adventure_store_v1';

export async function loadState<T>(fallback: T): Promise<T> {
  try {
    const s = getStorage();
    const value = await s.getItem(STORE_KEY);
    if (!value) return fallback;
    return JSON.parse(value) as T;
  } catch (e) {
    console.warn('[storage] load failed, using fallback', e);
    return fallback;
  }
}

export async function saveState<T>(state: T): Promise<void> {
  try {
    const s = getStorage();
    await s.setItem(STORE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('[storage] save failed', e);
  }
}
