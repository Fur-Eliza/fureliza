import { create } from "zustand";
import { Product } from "@/types/product";
import { WHATSAPP_NUMBER, MAX_CART_QUANTITY } from "@/lib/constants";

export interface CartItem {
  product: Product;
  variantId: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  currency: "COP" | "USD";
  lastAdded: string | null;
  open: () => void;
  close: () => void;
  toggle: () => void;
  toggleCurrency: () => void;
  addItem: (product: Product, variantId: string) => void;
  removeItem: (productSlug: string, variantId: string) => void;
  updateQuantity: (
    productSlug: string,
    variantId: string,
    quantity: number
  ) => void;
  clearLastAdded: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  formatPrice: (cop: number, usd: number) => string;
  whatsappCheckoutUrl: () => string;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  currency: "COP",
  lastAdded: null,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  toggleCurrency: () =>
    set((s) => ({ currency: s.currency === "COP" ? "USD" : "COP" })),

  addItem: (product, variantId) =>
    set((state) => {
      const existing = state.items.find(
        (i) => i.product.slug === product.slug && i.variantId === variantId
      );
      if (existing) {
        return {
          lastAdded: product.name,
          items: state.items.map((i) =>
            i.product.slug === product.slug && i.variantId === variantId
              ? { ...i, quantity: Math.min(i.quantity + 1, MAX_CART_QUANTITY) }
              : i
          ),
        };
      }
      return {
        lastAdded: product.name,
        items: [...state.items, { product, variantId, quantity: 1 }],
      };
    }),

  clearLastAdded: () => set({ lastAdded: null }),

  removeItem: (slug, variantId) =>
    set((state) => ({
      items: state.items.filter(
        (i) => !(i.product.slug === slug && i.variantId === variantId)
      ),
    })),

  updateQuantity: (slug, variantId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return {
          items: state.items.filter(
            (i) => !(i.product.slug === slug && i.variantId === variantId)
          ),
        };
      }
      const clamped = Math.min(quantity, MAX_CART_QUANTITY);
      return {
        items: state.items.map((i) =>
          i.product.slug === slug && i.variantId === variantId
            ? { ...i, quantity: clamped }
            : i
        ),
      };
    }),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  totalPrice: () => {
    const { items, currency } = get();
    return items.reduce((sum, i) => {
      const variant = i.product.variants.find((v) => v.id === i.variantId);
      if (!variant) return sum;
      return (
        sum +
        i.quantity * (currency === "COP" ? variant.price.cop : variant.price.usd)
      );
    }, 0);
  },

  formatPrice: (cop, usd) => {
    const { currency } = get();
    if (currency === "COP") {
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }).format(cop);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(usd);
  },

  whatsappCheckoutUrl: () => {
    const { items, currency, totalPrice, formatPrice } = get();
    if (items.length === 0) return "#";

    const total = totalPrice();
    const lines = items
      .map((i) => {
        const variant = i.product.variants.find((v) => v.id === i.variantId);
        if (!variant) return null;
        return `\u2022 ${i.product.name} (${variant.size} - ${variant.type}) x${i.quantity} — ${formatPrice(variant.price.cop * i.quantity, variant.price.usd * i.quantity)}`;
      })
      .filter(Boolean)
      .join("\n");

    const formattedTotal = formatPrice(
      currency === "COP" ? total : 0,
      currency === "USD" ? total : 0
    );

    const message = encodeURIComponent(
      `Hola! Me gustaría ordenar:\n\n${lines}\n\n*Total estimado: ${formattedTotal}*\n\nPor favor confirmar disponibilidad y precio final.`
    );

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  },
}));
