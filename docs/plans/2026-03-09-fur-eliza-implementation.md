# Fur Eliza — Phase 1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the "Black Card" MVP — a luxury perfume website with per-product scroll animations, dark/gold theme, and WhatsApp checkout.

**Architecture:** Next.js 16 app with GSAP scroll-driven canvas animations, adapted from the WS.Store.Bags reference project. Each product has its own frame sequence rendered on canvas. Static TypeScript data, Zustand cart, WhatsApp checkout. Dark matte background (#121212) with gold accents and grain texture.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, GSAP 3.14 + ScrollTrigger, Zustand, TypeScript

**Reference project:** `/home/jegx/jegx/desktop/work/org/wendy_sarmiento/WS.Store.Bags/`

**Design document:** `docs/plans/2026-03-09-fur-eliza-design.md`

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`

**Step 1: Initialize project and install dependencies**

```bash
cd /home/jegx/jegx/desktop/work/org/fureliza
npm init -y
npm install next@latest react@latest react-dom@latest tailwindcss@latest @tailwindcss/postcss@latest postcss@latest gsap@latest zustand@latest typescript@latest @types/react@latest @types/react-dom@latest @types/node@latest
```

**Step 2: Create package.json scripts**

Replace `package.json` scripts section:
```json
{
  "name": "fureliza",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

**Step 3: Create next.config.ts**

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
```

**Step 4: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Step 5: Create postcss.config.mjs**

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

**Step 6: Create directory structure**

```bash
mkdir -p src/app src/components src/store src/data src/types public/frames public/products public/brand scripts
```

**Step 7: Verify**

```bash
npx next --version
```

**Step 8: Commit**

```bash
git add package.json next.config.ts tsconfig.json postcss.config.mjs
git commit -m "chore: scaffold Next.js 16 project with deps"
```

---

### Task 2: Dark/Gold Theme & Global Styles

**Files:**
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Create: `public/grain.svg`

**Step 1: Create grain texture SVG**

```bash
# public/grain.svg — subtle noise overlay for matte texture
```

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#grain)" opacity="0.03"/>
</svg>
```

**Step 2: Create globals.css with dark/gold theme**

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  /* 60% — Dark backgrounds */
  --color-bg: #121212;
  --color-bg-warm: #1A1A1A;
  --color-bg-elevated: #222222;

  /* 30% — Gold identity */
  --color-gold: #C5A028;
  --color-gold-light: #E8D48B;
  --color-gold-dark: #8B6914;

  /* 10% — Text */
  --color-ink: #F5F5F5;
  --color-ink-soft: #9CA3AF;

  /* Auxiliares */
  --color-border: #2A2A2A;
  --color-overlay: rgba(0, 0, 0, 0.7);

  /* Font */
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
}

/* Reset */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html, body {
  overflow-x: clip;
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--color-bg);
  color: var(--color-ink);
}

/* Grain texture overlay — applied to body via ::after */
body::after {
  content: "";
  position: fixed;
  inset: 0;
  background: url("/grain.svg") repeat;
  pointer-events: none;
  z-index: 9999;
  opacity: 1;
}

/* Gold gradient text utility */
.text-gold-gradient {
  background: linear-gradient(
    135deg,
    var(--color-gold-dark) 0%,
    var(--color-gold) 40%,
    var(--color-gold-light) 60%,
    var(--color-gold) 80%,
    var(--color-gold-dark) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Embossed gold text utility */
.text-gold-emboss {
  color: var(--color-gold);
  text-shadow:
    0 1px 1px rgba(0, 0, 0, 0.8),
    0 -1px 0 rgba(232, 212, 139, 0.3);
}

/* Scrollbar minimal */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 3px; }

/* Loading shimmer */
@keyframes shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}

/* Image pulse on hover */
@keyframes img-pulse {
  0%   { transform: scale(1.10); }
  50%  { transform: scale(1.13); }
  100% { transform: scale(1.10); }
}

/* Smooth scroll offset for fixed navbar */
[id] { scroll-margin-top: 5rem; }

