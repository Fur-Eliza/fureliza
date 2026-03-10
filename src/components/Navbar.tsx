"use client";

import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { toggle, totalItems, currency, toggleCurrency } = useCartStore();
  const [scrolled, setScrolled] = useState(false);
  const count = totalItems();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? "rgba(18, 18, 18, 0.75)" : "transparent",
        backdropFilter: scrolled ? "saturate(1.8) blur(28px)" : "none",
        WebkitBackdropFilter: scrolled ? "saturate(1.8) blur(28px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(197, 160, 40, 0.1)" : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="font-[family-name:var(--font-playfair)] font-bold tracking-[0.08em] uppercase leading-tight text-center transition-colors duration-500 text-[var(--color-gold)]">
            <span className="block text-[15px]">Fur</span>
            <span className="block text-[11px] tracking-[0.18em]">Eliza</span>
          </a>

          <div className="flex items-center gap-1 sm:gap-3">
            <button
              onClick={toggleCurrency}
              className="text-xs font-semibold px-3 py-2.5 rounded-full border border-[var(--color-gold)]/20 text-[var(--color-gold)] hover:border-[var(--color-gold)]/50 transition-all duration-500"
            >
              {currency}
            </button>

            <button
              onClick={toggle}
              className="relative p-2.5 rounded-full text-[var(--color-ink-soft)] hover:text-[var(--color-gold)] hover:bg-[var(--color-gold)]/5 transition-all duration-500"
              aria-label="Open cart"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-gold)] text-[var(--color-bg)] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
