# Fur Eliza — Site Structure & Enhancement Design

**Date:** 2026-03-10
**Author:** Jonathan + Claude
**Status:** Approved
**Based on:** Ultra-deep research across 6 domains (UX, SEO, CRO, Performance, Next.js 16, Accessibility)

---

## 1. Route Architecture

Validated against Google's ecommerce URL best practices, Byredo/Le Labo URL patterns, and SEO research.

### Phase 1 Routes (build now)

```
/                              → Homepage (hero + catalog + CTA + about teaser)
/collection                    → Full catalog with filters (family, mood)
/perfume/[slug]                → Product detail page (SSG via generateStaticParams)
/about                         → Brand story
/faq                           → Frequently asked questions
/legal                         → Decant disclaimer + terms of use
```

### Future Routes (when product types expand)

```
/set/[slug]                    → Discovery sets (Phase 3)
/layering/[slug]               → Molecular layering products (Phase 4)
```

### URL Design Decisions

- **Flat product URLs** (`/perfume/megamare` = 2 levels) — optimal for SEO per Google's ecommerce guide
- **No `/store/` prefix** — adds a third level that dilutes keyword value
- **`/collection`** for catalog — luxury terminology (vs "store" or "shop")
- **Info pages at root** (`/about`, `/faq`, `/legal`) — matches Le Labo pattern
- **Future-proof** — new product types get their own namespace without touching existing routes

---

## 2. Page Structures

### 2.1 Homepage (`/`)

| # | Section | Description |
|---|---------|-------------|
| 1 | Hero scroll animation | First/featured product, canvas frame scrubbing, product name in gold gradient, dissolves to dark |
| 2 | Collection grid with filters | Filter buttons by olfactory family + mood. ProductCards with stagger animation, link to `/perfume/[slug]` |
| 3 | CTA WhatsApp | Frosted glass overlay: "¿No sabes cuál elegir? Te asesoramos" + WhatsApp button |
| 4 | About teaser | Short brand story + "Lux Intra" + link to `/about` |
| 5 | Footer | Brand story, navigation, WhatsApp, copyright |

### 2.2 Product Detail Page (`/perfume/[slug]`)

| # | Section | Description |
|---|---------|-------------|
| 1 | Hero scroll animation | Unique per-product canvas frame scrubbing |
| 2 | Product info | Name (gold gradient), house, poetic description |
| 3 | Notes pyramid | Top / Heart / Base with note names |
| 4 | Fragrance meter | Visual bars for intensity, projection, longevity (new from research) |
| 5 | Emotional tags | Gold pill badges: "powerful", "dark", "salty" etc. |
| 6 | Price + Add to cart | COP/USD price, shipping cost visible, add-to-cart button. **Sticky on mobile** (8-15% conversion lift) |
| 7 | Related fragrances | "If you like this..." cards filtered by same family/mood |
| 8 | JSON-LD (invisible) | Schema.org Product structured data for Google rich snippets |

### 2.3 Collection Page (`/collection`)

| # | Section | Description |
|---|---------|-------------|
| 1 | Header | "Collection" in gold gradient + subtitle |
| 2 | Filter bar | Buttons by olfactory family (Deep Woods, Opulent Florals, Vibrant Citrus, Ocean & Marine, Oriental & Spiced) + by mood (Power, Seduction, Energy, Comfort) |
| 3 | Product grid | All products, filtered in real-time without page change |

### 2.4 About Page (`/about`)

| # | Section | Description |
|---|---------|-------------|
| 1 | Hero | "Fur Eliza" large + tagline "Lux Intra" |
| 2 | Story | Beethoven → Elizabeth → the promise → fragrances as symphonic movements |
| 3 | Philosophy | No gender, curated by emotion, sensory experience before purchase |
| 4 | CTA | "Explore the collection" → `/collection` |

### 2.5 FAQ Page (`/faq`)

Accordion component with questions:
- ¿Qué es un decant?
- ¿Son perfumes originales?
- ¿Cómo compro?
- ¿Cuánto tarda el envío?
- ¿Aceptan devoluciones?
- ¿Qué métodos de pago aceptan?
- ¿Hacen envíos a todo Colombia?

Each answer includes FAQ Schema.org markup for Google rich snippets.

### 2.6 Legal Page (`/legal`)

- Decant disclaimer (legally required in Colombia under Andean regime)
- Terms of use
- Privacy policy
- Return policy

---

## 3. Technical Enhancements (from research)

### 3.1 Performance

| Enhancement | What | Impact |
|-------------|------|--------|
| AVIF-first images | Serve AVIF with WebP/JPEG fallback via `<picture>` | 50% smaller than JPEG, improves LCP |
| PPR (Partial Prerendering) | `"use cache"` + `<Suspense>` for instant static shells | Instant page load with streamed dynamic content |
| Network-aware loading | Detect connection via `navigator.connection`, reduce frames on slow networks | Better experience on Colombian mobile networks |
| INP optimization | Defer non-critical scripts, Web Workers for heavy processing | Target: INP < 200ms |
| Turbopack + React Compiler | Both stable in Next.js 16 | 2-5x faster builds, auto-memoization |