/* Disable hover animations on touch devices */
@media (hover: none) {
  .group:hover img {
    transform: none !important;
    animation: none !important;
  }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Step 3: Create layout.tsx**

```tsx
// src/app/layout.tsx
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
  title: "Fur Eliza | Luxury Niche Perfumery",
  description:
    "Feel the fragrance before you wear it. Curated niche perfumes presented through immersive sensory experiences. Lux Intra.",
  keywords: [
    "niche perfume",
    "luxury fragrance",
    "perfumeria nicho",
    "Fur Eliza",
    "curated perfumes",
  ],
  authors: [{ name: "Fur Eliza" }],
  openGraph: {
    title: "Fur Eliza | Luxury Niche Perfumery",
    description: "Feel the fragrance before you wear it. Lux Intra.",
    type: "website",
    locale: "es_CO",
    siteName: "Fur Eliza",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fur Eliza | Luxury Niche Perfumery",
    description: "Feel the fragrance before you wear it. Lux Intra.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

**Step 4: Create minimal homepage to test**

```tsx
// src/app/page.tsx
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-gold-gradient">
        FUR ELIZA
      </h1>
    </main>
  );
}
```

**Step 5: Verify dev server works**

```bash
npm run dev
# Open http://localhost:3000 — should see gold gradient "FUR ELIZA" on dark background with grain texture
```

**Step 6: Commit**

```bash
git add src/app/ public/grain.svg
git commit -m "feat: dark/gold theme with grain texture and layout"
```

---

### Task 3: Product Types & Data

**Files:**
- Create: `src/types/product.ts`
- Create: `src/data/products.ts`

**Step 1: Create product types**

```typescript
// src/types/product.ts
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

**Step 2: Create sample product data (2 products for development)**

```typescript
// src/data/products.ts
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

**Step 3: Commit**

```bash
git add src/types/ src/data/
git commit -m "feat: product types and sample catalog data"
```

---

### Task 4: Cart Store

**Files:**
- Create: `src/store/cartStore.ts`

**Step 1: Create cart store adapted for Fur Eliza**

```typescript
// src/store/cartStore.ts
import { create } from "zustand";
import { Product } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  currency: "COP" | "USD";
  lastAdded: string | null;
  open: () => void;
  close: () => void;
  toggle: () => void;
  toggleCurrency: () => void;
  addItem: (product: Product) => void;
  removeItem: (productSlug: string) => void;
  updateQuantity: (productSlug: string, quantity: number) => void;
  clearLastAdded: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  formatPrice: (cop: number, usd: number) => string;
  whatsappCheckoutUrl: () => string;
}

const WHATSAPP_NUMBER = "573000000000"; // TODO: Replace with real number

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  currency: "COP",
  lastAdded: null,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  toggleCurrency: () =>
    set((s) => ({ currency: s.currency === "COP" ? "USD" : "COP" })),

  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((i) => i.product.slug === product.slug);
      if (existing) {
        return {
          lastAdded: product.name,
          items: state.items.map((i) =>
            i.product.slug === product.slug
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        lastAdded: product.name,
        items: [...state.items, { product, quantity: 1 }],
      };
    }),

  clearLastAdded: () => set({ lastAdded: null }),

  removeItem: (slug) =>
    set((state) => ({
      items: state.items.filter((i) => i.product.slug !== slug),
    })),

  updateQuantity: (slug, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return { items: state.items.filter((i) => i.product.slug !== slug) };
      }
      return {
        items: state.items.map((i) =>
          i.product.slug === slug ? { ...i, quantity } : i
        ),
      };
    }),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  totalPrice: () => {
    const { items, currency } = get();
    return items.reduce(
      (sum, i) =>
        sum + i.quantity * (currency === "COP" ? i.product.price.cop : i.product.price.usd),
      0
    );
  },

  formatPrice: (cop, usd) => {
    const { currency } = get();
    if (currency === "COP") {
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }).format(cop);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(usd);
  },

  whatsappCheckoutUrl: () => {
    const { items, currency, totalPrice } = get();
    if (items.length === 0) return "#";

    const total = totalPrice();
    const label = currency;
    const lines = items
      .map((i) => {
        const price = currency === "COP" ? i.product.price.cop : i.product.price.usd;
        return `\u2022 ${i.product.name} (${i.product.house}) x${i.quantity} — ${label} ${price.toLocaleString()}`;
      })
      .join("\n");

    const message = encodeURIComponent(
      `Hola! Me gustaría ordenar:\n\n${lines}\n\n*Total: ${label} ${total.toLocaleString()}*`
    );

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  },
}));
```

**Step 2: Commit**

```bash
git add src/store/
git commit -m "feat: cart store with WhatsApp checkout"
```

---

### Task 5: AnimatedSection Component

**Files:**
- Create: `src/components/AnimatedSection.tsx`

**Step 1: Create AnimatedSection (same as WS.Store.Bags — animation logic is theme-agnostic)**

```tsx
// src/components/AnimatedSection.tsx
"use client";

import { useEffect, useRef } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-left" | "fade-right" | "scale" | "blur-in";
  delay?: number;
  duration?: number;
}

const animations = {
  "fade-up": { from: { opacity: 0, y: 80 }, to: { opacity: 1, y: 0 } },
  "fade-left": { from: { opacity: 0, x: -60 }, to: { opacity: 1, x: 0 } },
  "fade-right": { from: { opacity: 0, x: 60 }, to: { opacity: 1, x: 0 } },
  scale: { from: { opacity: 0, scale: 0.9 }, to: { opacity: 1, scale: 1 } },
  "blur-in": {
    from: { opacity: 0, filter: "blur(10px)" },
    to: { opacity: 1, filter: "blur(0px)" },
  },
};

