# Fur Eliza — Project Guide

## Project Overview
Luxury niche perfume ecommerce. Beethoven-inspired brand ("Für Elise" → "Fur Eliza"). WhatsApp-first checkout in Colombia. Dark luxury aesthetic with gold accents.

## Tech Stack
- **Framework**: Next.js 16 (App Router) + TypeScript strict + Tailwind CSS 4
- **Animations**: GSAP (ScrollTrigger, ScrollSmoother, SplitText) — all free since 2025
- **State**: Zustand 5 with selector pattern to prevent unnecessary re-renders
- **Backend**: Rust/Axum (catalog-service scaffold), PostgreSQL via Docker
- **Package Manager**: npm (lockfile: package-lock.json)

## Project Structure
```
scripts/
├── extract-frames.sh       # FFmpeg: video → 150 desktop + 75 mobile WebP frames
├── generate-product.ts     # OpenRouter AI: fragrance name → full Product TypeScript object
├── generate-video.ts       # fal.ai: product photo → cinematic AI video (7 styles)
├── pipeline.sh             # Master: generate + video + frames in one command
└── tsconfig.json           # TypeScript config for scripts
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (fonts, JSON-LD, skip-nav)
│   ├── page.tsx            # Homepage (HeroScroll + collection + CTA)
│   ├── collection/         # Collection with filters (family + mood)
│   ├── perfume/[slug]/     # Product detail (120-frame scroll, variants)
│   ├── about/              # Brand story + philosophy
│   ├── faq/                # FAQ with accordion + JSON-LD
│   ├── legal/              # Terms, privacy, returns
│   ├── globals.css         # Theme variables, grain overlay, animations
│   ├── sitemap.ts          # Dynamic sitemap
│   └── robots.ts           # Robots.txt
├── components/             # Shared components
│   ├── HeroScroll.tsx      # 120-frame canvas scroll animation (core)
│   ├── Navbar.tsx          # Navigation + mobile hamburger
│   ├── CartDrawer.tsx      # Slide-out cart with WhatsApp checkout
│   ├── ProductCard.tsx     # Product grid card with "Desde" price
│   ├── SmoothScroll.tsx    # Global ScrollSmoother wrapper (layout.tsx)
│   ├── SplitTitle.tsx      # GSAP SplitText character-by-character animation
│   ├── AnimatedSection.tsx # GSAP fade/blur/scale wrapper
│   ├── Footer.tsx          # Footer with GSAP column animations
│   ├── CTAWhatsApp.tsx     # Frosted glass WhatsApp CTA section
│   ├── ProductJsonLd.tsx   # AggregateOffer JSON-LD for SEO
│   ├── FragranceMeter.tsx  # Intensity/projection/longevity bars
│   ├── StickyAddToCart.tsx  # Mobile sticky add-to-cart bar
│   ├── RelatedProducts.tsx # Cross-selling related fragrances
│   ├── Accordion.tsx       # FAQ accordion component
│   └── Toast.tsx           # "Agregado al carrito" notification
├── store/cartStore.ts      # Zustand cart (COP/USD, WhatsApp URL builder)
├── lib/
│   ├── constants.ts        # WHATSAPP_NUMBER, MAX_CART_QUANTITY, safeJsonLd()
│   └── gsap.ts             # Centralized GSAP plugin registration
├── data/products.ts        # Static product data (2 products currently)
├── types/product.ts        # Product, Variant, OlfactoryFamily, Mood types
└── hooks/useReducedMotion.ts
backend/
├── services/catalog-service/  # Rust/Axum (scaffold with mock data)
├── docker-compose.yml         # Postgres + catalog-service
└── .env.example               # Required env vars
docs/
├── VISION.md                  # Brand vision + 5-phase roadmap
├── TECH_RESEARCH.md           # Technology research (15 sections)
├── COMPREHENSIVE_CODE_REVIEW.md
├── THE_ONYX_PROTOCOL.md       # Future Nx monorepo architecture
├── FUR_ELIZA_MASTER_PLAN.md   # Original strategy
└── plans/                     # Design and implementation plans
```

## Key Patterns & Gotchas

