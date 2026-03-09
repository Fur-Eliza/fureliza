# Fur Eliza — Design Document

**Date:** 2026-03-09
**Author:** Jonathan + Claude
**Status:** Approved

---

## 1. What Is Fur Eliza

A curated niche perfumery with an ultra-luxury digital experience. The website makes you *feel* the fragrance before buying it — each product has its own immersive scroll animation, like Apple's product pages, but for perfume.

**It is NOT:** a generic perfume store, a marketplace, a subscription box, or a manufacturer (not yet).

**It IS:** a curated sensory experience that sells premium fragrances through emotion-driven storytelling.

---

## 2. Brand Identity

| Element | Value |
|---------|-------|
| Commercial name | Fur Eliza |
| Domain | fureliza.com |
| Legal entity | Fur Eliza S.A.S. (Colombia) |
| Primary logo | Morning glory flower (golden, inner glow) + circular frame + "FUR ELIZA" |
| Monogram | F.E. (seals, wax, favicon, small applications) |
| Symbol | Flower alone (engravings, patterns, watermarks) |
| Tagline | "Lux Intra" (The light within) |
| Background | Off-black #121212 with subtle grain texture (2-4% noise SVG overlay) |
| Gold | Gradient: bronze #8B6914 -> gold #C5A028 -> pale gold #E8D48B |
| Text body | Soft gray #9CA3AF |
| Heading font | Playfair Display (serif, elegant) |
| Body font | Inter (sans-serif, minimal) |
| Audience | Men and women — organized by olfactory family and mood, never by gender |

### Logo Assets (existing)

Located in `fureliza/.jegx/media/`:
- Full logo with flower + circular frame + text
- F.E. monogram
- Standalone flower symbol
- Campaign visuals (ocean perfume, piano perfume)

---

## 3. Core Concept: Every Product Gets Its Own Animation

### The Pipeline

Every perfume in the catalog gets an immersive scroll-driven animation. This is economically viable because the process is automated:

```
1. GENERATE  -> Seedance 2.0 (or Kling/Luma): describe the perfume's emotion, get a video
2. EXTRACT   -> ffmpeg: extract sequential frames from video
3. OPTIMIZE  -> sharp/libavif: convert to AVIF (primary) + WebP (fallback)
4. DEPLOY    -> copy to /public/frames/{product-slug}/
5. REGISTER  -> add product to catalog data with metadata + emotional tags
6. AUTOMATIC -> the site generates the product page with its animation
```

### Automation Script

`scripts/process-hero.sh <product-slug> <video-file>`

This script:
- Extracts frames at target FPS (24-30fps for ~3-5 seconds of scroll content = 72-150 frames)
- Converts to AVIF with quality 50-60 (target: 20-40KB per frame)
- Generates WebP fallback
- Creates a manifest.json with frame count and total size
- Outputs to `/public/frames/{product-slug}/`

### Frame Budget

| Target | Value |
|--------|-------|
| Frames per product | 90-150 |
| Frame size (AVIF) | 20-40KB |
| Total per product | 2-6MB |
| Preload strategy | First 30 eager, rest lazy |
| Mobile | Fewer frames (every 2nd frame), lower resolution |

---

## 4. User Experience Flow

### Homepage

1. Black matte background with grain texture loads instantly
2. Logo appears with subtle gold glow animation
3. User scrolls -> first hero perfume animation begins (canvas frame scrubbing)
4. Text overlays with `mix-blend-mode: difference` describe the fragrance
5. Animation dissolves into product section
6. Product grid: elegant cards with staggered entrance, hover effects
7. Each card links to its own immersive product page
8. CTA section with frosted glass overlay
9. Footer with brand story

### Product Page (each perfume)

1. Full-screen canvas animation tied to scroll (unique per product)
2. Product details section: name, house, notes pyramid, price
3. Emotional description (the "story" of the fragrance)
4. Olfactory family tags
5. Add to cart / Buy via WhatsApp
6. Related fragrances