export default function AnimatedSection({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  duration = 1,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function init() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!ref.current) return;

      const anim = animations[animation];
      gsap.fromTo(ref.current, anim.from, {
        ...anim.to,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
    }
    init();
  }, [animation, delay, duration]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/AnimatedSection.tsx
git commit -m "feat: reusable scroll-triggered animation component"
```

---

### Task 6: HeroScroll Component (Per-Product)

**Files:**
- Create: `src/components/HeroScroll.tsx`

This is the most critical component. Unlike WS.Store.Bags which has one global hero, Fur Eliza's HeroScroll takes a product and loads frames from its directory.

**Step 1: Create HeroScroll.tsx**

```tsx
// src/components/HeroScroll.tsx
"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Product } from "@/types/product";

const PRELOAD_COUNT = 30;

interface Props {
  product: Product;
  showTitle?: boolean;
}

function frameUrl(directory: string, index: number, total: number, format: string): string {
  const num = String(Math.min(Math.max(index, 1), total)).padStart(4, "0");
  return `${directory}/frame_${num}.${format}`;
}

export default function HeroScroll({ product, showTitle = true }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const [loaded, setLoaded] = useState(false);

  const { frames } = product;
  const TOTAL_FRAMES = frames.count;

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imagesRef.current[index];
    if (!img || !img.complete) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  }, []);

  useEffect(() => {
    let tl: gsap.core.Tween | null = null;

    async function init() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const images: HTMLImageElement[] = [];
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        images.push(new Image());
      }
      imagesRef.current = images;

      let loadedEager = 0;
      const onEagerLoad = () => {
        loadedEager++;
        if (loadedEager === 1) {
          drawFrame(0);
          setLoaded(true);
        }
      };

      const preloadCount = Math.min(PRELOAD_COUNT, TOTAL_FRAMES);
      for (let i = 0; i < preloadCount; i++) {
        images[i].onload = onEagerLoad;
        images[i].src = frameUrl(frames.directory, i + 1, TOTAL_FRAMES, frames.format);
      }
      for (let i = preloadCount; i < TOTAL_FRAMES; i++) {
        images[i].src = frameUrl(frames.directory, i + 1, TOTAL_FRAMES, frames.format);
      }

      // Frame scrubbing
      const obj = { frame: 0 };
      tl = gsap.to(obj, {
        frame: TOTAL_FRAMES - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
        onUpdate: () => {
          const idx = Math.round(obj.frame);
          if (idx !== currentFrameRef.current) {
            currentFrameRef.current = idx;
            drawFrame(idx);
          }
        },
      });

      // Fade-in on load (dark theme: from black, not white)
      gsap.set(".hero-canvas-wrap", {
        filter: "blur(40px) brightness(0) saturate(0)",
        scale: 1.12,
      });
      gsap.set(".hero-fadein-overlay", { opacity: 1 });

      const fadeInTL = gsap.timeline({ delay: 0.2 });
      fadeInTL
        .to(".hero-fadein-overlay", { opacity: 0, duration: 0.6, ease: "power2.out" })
        .to(".hero-canvas-wrap", {
          filter: "blur(16px) brightness(0.5) saturate(0.3)",
          scale: 1.06, duration: 0.8, ease: "power2.out",
        }, 0)
        .to(".hero-canvas-wrap", {
          filter: "blur(4px) brightness(0.8) saturate(0.7)",
          scale: 1.02, duration: 0.7, ease: "power2.out",
        }, 0.6)
        .to(".hero-canvas-wrap", {
          filter: "blur(0px) brightness(1) saturate(1)",
          scale: 1, duration: 0.8, ease: "power3.out",
        }, 1.1);

      // Title entrance
      if (showTitle) {
        gsap.fromTo(".hero-title",
          { opacity: 0, y: 40, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "power3.out", delay: 0.3 }
        );
        gsap.fromTo(".hero-subtitle",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.7 }
        );

        // Title fade out on scroll
        gsap.to(".hero-text-container", {
          opacity: 0, y: -80, scale: 0.9,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top", end: "15% top", scrub: true,
          },
        });
      }

      // Progressive dissolve to dark
      const dissolveTL = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "65% top", end: "bottom bottom", scrub: true,
        },
      });
      dissolveTL
        .to(".hero-canvas-wrap", {
          filter: "blur(4px) brightness(0.8) saturate(1)",
          scale: 1.02, duration: 0.28,
        }, 0)
        .to(".hero-dissolve-gradient", { y: "0%", duration: 0.56 }, 0.14)
        .to(".hero-canvas-wrap", {
          filter: "blur(16px) brightness(0.3) saturate(0.3)",
          scale: 1.06, duration: 0.28,
        }, 0.28)
        .to(".hero-dissolve-overlay", { opacity: 1, duration: 0.29 }, 0.56)
        .to(".hero-canvas-wrap", {
          filter: "blur(40px) brightness(0) saturate(0)",
          scale: 1.12, duration: 0.44,
        }, 0.56);

      // Scroll indicator
      gsap.to(".hero-scroll-indicator", {
        opacity: 0, y: 20,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top", end: "5% top", scrub: true,
        },
      });
    }

    init();
    return () => {
      if (tl) tl.kill();
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      });
    };
  }, [drawFrame, TOTAL_FRAMES, frames, showTitle]);

  return (
    <div ref={containerRef} className="h-[500vh] relative">
      <div className="sticky top-0 h-dvh flex items-center justify-center overflow-hidden bg-[var(--color-bg)]">
        <div className="hero-canvas-wrap w-full h-full">
          <canvas
            ref={canvasRef}
            className={`w-full h-full object-cover transition-opacity duration-700 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            style={{ maxHeight: "100dvh" }}
          />
        </div>

        {/* Fade-in: dark overlay that fades out */}
        <div className="hero-fadein-overlay absolute inset-0 bg-[var(--color-bg)] pointer-events-none z-10" />

        {/* Fade-out: gradient wipe from bottom (dark) */}
        <div
          className="hero-dissolve-gradient absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to top, #121212 0%, #121212 40%, rgba(18,18,18,0.8) 60%, rgba(18,18,18,0) 100%)",
            transform: "translateY(100%)",
          }}
        />
        <div className="hero-dissolve-overlay absolute inset-0 bg-[var(--color-bg)] opacity-0 pointer-events-none" />

        {/* Title overlay */}
        {showTitle && (
          <div className="hero-text-container absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-center px-4">
              <h1 className="hero-title font-[family-name:var(--font-playfair)] text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4 opacity-0 text-gold-gradient">
                {product.name}
              </h1>
              <p className="hero-subtitle text-sm sm:text-lg md:text-2xl font-bold tracking-[0.25em] uppercase opacity-0 text-[var(--color-ink-soft)]">
                {product.house}
              </p>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {!loaded && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[var(--color-bg)]">
            <span className="font-[family-name:var(--font-playfair)] text-xl font-bold tracking-[0.1em] uppercase text-[var(--color-gold)] opacity-30 animate-pulse">
              Fur Eliza
            </span>
            <div className="mt-6 w-32 h-0.5 rounded-full bg-[var(--color-border)] overflow-hidden">
              <div className="h-full w-1/3 rounded-full bg-[var(--color-gold)] animate-[shimmer_1.5s_ease-in-out_infinite]" />
            </div>
          </div>
        )}

        {/* Scroll indicator */}
        <div className="hero-scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-[var(--color-ink-soft)]">
            <span className="text-[10px] tracking-widest uppercase opacity-60">Scroll</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="animate-bounce">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/HeroScroll.tsx
git commit -m "feat: per-product HeroScroll with dark theme dissolve"
```

---

### Task 7: Navbar Component

**Files:**
- Create: `src/components/Navbar.tsx`

**Step 1: Create dark-theme Navbar with glassmorphism**

```tsx
// src/components/Navbar.tsx
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
```

**Step 2: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: dark glassmorphic navbar with gold accents"
```

---

### Task 8: ProductCard Component

**Files:**
- Create: `src/components/ProductCard.tsx`

**Step 1: Create dark-theme ProductCard with link to product page**

```tsx
// src/components/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";

interface Props {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: Props) {
  const { addItem, formatPrice } = useCartStore();
  const cardRef = useRef<HTMLElement>(null);
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  useEffect(() => {
    async function animate() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!cardRef.current) return;

      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 80, rotateX: 8 },
        {
          opacity: 1, y: 0, rotateX: 0,
          duration: 0.9, ease: "power3.out",
          delay: index * 0.15,
          scrollTrigger: { trigger: cardRef.current, start: "top 88%", once: true },
        }
      );
    }
    animate();
  }, [index]);

  return (
    <Link href={`/perfume/${product.slug}`}>
      <article ref={cardRef} className="group cursor-pointer opacity-0" style={{ perspective: "1000px" }}>
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--color-bg-warm)] mb-4 shadow-lg shadow-black/20 group-hover:shadow-xl group-hover:shadow-[var(--color-gold)]/10 transition-shadow duration-500">
          <Image
            src={product.images.card}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:animate-[img-pulse_2.5s_ease-in-out_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <button
            onClick={handleAdd}
            className={`absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 py-3 backdrop-blur-sm text-sm font-semibold rounded-xl transition-all duration-300 active:scale-95 ${
              added
                ? "bg-[var(--color-gold)] text-[var(--color-bg)] opacity-100 translate-y-0"
                : "bg-[var(--color-bg)]/80 text-[var(--color-gold)] border border-[var(--color-gold)]/20 opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-3 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 hover:bg-[var(--color-gold)] hover:text-[var(--color-bg)]"
            }`}
          >
            {added ? "Added" : "Add to cart"}
          </button>
        </div>

        <div className="px-1">
          <p className="text-xs font-semibold tracking-widest uppercase text-[var(--color-gold)]/60 mb-1">
            {product.house}
          </p>
          <h3 className="text-base font-semibold text-[var(--color-ink)] mb-1 group-hover:text-[var(--color-gold)] transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-2 line-clamp-2">
            {product.description}
          </p>
          <p className="text-lg font-bold text-[var(--color-gold)]">
            {formatPrice(product.price.cop, product.price.usd)}
          </p>
        </div>
      </article>
    </Link>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/ProductCard.tsx
git commit -m "feat: dark product card with gold accents and link to detail"
```

---

### Task 9: CartDrawer, Toast Components

**Files:**
- Create: `src/components/CartDrawer.tsx`
- Create: `src/components/Toast.tsx`

**Step 1: Create dark-theme CartDrawer**

```tsx
// src/components/CartDrawer.tsx
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
```

**Step 2: Create dark-theme Toast**

```tsx
// src/components/Toast.tsx
"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";

export default function Toast() {
  const { lastAdded, clearLastAdded } = useCartStore();
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!lastAdded) return;
    setExiting(false);
    setVisible(true);
    const exitTimer = setTimeout(() => setExiting(true), 2200);
    const hideTimer = setTimeout(() => { setVisible(false); clearLastAdded(); }, 2700);
    return () => { clearTimeout(exitTimer); clearTimeout(hideTimer); };
  }, [lastAdded, clearLastAdded]);

  if (!visible || !lastAdded) return null;

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-2xl max-w-[calc(100vw-2rem)] transition-all duration-500 ${
        exiting ? "opacity-0 translate-y-4 scale-95 -translate-x-1/2" : "opacity-100 translate-y-0 scale-100 -translate-x-1/2"
      }`}
      style={{
        backgroundColor: "rgba(26, 26, 26, 0.75)",
        backdropFilter: "saturate(1.8) blur(28px)",
        WebkitBackdropFilter: "saturate(1.8) blur(28px)",
        border: "1px solid rgba(197, 160, 40, 0.15)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-[var(--color-gold)]/20 animate-ping" />
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <span className="text-sm font-medium text-[var(--color-ink)]">
        <strong className="text-[var(--color-gold)]">{lastAdded}</strong> added to cart
      </span>
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add src/components/CartDrawer.tsx src/components/Toast.tsx
git commit -m "feat: dark cart drawer and toast notification"
```

