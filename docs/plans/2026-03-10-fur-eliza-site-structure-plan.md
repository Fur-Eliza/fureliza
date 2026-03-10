# Fur Eliza — Site Structure & Enhancements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add new pages (/collection, /about, /faq, /legal), enhance product pages (fragrance meter, related products, sticky CTA, JSON-LD), improve technical foundations (centralized GSAP, accessibility, SEO), and optimize performance.

**Architecture:** Incremental enhancement of existing Next.js 16 app. New pages use server components where possible, client components only for interactive elements. All GSAP usage migrated to centralized `useGSAP()` pattern. Accessibility and SEO improvements applied across existing and new components.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, GSAP 3.14 + useGSAP, Zustand, TypeScript

---

> **Reference:** Read the approved design doc at `docs/plans/2026-03-10-fur-eliza-site-structure-design.md` for full context on route architecture, page structures, technical enhancements, and anti-scope-creep boundaries.

---

## Batch 1: Technical Foundations

These tasks establish shared infrastructure that all subsequent tasks depend on.

---

### Task 1: Centralized GSAP with useGSAP

**Why:** Every animated component currently does its own `await import("gsap")` + `gsap.registerPlugin(ScrollTrigger)` inside `useEffect`. This causes redundant plugin registration, no automatic cleanup, and potential memory leaks. The `@gsap/react` package provides `useGSAP()` which auto-cleans ScrollTrigger instances on unmount.

**Install dependency:**

```bash
npm install @gsap/react
```

**Create file: `src/lib/gsap.ts`**

```ts
"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register plugins once at module level
gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
```

**Commit:**

```bash
git add src/lib/gsap.ts package.json package-lock.json && git commit -m "feat: centralized GSAP with useGSAP hook

Create src/lib/gsap.ts that registers ScrollTrigger once at module level
and re-exports gsap, ScrollTrigger, useGSAP from @gsap/react for use
across all animated components."
```

---

### Task 2: Accessibility — prefers-reduced-motion

**Why:** WCAG 2.3.3 requires respecting `prefers-reduced-motion`. Over 70M users globally have this preference enabled. We already have a basic CSS rule in `globals.css` that kills animation/transition durations, but we need a React hook so GSAP-powered components can skip animations entirely (not just shorten them).

**Modify file: `src/app/globals.css`**

