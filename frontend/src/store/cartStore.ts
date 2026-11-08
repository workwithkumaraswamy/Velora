import { create } from 'zustand';
import { CartItem, Product, ProductVariant } from '../types';
import { api } from '../services/api';

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  couponCode: string | null;
  discountAmount: number;
  couponDescription: string | null;
  freeShippingThreshold: number;
  standardShippingFee: number;

  // Actions
  addItem: (product: Product, size: string, color: string, quantity?: number, variant?: ProductVariant) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;

  // Computed getters
  getSubtotal: () => number;
  getShippingFee: () => number;
  getTotal: () => number;
  getItemsCount: () => number;
}

const STORAGE_KEY = 'velora_cart';

const loadCart = (): CartItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCart = (items: CartItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage errors
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  items: loadCart(),
  isDrawerOpen: false,
  couponCode: null,
  discountAmount: 0,
  couponDescription: null,
  freeShippingThreshold: 1499,
  standardShippingFee: 99,

  addItem: (product, size, color, quantity = 1, variant) => {
    const items = [...get().items];
    const existingIndex = items.findIndex(
      it => it.productId === product.id && it.size === size && it.color === color
    );

    const unitPrice = variant?.priceOverride ? Number(variant.priceOverride) : Number(product.basePrice);

    if (existingIndex > -1) {
      items[existingIndex].quantity += quantity;
    } else {
      const newItem: CartItem = {
        id: `cart-item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        productId: product.id,
        product,
        variantId: variant?.id,
        variant,
        size,
        color,
        quantity,
        unitPrice,
      };
      items.push(newItem);
    }

    saveCart(items);
    set({ items, isDrawerOpen: true });
  },

  removeItem: (itemId) => {
    const items = get().items.filter(it => it.id !== itemId);
    saveCart(items);
    set({ items });
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    const items = get().items.map(it => (it.id === itemId ? { ...it, quantity } : it));
    saveCart(items);
    set({ items });
  },

  clearCart: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ items: [], couponCode: null, discountAmount: 0, couponDescription: null });
  },

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

  applyCoupon: async (code) => {
    const subtotal = get().getSubtotal();
    try {
      const res = await api.post('/coupons/validate', {
        code: code.trim().toUpperCase(),
        subtotal,
      });

      const { discountAmount, description } = res.data.data;
      set({
        couponCode: code.trim().toUpperCase(),
        discountAmount: Number(discountAmount),
        couponDescription: description,
      });

      return { success: true, message: `Promo code ${code} applied successfully!` };
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Invalid promotional code.';
      set({ couponCode: null, discountAmount: 0, couponDescription: null });
      return { success: false, message: msg };
    }
  },

  removeCoupon: () => {
    set({ couponCode: null, discountAmount: 0, couponDescription: null });
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  },

  getShippingFee: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal >= get().freeShippingThreshold ? 0 : get().standardShippingFee;
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const shipping = get().getShippingFee();
    const discount = get().discountAmount;
    return Math.max(0, subtotal - discount + shipping);
  },

  getItemsCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