---

### Task 10: Footer Component

**Files:**
- Create: `src/components/Footer.tsx`

**Step 1: Create Fur Eliza footer with brand story**

```tsx
// src/components/Footer.tsx
"use client";

import { useEffect, useRef } from "react";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    async function init() {
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
              Inspired by the subtlety of Beethoven, created for Elizabeth.
              Feel the fragrance before you wear it. Lux Intra.
            </p>
          </div>

          <div className="footer-col opacity-0">
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[var(--color-gold)]/40">Navigation</h4>
            <ul className="space-y-2 text-sm text-[var(--color-ink-soft)]">
              <li><a href="#collection" className="hover:text-[var(--color-gold)] transition-colors duration-300">Collection</a></li>
              <li><a href="#about" className="hover:text-[var(--color-gold)] transition-colors duration-300">Our Story</a></li>
            </ul>
          </div>

          <div className="footer-col opacity-0">
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[var(--color-gold)]/40">Contact</h4>
            <a href="https://wa.me/573000000000" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] rounded-lg text-sm font-medium text-white hover:bg-[#1DA851] transition-all duration-300 hover:shadow-lg hover:shadow-[#25D366]/25 hover:scale-105 active:scale-95">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-ink-soft)]/30">
          &copy; {new Date().getFullYear()} Fur Eliza. All rights reserved. Lux Intra.
        </div>
      </div>
    </footer>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: footer with brand story and gold accents"
```

