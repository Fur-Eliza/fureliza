"use client";

import { useState } from "react";
import { Product, OlfactoryFamily, Mood } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";
import Footer from "@/components/Footer";

const FAMILY_LABELS: Record<OlfactoryFamily, string> = {
  "deep-woods": "Amaderadas",
  "opulent-florals": "Florales",
  "vibrant-citrus": "Cítricos",
  "ocean-marine": "Acuáticos",
  "oriental-spiced": "Orientales",
  "gourmand-sweet": "Gourmand",
};

const MOOD_LABELS: Record<Mood, string> = {
  power: "Poder",
  seduction: "Seducción",
  energy: "Energía",
  comfort: "Confort",
  mystery: "Misterio",
  elegance: "Elegancia",
  innocence: "Inocencia",
  rebellion: "Rebeldía",
};

interface Props {
  products: Product[];
}

export default function CollectionClient({ products }: Props) {
  const [activeFamily, setActiveFamily] = useState<OlfactoryFamily | null>(null);
  const [activeMood, setActiveMood] = useState<Mood | null>(null);

  const filtered = products.filter((p) => {
    if (activeFamily && p.family !== activeFamily) return false;
    if (activeMood && !p.mood.includes(activeMood)) return false;
    return true;
  });

  const families = Object.keys(FAMILY_LABELS) as OlfactoryFamily[];
  const moods = Object.keys(MOOD_LABELS) as Mood[];

  return (
    <>
      <Navbar />
      <CartDrawer />
      <Toast />

      <main className="pt-24 pb-14 md:pb-24">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10 md:mb-14">
            <AnimatedSection animation="blur-in">
              <p className="text-sm font-semibold tracking-widest uppercase text-[var(--color-gold)]/60 mb-2">
                Fur Eliza
              </p>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.1}>
              <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-bold text-gold-gradient mb-4">
                Colección
              </h1>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.2}>
              <p className="text-[var(--color-ink-soft)] max-w-lg mx-auto">
                Cada fragancia es una experiencia. Explora, filtra y encuentra la que habla de ti.
              </p>
            </AnimatedSection>
          </div>

          {/* Filters */}
          <div className="mb-10 space-y-4">
            {/* Family filters */}
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setActiveFamily(null)}
                className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-300 ${
                  activeFamily === null
                    ? "bg-[var(--color-gold)] text-[var(--color-bg)] border-[var(--color-gold)]"
                    : "border-[var(--color-gold)]/20 text-[var(--color-gold)]/60 hover:border-[var(--color-gold)]/50 hover:text-[var(--color-gold)]"
                }`}
              >
                Todas
              </button>
              {families.map((family) => (
                <button
                  key={family}
                  onClick={() => setActiveFamily(activeFamily === family ? null : family)}
                  className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-300 ${
                    activeFamily === family
                      ? "bg-[var(--color-gold)] text-[var(--color-bg)] border-[var(--color-gold)]"
                      : "border-[var(--color-gold)]/20 text-[var(--color-gold)]/60 hover:border-[var(--color-gold)]/50 hover:text-[var(--color-gold)]"
                  }`}
                >
                  {FAMILY_LABELS[family]}
                </button>
              ))}
            </div>

            {/* Mood filters */}
            <div className="flex flex-wrap justify-center gap-2">
              {moods.map((mood) => (
                <button
                  key={mood}
                  onClick={() => setActiveMood(activeMood === mood ? null : mood)}
                  className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-300 ${
                    activeMood === mood
                      ? "bg-[var(--color-gold)]/20 text-[var(--color-gold)] border-[var(--color-gold)]/50"
                      : "border-[var(--color-border)] text-[var(--color-ink-soft)] hover:border-[var(--color-gold)]/30 hover:text-[var(--color-gold)]/60"
                  }`}
                >
                  {MOOD_LABELS[mood]}
                </button>
              ))}
            </div>
          </div>

          {/* Product grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filtered.map((product, index) => (
                <ProductCard key={product.slug} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-[var(--color-ink-soft)] text-lg">
                No hay fragancias con estos filtros.
              </p>
              <button
                onClick={() => {
                  setActiveFamily(null);
                  setActiveMood(null);
                }}
                className="mt-4 text-sm text-[var(--color-gold)] underline underline-offset-4 hover:text-[var(--color-gold-light)] transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
