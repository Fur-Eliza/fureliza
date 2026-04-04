# Fur Eliza — Project Guide

## What
Luxury niche perfume ecommerce. Beethoven-inspired brand. WhatsApp-first checkout in Colombia. Dark luxury aesthetic with gold accents.

## Tech Stack
- **Framework**: Next.js 16 (App Router) + TypeScript strict + Tailwind CSS 4
- **Animations**: GSAP (ScrollTrigger, ScrollSmoother, SplitText) — see `.claude/rules/gsap.md`
- **State**: Zustand 5 — **always** use selectors: `useCartStore(s => s.items)` not `useCartStore()`
- **Pipeline**: OpenRouter (text) + fal.ai (video) + FFmpeg (frames) — see `.claude/rules/pipeline.md`
- **Package Manager**: npm (lockfile: package-lock.json)

## Project Structure
```
src/app/          — Next.js App Router pages (home, collection, perfume/[slug], about, faq, legal)
src/components/   — Shared components (HeroScroll, Navbar, CartDrawer, Footer, etc.)
src/store/        — Zustand cart store (COP/USD, WhatsApp checkout URL)
src/types/        — Product, Variant, OlfactoryFamily, Mood types
src/data/         — Static product data (2 products currently)
src/lib/          — constants.ts (safeJsonLd, WHATSAPP_NUMBER), gsap.ts (plugin registration)
scripts/          — El Compositor pipeline (generate-product, generate-video, extract-frames)
backend/          — Rust/Axum catalog-service scaffold + Docker
docs/             — Vision, plans, research, guides
```

## Critical Patterns

### Zustand
- Always selectors: `useCartStore(s => s.addItem)` — never destructure the whole store
- `totalPrice()` computes inline — never store derived state (stale closure bug)

### Product Data Model
- Products have `variants[]` (decant/full/sample) — never a single price
- `retailPrice?` enables psychological pricing (crossed-out, "Ahorra X%", per-day cost)
- Variable frame count: `frames.directory` + `frames.count` + `frames.format`

### Shell Environment
- CWD resets to `fureliza/fureliza` — use `cd /home/jegx/jegx/desktop/work/org/fureliza &&` prefix
- Project root: `/home/jegx/jegx/desktop/work/org/fureliza/`

## Commands
```bash
npm run dev                                      # Dev server (Turbopack)
npm run build                                    # Production build
npx tsc --noEmit                                 # Type check (must pass clean)
npm run generate "Name" "House"                  # AI product data via OpenRouter
npm run video photo.jpg slug [style]             # AI video via fal.ai
npm run frames video.mp4 slug [150] [75]         # FFmpeg frame extraction
npm run pipeline "Name" "House" [photo] [style]  # All three in one command
```

## Language
- User-facing text: **Spanish** (Colombian es_CO). Accents matter: Colección, Información, Política
- Code/comments: **English**

## Domain Rules (loaded on demand)
- `.claude/rules/gsap.md` — GSAP patterns, try/catch, cleanup, reduced-motion
- `.claude/rules/seo.md` — JSON-LD, canonical URLs, sitemap
- `.claude/rules/security.md` — CSP, safeJsonLd, env vars
- `.claude/rules/accessibility.md` — skip-nav, focus rings, ARIA
- `.claude/rules/pipeline.md` — El Compositor: OpenRouter, fal.ai, FFmpeg