---

### Task 11: Product Detail Page (Dynamic Route)

**Files:**
- Create: `src/app/perfume/[slug]/page.tsx`

This is NEW — WS.Store.Bags doesn't have product detail pages. Each perfume gets its own full-screen immersive page with scroll animation.

**Step 1: Create dynamic product page**

```tsx
// src/app/perfume/[slug]/page.tsx
import { notFound } from "next/navigation";
import { products, getProductBySlug } from "@/data/products";
import ProductPageClient from "./ProductPageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return {
    title: `${product.name} — ${product.house} | Fur Eliza`,
    description: product.description,
    openGraph: {
      title: `${product.name} — ${product.house} | Fur Eliza`,
      description: product.description,
      images: [{ url: product.images.hero, width: 1200, height: 630 }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return <ProductPageClient product={product} />;
}
```

**Step 2: Create client component for product page**

```tsx
// src/app/perfume/[slug]/ProductPageClient.tsx
"use client";

import { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import HeroScroll from "@/components/HeroScroll";
import AnimatedSection from "@/components/AnimatedSection";
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
                    {level === "top" ? "Top" : level === "heart" ? "Heart" : "Base"}
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

          {/* Tags */}
          <AnimatedSection animation="fade-up" delay={0.35}>
            <div className="flex flex-wrap gap-2 mb-10">
              {product.emotionalTags.map((tag) => (
                <span key={tag} className="px-3 py-1 text-xs rounded-full border border-[var(--color-gold)]/20 text-[var(--color-gold)]/60 capitalize">
                  {tag}
                </span>
              ))}
            </div>
          </AnimatedSection>

          {/* Price & buy */}
          <AnimatedSection animation="fade-up" delay={0.4}>
            <div className="flex items-center gap-6">
              <p className="text-3xl font-bold text-[var(--color-gold)]">
                {formatPrice(product.price.cop, product.price.usd)}
              </p>
              <span className="text-sm text-[var(--color-ink-soft)]">{product.size} — {product.type === "full" ? "Full bottle" : "Decant"}</span>
            </div>
            <button
              onClick={handleAdd}
              className={`mt-6 px-8 py-4 font-semibold rounded-xl transition-all duration-300 active:scale-95 ${
                added
                  ? "bg-[var(--color-gold)] text-[var(--color-bg)]"
                  : "bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/30 hover:bg-[var(--color-gold)] hover:text-[var(--color-bg)]"
              }`}
            >
              {added ? "Added to cart" : "Add to cart"}
            </button>
          </AnimatedSection>
        </section>
      </main>

      <Footer />
    </>
  );
}
```

