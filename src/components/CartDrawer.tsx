"use client";

import Image from "next/image";
import { useCartStore } from "@/store/cartStore";

export default function CartDrawer() {
  const {
    items, isOpen, close, removeItem, updateQuantity,
    totalPrice, currency, formatPrice, whatsappCheckoutUrl,
  } = useCartStore();
  const total = totalPrice();

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
      />

      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-[var(--color-bg-warm)] shadow-2xl flex flex-col transition-transform duration-400 ${
          isOpen ? "translate-x-0 ease-[cubic-bezier(0.32,0.72,0,1)]" : "translate-x-full ease-[cubic-bezier(0.32,0.72,0,1)]"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-bold text-[var(--color-ink)]">Your Cart</h2>
          <button onClick={close} className="p-2 rounded-full hover:bg-[var(--color-bg-elevated)] transition-colors" aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-border)" strokeWidth="1" className="mb-4">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <p className="text-[var(--color-ink-soft)] text-sm">Your cart is empty</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.product.slug} className="flex gap-4 p-3 rounded-xl bg-[var(--color-bg-elevated)]">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                    <Image src={item.product.images.card} alt={item.product.name} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-[var(--color-ink)] truncate">{item.product.name}</h4>
                    <p className="text-xs text-[var(--color-ink-soft)]">{item.product.house}</p>
                    <p className="text-sm font-bold text-[var(--color-gold)] mt-0.5">
                      {formatPrice(item.product.price.cop, item.product.price.usd)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.product.slug, item.quantity - 1)}
                        className="w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center text-sm text-[var(--color-ink-soft)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors">
                        -
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.slug, item.quantity + 1)}
                        className="w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center text-sm text-[var(--color-ink-soft)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors">
                        +
                      </button>
                      <button onClick={() => removeItem(item.product.slug)}
                        className="ml-auto text-xs text-red-400 hover:text-red-300 transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[var(--color-border)] px-6 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-ink-soft)]">Total</span>
              <span className="text-xl font-bold text-[var(--color-gold)]">
                {currency === "COP"
                  ? new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(total)
                  : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(total)}
              </span>
            </div>
            <a href={whatsappCheckoutUrl()} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#25D366]/30 hover:scale-[1.02] active:scale-95">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Buy via WhatsApp
            </a>
          </div>
        )}
      </div>
    </>
  );
}