### GSAP in Next.js
- **Always** use `"use client"` for any component with GSAP
- **Always** wrap GSAP in try/catch with fallback (GSAP may fail to load with adblockers)
- **Always** add `gsap-animated` CSS class for `prefers-reduced-motion` fallback
- **Never** use `ScrollTrigger.killAll()` — kill only the component's own triggers
- Register plugins once in `src/lib/gsap.ts` with `typeof window !== "undefined"` guard
- Use `useGSAP()` from `@gsap/react` for automatic cleanup
- **ScrollSmoother** wraps all content via `SmoothScroll.tsx` in root layout
- **SplitText** is used via `SplitTitle.tsx` — reverts on cleanup to avoid DOM issues
- All premium plugins (ScrollSmoother, SplitText, MorphSVG) are free since 2025

### View Transitions
- Enabled via `experimental.viewTransition: true` in `next.config.ts`
- CSS animations defined in `globals.css` (fade + blur transition)
- GPU-accelerated, ~78% browser support (March 2026)
- Progressive enhancement: works without transitions on unsupported browsers

### Zustand Store
- **Always** use selectors: `useCartStore(s => s.items)` not `useCartStore()`
- Cart computes `totalPrice()` inline — never store derived state in a variable (stale closure bug)
- WhatsApp checkout URL uses `formatPrice()` from the store for consistency

### Product Data Model
- Products have `variants[]` (decant/full/sample) — never a single price
- Cheapest variant determines "Desde $X" display price
- `retailPrice?` enables psychological pricing (crossed-out retail, "Ahorra X%", per-day cost)
- `emotionalTags` and `mood` drive the future AI quiz recommendation engine
- Variable frame count per product: `frames.directory` + `frames.count` + `frames.format` (HeroScroll reads count dynamically)

### Security
- `safeJsonLd()` in `src/lib/constants.ts` — use for ALL JSON-LD to prevent XSS
- CSP headers in `next.config.ts` — update `connect-src` when adding new APIs
- WhatsApp number from env var `NEXT_PUBLIC_WHATSAPP_NUMBER` with fallback
- Never commit `.env` files (patterns in `.gitignore`)

### SEO
- Every page needs `alternates: { canonical: "/path" }` in metadata
- Product pages use `ProductJsonLd` (AggregateOffer schema) in server component
- FAQ page uses FAQPage JSON-LD schema
- Root layout has Organization JSON-LD

### Accessibility
- Skip-nav link in root layout targets `#main-content`
- `prefers-reduced-motion` CSS kills all animations and makes GSAP elements visible
- All interactive elements have focus-visible outlines (gold color)
- Canvas elements need `aria-label` and `role="img"`

### Shell Environment
- CWD resets to `fureliza/fureliza` — always use absolute paths or `cd /home/jegx/jegx/desktop/work/org/fureliza &&` prefix
- Project root: `/home/jegx/jegx/desktop/work/org/fureliza/`

## Commands
```bash
# Development
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npx tsc --noEmit     # Type check (must pass clean)

# El Compositor Pipeline (product automation)
npm run generate "Name" "House"              # Generate product data via OpenRouter AI
npm run video photo.jpg slug [style]         # Generate AI video via fal.ai (styles: hero|orbit|macro|mood|transform|floating|water)
npm run frames video.mp4 slug [150] [75]     # Extract WebP scroll frames via FFmpeg
npm run pipeline "Name" "House" [photo] [style]  # All three in one command
```

### El Compositor Pipeline
- **Text generation**: OpenRouter API (default: Gemini 2.5 Flash). Env: `OPENROUTER_API_KEY`
- **Video generation**: fal.ai (default: Kling Turbo). Env: `FAL_KEY`. 7 cinematic styles with curated prompts
- **Frame extraction**: FFmpeg local. Outputs 150 desktop + 75 mobile WebP frames + manifest.json
- **Fragrance data**: Optional Fragella API ($12/mo, 74K+ fragrances). Env: `FRAGELLA_API_KEY`
- See `docs/AI_VIDEO_GENERATION_GUIDE.md` for prompt templates, camera movements, lighting vocabulary

## Language
- All user-facing text is in **Spanish** (Colombian locale es_CO)
- Code comments and variable names in **English**
- Accents matter: Colección, Información, Política (not Coleccion, Informacion, Politica)