**Step 3: Commit**

```bash
git add src/app/perfume/
git commit -m "feat: dynamic product page with per-product hero animation"
```

---

### Task 12: Homepage Assembly

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Build the full homepage**

```tsx
// src/app/page.tsx
import HeroScroll from "@/components/HeroScroll";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";
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
                Collection
              </p>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.1}>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-bold text-gold-gradient">
                Curated Fragrances
              </h2>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.2}>
              <p className="mt-4 text-[var(--color-ink-soft)] max-w-lg mx-auto">
                Each fragrance is an experience. Scroll through its world before you decide.
              </p>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product, index) => (
              <ProductCard key={product.slug} product={product} index={index} />
            ))}
          </div>
        </section>

        {/* About */}
        <section id="about" className="bg-[var(--color-bg-warm)] py-14 md:py-24 overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedSection animation="blur-in">
              <p className="text-sm font-semibold tracking-widest uppercase text-[var(--color-gold)]/60 mb-2">
                Our Story
              </p>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.1}>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-gold-gradient mb-6">
                The Light Within
              </h2>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.2}>
              <div className="space-y-4 text-[var(--color-ink-soft)] leading-relaxed max-w-2xl mx-auto">
                <p>
                  Fur Eliza was born from a promise: to translate the beauty of
                  music and devotion into unforgettable aromas. Named after
                  Beethoven&apos;s timeless composition, each fragrance in our
                  collection is a movement in an olfactory symphony.
                </p>
                <p>
                  We believe that choosing a perfume should be a sensory journey,
                  not a gamble. That&apos;s why every fragrance in our collection
                  comes with its own immersive experience — so you can feel it
                  before you wear it.
                </p>
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

**Step 2: Verify dev server**

```bash
npm run dev
# Check: dark background, grain texture, gold gradient text, navbar, product cards
```

**Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: homepage with hero, collection grid, and about section"
```

---

### Task 13: Frame Processing Script

**Files:**
- Create: `scripts/process-frames.sh`

**Step 1: Create the frame extraction and optimization script**

