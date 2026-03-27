"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    async function init() {
      try {
        const { gsap } = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        gsap.registerPlugin(ScrollTrigger);
        if (!footerRef.current) return;

        gsap.fromTo(
          footerRef.current.querySelectorAll(".footer-col"),
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: footerRef.current, start: "top 90%", once: true },
          }
        );
      } catch {
        // GSAP failed to load — make columns visible
        footerRef.current?.querySelectorAll(".footer-col").forEach((el) => {
          (el as HTMLElement).style.opacity = "1";
        });
      }
    }
    init();
  }, []);

  return (
    <footer ref={footerRef} className="bg-[var(--color-bg)] border-t border-[var(--color-border)] text-[var(--color-ink)] py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="footer-col opacity-0">
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold mb-3 text-gold-gradient">Fur Eliza</h3>
            <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed max-w-xs">
              Inspirada en la sutileza de Beethoven, creada para Elizabeth.
              Siente la fragancia antes de usarla. Lux Intra.
            </p>
          </div>

          <div className="footer-col opacity-0">
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[var(--color-gold)]/40">Navegación</h4>
            <ul className="space-y-2 text-sm text-[var(--color-ink-soft)]">
              <li><Link href="/collection" className="hover:text-[var(--color-gold)] transition-colors duration-300">Colección</Link></li>
              <li><Link href="/about" className="hover:text-[var(--color-gold)] transition-colors duration-300">Nuestra Historia</Link></li>
              <li><Link href="/faq" className="hover:text-[var(--color-gold)] transition-colors duration-300">Preguntas Frecuentes</Link></li>
              <li><Link href="/legal" className="hover:text-[var(--color-gold)] transition-colors duration-300">Información Legal</Link></li>
            </ul>
          </div>

          <div className="footer-col opacity-0">
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[var(--color-gold)]/40">Contacto</h4>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] rounded-lg text-sm font-medium text-white hover:bg-[#1DA851] transition-all duration-300 hover:shadow-lg hover:shadow-[#25D366]/25 hover:scale-105 active:scale-95">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-ink-soft)]/30">
          &copy; {new Date().getFullYear()} Fur Eliza. Todos los derechos reservados. Lux Intra.
        </div>
      </div>
    </footer>
  );
}