Add these rules after the existing `@media (prefers-reduced-motion: reduce)` block (replace the existing block):

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  .hero-canvas-wrap {
    filter: none !important;
    transform: none !important;
  }

  .hero-text-container {
    opacity: 1 !important;
    transform: none !important;
  }

  .hero-title, .hero-subtitle {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

**Create file: `src/hooks/useReducedMotion.ts`**

```ts
"use client";

import { useState, useEffect } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return reduced;
}
```

**Commit:**

```bash
git add src/hooks/useReducedMotion.ts src/app/globals.css && git commit -m "feat: prefers-reduced-motion support

Add useReducedMotion React hook for GSAP components to skip animations.
Enhance CSS reduced-motion rules to handle hero canvas and text overlays.
WCAG 2.3.3 compliance for 70M+ users with motion sensitivity."
```

---

### Task 3: Update Product Types

**Why:** The design doc specifies new fields for fragrance meter (intensity/projection/longevity), occasions, seasons, and related product slugs. These must exist in the type system and data before building components that use them.

**Modify file: `src/types/product.ts`**

Replace the entire file contents with:

```ts
export type OlfactoryFamily =
  | "deep-woods"
  | "opulent-florals"
  | "vibrant-citrus"
  | "ocean-marine"
  | "oriental-spiced";

export type Mood =
  | "power"
  | "seduction"
  | "energy"
  | "comfort"
  | "mystery"
  | "elegance";

export interface ProductInput {
  slug: string;
  name: string;
  house: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  price: {
    cop: number;
    usd: number;
  };
  type: "full" | "decant";
  size: string;
}

export interface ProductGenerated {
  family: OlfactoryFamily;
  mood: Mood[];
  emotionalTags: string[];
  description: string;
  fragrance: {
    intensity: number;   // 1-10 scale
    projection: number;  // 1-10 scale
    longevity: number;   // 1-10 scale (hours)
  };
  occasions: string[];   // e.g. ["evening", "formal", "date-night"]
  season: string[];      // e.g. ["fall", "winter"]
  related: string[];     // slugs of related products
}

export interface ProductAssets {
  frames: {
    directory: string;
    count: number;
    format: "avif" | "webp";
  };
  images: {
    card: string;
    hero: string;
  };
}

export type Product = ProductInput & ProductGenerated & ProductAssets;
```

**Modify file: `src/data/products.ts`**

Replace the entire file contents with:

```ts
import { Product } from "@/types/product";

export const products: Product[] = [
  {
    slug: "megamare",
    name: "Megamare",
    house: "Orto Parisi",
    notes: {
      top: ["sea salt", "seaweed"],
      heart: ["ambergris", "musk"],
      base: ["sea accord", "mineral"],
    },
    price: { cop: 850000, usd: 200 },
    type: "full",
    size: "50ml",
    family: "ocean-marine",
    mood: ["power", "mystery"],
    emotionalTags: ["powerful", "dark", "salty", "abyssal", "industrial", "bold"],
    description:
      "An abyss of salt that awakens beneath your skin. Megamare is not a perfume — it is a declaration of primitive force, a storm trapped in glass.",
    fragrance: {
      intensity: 9,
      projection: 8,
      longevity: 9,
    },
    occasions: ["evening", "formal", "statement"],
    season: ["fall", "winter"],
    related: ["baccarat-rouge-540"],
    frames: {
      directory: "/frames/megamare",
      count: 120,
      format: "webp",
    },
    images: {
      card: "/products/megamare-card.webp",
      hero: "/products/megamare-hero.webp",
    },
  },
  {
    slug: "baccarat-rouge-540",
    name: "Baccarat Rouge 540",
    house: "Maison Francis Kurkdjian",
    notes: {
      top: ["saffron", "jasmine"],
      heart: ["ambergris", "cedar"],
      base: ["fir resin", "musk"],
    },
    price: { cop: 1200000, usd: 285 },
    type: "full",
    size: "70ml",
    family: "oriental-spiced",
    mood: ["seduction", "elegance"],
    emotionalTags: ["luminous", "warm", "crystalline", "magnetic", "iconic", "radiant"],
    description:
      "Light made liquid. Baccarat Rouge 540 wraps you in a golden halo of warmth — saffron, jasmine, and ambergris fused into pure magnetism.",
    fragrance: {
      intensity: 8,
      projection: 9,
      longevity: 10,
    },
    occasions: ["evening", "date-night", "formal"],
    season: ["fall", "winter", "spring"],
    related: ["megamare"],
    frames: {
      directory: "/frames/baccarat-rouge-540",
      count: 120,
      format: "webp",
    },
    images: {
      card: "/products/baccarat-rouge-540-card.webp",
      hero: "/products/baccarat-rouge-540-hero.webp",
    },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
```

**Commit:**

```bash
git add src/types/product.ts src/data/products.ts && git commit -m "feat: add fragrance meter, occasions, season, related fields to product types

Extend ProductGenerated with fragrance (intensity/projection/longevity),
occasions, season, and related slugs. Populate existing products with
the new data for fragrance meter and related products components."
```

---

### Task 4: Sitemap + robots.txt + SEO foundations

**Why:** Google needs a sitemap and robots.txt to crawl properly. The design doc also specifies allowing AI crawlers (ChatGPT, Perplexity). Adding `title.template` to the root layout ensures consistent page titles like "Megamare — Orto Parisi | Fur Eliza".

**Create file: `src/app/sitemap.ts`**

```ts
import { MetadataRoute } from "next";
import { products } from "@/data/products";

const BASE_URL = "https://fureliza.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const productRoutes = products.map((product) => ({
    url: `${BASE_URL}/perfume/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const staticRoutes = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/collection`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/legal`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  return [...staticRoutes, ...productRoutes];
}
```

**Create file: `src/app/robots.ts`**

```ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://fureliza.com/sitemap.xml",
  };
}
```

**Modify file: `src/app/layout.tsx`**

Replace the entire file contents with:

```tsx
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fureliza.com"),
  title: {
    default: "Fur Eliza | Perfumeria Nicho de Lujo",
    template: "%s | Fur Eliza",
  },
  description:
    "Siente la fragancia antes de usarla. Perfumes nicho curados a traves de experiencias sensoriales inmersivas. Lux Intra.",
  keywords: [
    "perfume nicho",
    "perfumeria de lujo",
    "niche perfume",
    "luxury fragrance",
    "Fur Eliza",
    "decant perfume Colombia",
    "perfumes originales",
  ],
  authors: [{ name: "Fur Eliza" }],
  openGraph: {
    title: "Fur Eliza | Perfumeria Nicho de Lujo",
    description: "Siente la fragancia antes de usarla. Lux Intra.",
    type: "website",
    locale: "es_CO",
    siteName: "Fur Eliza",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fur Eliza | Perfumeria Nicho de Lujo",
    description: "Siente la fragancia antes de usarla. Lux Intra.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

**Commit:**

```bash
git add src/app/sitemap.ts src/app/robots.ts src/app/layout.tsx && git commit -m "feat: add sitemap.ts, robots.ts, and title.template for SEO

Dynamic sitemap includes all static routes and product pages.
robots.txt allows all crawlers including AI bots.
Root layout uses title.template pattern for consistent page titles.
Metadata updated with Spanish keywords for Colombian market."
```

---

## Batch 2: New Pages

---

### Task 5: Collection Page

**Why:** The design doc specifies a `/collection` page with full catalog and filter system (by family and mood). The homepage shows all products; the collection page adds filter buttons for olfactory family and mood, with real-time client-side filtering.

**Create file: `src/app/collection/page.tsx`**

```tsx
import { Metadata } from "next";
import { products } from "@/data/products";
import CollectionClient from "./CollectionClient";

export const metadata: Metadata = {
  title: "Coleccion",
  description:
    "Explora nuestra coleccion curada de perfumes nicho. Filtra por familia olfativa y estado de animo. Cada fragancia es una experiencia sensorial unica.",
  openGraph: {
    title: "Coleccion | Fur Eliza",
    description:
      "Explora nuestra coleccion curada de perfumes nicho. Cada fragancia es una experiencia.",
  },
};

export default function CollectionPage() {
  return <CollectionClient products={products} />;
}
```

**Create file: `src/app/collection/CollectionClient.tsx`**

```tsx
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
  "vibrant-citrus": "Citricos",
  "ocean-marine": "Acuaticos",
  "oriental-spiced": "Orientales",
};

const MOOD_LABELS: Record<Mood, string> = {
  power: "Poder",
  seduction: "Seduccion",
  energy: "Energia",
  comfort: "Confort",
  mystery: "Misterio",
  elegance: "Elegancia",
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
                Coleccion
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
```

**Commit:**

```bash
git add src/app/collection/page.tsx src/app/collection/CollectionClient.tsx && git commit -m "feat: add /collection page with family and mood filters

Server component with metadata + client component for filter state.
Filter buttons for olfactory family (Amaderadas, Florales, etc.) and
mood (Poder, Seduccion, etc.). Real-time filtering without page reload.
Empty state with clear-filters action. Spanish UI text."
```

---

### Task 6: About Page

**Why:** The design doc specifies an `/about` page with the brand story (Beethoven -> Elizabeth -> the promise), philosophy, and CTA to `/collection`.

**Create file: `src/app/about/page.tsx`**

```tsx
import { Metadata } from "next";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Nuestra Historia",
  description:
    "Fur Eliza nacio de una promesa: traducir la belleza de la musica y la devocion en aromas inolvidables. Lux Intra — la luz interior.",
  openGraph: {
    title: "Nuestra Historia | Fur Eliza",
    description:
      "Nacida de una promesa, cada fragancia es un movimiento en una sinfonia olfativa.",
  },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <Toast />

      <main className="pt-24 pb-14 md:pb-24">
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 md:mb-24">
          <AnimatedSection animation="blur-in">
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl lg:text-8xl font-bold text-gold-gradient mb-4">
              Fur Eliza
            </h1>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={0.2}>
            <p className="text-lg md:text-xl tracking-[0.2em] uppercase text-[var(--color-ink-soft)]">
              Lux Intra
            </p>
          </AnimatedSection>
        </section>

        {/* Story */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-24">
          <AnimatedSection animation="fade-up">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-gold-gradient mb-6">
              La Historia
            </h2>
          </AnimatedSection>
          <div className="space-y-5 text-[var(--color-ink-soft)] leading-relaxed">
            <AnimatedSection animation="fade-up" delay={0.1}>
              <p>
                En 1810, Ludwig van Beethoven compuso una pieza que trascenderia siglos. La
                llamo &quot;Fur Elise&quot; — para Elisa. Una carta de amor convertida en
                musica, un regalo que sobrevivio al tiempo.
              </p>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.15}>
              <p>
                Fur Eliza nacio de esa misma intencion: crear algo tan intimo y poderoso que
                no necesite explicacion. Cada fragancia en nuestra coleccion es un movimiento
                en una sinfonia olfativa — compuesta no para impresionar, sino para
                conmover.
              </p>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.2}>
              <p>
                No vendemos perfumes. Curamos experiencias sensoriales. Antes de elegir, te
                invitamos a sentir — a cerrar los ojos y dejar que la fragancia hable.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Philosophy */}
        <section className="bg-[var(--color-bg-warm)] py-14 md:py-24 mb-16 md:mb-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection animation="fade-up">
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-gold-gradient mb-6">
                Filosofia
              </h2>
            </AnimatedSection>
            <div className="space-y-5 text-[var(--color-ink-soft)] leading-relaxed">
              <AnimatedSection animation="fade-up" delay={0.1}>
                <p>
                  <strong className="text-[var(--color-ink)]">Sin genero.</strong> Organizamos
                  nuestras fragancias por familia olfativa y emocion, nunca por genero. Un
                  aroma no tiene sexo — tiene caracter.
                </p>
              </AnimatedSection>
              <AnimatedSection animation="fade-up" delay={0.15}>
                <p>
                  <strong className="text-[var(--color-ink)]">Curado por emocion.</strong> Cada
                  perfume fue seleccionado no solo por su calidad, sino por lo que te hace
                  sentir. Poder, seduccion, energia, confort — elige tu estado de animo.
                </p>
              </AnimatedSection>
              <AnimatedSection animation="fade-up" delay={0.2}>
                <p>
                  <strong className="text-[var(--color-ink)]">Experiencia antes de compra.</strong>{" "}
                  Creemos que elegir un perfume no debe ser una apuesta. Por eso cada fragancia
                  tiene su propia experiencia inmersiva — para que la sientas antes de llevarla.
                </p>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="scale">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-gold-gradient mb-4">
              Explora la Coleccion
            </h2>
            <p className="text-[var(--color-ink-soft)] mb-8 max-w-md mx-auto">
              Cada fragancia tiene su propio mundo. Entra y descubre cual es la tuya.
            </p>
            <Link
              href="/collection"
              className="inline-block px-8 py-4 font-semibold rounded-xl bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/30 hover:bg-[var(--color-gold)] hover:text-[var(--color-bg)] transition-all duration-300 active:scale-95"
            >
              Ver Coleccion
            </Link>
          </AnimatedSection>
        </section>
      </main>

      <Footer />
    </>
  );
}
```

**Commit:**

```bash
git add src/app/about/page.tsx && git commit -m "feat: add /about page with brand story and philosophy

Beethoven origin story, philosophy section (no gender, curated by
emotion, experience before purchase), and CTA linking to /collection.
All text in Spanish. Uses AnimatedSection for scroll animations."
```

---

### Task 7: FAQ Page

**Why:** The design doc specifies an FAQ page with accordion and FAQ Schema.org structured data for Google rich snippets. All questions in Spanish for the Colombian market.

**Create file: `src/components/Accordion.tsx`**

```tsx
"use client";

import { useState } from "react";

interface AccordionItem {
  question: string;
  answer: string;
}

interface Props {
  items: AccordionItem[];
}

export default function Accordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="border border-[var(--color-border)] rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[var(--color-bg-warm)] transition-colors duration-300"
              aria-expanded={isOpen}
            >
              <span className="text-sm sm:text-base font-semibold text-[var(--color-ink)] pr-4">
                {item.question}
              </span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-gold)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-5 pb-4 text-sm text-[var(--color-ink-soft)] leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

**Create file: `src/app/faq/page.tsx`**

```tsx
import { Metadata } from "next";
import Accordion from "@/components/Accordion";
import AnimatedSection from "@/components/AnimatedSection";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";
import Footer from "@/components/Footer";

const FAQ_ITEMS = [
  {
    question: "Que es un decant?",
    answer:
      "Un decant es una porcion del perfume original trasvasada a un frasco mas pequeno (generalmente 5ml o 10ml). Es la forma ideal de probar una fragancia nicho sin invertir en el frasco completo. Todos nuestros decants son 100% autenticos.",
  },
  {
    question: "Son perfumes originales?",
    answer:
      "Si, absolutamente. Trabajamos exclusivamente con perfumes originales de casas reconocidas. Cada producto incluye garantia de autenticidad. Fur Eliza es una entidad independiente — no estamos afiliados ni patrocinados por las marcas que ofrecemos.",
  },
  {
    question: "Como compro?",
    answer:
      "Agrega los productos que deseas al carrito y finaliza tu compra a traves de WhatsApp. Nuestro equipo te confirmara disponibilidad, te enviara los datos de pago y coordinara el envio.",
  },
  {
    question: "Cuanto tarda el envio?",
    answer:
      "Enviamos a todo Colombia. Los tiempos de entrega son: Bogota 1-2 dias habiles, ciudades principales 2-4 dias habiles, otras ciudades 3-6 dias habiles. Recibiras un numero de seguimiento una vez despachado tu pedido.",
  },
  {
    question: "Aceptan devoluciones?",
    answer:
      "Debido a la naturaleza de los productos (fragancias), no aceptamos devoluciones una vez abierto el producto. Si recibes un producto defectuoso o diferente al solicitado, contáctanos dentro de las primeras 48 horas para gestionarlo.",
  },
  {
    question: "Que metodos de pago aceptan?",
    answer:
      "Aceptamos transferencia bancaria (Bancolombia, Davivienda, Nequi), PSE, y efectivo contra entrega en Bogota. Los pagos se coordinan a traves de WhatsApp para tu comodidad y seguridad.",
  },
  {
    question: "Hacen envios a todo Colombia?",
    answer:
      "Si, realizamos envios a todas las ciudades y municipios de Colombia a traves de transportadoras certificadas. El costo del envio se calcula segun tu ubicacion y se te informa antes de confirmar tu compra.",
  },
];

export const metadata: Metadata = {
  title: "Preguntas Frecuentes",
  description:
    "Resolvemos tus dudas sobre decants, envios, pagos y devoluciones. Conoce como funciona Fur Eliza.",
  openGraph: {
    title: "Preguntas Frecuentes | Fur Eliza",
    description:
      "Todo lo que necesitas saber sobre comprar perfumes nicho en Fur Eliza.",
  },
};

export default function FAQPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <Navbar />
      <CartDrawer />
      <Toast />

      <main className="pt-24 pb-14 md:pb-24">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10 md:mb-14">
            <AnimatedSection animation="blur-in">
              <p className="text-sm font-semibold tracking-widest uppercase text-[var(--color-gold)]/60 mb-2">
                Ayuda
              </p>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.1}>
              <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-gold-gradient mb-4">
                Preguntas Frecuentes
              </h1>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.2}>
              <p className="text-[var(--color-ink-soft)] max-w-md mx-auto">
                Encuentra respuestas a las dudas mas comunes sobre nuestros productos y servicio.
              </p>
            </AnimatedSection>
          </div>

          {/* Accordion */}
          <AnimatedSection animation="fade-up" delay={0.3}>
            <Accordion items={FAQ_ITEMS} />
          </AnimatedSection>
        </section>
      </main>

      <Footer />
    </>
  );
}
```

**Commit:**

```bash
git add src/components/Accordion.tsx src/app/faq/page.tsx && git commit -m "feat: add /faq page with accordion and FAQ schema JSON-LD