```bash
#!/usr/bin/env bash
# scripts/process-frames.sh
# Usage: ./scripts/process-frames.sh <product-slug> <video-file> [fps]
#
# Extracts frames from a video, optimizes to WebP (and AVIF when available),
# auto-selects hero + card images, generates mobile variant, and outputs manifest.

set -euo pipefail

SLUG="${1:?Usage: process-frames.sh <slug> <video-file> [fps]}"
VIDEO="${2:?Usage: process-frames.sh <slug> <video-file> [fps]}"
FPS="${3:-24}"

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="${PROJECT_ROOT}/public/frames/${SLUG}"
PRODUCTS_DIR="${PROJECT_ROOT}/public/products"
TEMP_DIR=$(mktemp -d)

echo "==> Processing frames for: ${SLUG}"
echo "    Video: ${VIDEO}"
echo "    FPS: ${FPS}"

# 1. Extract frames
echo "==> Extracting frames at ${FPS}fps..."
mkdir -p "${OUT_DIR}"
ffmpeg -i "${VIDEO}" -vf "fps=${FPS}" -q:v 2 "${TEMP_DIR}/frame_%04d.png" -y -loglevel warning

FRAME_COUNT=$(ls -1 "${TEMP_DIR}"/frame_*.png | wc -l)
echo "    Extracted ${FRAME_COUNT} frames"

# 2. Convert to WebP
echo "==> Converting to WebP..."
for f in "${TEMP_DIR}"/frame_*.png; do
  base=$(basename "$f" .png)
  npx sharp-cli --input "$f" --output "${OUT_DIR}/${base}.webp" --format webp --quality 65 2>/dev/null || \
    ffmpeg -i "$f" -quality 65 "${OUT_DIR}/${base}.webp" -y -loglevel warning
done

# 3. Auto-select hero image (frame at 30% — usually the most visually interesting)
HERO_FRAME=$((FRAME_COUNT * 30 / 100))
HERO_FRAME_PAD=$(printf "%04d" $HERO_FRAME)
echo "==> Selecting hero frame: ${HERO_FRAME_PAD}"
mkdir -p "${PRODUCTS_DIR}"
cp "${OUT_DIR}/frame_${HERO_FRAME_PAD}.webp" "${PRODUCTS_DIR}/${SLUG}-hero.webp"
cp "${OUT_DIR}/frame_${HERO_FRAME_PAD}.webp" "${PRODUCTS_DIR}/${SLUG}-card.webp"

# 4. Generate mobile variant (skip every 2nd frame)
echo "==> Generating mobile frames..."
MOBILE_DIR="${OUT_DIR}/mobile"
mkdir -p "${MOBILE_DIR}"
MOBILE_COUNT=0
i=1
for f in "${OUT_DIR}"/frame_*.webp; do
  if (( i % 2 == 1 )); then
    MOBILE_COUNT=$((MOBILE_COUNT + 1))
    MOBILE_PAD=$(printf "%04d" $MOBILE_COUNT)
    cp "$f" "${MOBILE_DIR}/frame_${MOBILE_PAD}.webp"
  fi
  i=$((i + 1))
done
echo "    Mobile frames: ${MOBILE_COUNT}"

# 5. Calculate total size
TOTAL_SIZE=$(du -sh "${OUT_DIR}" | cut -f1)

# 6. Write manifest
cat > "${OUT_DIR}/manifest.json" <<MANIFEST
{
  "slug": "${SLUG}",
  "count": ${FRAME_COUNT},
  "mobileCount": ${MOBILE_COUNT},
  "format": "webp",
  "fps": ${FPS},
  "totalSize": "${TOTAL_SIZE}"
}
MANIFEST

echo "==> Done!"
echo "    Frames: ${OUT_DIR}/ (${FRAME_COUNT} frames, ${TOTAL_SIZE})"
echo "    Hero:   ${PRODUCTS_DIR}/${SLUG}-hero.webp"
echo "    Card:   ${PRODUCTS_DIR}/${SLUG}-card.webp"
echo "    Mobile: ${MOBILE_DIR}/ (${MOBILE_COUNT} frames)"

# Cleanup
rm -rf "${TEMP_DIR}"
```

**Step 2: Make executable**

```bash
chmod +x scripts/process-frames.sh
```

**Step 3: Commit**

```bash
git add scripts/
git commit -m "feat: frame processing script (video -> WebP frames + mobile + hero)"
```

---

### Task 14: Placeholder Frames for Development

Until real Seedance videos are generated, create placeholder frames so the site can be developed and tested.

**Step 1: Create a script that generates colored gradient placeholder frames**

