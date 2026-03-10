"use client";

import { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import HeroScroll from "@/components/HeroScroll";
import AnimatedSection from "@/components/AnimatedSection";
import FragranceMeter from "@/components/FragranceMeter";
import RelatedProducts from "@/components/RelatedProducts";
import StickyAddToCart from "@/components/StickyAddToCart";
import ProductJsonLd from "@/components/ProductJsonLd";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function ProductPageClient({ product }: { product: Product }) {
  const { addItem, formatPrice } = useCartStore();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <>
      <ProductJsonLd product={product} />
      <Navbar />
      <CartDrawer />
      <Toast />

      <main>
        <HeroScroll product={product} />

        {/* Product details */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-24">
          <AnimatedSection animation="fade-up">
            <p className="text-sm font-semibold tracking-widest uppercase text-[var(--color-gold)]/60 mb-2">
              {product.house}
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.1}>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-bold text-gold-gradient mb-6">
              {product.name}
            </h1>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.2}>
            <p className="text-lg text-[var(--color-ink-soft)] leading-relaxed mb-8 max-w-2xl">
              {product.description}
            </p>
          </AnimatedSection>

          {/* Notes pyramid */}
          <AnimatedSection animation="fade-up" delay={0.3}>
            <div className="grid grid-cols-3 gap-6 mb-10">
              {(["top", "heart", "base"] as const).map((level) => (
                <div key={level}>
                  <h3 className="text-xs font-semibold tracking-widest uppercase text-[var(--color-gold)]/40 mb-2">
                    {level === "top" ? "Notas de Salida" : level === "heart" ? "Notas de Corazon" : "Notas de Fondo"}
                  </h3>
                  <ul className="space-y-1">
                    {product.notes[level].map((note) => (
                      <li key={note} className="text-sm text-[var(--color-ink-soft)] capitalize">{note}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Fragrance meter */}
          <AnimatedSection animation="fade-up" delay={0.35}>
            <div className="mb-10">
              <FragranceMeter
                intensity={product.fragrance.intensity}
                projection={product.fragrance.projection}
                longevity={product.fragrance.longevity}
              />
            </div>
          </AnimatedSection>

          {/* Tags */}
          <AnimatedSection animation="fade-up" delay={0.4}>
            <div className="flex flex-wrap gap-2 mb-10">
              {product.emotionalTags.map((tag) => (
                <span key={tag} className="px-3 py-1 text-xs rounded-full border border-[var(--color-gold)]/20 text-[var(--color-gold)]/60 capitalize">
                  {tag}
                </span>
              ))}
            </div>
          </AnimatedSection>

          {/* Price & buy */}
          <AnimatedSection animation="fade-up" delay={0.45}>
            <div className="flex items-center gap-6">
              <p className="text-3xl font-bold text-[var(--color-gold)]">
                {formatPrice(product.price.cop, product.price.usd)}
              </p>
              <span className="text-sm text-[var(--color-ink-soft)]">
                {product.size} — {product.type === "full" ? "Frasco completo" : "Decant"}
              </span>
            </div>
            <p className="mt-2 text-xs text-[var(--color-ink-soft)]">
              Envio a todo Colombia. Costo de envio calculado al finalizar la compra via WhatsApp.
            </p>
            <button
              onClick={handleAdd}
              className={`mt-6 px-8 py-4 font-semibold rounded-xl transition-all duration-300 active:scale-95 ${
                added
                  ? "bg-[var(--color-gold)] text-[var(--color-bg)]"
                  : "bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/30 hover:bg-[var(--color-gold)] hover:text-[var(--color-bg)]"
              }`}
            >
              {added ? "Agregado al carrito" : "Agregar al carrito"}
            </button>
          </AnimatedSection>
        </section>

        {/* Related fragrances */}
        <RelatedProducts
          currentSlug={product.slug}
          relatedSlugs={product.related}
          family={product.family}
          mood={product.mood}
        />
      </main>

      <Footer />
      <StickyAddToCart product={product} />
    </>
  );
}
