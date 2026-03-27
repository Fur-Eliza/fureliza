"use client";

import { useEffect, useState } from "react";
import { Product, ProductVariant } from "@/types/product";
import { useCartStore } from "@/store/cartStore";

interface Props {
  product: Product;
  selectedVariant: ProductVariant;
}

export default function StickyAddToCart({ product, selectedVariant }: Props) {
  const { addItem, formatPrice } = useCartStore();
  const [visible, setVisible] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show after scrolling 600px (past the hero and into product details)
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAdd = () => {
    addItem(product, selectedVariant.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}
      style={{
        backgroundColor: "rgba(18, 18, 18, 0.92)",
        backdropFilter: "saturate(1.8) blur(28px)",
        WebkitBackdropFilter: "saturate(1.8) blur(28px)",
        borderTop: "1px solid rgba(197, 160, 40, 0.15)",
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        <div className="min-w-0 mr-3">
          <p className="text-sm font-bold text-[var(--color-ink)] truncate">
            {product.name}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--color-ink-soft)] opacity-70">
              {selectedVariant.size}
            </span>
            <p className="text-base font-bold text-[var(--color-gold)]">
              {formatPrice(
                selectedVariant.price.cop,
                selectedVariant.price.usd
              )}
            </p>
          </div>
        </div>
        <button
          onClick={handleAdd}
          className={`shrink-0 px-6 py-3 font-semibold text-sm rounded-xl transition-all duration-300 active:scale-95 ${
            added
              ? "bg-[var(--color-gold)] text-[var(--color-bg)]"
              : "bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/30 hover:bg-[var(--color-gold)] hover:text-[var(--color-bg)]"
          }`}
        >
          {added ? "Agregado" : "Agregar"}
        </button>
      </div>
    </div>
  );
}
