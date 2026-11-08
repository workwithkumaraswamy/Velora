import { create } from 'zustand';
import { Product } from '../types';

interface WishlistState {
  items: Product[];
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  getCount: () => number;
}

const STORAGE_KEY = 'velora_wishlist';

const loadWishlist = (): Product[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveWishlist = (items: Product[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage errors
  }
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: loadWishlist(),

  toggleItem: (product) => {
    const current = get().items;
    const exists = current.some((p) => p.id === product.id);
    let updated: Product[];

    if (exists) {
      updated = current.filter((p) => p.id !== product.id);
    } else {
      updated = [product, ...current];
    }

    saveWishlist(updated);
    set({ items: updated });
  },

  isInWishlist: (productId) => {
    return get().items.some((p) => p.id === productId);
  },

  removeItem: (productId) => {
    const updated = get().items.filter((p) => p.id !== productId);
    saveWishlist(updated);
    set({ items: updated });
  },

  getCount: () => get().items.length,
}));