Reusable Accordion component with expand/collapse animation.
FAQ page with 7 questions in Spanish covering decants, shipping,
payments, returns. FAQ Schema.org structured data for Google rich
snippets. Server component renders JSON-LD, client accordion for
interactivity."
```

---

### Task 8: Legal Page

**Why:** The design doc requires a `/legal` page with decant disclaimer (legally required in Colombia under Andean regime), terms of use, privacy policy, and return policy.

**Create file: `src/app/legal/page.tsx`**

```tsx
import { Metadata } from "next";
import AnimatedSection from "@/components/AnimatedSection";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Informacion Legal",
  description:
    "Terminos de uso, politica de privacidad, politica de devoluciones y aviso legal sobre decants de Fur Eliza.",
  openGraph: {
    title: "Informacion Legal | Fur Eliza",
    description: "Terminos y condiciones de Fur Eliza.",
  },
};

export default function LegalPage() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <Toast />

      <main className="pt-24 pb-14 md:pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <AnimatedSection animation="blur-in">
              <p className="text-sm font-semibold tracking-widest uppercase text-[var(--color-gold)]/60 mb-2">
                Fur Eliza
              </p>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.1}>
              <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-gold-gradient">
                Informacion Legal
              </h1>
            </AnimatedSection>
          </div>

          <div className="space-y-12 text-[var(--color-ink-soft)] leading-relaxed text-sm">
            {/* Decant disclaimer */}
            <AnimatedSection animation="fade-up">
              <section>
                <h2 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl font-bold text-[var(--color-ink)] mb-4">
                  Aviso sobre Decants
                </h2>
                <p className="mb-3">
                  Fur Eliza S.A.S. es una entidad independiente. Los productos tipo decant
                  ofrecidos en este sitio son re-envasados autenticos de perfumes originales.
                  Fur Eliza no esta afiliada, patrocinada ni avalada por las casas de perfumeria
                  cuyos productos comercializa.
                </p>
                <p>
                  Todos los nombres de marcas, logotipos y marcas comerciales mencionados en este
                  sitio son propiedad de sus respectivos titulares y se utilizan unicamente con
                  fines descriptivos e informativos, de acuerdo con la doctrina de primera venta
                  bajo el regimen andino de propiedad intelectual.
                </p>
              </section>
            </AnimatedSection>

            {/* Terms of use */}
            <AnimatedSection animation="fade-up" delay={0.1}>
              <section>
                <h2 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl font-bold text-[var(--color-ink)] mb-4">
                  Terminos de Uso
                </h2>
                <p className="mb-3">
                  Al acceder y utilizar este sitio web, aceptas los siguientes terminos y
                  condiciones. Si no estas de acuerdo con alguno de estos terminos, te pedimos
                  que no utilices este sitio.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>
                    Los precios publicados estan sujetos a cambio sin previo aviso y dependen
                    de la disponibilidad del producto.
                  </li>
                  <li>
                    Las imagenes y descripciones de los productos son referencias visuales y
                    poeticas. El producto fisico puede variar ligeramente en presentacion.
                  </li>
                  <li>
                    Las compras se formalizan a traves de WhatsApp. Un pedido no se considera
                    confirmado hasta que se verifique el pago.
                  </li>
                  <li>
                    Fur Eliza se reserva el derecho de cancelar pedidos en caso de agotamiento
                    de inventario, ofreciendo reembolso completo.
                  </li>
                </ul>
              </section>
            </AnimatedSection>

            {/* Privacy policy */}
            <AnimatedSection animation="fade-up" delay={0.15}>
              <section>
                <h2 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl font-bold text-[var(--color-ink)] mb-4">
                  Politica de Privacidad
                </h2>
                <p className="mb-3">
                  Fur Eliza respeta tu privacidad. La informacion personal que compartes con
                  nosotros a traves de WhatsApp (nombre, direccion, telefono) se utiliza
                  exclusivamente para procesar y enviar tu pedido.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>No vendemos, alquilamos ni compartimos tu informacion personal con terceros.</li>
                  <li>No almacenamos datos de pago en nuestro sitio web.</li>
                  <li>
                    Este sitio puede utilizar cookies anonimas para mejorar la experiencia de
                    navegacion y analizar el trafico.
                  </li>
                  <li>
                    Puedes solicitar la eliminacion de tus datos personales contactandonos a
                    traves de WhatsApp.
                  </li>
                </ul>
              </section>
            </AnimatedSection>

            {/* Return policy */}
            <AnimatedSection animation="fade-up" delay={0.2}>
              <section>
                <h2 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl font-bold text-[var(--color-ink)] mb-4">
                  Politica de Devoluciones
                </h2>
                <p className="mb-3">
                  Debido a la naturaleza de nuestros productos (fragancias), aplicamos la
                  siguiente politica:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>
                    <strong className="text-[var(--color-ink)]">Productos sellados:</strong>{" "}
                    Puedes solicitar devolucion dentro de los 5 dias calendario posteriores a la
                    recepcion, siempre que el producto se encuentre sellado y en su empaque original.
                  </li>
                  <li>
                    <strong className="text-[var(--color-ink)]">Productos abiertos:</strong>{" "}
                    No se aceptan devoluciones de productos que hayan sido abiertos o utilizados.
                  </li>
                  <li>
                    <strong className="text-[var(--color-ink)]">Producto defectuoso:</strong>{" "}
                    Si recibes un producto defectuoso o diferente al solicitado, contactanos
                    dentro de las primeras 48 horas con evidencia fotografica para gestionar el
                    reemplazo o reembolso.
                  </li>
                  <li>
                    Los costos de envio de devolucion corren por cuenta del comprador, excepto
                    en casos de error de Fur Eliza.
                  </li>
                </ul>
              </section>
            </AnimatedSection>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
