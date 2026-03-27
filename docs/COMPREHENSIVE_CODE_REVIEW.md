# Fur Eliza — Comprehensive Code Review Report

**Date:** 2026-03-26
**Reviewed by:** Claude Opus 4.6 (4 parallel specialized agents)
**Scope:** Full codebase — frontend (Next.js 16), backend (Rust/Axum), infrastructure (Docker)

---

## Executive Summary

The Fur Eliza project demonstrates professional architecture choices: Next.js App Router, Zustand state management, GSAP animations, TypeScript strict mode, Rust microservice with Axum. However, the codebase has **12 critical issues**, **19 high-severity issues**, and **15+ medium/low issues** across security, type safety, performance, SEO, and backend readiness.

**The project CANNOT ship to production** without addressing at minimum the critical and high-severity items.

### Severity Counts

| Severity | Count | Categories |
|----------|-------|------------|
| CRITICAL | 12 | TypeScript errors, security credentials, broken schemas, DB exposure |
| HIGH | 19 | XSS risk, no security headers, price manipulation, GSAP cleanup, UX bugs |
| MEDIUM | 15 | Performance, a11y, code patterns, Docker config |
| LOW | 10 | Naming, scalability, minor inconsistencies |

---

## Table of Contents

1. [TypeScript Compilation Errors (BLOCKING)](#1-typescript-compilation-errors-blocking)
2. [Security Audit](#2-security-audit)
3. [Architecture & Code Quality](#3-architecture--code-quality)
4. [Performance](#4-performance)
5. [SEO](#5-seo)
6. [Accessibility](#6-accessibility)
7. [Backend (Rust)](#7-backend-rust)
8. [Infrastructure (Docker)](#8-infrastructure-docker)
9. [Prioritized Action Plan](#9-prioritized-action-plan)

---

## 1. TypeScript Compilation Errors (BLOCKING)

The project **does not compile**. `tsc --noEmit` reports 5 errors:

### CRIT-TS-1: `ProductJsonLd.tsx` — Accessing non-existent properties on `Product`

**Files:** `src/components/ProductJsonLd.tsx:22,38,43`

```
error TS2339: Property 'price' does not exist on type 'Product'.
error TS2339: Property 'size' does not exist on type 'Product'.
error TS2339: Property 'type' does not exist on type 'Product'.
```

**Root Cause:** `Product` was refactored to a multi-variant model (`variants: ProductVariant[]`), but `ProductJsonLd` still references old flat properties (`product.price`, `product.size`, `product.type`).

**Fix:** Use variants for pricing. Use `AggregateOffer` for multi-variant products:

```typescript
const primaryVariant = product.variants[0];
offers: {
  "@type": "AggregateOffer",
  priceCurrency: "COP",
  lowPrice: Math.min(...product.variants.map(v => v.price.cop)),
  highPrice: Math.max(...product.variants.map(v => v.price.cop)),
  offerCount: product.variants.length,
}
```

### CRIT-TS-2: `CollectionClient.tsx` — Incomplete `Record<>` types

**File:** `src/app/collection/CollectionClient.tsx:12,20`

```
error TS2741: Property '"gourmand-sweet"' is missing in Record<OlfactoryFamily, string>
error TS2739: Missing properties: innocence, rebellion in Record<Mood, string>
```

**Root Cause:** `OlfactoryFamily` added `"gourmand-sweet"` and `Mood` added `"innocence"` / `"rebellion"` in `product.ts`, but the label maps weren't updated.

**Fix:** Add the missing entries:

```typescript
const FAMILY_LABELS: Record<OlfactoryFamily, string> = {
  // ...existing...
  "gourmand-sweet": "Gourmand",
};

const MOOD_LABELS: Record<Mood, string> = {
  // ...existing...
  innocence: "Inocencia",
  rebellion: "Rebeldía",
};
```

---

## 2. Security Audit

### CRITICAL

| ID | Issue | File | CWE |
|----|-------|------|-----|
| SEC-C1 | Hardcoded DB password `secret_password` in docker-compose.yml | `backend/docker-compose.yml:12,27` | CWE-798 |
| SEC-C2 | Backend API bound to 0.0.0.0 with no auth, no CORS | `backend/main.rs:67` | CWE-284 |
| SEC-C3 | Real WhatsApp number hardcoded in client bundle | `src/store/cartStore.ts:33` | CWE-200 |

### HIGH

| ID | Issue | File | CWE |
|----|-------|------|-----|
| SEC-H1 | XSS via `dangerouslySetInnerHTML` + `JSON.stringify` in JSON-LD (no HTML escaping) | `ProductJsonLd.tsx:51`, `faq/page.tsx:81` | CWE-79 |
| SEC-H2 | Zero HTTP security headers (no CSP, no X-Frame-Options, no HSTS) | `next.config.ts` | CWE-16 |
| SEC-H3 | Client-side price manipulation — WhatsApp message includes tampered prices | `cartStore.ts:124` | CWE-602 |
| SEC-H4 | PostgreSQL port 5432 exposed to Docker host with weak password | `docker-compose.yml:29` | CWE-284 |
| SEC-H5 | `dotenv` crate has active RustSec advisory RUSTSEC-2021-0141 | `Cargo.toml:14` | — |

### MEDIUM

| ID | Issue | File |
|----|-------|------|
| SEC-M1 | `.gitignore` doesn't cover `backend/.env` or `backend/secrets/` | `.gitignore` |
| SEC-M2 | No cart quantity upper bound — can set quantity to `MAX_SAFE_INTEGER` | `cartStore.ts:77` |
| SEC-M3 | Health endpoint leaks internal service name `catalog-core` | `main.rs:77` |
| SEC-M4 | npm audit: Next.js 16.1.6 has 5 moderate vulnerabilities | `package.json` |

### Recommended Security Headers (add to `next.config.ts`):

```typescript
async headers() {
  return [{
    source: "/(.*)",
    headers: [
      { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ],
  }];
}
```

---

## 3. Architecture & Code Quality

### CRITICAL

| ID | Issue | File |
|----|-------|------|
| ARC-C1 | `products[0]` accessed without null guard — throws if array is empty | `app/page.tsx:14` |
| ARC-C2 | Cart total uses wrong `formatPrice` arguments + stale closure | `CartDrawer.tsx:19,221-224` |

### HIGH

| ID | Issue | File |
|----|-------|------|
| ARC-H1 | Zustand `totalItems()`/`totalPrice()` as store methods causes full-store re-renders | `cartStore.ts:27-30`, `Navbar.tsx:11` |
| ARC-H2 | `ScrollTrigger.getAll().forEach(t.kill())` nukes ALL scroll animations globally | `HeroScroll.tsx:174-176` |
| ARC-H3 | `AnimatedSection` `opacity: 0` inline style = invisible forever if GSAP fails | `AnimatedSection.tsx:53` |
| ARC-H4 | `ProductCard` same `opacity-0` problem — cards invisible if GSAP fails | `ProductCard.tsx:64` |
| ARC-H5 | 3 different WhatsApp numbers (2 placeholder, 1 real) across codebase | `CTAWhatsApp.tsx:5`, `Footer.tsx:49`, `cartStore.ts:33` |
| ARC-H6 | Toast message in English ("added to cart") on a fully Spanish site | `Toast.tsx:42` |
| ARC-H7 | Footer hash links (`#collection`, `#about`) broken on non-homepage routes | `Footer.tsx:42-43` |
| ARC-H8 | "Desde" price label uses first variant (not cheapest) | `ProductCard.tsx:96-101` |

### MEDIUM

| ID | Issue | File |
|----|-------|------|
| ARC-M1 | GSAP class selectors are global — breaks with multiple HeroScroll instances | `HeroScroll.tsx:96-166` |
| ARC-M2 | `"use client"` on hook file is non-standard | `useReducedMotion.ts:1` |
| ARC-M3 | `registerPlugin` at module level may execute during SSR | `lib/gsap.ts:7` |
| ARC-M4 | Array index used as React key in Accordion | `Accordion.tsx:23` |
| ARC-M5 | Sticky CTA and main button have independent `added` state | `StickyAddToCart.tsx` vs `ProductPageClient.tsx` |
| ARC-M6 | Skip-nav target is `<div>` not `<main>` — not focusable | `layout.tsx:55-59` |
| ARC-M7 | Variant sort ignores `"sample"` type ordering | `ProductPageClient.tsx:31-34` |
| ARC-M8 | Mixed GSAP patterns: `useGSAP` in FragranceMeter, manual `useEffect` everywhere else | Multiple |
| ARC-M9 | Footer entirely "use client" just for a GSAP fade animation | `Footer.tsx` |

---

## 4. Performance

### Critical Performance Issues

| ID | Issue | Impact | File |
|----|-------|--------|------|
| PERF-1 | HeroScroll fires 120 HTTP requests simultaneously on mount | 3.6-12MB bandwidth, blocks LCP | `HeroScroll.tsx:51-72` |
| PERF-2 | Canvas has no explicit dimensions — CLS risk on resize | Layout shift | `HeroScroll.tsx:184-190` |
| PERF-3 | No `<Image priority>` anywhere — no LCP optimization hints | Slow LCP | All pages |
| PERF-4 | GSAP imported both statically (`lib/gsap.ts`) and dynamically — double bundling | +89KB JS | Multiple |
| PERF-5 | Hero h1 starts `opacity: 0`, animated by GSAP after 0.3s delay — delays LCP text | LCP delay | `HeroScroll.tsx:210` |
| PERF-6 | `font-display: swap` causes FOUT/CLS | Layout shift | `layout.tsx:8,14` |

### Re-render Issues

| ID | Issue | File |
|----|-------|------|
| PERF-R1 | `Navbar` subscribes to full store, re-renders on every cart change | `Navbar.tsx:11` |
| PERF-R2 | `CartDrawer` calls `totalPrice()` synchronously on every render | `CartDrawer.tsx:19` |
| PERF-R3 | Two independent scroll listeners (`Navbar` + `StickyAddToCart`) for visibility | `Navbar.tsx:14`, `StickyAddToCart.tsx:18` |

### Bundle Bloat

| Issue | Impact |
|-------|--------|
| Every page component is effectively client-rendered (all children are "use client") | No SSR benefit from App Router |
| `Footer.tsx` and `CTAWhatsApp.tsx` are "use client" for animation only | Static HTML unnecessarily shipped as JS |
| GSAP core (~67KB) + ScrollTrigger (~22KB) gzipped | ~89KB animation library |
| All product data serialized across server/client boundary | Scales poorly with catalog growth |

---

## 5. SEO

### CRITICAL SEO Issues

| ID | Issue | File |
|----|-------|------|
| SEO-C1 | Product JSON-LD outputs `undefined` for price, size, type — fails Rich Results Test | `ProductJsonLd.tsx:22,38,43` |
| SEO-C2 | ProductJsonLd rendered inside "use client" boundary — NOT in initial HTML for Googlebot | `ProductPageClient.tsx` |
| SEO-C3 | Homepage has no `<h1>` in server-rendered HTML (HeroScroll h1 is client-only, opacity-0) | `page.tsx` |

### HIGH SEO Issues

| ID | Issue | File |
|----|-------|------|
| SEO-H1 | Product descriptions in English on a Spanish site — mixed-language content | `products.ts:39,94` |
| SEO-H2 | Two h1 elements on product pages (HeroScroll + detail section) | `ProductPageClient.tsx` |
| SEO-H3 | No `alternates.canonical` on any page | All pages |
| SEO-H4 | OG images missing on About, FAQ, Legal, Collection pages | Multiple |
| SEO-H5 | `/legal` page is a true orphan — zero navigation links to it | All navs |
| SEO-H6 | `/faq` only in mobile nav, not desktop | `Navbar.tsx` |
| SEO-H7 | Footer anchor links broken on non-homepage routes | `Footer.tsx:42-43` |

### MEDIUM SEO Issues

| ID | Issue | File |
|----|-------|------|
| SEO-M1 | `lastModified: new Date()` in sitemap always signals "changed" | `sitemap.ts` |
| SEO-M2 | No Organization/LocalBusiness schema | Missing |
| SEO-M3 | No BreadcrumbList schema on product pages | Missing |
| SEO-M4 | Missing accents: "Coleccion" → "Colección", "traves" → "través" | Multiple |
| SEO-M5 | OG image dimensions declared as 1200x630 regardless of actual size | `perfume/[slug]/page.tsx` |
| SEO-M6 | No explicit homepage metadata export (relies on layout defaults) | `page.tsx` |

---

## 6. Accessibility

| ID | Severity | Issue | File |
|----|----------|-------|------|
| A11Y-1 | HIGH | `<canvas>` in HeroScroll has no `aria-label` or fallback text | `HeroScroll.tsx:184-190` |
| A11Y-2 | HIGH | Skip-nav target is `<div>` not focusable `<main>` | `layout.tsx:55-59` |
| A11Y-3 | HIGH | Content invisible forever if GSAP fails (AnimatedSection, ProductCard, Footer) | Multiple |
| A11Y-4 | MEDIUM | Footer columns start `opacity-0` — CLS risk + invisible if GSAP fails | `Footer.tsx:31,39,47` |
| A11Y-5 | LOW | Array index as key in Accordion — may cause wrong state on reorder | `Accordion.tsx:23` |

---

## 7. Backend (Rust)

### Production Readiness: NOT READY

| Area | Status |
|------|--------|
| Database connectivity | NOT IMPLEMENTED (mock only) |
| CORS middleware | MISSING |
| Authentication/Authorization | MISSING |
| Request logging middleware | MISSING |
| Error handling | Panics via `.unwrap()` |
| Input validation | MISSING |
| Database migrations | MISSING |
| Rate limiting | MISSING |
| `GET /products/:id` route | MISSING |

### Critical Backend Issues

| ID | Issue | File |
|----|-------|------|
| BE-C1 | `AppState.db` (PgPool) is commented out — no DB connection | `main.rs:46-48` |
| BE-C2 | `dotenv 0.15` has RUSTSEC-2021-0141 advisory — use `dotenvy` | `Cargo.toml:14` |
| BE-C3 | `.unwrap()` on bind/serve — crashes on port conflict | `main.rs:70-71` |
| BE-C4 | `alpine:3.18` runtime is EOL (May 2025) — no security patches | `Dockerfile:24` |

### Important Backend Issues

| ID | Issue | File |
|----|-------|------|
| BE-I1 | No CORS layer — browser requests will be blocked | `main.rs:61-64` |
| BE-I2 | No `TraceLayer` for request logging | `main.rs:61-64` |
| BE-I3 | `VariantFormat` enum serializes as PascalCase, not snake_case | `main.rs:36-41` |
| BE-I4 | `price_usd: i64` — no denomination indicator | `main.rs:31-32` |
| BE-I5 | `size: String` is free-form, no validation | `main.rs:29` |
| BE-I6 | `tracing_subscriber::fmt::init()` ignores `RUST_LOG` env filter | `main.rs:53` |
| BE-I7 | Rust 1.81 builder image is ~12 versions behind | `Dockerfile:2` |
| BE-I8 | No healthcheck for catalog-service in Docker Compose | `docker-compose.yml` |
| BE-I9 | Non-root user created after COPY — wrong ordering | `Dockerfile:32-37` |
| BE-I10 | No `GET /products/:id` route | `main.rs` |

---

## 8. Infrastructure (Docker)

| ID | Severity | Issue | File |
|----|----------|-------|------|
| INF-1 | CRITICAL | Hardcoded `secret_password` in compose file | `docker-compose.yml:12,27` |
| INF-2 | CRITICAL | Both API (8080) and DB (5432) ports exposed to host | `docker-compose.yml:9,29` |
| INF-3 | HIGH | No `.dockerignore` for Rust build context | `catalog-service/` |
| INF-4 | HIGH | Alpine 3.18 EOL — no security patches | `Dockerfile:24` |
| INF-5 | MEDIUM | No healthcheck for catalog-service | `docker-compose.yml` |
| INF-6 | LOW | Rust 1.81 pinned, ~12 releases behind | `Dockerfile:2` |

---

## 9. Prioritized Action Plan

### Phase 1: BLOCKING — Must Fix Before Build Works

1. **Fix `ProductJsonLd.tsx`** — use `product.variants[0]` for price, size, type
2. **Fix `CollectionClient.tsx`** — add missing `"gourmand-sweet"`, `"innocence"`, `"rebellion"` entries
3. **Run `npm audit fix`** — patch Next.js moderate vulnerabilities

### Phase 2: CRITICAL — Must Fix Before Any Deployment

4. **Remove hardcoded DB password** from `docker-compose.yml` → use `.env` file + `.gitignore`
5. **Remove exposed ports** (5432 for DB, consider 8080 for API) from Docker Compose
6. **Move WhatsApp number** to `NEXT_PUBLIC_WHATSAPP_NUMBER` env var, unify all 3 occurrences
7. **Add HTTP security headers** in `next.config.ts`
8. **Escape HTML in JSON-LD** — create `safeJsonLd()` helper
9. **Add null guard** for `products[0]` on homepage

### Phase 3: HIGH — Must Fix Before Production Launch

10. **Move ProductJsonLd** to server component (outside "use client" boundary)
11. **Fix HeroScroll cleanup** — track own ScrollTrigger instances instead of `getAll().kill()`
12. **Add GSAP failure fallbacks** — CSS `@media (prefers-reduced-motion: reduce)` reset, try/catch
13. **Fix cart total** `formatPrice` arguments and stale closure issue
14. **Unify WhatsApp numbers** — single shared constant
15. **Fix Footer links** — use `<Link href="/collection">` instead of `#collection`
16. **Translate Toast** to Spanish ("agregado al carrito")
17. **Translate product descriptions** to Spanish
18. **Fix ProductCard** "Desde" to use cheapest variant
19. **Add `<h1>`** to homepage that is visible in server HTML
20. **Add canonical URLs** to all pages
21. **Link `/legal` and `/faq`** from navigation/footer
22. **Add CORS middleware** to Rust backend
23. **Replace `dotenv` with `dotenvy`** in Cargo.toml
24. **Upgrade Alpine** to 3.21+ in Dockerfile
25. **Add cart quantity maximum** (e.g., 99)

### Phase 4: MEDIUM — Should Fix Before v1.0

26. **Optimize Zustand subscriptions** — use targeted selectors
27. **Throttle HeroScroll image loading** — use `requestIdleCallback` for frames 30-120
28. **Set explicit canvas dimensions** to prevent CLS
29. **Add `<Image priority>`** to LCP images
30. **Unify GSAP import pattern** — standardize on `useGSAP` or dynamic import
31. **Make Footer a server component** with thin client animation leaf
32. **Add Organization JSON-LD** schema
33. **Fix sitemap `lastModified`** — use static dates
34. **Add `aria-label`** to HeroScroll canvas
35. **Add request logging** (`TraceLayer`) to Rust backend
36. **Wire up `PgPool`** in `AppState`
37. **Add `.dockerignore`** for Rust build
38. **Add env filter** for `RUST_LOG` in tracing subscriber
39. **Add healthcheck** for catalog-service in Docker Compose

---

## npm Audit Results

```
next 16.0.0-beta.0 - 16.1.6
Severity: moderate
- HTTP request smuggling in rewrites (GHSA-ggv3-7p47-pfv8)
- Unbounded next/image disk cache growth (GHSA-3x4c-7xq6-9pq8)
- Unbounded postponed resume buffering DoS (GHSA-h27x-g6w4-24gq)
- Null origin can bypass Server Actions CSRF checks (GHSA-mq59-m269-xvcx)
- Null origin can bypass dev HMR websocket CSRF checks (GHSA-jcc7-9wpm-mj36)

Fix: npm audit fix
```

---

*Report generated by 4 parallel specialized review agents analyzing architecture, security, performance, SEO, accessibility, type safety, and backend readiness.*
