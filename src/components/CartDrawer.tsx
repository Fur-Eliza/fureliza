"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useCartStore } from "@/store/cartStore";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    close,
    removeItem,
    updateQuantity,
    totalPrice,
    currency,
    formatPrice,
    whatsappCheckoutUrl,
  } = useCartStore();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus();
    const drawer = drawerRef.current;
    if (!drawer) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = drawer.querySelectorAll<HTMLElement>(
        'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
        aria-hidden="true"
      />

      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-[var(--color-bg-warm)] shadow-2xl flex flex-col transition-transform duration-400 ${
          isOpen
            ? "translate-x-0 ease-[cubic-bezier(0.32,0.72,0,1)]"
            : "translate-x-full ease-[cubic-bezier(0.32,0.72,0,1)]"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-bold text-[var(--color-ink)]">
            Tu Carrito
          </h2>
          <button
            ref={closeButtonRef}
            onClick={close}
            className="p-2 rounded-full hover:bg-[var(--color-bg-elevated)] transition-colors"
            aria-label="Cerrar carrito"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-border)"
                strokeWidth="1"
                className="mb-4"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <p className="text-[var(--color-ink-soft)] text-sm">
                Tu carrito esta vacio
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const variant = item.product.variants.find(
                  (v) => v.id === item.variantId
                );
                if (!variant) return null;

                const price =
                  currency === "COP" ? variant.price.cop : variant.price.usd;

                return (
                  <li
                    key={`${item.product.slug}-${item.variantId}`}
                    className="flex gap-4 p-3 rounded-xl bg-[var(--color-bg-elevated)]"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={item.product.images.card}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-[var(--color-ink)] truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-[var(--color-ink-soft)] capitalize">
                        {variant.size} —{" "}
                        {variant.type === "full" ? "Botella" : "Decant"}
                      </p>
                      <p className="text-sm font-bold text-[var(--color-gold)] mt-1">
                        {formatPrice(
                          variant.price.cop * item.quantity,
                          variant.price.usd * item.quantity
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() =>
                          removeItem(item.product.slug, item.variantId)
                        }
                        className="text-[var(--color-ink-soft)] hover:text-red-400 transition-colors p-1"
                        aria-label="Eliminar"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                      <div className="flex items-center gap-2 bg-[var(--color-bg-warm)] rounded-lg px-2 py-1">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.slug,
                              item.variantId,
                              item.quantity - 1
                            )
                          }
                          className="w-5 h-5 flex items-center justify-center text-[var(--color-ink-soft)] hover:text-[var(--color-gold)]"
                        >
                          -
                        </button>
                        <span className="text-sm w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.slug,
                              item.variantId,
                              item.quantity + 1
                            )
                          }
                          className="w-5 h-5 flex items-center justify-center text-[var(--color-ink-soft)] hover:text-[var(--color-gold)]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-bg-warm)]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[var(--color-ink-soft)]">Total estimado</span>
            <span className="text-xl font-bold text-[var(--color-gold)]">
              {currency === "COP"
                ? formatPrice(totalPrice(), 0)
                : formatPrice(0, totalPrice())}
            </span>
          </div>
          <a
            href={whatsappCheckoutUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 bg-[var(--color-gold)] text-[var(--color-bg)] text-center font-bold rounded-xl hover:bg-[var(--color-gold-light)] transition-colors active:scale-95 shadow-lg shadow-[var(--color-gold)]/20"
          >
            Completar pedido en WhatsApp
          </a>
          <p className="text-center text-xs text-[var(--color-ink-soft)] mt-3 opacity-60">
            Seras redirigido a un chat seguro con un asesor.
          </p>
        </div>
      </div>
    </>
  );
}
