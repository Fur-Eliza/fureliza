"use client";

import { Product, ProductVariant } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import HeroScroll from "@/components/HeroScroll";
import AnimatedSection from "@/components/AnimatedSection";
import FragranceMeter from "@/components/FragranceMeter";
import RelatedProducts from "@/components/RelatedProducts";
import StickyAddToCart from "@/components/StickyAddToCart";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function ProductPageClient({ product }: { product: Product }) {
  const { addItem, formatPrice } = useCartStore();
  const [added, setAdded] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0]
  );

  const handleAdd = () => {
    addItem(product, selectedVariant.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  // Sort variants: samples first, then decants, then full bottles
  const typeOrder: Record<string, number> = { sample: 0, decant: 1, full: 2 };
  const sortedVariants = [...product.variants].sort(
    (a, b) => (typeOrder[a.type] ?? 1) - (typeOrder[b.type] ?? 1)
  );

  return (
    <>
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
                    {level === "top"
                      ? "Notas de Salida"
                      : level === "heart"
                      ? "Notas de Corazon"
                      : "Notas de Fondo"}
                  </h3>
                  <ul className="space-y-1">
                    {product.notes[level].map((note) => (
                      <li
                        key={note}
                        className="text-sm text-[var(--color-ink-soft)] capitalize"
                      >
                        {note}
                      </li>
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
                <span
                  key={tag}
                  className="px-3 py-1 text-xs rounded-full border border-[var(--color-gold)]/20 text-[var(--color-gold)]/60 capitalize"
                >
                  {tag}
                </span>
              ))}
            </div>
          </AnimatedSection>

          {/* Variant Selector */}
          <AnimatedSection animation="fade-up" delay={0.42}>
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-[var(--color-ink-soft)] mb-3">
                Selecciona tu presentacion:
              </h3>
              <div className="flex flex-wrap gap-3">
                {sortedVariants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`relative px-4 py-3 border rounded-lg transition-all duration-300 text-left min-w-[120px] ${
                      selectedVariant.id === variant.id
                        ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10"
                        : "border-[var(--color-border)] hover:border-[var(--color-gold)]/50 text-[var(--color-ink-soft)]"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span
                        className={`text-sm font-medium ${
                          selectedVariant.id === variant.id
                            ? "text-[var(--color-gold)]"
                            : ""
                        }`}
                      >
                        {variant.size}
                      </span>
                      <span className="text-xs opacity-70 capitalize">
                        {variant.type === "full" ? "Botella" : "Decant"}
                      </span>
                      <span className="text-xs font-bold mt-1">
                        {formatPrice(variant.price.cop, variant.price.usd)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Price & buy */}
          <AnimatedSection animation="fade-up" delay={0.45}>
            <div className="flex items-end gap-6 mb-2">
              <p className="text-4xl font-bold text-[var(--color-gold)]">
                {formatPrice(
                  selectedVariant.price.cop,
                  selectedVariant.price.usd
                )}
              </p>
            </div>
            <p className="mt-2 text-xs text-[var(--color-ink-soft)] mb-6">
              {selectedVariant.type === "decant"
                ? "Incluye atomizador de viaje de lujo y estuche protector."
                : "Presentacion original sellada con garantia de autenticidad."}
            </p>

            <button
              onClick={handleAdd}
              className={`w-full md:w-auto px-10 py-4 font-bold tracking-wide rounded-xl transition-all duration-300 active:scale-95 shadow-lg shadow-[var(--color-gold)]/10 ${
                added
                  ? "bg-[var(--color-gold)] text-[var(--color-bg)]"
                  : "bg-gradient-to-r from-[var(--color-gold-dark)] to-[var(--color-gold)] text-[var(--color-bg)] hover:brightness-110"
              }`}
            >
              {added ? "AGREGADO AL CARRITO" : "AGREGAR AL CARRITO"}
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
      <StickyAddToCart product={product} selectedVariant={selectedVariant} />
    </>
  );
}