### Navigation

- Fixed navbar with glassmorphism on scroll (transparent -> frosted)
- Search bar (Phase 1: by name/family. Phase 2: by feeling)
- Cart icon with badge
- Currency toggle (COP/USD)

---

## 5. Product Organization

### NO gender sections. Instead:

**By Olfactory Family:**
- Deep Woods (amaderadas)
- Opulent Florals (florales)
- Vibrant Citrus (citricos)
- Ocean & Marine (acuaticos)
- Oriental & Spiced (orientales)

**By Mood/Intention:**
- Power & Presence
- Seduction & Mystery
- Energy & Clarity
- Comfort & Warmth

**By Search (Phase 2):**
- Name / notes / family (instant filters)
- Natural language ("quiero algo que huela a tormenta en el mar")

---

## 6. Tech Stack

### Frontend
- **Next.js 16** — SSR + client components, proven in WS.Store.Bags
- **React 19** — concurrent rendering
- **Tailwind CSS 4** — custom dark/gold theme
- **GSAP 3.14 + ScrollTrigger** — all scroll animations, canvas frame scrubbing

### Animation
- **HTML5 Canvas** — render frames per scroll position
- **CSS grain overlay** — SVG noise at 2-4% opacity for matte texture
- **CSS linear-gradient** — metallic gold effect
- **CSS text-shadow/drop-shadow** — embossed relief effect on logo/text

### State & Data
- **Zustand** — cart state, currency toggle
- **Static TypeScript data** (Phase 1) — product catalog with emotional tags
- **PostgreSQL + pgvector** (Phase 2) — when AI search requires it

### Payments (Colombia)
- **WhatsApp checkout** (Phase 1) — zero cost, builds personal trust
- **Wompi** (Phase 1.5) — cards, PSE, Nequi, QR Bancolombia
- **NOT Stripe** — doesn't operate directly in Colombia

### AI Search (Phase 2)
- **Claude API** (Anthropic) — interpret emotional descriptions
- **Emotional tags per product** — manually curated descriptors
- **Vercel AI SDK** — streaming UI responses
- NO vector database needed until 100+ products

### Asset Pipeline
- **Seedance 2.0 / Kling AI / Luma** — generate atmospheric videos per perfume
- **ffmpeg** — extract frames from video
- **sharp / libavif** — optimize to AVIF/WebP
- **Custom bash script** — automate the full pipeline

### Infrastructure
- **Vercel** (Phase 1) — instant Next.js deployment, free tier
- **Docker + VPS** (Phase 2) — self-hosting when needed

---

## 7. Phases

### Phase 1 — "The Black Card" (BUILD THIS FIRST)

**Goal:** A stunning website that makes people want to buy.

- [ ] Project setup: Next.js 16 + Tailwind 4 + GSAP
- [ ] Dark/gold theme: grain texture, metallic gradients, embossed effects
- [ ] Asset pipeline script: video -> frames -> optimize -> deploy
- [ ] Homepage with hero animation (first perfume)
- [ ] Product page template with scroll animation (reusable for all products)
- [ ] Product catalog (5-15 perfumes) — each with its own animation
- [ ] Product data with emotional tags
- [ ] Cart (Zustand) + WhatsApp checkout
- [ ] Responsive design (mobile + desktop)
- [ ] Navbar with glassmorphism
- [ ] Footer with brand story
- [ ] Performance: LCP < 2.5s, INP < 200ms
- [ ] Deploy to Vercel

### Phase 2 — "The Intelligence"

**Goal:** Smart search that understands emotions.

- [ ] Search by name / notes / family (filters, no AI needed)
- [ ] Search by feeling (Claude API + emotional tags)
- [ ] Wompi payment integration
- [ ] Product database (migrate from static data)

### Phase 3 — "The Full Experience"

**Goal:** The physical experience matches the digital one.