```

**Commit:**

```bash
git add src/app/legal/page.tsx && git commit -m "feat: add /legal page with decant disclaimer, terms, privacy, returns

Decant disclaimer required under Colombian Andean IP regime.
Terms of use, privacy policy (WhatsApp-only data), return policy.
All text in Spanish. Server component with metadata."
```

---

## Batch 3: Product Page Enhancements

---

### Task 9: Fragrance Meter Component

**Why:** The design doc specifies visual bars for intensity, projection, and longevity to address the "smell barrier" — helping users understand a fragrance's character before buying.

**Create file: `src/components/FragranceMeter.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Props {
  intensity: number;
  projection: number;
  longevity: number;
}

const LABELS: Record<string, string> = {
  intensity: "Intensidad",
  projection: "Proyeccion",
  longevity: "Longevidad",
};

function MeterBar({ label, value, index }: { label: string; value: number; index: number }) {
  const barRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const percentage = Math.min(Math.max(value, 0), 10) * 10;

  useGSAP(
    () => {
      if (!barRef.current || !containerRef.current) return;

      if (reduced) {
        gsap.set(barRef.current, { width: `${percentage}%` });
        return;
      }

      gsap.fromTo(
        barRef.current,
        { width: "0%" },
        {
          width: `${percentage}%`,
          duration: 1.2,
          delay: index * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    },
    { scope: containerRef, dependencies: [percentage, index, reduced] }
  );

  return (
    <div ref={containerRef} className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-widest uppercase text-[var(--color-ink-soft)]">
          {label}
        </span>
        <span className="text-xs font-bold text-[var(--color-gold)]">{value}/10</span>
      </div>
      <div className="h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
        <div
          ref={barRef}
          className="h-full rounded-full"
          style={{
            background:
              "linear-gradient(90deg, var(--color-gold-dark), var(--color-gold), var(--color-gold-light))",
            width: reduced ? `${percentage}%` : "0%",
          }}
        />
      </div>
    </div>
  );
}

export default function FragranceMeter({ intensity, projection, longevity }: Props) {
  const meters = [
    { key: "intensity", value: intensity },
    { key: "projection", value: projection },
    { key: "longevity", value: longevity },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold tracking-widest uppercase text-[var(--color-gold)]/40 mb-3">
        Perfil de Fragancia
      </h3>
      {meters.map((meter, index) => (
        <MeterBar
          key={meter.key}
          label={LABELS[meter.key]}
          value={meter.value}
          index={index}
        />
      ))}
    </div>
  );
}
```

**Commit:**

```bash
git add src/components/FragranceMeter.tsx && git commit -m "feat: add FragranceMeter component with animated gold bars

Visual bars for intensity, projection, longevity on a 1-10 scale.
Gold gradient fill animation triggered on scroll into view.
Respects prefers-reduced-motion via useReducedMotion hook.
Uses centralized GSAP with useGSAP for proper cleanup."
```

---

### Task 10: Related Fragrances Section

**Why:** The design doc specifies a "If you like this..." section showing 2-3 related products from the same family/mood to increase cross-selling and session duration.

**Create file: `src/components/RelatedProducts.tsx`**

```tsx
import { Product } from "@/types/product";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";

interface Props {
  currentSlug: string;
  relatedSlugs: string[];
  family: string;
  mood: string[];
}

export default function RelatedProducts({ currentSlug, relatedSlugs, family, mood }: Props) {
  // First: use explicit related slugs
  let related = relatedSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => p !== undefined && p.slug !== currentSlug);

  // Fallback: same family or overlapping mood
  if (related.length < 2) {
    const fallback = products.filter(
      (p) =>
        p.slug !== currentSlug &&
        !related.some((r) => r.slug === p.slug) &&
        (p.family === family || p.mood.some((m) => mood.includes(m)))
    );
    related = [...related, ...fallback].slice(0, 3);
  }

  if (related.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-24">
      <div className="text-center mb-10">
        <AnimatedSection animation="fade-up">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-gold-gradient">
            Si te gusta esta, tambien
          </h2>
        </AnimatedSection>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {related.slice(0, 3).map((product, index) => (
          <ProductCard key={product.slug} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}
```

**Commit:**

```bash
git add src/components/RelatedProducts.tsx && git commit -m "feat: add RelatedProducts component for cross-selling

Shows 2-3 related products using explicit related slugs from product
data, with fallback to same family/mood matching. Reuses existing
ProductCard component. Spanish heading."
```

---

### Task 11: Sticky Mobile CTA

**Why:** Research shows a sticky mobile CTA provides an 8-15% conversion lift. The button appears fixed at the bottom of the screen on mobile after the user scrolls past the main add-to-cart button.

**Create file: `src/components/StickyAddToCart.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";

interface Props {
  product: Product;
}

export default function StickyAddToCart({ product }: Props) {
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
    addItem(product);
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
          <p className="text-base font-bold text-[var(--color-gold)]">
            {formatPrice(product.price.cop, product.price.usd)}
          </p>
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
```

**Commit:**

```bash
git add src/components/StickyAddToCart.tsx && git commit -m "feat: add StickyAddToCart for mobile product pages

Fixed bottom bar on mobile (hidden on lg+) showing product name, price,
and add-to-cart button. Appears after scrolling 600px past hero.
Glassmorphic background matching navbar style. 8-15% conversion lift
per CRO research."
```

---

### Task 12: JSON-LD Product Schema

**Why:** Google rich snippets with price and availability significantly improve CTR in search results. The design doc requires Schema.org Product structured data on every product page.

**Create file: `src/components/ProductJsonLd.tsx`**

```tsx
import { Product } from "@/types/product";

interface Props {
  product: Product;
}

export default function ProductJsonLd({ product }: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: `https://fureliza.com${product.images.hero}`,
    brand: {
      "@type": "Brand",
      name: product.house,
    },
    offers: {
      "@type": "Offer",
      url: `https://fureliza.com/perfume/${product.slug}`,
      priceCurrency: "COP",
      price: product.price.cop,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Fur Eliza",
      },
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Olfactory Family",
        value: product.family,
      },
      {
        "@type": "PropertyValue",
        name: "Size",
        value: product.size,
      },
      {
        "@type": "PropertyValue",
        name: "Type",
        value: product.type === "full" ? "Full Bottle" : "Decant",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

**Commit:**

```bash
git add src/components/ProductJsonLd.tsx && git commit -m "feat: add ProductJsonLd component for Google rich snippets

Schema.org Product structured data with name, description, image,
brand, price in COP, availability, olfactory family, size, and type.
Invisible script tag rendered in product page for SEO."
```

---

### Task 13: Update ProductPageClient

**Why:** Integrate all new product page components (FragranceMeter, RelatedProducts, StickyAddToCart, ProductJsonLd) into the existing product page. Also add shipping info for transparent pricing (reduces 48.2% cart abandonment from surprise costs).

**Modify file: `src/app/perfume/[slug]/ProductPageClient.tsx`**

Replace the entire file contents with:

```tsx
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
```

**Commit:**

```bash
git add src/app/perfume/[slug]/ProductPageClient.tsx && git commit -m "feat: enhance product page with fragrance meter, related, sticky CTA, JSON-LD

Integrate FragranceMeter, RelatedProducts, StickyAddToCart, and
ProductJsonLd into ProductPageClient. Add shipping info for transparent
pricing. Notes pyramid labels in Spanish. Button text in Spanish."
```

---

## Batch 4: Homepage Enhancements

---

### Task 14: CTA WhatsApp Section

**Why:** The design doc specifies a frosted glass CTA section for WhatsApp consultation on the homepage. WhatsApp-driven businesses in Colombia see 35-55% conversion rates from personal consultation.

**Create file: `src/components/CTAWhatsApp.tsx`**

```tsx
"use client";

import AnimatedSection from "@/components/AnimatedSection";

const WHATSAPP_NUMBER = "573000000000"; // TODO: Replace with real number
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hola! Me gustaria recibir asesoria personalizada para elegir mi fragancia ideal."
);

export default function CTAWhatsApp() {
  return (
    <section className="py-14 md:py-24 px-4 sm:px-6 lg:px-8">
      <div
        className="max-w-3xl mx-auto rounded-2xl px-6 sm:px-10 py-12 text-center"
        style={{
          backgroundColor: "rgba(26, 26, 26, 0.6)",
          backdropFilter: "saturate(1.8) blur(28px)",
          WebkitBackdropFilter: "saturate(1.8) blur(28px)",
          border: "1px solid rgba(197, 160, 40, 0.12)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        <AnimatedSection animation="blur-in">
          <p className="text-sm font-semibold tracking-widest uppercase text-[var(--color-gold)]/60 mb-2">
            Asesoria Personal
          </p>
        </AnimatedSection>
        <AnimatedSection animation="fade-up" delay={0.1}>
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-gold-gradient mb-4">
            No sabes cual elegir?
          </h2>
        </AnimatedSection>
        <AnimatedSection animation="fade-up" delay={0.2}>
          <p className="text-[var(--color-ink-soft)] max-w-md mx-auto mb-8">
            Te asesoramos de forma personalizada. Cuentanos que te gusta, como quieres
            sentirte, y te recomendamos la fragancia perfecta.
          </p>
        </AnimatedSection>
        <AnimatedSection animation="scale" delay={0.3}>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#25D366]/30 hover:scale-[1.02] active:scale-95"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Escribenos por WhatsApp
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
```

**Commit:**

```bash
git add src/components/CTAWhatsApp.tsx && git commit -m "feat: add CTAWhatsApp frosted glass consultation section

Glassmorphic card with WhatsApp CTA for personalized fragrance
consultation. Pre-filled message. Matches navbar glassmorphism style.
35-55% conversion rate for WhatsApp-driven Colombian businesses."
```

---

### Task 15: Update Navbar

**Why:** The design doc requires adding Collection and About navigation links, plus a mobile hamburger menu. Current navbar only has logo, currency toggle, and cart icon.

**Modify file: `src/components/Navbar.tsx`**

Replace the entire file contents with:

```tsx
"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { toggle, totalItems, currency, toggleCurrency } = useCartStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const count = totalItems();

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
      aria-label="Navegacion principal"
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
              Coleccion
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-gold)] transition-colors duration-300"
            >
              Nosotros
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
              aria-label={menuOpen ? "Cerrar menu" : "Abrir menu"}
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
              Coleccion
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
          </div>
        </div>
      </div>
    </nav>
  );
}
```

**Commit:**

```bash
git add src/components/Navbar.tsx && git commit -m "feat: update Navbar with collection/about links and mobile hamburger

Desktop: add Coleccion and Nosotros nav links between logo and controls.
Mobile: add hamburger menu with Coleccion, Nosotros, FAQ links.
ARIA labels in Spanish for accessibility. Logo uses Next.js Link."
```

---

### Task 16: Update Homepage

**Why:** Add the CTAWhatsApp section between the collection grid and the about teaser. Add a "Ver toda la coleccion" link to the `/collection` page. Update text to Spanish.

**Modify file: `src/app/page.tsx`**

Replace the entire file contents with:

```tsx
import Link from "next/link";
import HeroScroll from "@/components/HeroScroll";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";
import CTAWhatsApp from "@/components/CTAWhatsApp";
import Footer from "@/components/Footer";
import { products } from "@/data/products";

export default function Home() {
  // Use first product as homepage hero
  const heroProduct = products[0];

  return (
    <>
      <Navbar />
      <CartDrawer />
      <Toast />

      <main>
        <HeroScroll product={heroProduct} />

        {/* Collection */}
        <section id="collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-24">
          <div className="text-center mb-10 md:mb-16">
            <AnimatedSection animation="blur-in">
              <p className="text-sm font-semibold tracking-widest uppercase text-[var(--color-gold)]/60 mb-2">
                Coleccion
              </p>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.1}>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-bold text-gold-gradient">
                Fragancias Curadas
              </h2>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.2}>
              <p className="mt-4 text-[var(--color-ink-soft)] max-w-lg mx-auto">
                Cada fragancia es una experiencia. Navega su mundo antes de decidir.
              </p>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product, index) => (
              <ProductCard key={product.slug} product={product} index={index} />
            ))}
          </div>

          <AnimatedSection animation="fade-up" delay={0.3}>
            <div className="text-center mt-10">
              <Link
                href="/collection"
                className="inline-block text-sm font-semibold text-[var(--color-gold)] underline underline-offset-4 decoration-[var(--color-gold)]/30 hover:decoration-[var(--color-gold)] transition-all duration-300"
              >
                Ver toda la coleccion
              </Link>
            </div>
          </AnimatedSection>
        </section>

        {/* WhatsApp CTA */}
        <CTAWhatsApp />

        {/* About teaser */}
        <section id="about" className="bg-[var(--color-bg-warm)] py-14 md:py-24 overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedSection animation="blur-in">
              <p className="text-sm font-semibold tracking-widest uppercase text-[var(--color-gold)]/60 mb-2">
                Nuestra Historia
              </p>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.1}>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-gold-gradient mb-6">
                La Luz Interior
              </h2>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.2}>
              <div className="space-y-4 text-[var(--color-ink-soft)] leading-relaxed max-w-2xl mx-auto">
                <p>
                  Fur Eliza nacio de una promesa: traducir la belleza de la musica y
                  la devocion en aromas inolvidables. Cada fragancia en nuestra
                  coleccion es un movimiento en una sinfonia olfativa.
                </p>
                <p>
                  Creemos que elegir un perfume debe ser un viaje sensorial, no una
                  apuesta. Por eso cada fragancia viene con su propia experiencia
                  inmersiva — para que la sientas antes de llevarla.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.3}>
              <div className="mt-8">
                <Link
                  href="/about"
                  className="inline-block text-sm font-semibold text-[var(--color-gold)] underline underline-offset-4 decoration-[var(--color-gold)]/30 hover:decoration-[var(--color-gold)] transition-all duration-300"
                >
                  Conoce nuestra historia
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
```

**Commit:**

```bash
git add src/app/page.tsx && git commit -m "feat: update homepage with CTAWhatsApp, collection link, Spanish text

Add CTAWhatsApp section between collection grid and about teaser.
Add 'Ver toda la coleccion' link to /collection page.
Add 'Conoce nuestra historia' link to /about page.
All user-facing text translated to Spanish."
```

---

## Batch 5: Gold Contrast Audit + Final Accessibility

---

### Task 17: Contrast Audit + Focus Management + Skip Navigation

**Why:** WCAG 2.1 AA requires 4.5:1 contrast ratio for normal text and 3:1 for large text. Gold (#C5A028) on dark (#121212) gives approximately 5.8:1 which passes. However, gold with opacity (e.g., `text-[var(--color-gold)]/40` and `text-[var(--color-gold)]/60`) may fail. We also need focus trap in CartDrawer, skip navigation in layout, and ARIA labels on interactive elements.

**Modify file: `src/app/globals.css`**

Replace the entire file contents with:

```css
@import "tailwindcss";

@theme {
  --color-bg: #121212;
  --color-bg-warm: #1A1A1A;
  --color-bg-elevated: #222222;
  --color-gold: #C5A028;
  --color-gold-light: #E8D48B;
  --color-gold-dark: #8B6914;
  --color-gold-pale: #D4B84A;
  --color-ink: #F5F5F5;
  --color-ink-soft: #9CA3AF;
  --color-border: #2A2A2A;
  --color-overlay: rgba(0, 0, 0, 0.7);
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
}

* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html, body { overflow-x: clip; }
html { scroll-behavior: smooth; }
body {
  background: var(--color-bg);
  color: var(--color-ink);
}

body::after {
  content: "";
  position: fixed;
  inset: 0;
  background: url("/grain.svg") repeat;
  pointer-events: none;
  z-index: 9999;
  opacity: 1;
}

.text-gold-gradient {
  background: linear-gradient(135deg, var(--color-gold-dark) 0%, var(--color-gold) 40%, var(--color-gold-light) 60%, var(--color-gold) 80%, var(--color-gold-dark) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.text-gold-emboss {
  color: var(--color-gold);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.8), 0 -1px 0 rgba(232, 212, 139, 0.3);
}

/* Skip navigation link */
.skip-nav {
  position: absolute;
  top: -100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  padding: 0.75rem 1.5rem;
  background: var(--color-gold);
  color: var(--color-bg);
  font-weight: 600;
  font-size: 0.875rem;
  border-radius: 0 0 0.75rem 0.75rem;
  transition: top 0.2s ease;
}
.skip-nav:focus {
  top: 0;
  outline: 2px solid var(--color-gold-light);
  outline-offset: 2px;
}

/* Focus visible rings */
*:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
  border-radius: 4px;
}

button:focus-visible, a:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
}

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 3px; }

@keyframes shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}

@keyframes img-pulse {
  0%   { transform: scale(1.10); }
  50%  { transform: scale(1.13); }
  100% { transform: scale(1.10); }
}

[id] { scroll-margin-top: 5rem; }

@media (hover: none) {
  .group:hover img {
    transform: none !important;
    animation: none !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  .hero-canvas-wrap {
    filter: none !important;
    transform: none !important;
  }

  .hero-text-container {
    opacity: 1 !important;
    transform: none !important;
  }

  .hero-title, .hero-subtitle {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

**Modify file: `src/app/layout.tsx`**

Replace the entire file contents with:

```tsx
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fureliza.com"),
  title: {
    default: "Fur Eliza | Perfumeria Nicho de Lujo",
    template: "%s | Fur Eliza",
  },
  description:
    "Siente la fragancia antes de usarla. Perfumes nicho curados a traves de experiencias sensoriales inmersivas. Lux Intra.",
  keywords: [
    "perfume nicho",
    "perfumeria de lujo",
    "niche perfume",
    "luxury fragrance",
    "Fur Eliza",
    "decant perfume Colombia",
    "perfumes originales",
  ],
  authors: [{ name: "Fur Eliza" }],
  openGraph: {
    title: "Fur Eliza | Perfumeria Nicho de Lujo",
    description: "Siente la fragancia antes de usarla. Lux Intra.",
    type: "website",
    locale: "es_CO",
    siteName: "Fur Eliza",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fur Eliza | Perfumeria Nicho de Lujo",
    description: "Siente la fragancia antes de usarla. Lux Intra.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        <a href="#main-content" className="skip-nav">
          Saltar al contenido principal
        </a>
        <div id="main-content">
          {children}
        </div>
      </body>
    </html>
  );
}
```

**Modify file: `src/components/CartDrawer.tsx`**

Replace the entire file contents with:

```tsx
"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useCartStore } from "@/store/cartStore";

export default function CartDrawer() {
  const {
    items, isOpen, close, removeItem, updateQuantity,
    totalPrice, currency, formatPrice, whatsappCheckoutUrl,
  } = useCartStore();
  const total = totalPrice();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap: when drawer opens, focus the close button; trap Tab within drawer
  useEffect(() => {
    if (!isOpen) return;

    // Focus close button on open
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
          isOpen ? "translate-x-0 ease-[cubic-bezier(0.32,0.72,0,1)]" : "translate-x-full ease-[cubic-bezier(0.32,0.72,0,1)]"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-bold text-[var(--color-ink)]">Tu Carrito</h2>
          <button
            ref={closeButtonRef}
            onClick={close}
            className="p-2 rounded-full hover:bg-[var(--color-bg-elevated)] transition-colors"
            aria-label="Cerrar carrito"
          >
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
              <p className="text-[var(--color-ink-soft)] text-sm">Tu carrito esta vacio</p>
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
                      <button
                        onClick={() => updateQuantity(item.product.slug, item.quantity - 1)}
                        className="w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center text-sm text-[var(--color-ink-soft)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors"
                        aria-label={`Reducir cantidad de ${item.product.name}`}
                      >
                        -
                      </button>
                      <span className="text-sm font-medium w-6 text-center" aria-label={`Cantidad: ${item.quantity}`}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.slug, item.quantity + 1)}
                        className="w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center text-sm text-[var(--color-ink-soft)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors"
                        aria-label={`Aumentar cantidad de ${item.product.name}`}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.product.slug)}
                        className="ml-auto text-xs text-red-400 hover:text-red-300 transition-colors"
                        aria-label={`Eliminar ${item.product.name} del carrito`}
                      >
                        Eliminar
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
              Comprar via WhatsApp
            </a>
          </div>
        )}
      </div>
    </>
  );
}
```

**Commit:**

```bash
git add src/app/globals.css src/app/layout.tsx src/components/CartDrawer.tsx && git commit -m "feat: accessibility audit — focus trap, skip nav, ARIA labels, contrast

Add skip navigation link to root layout (Spanish).
Add focus-visible rings globally for keyboard navigation.
Add --color-gold-pale variable for contrast-safe gold.
CartDrawer: focus trap with Tab/Shift+Tab, Escape to close, role=dialog,
aria-modal, ARIA labels on all buttons. Spanish UI text.
Enhanced prefers-reduced-motion CSS rules for hero elements."
```

---

### Task 18: Build & Verify

**Why:** Verify all routes compile correctly, no TypeScript errors, and the build succeeds.

Run:

```bash
npm run build
```

Fix any errors that arise. Common issues to check:
- TypeScript errors from new fields (all products must have `fragrance`, `occasions`, `season`, `related`)
- Missing imports in new pages
- Unused variables or imports

After a successful build, commit:

```bash
git add -A && git commit -m "chore: verify build passes with all new routes and components

All routes generate correctly: /, /collection, /about, /faq, /legal,
/perfume/[slug]. No TypeScript errors. Site structure enhancement
implementation complete."
```

---

## Summary of all files

### New files created (12)

| File | Type | Description |
|------|------|-------------|
| `src/lib/gsap.ts` | Client lib | Centralized GSAP plugin registration |
| `src/hooks/useReducedMotion.ts` | Client hook | Detects prefers-reduced-motion |
| `src/app/sitemap.ts` | Server | Dynamic sitemap with all routes |
| `src/app/robots.ts` | Server | Allow all crawlers |
| `src/app/collection/page.tsx` | Server | Collection page with metadata |
| `src/app/collection/CollectionClient.tsx` | Client | Filter state + product grid |
| `src/app/about/page.tsx` | Server | Brand story page |
| `src/app/faq/page.tsx` | Server | FAQ with JSON-LD schema |
| `src/app/legal/page.tsx` | Server | Legal information page |
| `src/components/Accordion.tsx` | Client | Reusable FAQ accordion |
| `src/components/FragranceMeter.tsx` | Client | Intensity/projection/longevity bars |
| `src/components/RelatedProducts.tsx` | Client | Related fragrances section |
| `src/components/StickyAddToCart.tsx` | Client | Mobile sticky CTA |
| `src/components/ProductJsonLd.tsx` | Server | Product structured data |
| `src/components/CTAWhatsApp.tsx` | Client | WhatsApp consultation CTA |

### Existing files modified (7)

| File | Changes |
|------|---------|
| `src/types/product.ts` | Added `fragrance`, `occasions`, `season`, `related` fields |
| `src/data/products.ts` | Populated new fields on existing products |
| `src/app/layout.tsx` | Title template, skip nav link, Spanish metadata |
| `src/app/globals.css` | Skip nav, focus-visible, enhanced reduced-motion, `--color-gold-pale` |
| `src/app/page.tsx` | CTAWhatsApp section, collection link, Spanish text |
| `src/app/perfume/[slug]/ProductPageClient.tsx` | FragranceMeter, RelatedProducts, StickyAddToCart, ProductJsonLd, Spanish text |
| `src/components/Navbar.tsx` | Nav links, mobile hamburger, ARIA labels |
| `src/components/CartDrawer.tsx` | Focus trap, ARIA labels, Spanish text |

### Dependencies added (1)

| Package | Version | Purpose |
|---------|---------|---------|
| `@gsap/react` | latest | `useGSAP()` hook for auto-cleanup |
