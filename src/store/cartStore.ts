import { create } from "zustand";
import { Product } from "@/types/product";

export interface CartItem {
  product: Product;
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
  addItem: (product: Product) => void;
  removeItem: (productSlug: string) => void;
  updateQuantity: (productSlug: string, quantity: number) => void;
  clearLastAdded: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  formatPrice: (cop: number, usd: number) => string;
  whatsappCheckoutUrl: () => string;
}

const WHATSAPP_NUMBER = "573000000000"; // TODO: Replace with real number

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

  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((i) => i.product.slug === product.slug);
      if (existing) {
        return {
          lastAdded: product.name,
          items: state.items.map((i) =>
            i.product.slug === product.slug
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        lastAdded: product.name,
        items: [...state.items, { product, quantity: 1 }],
      };
    }),

  clearLastAdded: () => set({ lastAdded: null }),

  removeItem: (slug) =>
    set((state) => ({
      items: state.items.filter((i) => i.product.slug !== slug),
    })),

  updateQuantity: (slug, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return { items: state.items.filter((i) => i.product.slug !== slug) };
      }
      return {
        items: state.items.map((i) =>
          i.product.slug === slug ? { ...i, quantity } : i
        ),
      };
    }),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  totalPrice: () => {
    const { items, currency } = get();
    return items.reduce(
      (sum, i) =>
        sum + i.quantity * (currency === "COP" ? i.product.price.cop : i.product.price.usd),
      0
    );
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
    const { items, currency, totalPrice } = get();
    if (items.length === 0) return "#";

    const total = totalPrice();
    const label = currency;
    const lines = items
      .map((i) => {
        const price = currency === "COP" ? i.product.price.cop : i.product.price.usd;
        return `\u2022 ${i.product.name} (${i.product.house}) x${i.quantity} — ${label} ${price.toLocaleString()}`;
      })
      .join("\n");

    const message = encodeURIComponent(
      `Hola! Me gustaría ordenar:\n\n${lines}\n\n*Total: ${label} ${total.toLocaleString()}*`
    );

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  },
}));