### 3.2 SEO

| Enhancement | What | Impact |
|-------------|------|--------|
| JSON-LD Product schema | Full structured data on every product page (name, image, offers, variants) | Google rich snippets with price/availability |
| Dynamic generateMetadata | Sensory keywords, titles <60 chars, descriptions 140-160 chars | Better CTR in search results |
| FAQ schema | Structured data on FAQ page | FAQ rich snippets in Google |
| Sitemap + robots.txt | Dynamic `sitemap.ts` + `robots.ts` in Next.js | Proper crawling, allow AI crawlers |
| GEO optimization | Factual extractable content alongside luxury copy | Visibility in ChatGPT/Perplexity/Google AI |

### 3.3 Accessibility

| Enhancement | What | Impact |
|-------------|------|--------|
| `prefers-reduced-motion` | Disable all scroll animations, show static hero image | WCAG 2.3.3 compliance, 70M+ users |
| Gold contrast audit | Ensure gold text meets 4.5:1 ratio against dark background | WCAG 2.1 AA compliance |
| Focus management | Trap focus in cart drawer, return on close, visible focus rings | Keyboard navigation support |
| ARIA labels | Descriptive labels on product cards, buttons, modals | Screen reader support |
| Skip navigation | Hidden link to skip to main content | WCAG requirement |

### 3.4 Conversion Optimization

| Enhancement | What | Impact |
|-------------|------|--------|
| Sticky mobile CTA | Fixed "Add to cart" button on mobile product pages | 8-15% conversion lift |
| Transparent pricing | Show shipping + IVA on product page before cart | Reduces 48.2% abandonment from surprise costs |
| Related fragrances | "If you like this..." recommendations by family/mood | Cross-sell, longer sessions |
| Fragrance meter | Visual intensity/projection/longevity bars | Addresses the "smell barrier" |
| CTA WhatsApp section | Frosted glass "personal consultation" CTA on homepage | Drives conversations (35-55% conversion) |

### 3.5 Code Architecture

| Enhancement | What | Impact |
|-------------|------|--------|
| Centralized GSAP (`lib/gsap.ts`) | Register all plugins once, export `useGSAP` | Prevents memory leaks, proper cleanup |
| `useGSAP()` hook | Replace `useEffect` for all GSAP animations | Auto-cleanup on unmount |
| Server Components by default | Only `"use client"` at leaf level for interactive components | Zero client JS for non-interactive UI |
| `proxy.ts` (was middleware.ts) | Rename per Next.js 16 convention | Future-proof |

---

## 4. Product Data Structure Updates

Add new fields to support research findings:

```typescript
// New fields in ProductGenerated
interface ProductGenerated {
  // ... existing fields ...
  fragrance: {
    intensity: number;    // 1-10 scale
    projection: number;   // 1-10 scale
    longevity: number;    // 1-10 scale (hours)
  };
  occasions: string[];    // ["evening", "formal", "date-night"]
  season: string[];       // ["fall", "winter"]
  related: string[];      // slugs of related products
}
```

---

## 5. Navbar Updates

Current navbar has: Logo, Currency toggle, Cart icon.

Updated navbar:
- Logo ("Fur Eliza" in Playfair)
- Navigation links: Collection, About
- Currency toggle (COP/USD)
- Cart icon with badge

Mobile: hamburger menu with all links + currency + cart.

---

## 6. What This Design Does NOT Include (Anti-Scope-Creep)

- No WhatsApp Business API integration (Phase 1.5 — requires API approval)
- No discovery sets pages (Phase 3 — requires physical product)
- No AI fragrance finder quiz (Phase 2)
- No reviews/ratings system (needs backend — Phase 2)
- No user accounts or authentication
- No hreflang/i18n (Phase 2 — when expanding to LATAM)
- No light/dark mode toggle (luxury = dark-only)
- No PWA service worker (Phase 2)
- No payment gateway (Phase 1 = WhatsApp checkout only)

---

## 7. Implementation Priority

### Batch 1: New pages + routes
- `/collection` page with filter system
- `/about` page
- `/faq` page with accordion + FAQ schema
- `/legal` page

### Batch 2: Product page enhancements
- Fragrance meter component (intensity/projection/longevity)
- Related fragrances section
- Sticky mobile CTA
- Transparent pricing (shipping info)
- JSON-LD Product schema

### Batch 3: Technical foundations
- Centralized `lib/gsap.ts` with `useGSAP()`
- `prefers-reduced-motion` support across all components
- Gold contrast audit + fixes
- Focus management for cart drawer
- ARIA labels throughout

### Batch 4: SEO
- Dynamic sitemap.ts
- robots.ts (allow AI crawlers)
- generateMetadata improvements (sensory keywords)
- FAQ Schema.org markup

### Batch 5: Performance
- AVIF conversion in frame pipeline
- Network-aware frame loading
- PPR setup with Cache Components
- Skip navigation + accessibility audit

### Batch 6: Homepage improvements
- CTA WhatsApp section (frosted glass)
- Filter system on collection grid
- Homepage collection grid links to `/collection` for "see all"
- Navbar navigation links update
