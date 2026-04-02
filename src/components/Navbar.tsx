"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";

export default function Navbar() {
  const toggle = useCartStore((s) => s.toggle);
  const currency = useCartStore((s) => s.currency);
  const toggleCurrency = useCartStore((s) => s.toggleCurrency);
  const count = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change (when clicking a link)
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled || menuOpen ? "rgba(18, 18, 18, 0.75)" : "transparent",
        backdropFilter: scrolled || menuOpen ? "saturate(1.8) blur(28px)" : "none",
        WebkitBackdropFilter: scrolled || menuOpen ? "saturate(1.8) blur(28px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(197, 160, 40, 0.1)" : "1px solid transparent",
      }}
      aria-label="Navegación principal"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="font-[family-name:var(--font-playfair)] font-bold tracking-[0.08em] uppercase leading-tight text-center transition-colors duration-500 text-[var(--color-gold)]"
            onClick={closeMenu}
          >
            <span className="block text-[15px]">Fur</span>
            <span className="block text-[11px] tracking-[0.18em]">Eliza</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/collection"
              className="text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-gold)] transition-colors duration-300"
            >
              Colección
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-gold)] transition-colors duration-300"
            >
              Nosotros
            </Link>
            <Link
              href="/faq"
              className="text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-gold)] transition-colors duration-300"
            >
              FAQ
            </Link>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-1 sm:gap-3">
            <button
              onClick={toggleCurrency}
              className="text-xs font-semibold px-3 py-2.5 rounded-full border border-[var(--color-gold)]/20 text-[var(--color-gold)] hover:border-[var(--color-gold)]/50 transition-all duration-500"
              aria-label={`Moneda actual: ${currency}. Cambiar moneda`}
            >
              {currency}
            </button>

            <button
              onClick={toggle}
              className="relative p-2.5 rounded-full text-[var(--color-ink-soft)] hover:text-[var(--color-gold)] hover:bg-[var(--color-gold)]/5 transition-all duration-500"
              aria-label={`Abrir carrito${count > 0 ? `, ${count} productos` : ""}`}
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

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2.5 rounded-full text-[var(--color-ink-soft)] hover:text-[var(--color-gold)] hover:bg-[var(--color-gold)]/5 transition-all duration-500"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                {menuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <>
                    <path d="M3 8h18" />
                    <path d="M3 16h18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? "max-h-48 opacity-100 pb-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-3 pt-2 border-t border-[var(--color-border)]">
            <Link
              href="/collection"
              onClick={closeMenu}
              className="text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-gold)] transition-colors duration-300 py-2"
            >
              Colección
            </Link>
            <Link
              href="/about"
              onClick={closeMenu}
              className="text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-gold)] transition-colors duration-300 py-2"
            >
              Nosotros
            </Link>
            <Link
              href="/faq"
              onClick={closeMenu}
              className="text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-gold)] transition-colors duration-300 py-2"
            >
              FAQ
            </Link>
            <Link
              href="/legal"
              onClick={closeMenu}
              className="text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-gold)] transition-colors duration-300 py-2"
            >
              Legal
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
