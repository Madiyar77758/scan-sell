import { ScanResult } from './geminiService';

export interface FavoriteItem {
  id: string;
  savedAt: string;
  image: string;
  result: ScanResult;
}

const STORAGE_KEY = 'scan_sell_favorites';

export function getFavorites(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveFavorite(image: string, result: ScanResult): FavoriteItem {
  const item: FavoriteItem = {
    id: Date.now().toString(),
    savedAt: new Date().toISOString(),
    image,
    result,
  };
  const existing = getFavorites();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([item, ...existing]));
  return item;
}

export function removeFavorite(id: string): void {
  const existing = getFavorites();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.filter(f => f.id !== id)));
}

export function isFavorite(productName: string): boolean {
  return getFavorites().some(f => f.result.exactProductName === productName);
}