```bash
#!/usr/bin/env bash
# scripts/generate-placeholder-frames.sh
# Generates 120 colored gradient frames for development testing
# Usage: ./scripts/generate-placeholder-frames.sh <slug> <color-hex>

set -euo pipefail

SLUG="${1:?Usage: generate-placeholder-frames.sh <slug> <color-hex>}"
COLOR="${2:-1a3a5c}"

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="${PROJECT_ROOT}/public/frames/${SLUG}"
PRODUCTS_DIR="${PROJECT_ROOT}/public/products"
FRAMES=120

echo "==> Generating ${FRAMES} placeholder frames for: ${SLUG}"
mkdir -p "${OUT_DIR}" "${OUT_DIR}/mobile" "${PRODUCTS_DIR}"

for i in $(seq 1 $FRAMES); do
  PAD=$(printf "%04d" $i)
  # Vary brightness across frames to simulate scroll animation
  BRIGHTNESS=$(echo "scale=2; 0.3 + ($i / $FRAMES) * 0.7" | bc)
  convert -size 1920x1080 \
    -seed $i xc: +noise Random \
    -colorize "80,80,80" \
    -fill "#${COLOR}" -colorize 60 \
    -modulate "$(echo "$BRIGHTNESS * 100" | bc),100,100" \
    -quality 65 \
    "${OUT_DIR}/frame_${PAD}.webp" 2>/dev/null || \
  ffmpeg -f lavfi -i "color=c=0x${COLOR}:s=1920x1080:d=0.04,format=yuv420p" \
    -vf "drawtext=text='${SLUG} ${PAD}':fontsize=48:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2" \
    -frames:v 1 -quality 65 \
    "${OUT_DIR}/frame_${PAD}.webp" -y -loglevel warning
done

# Hero + card
cp "${OUT_DIR}/frame_0036.webp" "${PRODUCTS_DIR}/${SLUG}-hero.webp"
cp "${OUT_DIR}/frame_0036.webp" "${PRODUCTS_DIR}/${SLUG}-card.webp"

# Mobile (every 2nd)
MOBILE_COUNT=0
for i in $(seq 1 2 $FRAMES); do
  MOBILE_COUNT=$((MOBILE_COUNT + 1))
  MPAD=$(printf "%04d" $MOBILE_COUNT)
  SPAD=$(printf "%04d" $i)
  cp "${OUT_DIR}/frame_${SPAD}.webp" "${OUT_DIR}/mobile/frame_${MPAD}.webp"
done

cat > "${OUT_DIR}/manifest.json" <<EOF
{"slug":"${SLUG}","count":${FRAMES},"mobileCount":${MOBILE_COUNT},"format":"webp","fps":24,"totalSize":"placeholder"}
EOF

echo "==> Done: ${OUT_DIR}/ (${FRAMES} frames)"
```

**Step 2: Make executable and generate placeholders**

```bash
chmod +x scripts/generate-placeholder-frames.sh
./scripts/generate-placeholder-frames.sh megamare 0a2a4a
./scripts/generate-placeholder-frames.sh baccarat-rouge-540 4a2a0a
```

**Step 3: Commit (don't commit frames — add to .gitignore)**

```bash
echo "public/frames/" >> .gitignore
echo "node_modules/" >> .gitignore
echo ".next/" >> .gitignore
git add .gitignore scripts/generate-placeholder-frames.sh
git commit -m "feat: placeholder frame generator and gitignore"
```

---

### Task 15: Build & Verify

**Step 1: Run dev server and test all pages**

```bash
npm run dev
```

Check:
- [ ] `http://localhost:3000` — homepage loads with dark theme, grain texture, gold text
- [ ] Hero animation scrubs on scroll (using placeholder frames)
- [ ] Product cards appear with staggered animation
- [ ] Clicking a card navigates to `/perfume/megamare`
- [ ] Product page has its own hero animation
- [ ] Cart drawer opens/closes
- [ ] Adding to cart shows toast
- [ ] WhatsApp checkout URL works
- [ ] Currency toggle works
- [ ] Responsive on mobile viewport

**Step 2: Run production build**

```bash
npm run build
```

Fix any TypeScript or build errors.

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: Phase 1 complete — Fur Eliza MVP with all core components"
```

---

## Summary: Task Dependencies

```
Task 1:  Scaffold          ──> foundation
Task 2:  Theme & CSS       ──> depends on 1
Task 3:  Types & Data      ──> depends on 1
Task 4:  Cart Store        ──> depends on 3
Task 5:  AnimatedSection   ──> depends on 2
Task 6:  HeroScroll        ──> depends on 2, 3
Task 7:  Navbar            ──> depends on 4
Task 8:  ProductCard       ──> depends on 3, 4, 5
Task 9:  CartDrawer, Toast ──> depends on 4
Task 10: Footer            ──> depends on 2, 5
Task 11: Product Page      ──> depends on 6, 7, 8, 9, 10
Task 12: Homepage          ──> depends on 6, 7, 8, 9, 10
Task 13: Frame Script      ──> independent
Task 14: Placeholder Frames ──> depends on 13
Task 15: Build & Verify    ──> depends on all
```

Parallelizable groups:
- **Group A** (independent): Tasks 3, 4, 5, 13
- **Group B** (after A): Tasks 6, 7, 8, 9, 10
- **Group C** (after B): Tasks 11, 12, 14
- **Group D** (final): Task 15