- [ ] Premium packaging: black matte box, EVA foam, gold hot stamp, wax seal
- [ ] Gratitude letter with high-gsm paper
- [ ] Special editions with 3D resin pieces
- [ ] Discovery sets / kits
- [ ] More products with animations (pipeline makes this easy)

### Phase 4 — "The House" (future)

**Goal:** Fur Eliza becomes its own perfume house.

- [ ] Own fragrance line
- [ ] Molecular layering products
- [ ] AI concierge (climate + personality -> perfume recommendation)
- [ ] Subscription model

---

## 8. What We Will NOT Do (Anti-Scope-Creep)

- No Medusa.js or headless e-commerce backend in Phase 1
- No database in Phase 1 (static data is enough for < 50 products)
- No Stripe (doesn't work in Colombia)
- No subscription model until Phase 4
- No manufacturing until Phase 4
- No dropshipping (hybrid fulfillment only: buy -> package with Fur Eliza branding -> ship)
- No vector database until 100+ products
- No complex admin panel — products managed via code in Phase 1

---

## 9. Product Data Structure

Each product in the catalog has:

```typescript
interface Product {
  slug: string;              // "megamare"
  name: string;              // "Megamare"
  house: string;             // "Orto Parisi"
  family: OlfactoryFamily;   // "ocean-marine"
  mood: Mood[];              // ["power", "mystery"]
  notes: {
    top: string[];           // ["sea salt", "seaweed"]
    heart: string[];         // ["ambergris", "musk"]
    base: string[];          // ["sea accord", "mineral"]
  };
  emotionalTags: string[];   // ["powerful", "dark", "salty", "abyssal", "industrial"]
  description: string;       // Poetic description for the product page
  price: {
    cop: number;             // 850000
    usd: number;             // 200
  };
  type: "full" | "decant";
  size: string;              // "50ml" or "5ml"
  frames: {
    directory: string;       // "/frames/megamare"
    count: number;           // 120
    format: "avif" | "webp";
  };
  images: {
    card: string;            // "/products/megamare-card.webp"
    hero: string;            // "/products/megamare-hero.webp"
  };
}
```

---

## 10. Performance Targets

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s |
| INP (Interaction to Next Paint) | < 200ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| Frame sequence per product | < 6MB |
| Initial page load | < 500KB (before frames) |
| Frame preload | First 30 eager, rest on scroll proximity |
| Mobile | Reduced frame count (skip every 2nd), lower resolution |
| `prefers-reduced-motion` | Disable scroll animations, show static hero image |

---

## 11. Legal Considerations (Colombia)

- **RUES:** Register as "Fur Eliza S.A.S." — verify homonimia first
- **SIC:** Trademark search for "Fur Eliza" in Nice Class 3 (perfumes)
- **INVIMA:** Required if manufacturing own fragrances (Phase 4 only)
- **Decants disclaimer:** "Fur Eliza es una entidad independiente. Este producto es un re-envasado autentico del perfume original, no afiliado ni patrocinado por [Marca]"
- **Andean regime:** First sale doctrine allows resale; repackaging requires care with brand identity

---

## 12. Reference Implementation

**WS.Store.Bags** (`/home/jegx/jegx/desktop/work/org/wendy_sarmiento/WS.Store.Bags/`)

This project provides proven patterns for:
- Canvas frame scrubbing with GSAP ScrollTrigger (`HeroScroll.tsx`)
- Reusable scroll animations (`AnimatedSection.tsx`)
- Product card stagger effects (`ProductCard.tsx`)
- Glassmorphic navbar (`Navbar.tsx`)
- CTA blur-materialize effect (`CTASection.tsx`)
- Cart state with Zustand (`cartStore.ts`)
- WhatsApp checkout URL generation

**Fur Eliza adapts these patterns** with:
- Dark theme (invert: white bg -> #121212 bg, dark text -> gold/gray text)
- Per-product frame directories (not one global hero)
- Richer product data (emotional tags, notes pyramid, family, mood)
- Product page template (new — WS.Store.Bags only has homepage)
- Multiple canvas instances (one per product page)
