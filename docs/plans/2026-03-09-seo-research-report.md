# SEO Best Practices for Ecommerce & Luxury Brands (2025-2026)

## Comprehensive Research Report for Fur Eliza

**Date:** March 9, 2026
**Scope:** Ecommerce SEO, Luxury Brand Strategy, Next.js Implementation, Colombia Market

---

## Table of Contents

1. [Schema.org Structured Data for Product Pages](#1-schemaorg-structured-data-for-product-pages)
2. [Meta Tags Strategy for Luxury Ecommerce](#2-meta-tags-strategy-for-luxury-ecommerce)
3. [Open Graph / Twitter Cards Best Practices](#3-open-graph--twitter-cards-best-practices)
4. [Core Web Vitals Targets for 2026](#4-core-web-vitals-targets-for-2026)
5. [Image SEO (AVIF, WebP, Alt Text)](#5-image-seo-avif-webp-alt-text)
6. [Internal Linking Strategy](#6-internal-linking-strategy)
7. [Sitemap Best Practices for Next.js](#7-sitemap-best-practices-for-nextjs)
8. [robots.txt Recommendations](#8-robotstxt-recommendations)
9. [International SEO (Colombia Market)](#9-international-seo-colombia-market)
10. [Rich Snippets & Featured Snippets Optimization](#10-rich-snippets--featured-snippets-optimization)
11. [Next.js-Specific SEO Implementation](#11-nextjs-specific-seo-implementation)
12. [AI Search Optimization (GEO)](#12-ai-search-optimization-geo)
13. [Actionable Implementation Checklist](#13-actionable-implementation-checklist)

---

## 1. Schema.org Structured Data for Product Pages

### 1.1 Product Schema (Required for Every Product Page)

Google requires `name` and `image` properties at minimum, plus at least one of: `offers`, `review`, or `aggregateRating`. For Shopping rich results, `Offer` must include `price`, `priceCurrency` (ISO 4217), and `availability`.

**Recommended JSON-LD structure for a perfume product page:**

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Fur Eliza Eau de Parfum - Rosa Silvestre 100ml",
  "image": [
    "https://fureliza.com/images/rosa-silvestre-front.avif",
    "https://fureliza.com/images/rosa-silvestre-angle.avif",
    "https://fureliza.com/images/rosa-silvestre-box.avif"
  ],
  "description": "Una fragancia floral colombiana con notas de rosa silvestre, jazmín y madera de sándalo. Eau de Parfum de larga duración, 100ml.",
  "brand": {
    "@type": "Brand",
    "name": "Fur Eliza"
  },
  "sku": "FE-RS-100",
  "gtin13": "7701234567890",
  "color": "Dorado",
  "category": "Fragancias > Eau de Parfum > Floral",
  "material": "Eau de Parfum",
  "weight": {
    "@type": "QuantitativeValue",
    "value": "100",
    "unitCode": "MLT"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://fureliza.com/productos/rosa-silvestre-100ml",
    "priceCurrency": "COP",
    "price": "350000",
    "priceValidUntil": "2026-12-31",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "seller": {
      "@type": "Organization",
      "name": "Fur Eliza"
    },
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingDestination": {
        "@type": "DefinedRegion",
        "addressCountry": "CO"
      },
      "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "handlingTime": {
          "@type": "QuantitativeValue",
          "minValue": 1,
          "maxValue": 2,
          "unitCode": "d"
        },
        "transitTime": {
          "@type": "QuantitativeValue",
          "minValue": 2,
          "maxValue": 5,
          "unitCode": "d"
        }
      }
    },
    "hasMerchantReturnPolicy": {
      "@type": "MerchantReturnPolicy",
      "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
      "merchantReturnDays": 30,
      "returnMethod": "https://schema.org/ReturnByMail"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "bestRating": "5",
    "worstRating": "1",
    "reviewCount": "127",
    "ratingCount": "145"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "María López"
      },
      "datePublished": "2026-01-15",
      "reviewBody": "Una fragancia exquisita que dura todo el día...",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      }
    }
  ]
}
```

### 1.2 ProductGroup Schema (For Perfume Variants - Size/Concentration)

Google added support for `ProductGroup` with `hasVariant` (February 2024), making this critical for perfume products sold in multiple sizes (30ml, 50ml, 100ml).

```json
{
  "@context": "https://schema.org",
  "@type": "ProductGroup",
  "name": "Fur Eliza Rosa Silvestre Eau de Parfum",
  "description": "Fragancia floral colombiana con notas de rosa silvestre.",
  "brand": {
    "@type": "Brand",
    "name": "Fur Eliza"
  },
  "productGroupID": "FE-RS",
  "variesBy": ["https://schema.org/size"],
  "url": "https://fureliza.com/productos/rosa-silvestre",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127"
  },
  "hasVariant": [
    {
      "@type": "Product",
      "name": "Rosa Silvestre EDP 30ml",
      "sku": "FE-RS-030",
      "size": "30ml",
      "offers": {
        "@type": "Offer",
        "price": "150000",
        "priceCurrency": "COP",
        "availability": "https://schema.org/InStock",
        "url": "https://fureliza.com/productos/rosa-silvestre?size=30ml"
      }
    },
    {
      "@type": "Product",
      "name": "Rosa Silvestre EDP 50ml",
      "sku": "FE-RS-050",
      "size": "50ml",
      "offers": {
        "@type": "Offer",
        "price": "230000",
        "priceCurrency": "COP",
        "availability": "https://schema.org/InStock",
        "url": "https://fureliza.com/productos/rosa-silvestre?size=50ml"
      }
    },
    {
      "@type": "Product",
      "name": "Rosa Silvestre EDP 100ml",
      "sku": "FE-RS-100",
      "size": "100ml",
      "offers": {
        "@type": "Offer",
        "price": "350000",
        "priceCurrency": "COP",
        "availability": "https://schema.org/InStock",
        "url": "https://fureliza.com/productos/rosa-silvestre?size=100ml"
      }
    }
  ]
}
```

### 1.3 Additional Required Schema Types

| Schema Type | Where to Use | Priority |
|---|---|---|
| **BreadcrumbList** | All pages | Critical |
| **Organization** | Layout / Homepage | Critical |
| **Product + Offer** | Every product page | Critical |
| **ProductGroup** | Products with variants | High |
| **AggregateRating** | Product pages with reviews | High |
| **FAQPage** | Product pages, category pages | Medium |
| **WebSite** (with SearchAction) | Homepage | Medium |
| **CollectionPage** | Category/collection pages | Medium |
| **VideoObject** | Pages with product videos | Low-Medium |

### 1.4 BreadcrumbList Example

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": "https://fureliza.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Fragancias",
      "item": "https://fureliza.com/fragancias"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Eau de Parfum",
      "item": "https://fureliza.com/fragancias/eau-de-parfum"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Rosa Silvestre"
    }
  ]
}
```

### 1.5 Organization Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Fur Eliza",
  "url": "https://fureliza.com",
  "logo": "https://fureliza.com/images/logo.svg",
  "description": "Casa de fragancias artesanales colombianas.",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "CO",
    "addressRegion": "Cundinamarca",
    "addressLocality": "Bogotá"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": "Spanish"
  },
  "sameAs": [
    "https://www.instagram.com/fureliza",
    "https://www.facebook.com/fureliza",
    "https://www.tiktok.com/@fureliza"
  ]
}
```

**Sources:**
- [Google: Structured Data for Ecommerce](https://developers.google.com/search/docs/specialty/ecommerce/include-structured-data-relevant-to-ecommerce)
- [Google: Product Variant Structured Data](https://developers.google.com/search/docs/appearance/structured-data/product-variants)
- [Google: Intro to Product Structured Data](https://developers.google.com/search/docs/appearance/structured-data/product)
- [Schema.org Product Type](https://schema.org/Product)
- [ResultFirst: 7 Ecommerce Schema Markups 2026](https://www.resultfirst.com/blog/ecommerce-seo/ecommerce-schema-markups/)
- [Koanthic: E-commerce Schema Markup Guide 2026](https://koanthic.com/en/e-commerce-schema-markup-complete-guide-examples-2026/)

---

## 2. Meta Tags Strategy for Luxury Ecommerce

### 2.1 Title Tag Rules

- **Length:** 50-60 characters (max ~580px width)
- **Format for product pages:** `[Product Name] [Key Attribute] | Fur Eliza`
- **Format for category pages:** `[Category Name] - Fragancias Artesanales | Fur Eliza`
- **Format for homepage:** `Fur Eliza | Fragancias Artesanales Colombianas`
- **Place primary keyword at the beginning** of the title
- **Luxury brands can use shorter, punchier titles** (30-40 characters) to stand out

**Examples:**
```
Rosa Silvestre Eau de Parfum 100ml | Fur Eliza
Fragancias Florales para Mujer | Fur Eliza
Fur Eliza | Casa de Fragancias Artesanales
```

### 2.2 Meta Description Rules

- **Length:** 140-160 characters
- **Not a ranking signal** but critical for CTR (functions as marketing copy)
- **Include:** unique selling proposition, emotional appeal, call to action
- **Note:** Search engines override 62%+ of meta descriptions in 2026 with AI-generated snippets. Write them to be compelling enough that Google keeps them.

**Examples:**
```
Descubre Rosa Silvestre, una fragancia floral con esencia colombiana. Notas de rosa, jazmín y sándalo. Envío gratis a toda Colombia. ✦ Fur Eliza
```

### 2.3 Luxury-Specific Meta Tag Strategy

| Element | Strategy | Rationale |
|---|---|---|
| **Brand name** | Always include in title tag | Brand recognition drives luxury CTR |
| **Exclusivity language** | Use words like "artesanal," "edición," "colección" | Conveys luxury positioning |
| **Sensory keywords** | Describe scent profiles in descriptions | Matches how luxury shoppers search |
| **Price anchoring** | Do NOT include price in meta description for luxury | Luxury buyers search by brand/quality, not price |
| **E-E-A-T signals** | Author expertise, brand story mentions | Google prioritizes authoritative luxury content |

### 2.4 Essential HTML Meta Tags

```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://fureliza.com/productos/rosa-silvestre" />
<meta name="theme-color" content="#1a1a1a" />
<meta name="format-detection" content="telephone=no" />
```

**Sources:**
- [Shopify: Meta Descriptions 2026](https://www.shopify.com/blog/how-to-write-meta-descriptions)
- [Straight North: Title Tags & Meta Descriptions 2026](https://www.straightnorth.com/blog/title-tags-and-meta-descriptions-how-to-write-and-optimize-them-in-2026/)
- [DigitalApplied: eCommerce SEO Product & Category Page Guide 2026](https://www.digitalapplied.com/blog/ecommerce-seo-product-category-page-guide-2026)
- [SEOProfy: SEO for Luxury Brands 2026](https://seoprofy.com/blog/seo-for-luxury-brands/)
- [Mediaboom: SEO for Luxury Brands](https://mediaboom.com/news/seo-for-luxury-brands/)

---

## 3. Open Graph / Twitter Cards Best Practices

### 3.1 Open Graph Tags (Facebook, LinkedIn, WhatsApp, iMessage)

```html
<!-- Required OG Tags -->
<meta property="og:title" content="Rosa Silvestre Eau de Parfum | Fur Eliza" />
<meta property="og:description" content="Fragancia floral artesanal colombiana con notas de rosa silvestre, jazmín y sándalo." />
<meta property="og:image" content="https://fureliza.com/images/og/rosa-silvestre-1200x630.jpg" />
<meta property="og:url" content="https://fureliza.com/productos/rosa-silvestre" />
<meta property="og:type" content="product" />
<meta property="og:site_name" content="Fur Eliza" />
<meta property="og:locale" content="es_CO" />

<!-- Product-Specific OG Tags -->
<meta property="product:price:amount" content="350000" />
<meta property="product:price:currency" content="COP" />
<meta property="product:availability" content="in stock" />
<meta property="product:brand" content="Fur Eliza" />
<meta property="product:category" content="Fragancias" />
```

### 3.2 Twitter/X Card Tags

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@fureliza" />
<meta name="twitter:title" content="Rosa Silvestre Eau de Parfum | Fur Eliza" />
<meta name="twitter:description" content="Fragancia floral artesanal colombiana." />
<meta name="twitter:image" content="https://fureliza.com/images/twitter/rosa-silvestre-1200x600.jpg" />
```

### 3.3 Image Specifications

| Platform | Recommended Size | Aspect Ratio | Max File Size |
|---|---|---|---|
| **Open Graph** | 1200 x 630 px | 1.91:1 | 1 MB |
| **Twitter summary_large_image** | 1200 x 600 px | 2:1 | 1 MB |
| **Twitter summary** | 144 x 144 px (min) | 1:1 | 1 MB |
| **WhatsApp** | 1200 x 630 px | 1.91:1 | 300 KB |

### 3.4 Next.js Implementation

```typescript
// In Next.js App Router, OG and Twitter are part of the Metadata API
export const metadata: Metadata = {
  openGraph: {
    title: 'Rosa Silvestre Eau de Parfum | Fur Eliza',
    description: 'Fragancia floral artesanal colombiana.',
    url: '/productos/rosa-silvestre',
    siteName: 'Fur Eliza',
    images: [{
      url: '/images/og/rosa-silvestre-1200x630.jpg',
      width: 1200,
      height: 630,
      alt: 'Frasco de perfume Rosa Silvestre de Fur Eliza sobre fondo de pétalos de rosa',
    }],
    locale: 'es_CO',
    type: 'website', // Use 'website' for product pages (og:type=product is not natively supported by Next.js metadata)
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rosa Silvestre Eau de Parfum | Fur Eliza',
    description: 'Fragancia floral artesanal colombiana.',
    images: ['/images/twitter/rosa-silvestre-1200x600.jpg'],
  },
};
```

**Key insight:** Twitter/X falls back to Open Graph tags if its own meta tags are absent. However, setting both explicitly ensures optimal display across all platforms.

**Sources:**
- [Twitter Developer: Cards Markup](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup)
- [Neil Patel: Open Graph Meta Tags](https://neilpatel.com/blog/open-graph-meta-tags/)
- [EverywhereMarketer: Social Meta Tags Guide](https://www.everywheremarketer.com/blog/ultimate-guide-to-social-meta-tags-open-graph-and-twitter-cards)
- [SEOpressor: Open Graph and Twitter Card Guide](https://seopressor.com/blog/facebook-open-graph-twitter-card/)

---

## 4. Core Web Vitals Targets for 2026

### 4.1 Current Thresholds (Critical for Ranking)

| Metric | Good | Needs Improvement | Poor |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.5s | 2.5s - 4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | < 200ms | 200ms - 500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.1 - 0.25 | > 0.25 |
| **SVT** (Smooth Visual Transitions) | New 2026 metric | Penalizes janky page loads | - |

**Key 2026 changes:**
- INP replaced FID (First Input Delay) in March 2024 and is now the primary responsiveness metric
- Performance has become a **hard ranking factor** rather than a soft signal
- Google introduced stricter thresholds and the new SVT metric penalizing janky page loads
- E-commerce sites optimizing to "good" thresholds report **15-30% conversion increases**
- Organic traffic increases of **12-20%** are common after comprehensive CWV optimization

### 4.2 Ecommerce-Specific Optimization Targets

| Page Type | LCP Target | INP Focus Areas |
|---|---|---|
| **Homepage** | < 1.8s | Hero carousel interactions |
| **Category/Collection** | < 2.0s | Filters, sorting, pagination |
| **Product Page** | < 2.2s | Add to cart, variant selection, image gallery |
| **Cart** | < 1.5s | Quantity changes, remove item |
| **Checkout** | < 1.5s | Form inputs, payment processing |

### 4.3 Optimization Techniques for Next.js Ecommerce

**LCP Optimization:**
- Preload hero/product images: `<link rel="preload" as="image" href="..." fetchpriority="high">`
- Use SSG/ISR for product pages (pre-render HTML)
- Optimize server response time (< 200ms TTFB)
- Inline critical CSS, defer non-critical styles
- Use CDN for all static assets
- Set `priority={true}` on Next.js `<Image>` for above-the-fold images

**INP Optimization:**
- Minimize JavaScript bundle size (code splitting per route)
- Defer non-critical third-party scripts (analytics, chat widgets)
- Use `React.startTransition` for non-urgent state updates
- Debounce filter/search interactions
- Use web workers for heavy computations
- Keep main thread work under 50ms per task

**CLS Optimization:**
- Always set explicit `width` and `height` on images
- Use CSS `aspect-ratio` for responsive containers
- Reserve space for dynamic content (ads, banners, lazy-loaded elements)
- Avoid injecting content above existing content
- Use `font-display: swap` with size-adjusted fallback fonts

**Sources:**
- [CoreWebVitals.io: LCP, INP & CLS Explained 2026](https://www.corewebvitals.io/core-web-vitals)
- [Koanthic: Core Web Vitals 2026 INP Guide](https://koanthic.com/en/core-web-vitals-2026-complete-inp-guide-assessment/)
- [Webgaro: Core Web Vitals Impact on Ecommerce Revenue](https://webgaro.com/blog/core-web-vitals-impact-on-e-commerce-revenue/)
- [DigitalByteTeck: Core Web Vitals 2026 Rankings](https://www.digitalbyteteck.com/core-web-vitals-explained/)
- [White Label Coders: Core Web Vitals SEO 2026](https://whitelabelcoders.com/blog/how-important-are-core-web-vitals-for-seo-in-2026/)
- [FullThrottleSEO: Ecommerce SEO Best Practices 2026](https://fullthrottleseo.com/ecommerce-seo-best-practices/)

---

## 5. Image SEO (AVIF, WebP, Alt Text)

### 5.1 Image Format Strategy

**Priority order for serving:**
1. **AVIF** - 50% smaller than JPEG at equivalent quality (preferred)
2. **WebP** - 25-35% smaller than JPEG, 96%+ browser support (fallback)
3. **JPEG/PNG** - Final fallback for legacy browsers only

**Trade-off:** AVIF takes ~50% longer to encode but compresses 20% smaller than WebP. For pre-encoded product images (which are uploaded once and served many times), AVIF is ideal.

**Next.js configuration:**
```typescript
// next.config.ts
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'], // AVIF preferred, WebP fallback
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.fureliza.com',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

### 5.2 Product Image Requirements

| Image Type | Min Resolution | Recommended | Background |
|---|---|---|---|
| **Primary product** | 1200px longest | 2400px+ | Clean white/lifestyle |
| **Gallery images** | 1200px | 1800px+ | Multiple angles |
| **OG/Social share** | 1200x630 | 1200x630 | Branded composition |
| **Thumbnail** | 300x300 | 600x600 | White background |

**For Google Lens optimization** (12B+ queries/month):
- Product must be the dominant element, no visual clutter
- Provide multiple angles: front, side, back, detail, lifestyle
- Even, shadow-minimizing lighting
- Minimum 1200px longest dimension; 2400px+ for primary

### 5.3 Alt Text Patterns for Perfume Products

**Formula:** `[Brand] [Product Name] [Key Attribute] [Size] - [Visual Description]`

**Good examples:**
```
alt="Fur Eliza Rosa Silvestre Eau de Parfum 100ml - frasco dorado con tapa de madera sobre fondo blanco"
alt="Fur Eliza Rosa Silvestre perfume - vista lateral del frasco mostrando el líquido ámbar"
alt="Colección de fragancias Fur Eliza - cinco frascos artesanales en estante de madera"
alt="Fur Eliza Rosa Silvestre - detalle del atomizador y grabado del frasco"
```

**Bad examples:**
```
alt="perfume"  (too generic)
alt="perfume colombia fragancia mujer comprar barato"  (keyword stuffing)
alt=""  (missing - only use empty alt for decorative images)
```

### 5.4 Image Sitemap

Include a dedicated image sitemap or embed image data within your main sitemap:

```xml
<url>
  <loc>https://fureliza.com/productos/rosa-silvestre</loc>
  <image:image>
    <image:loc>https://cdn.fureliza.com/products/rosa-silvestre-front.avif</image:loc>
    <image:caption>Fur Eliza Rosa Silvestre Eau de Parfum 100ml frasco frontal</image:caption>
    <image:title>Rosa Silvestre EDP 100ml</image:title>
  </image:image>
  <image:image>
    <image:loc>https://cdn.fureliza.com/products/rosa-silvestre-lifestyle.avif</image:loc>
    <image:caption>Fur Eliza Rosa Silvestre perfume en tocador con flores naturales</image:caption>
  </image:image>
</url>
```

### 5.5 Next.js Image Component Usage

```tsx
import Image from 'next/image';

// Above-the-fold product image (NO lazy loading, high priority)
<Image
  src="/products/rosa-silvestre-front.avif"
  alt="Fur Eliza Rosa Silvestre Eau de Parfum 100ml - frasco dorado sobre fondo blanco"
  width={800}
  height={800}
  priority={true}           // Disables lazy loading, preloads the image
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  quality={85}
/>

// Below-the-fold gallery images (lazy loaded by default)
<Image
  src="/products/rosa-silvestre-side.avif"
  alt="Fur Eliza Rosa Silvestre - vista lateral del frasco de perfume"
  width={800}
  height={800}
  loading="lazy"             // Default behavior
  sizes="(max-width: 768px) 50vw, 25vw"
  quality={80}
/>
```

**Critical rule:** Never lazy-load the LCP image. Set `priority={true}` on the main product image.

**Sources:**
- [DigitalApplied: Image SEO 2026 Guide](https://www.digitalapplied.com/blog/image-seo-visual-search-optimization-guide-2026)
- [Elementor: AVIF vs WebP 2026](https://elementor.com/blog/webp-vs-avif/)
- [FreeImages: WebP vs JPEG vs AVIF 2026](https://blog.freeimages.com/post/webp-vs-jpeg-vs-avif-best-format-for-web-photos)
- [SoloMoMedia: Alt Tags Image SEO 2026](https://solomomedia.com/alt-tags-image-seo-2026/)
- [Google: Image SEO Best Practices](https://developers.google.com/search/docs/appearance/google-images)
- [Next.js: Image Component](https://nextjs.org/docs/app/api-reference/components/image)

---

## 6. Internal Linking Strategy

### 6.1 Site Architecture (3-Click Rule)

```
Homepage (/)
├── Fragancias (/fragancias)
│   ├── Eau de Parfum (/fragancias/eau-de-parfum)
│   │   ├── Rosa Silvestre (/fragancias/eau-de-parfum/rosa-silvestre)
│   │   └── Noche de Luna (/fragancias/eau-de-parfum/noche-de-luna)
│   ├── Eau de Toilette (/fragancias/eau-de-toilette)
│   └── Body Mist (/fragancias/body-mist)
├── Colecciones (/colecciones)
│   ├── Colección Botánica (/colecciones/botanica)
│   └── Colección Nocturna (/colecciones/nocturna)
├── Regalos (/regalos)
├── Sobre Nosotros (/sobre-nosotros)
└── Blog (/blog)
    ├── Guía de Fragancias (/blog/guia-de-fragancias)
    └── El Arte del Perfume (/blog/arte-del-perfume)
```

Every product should be reachable within 3 clicks from the homepage.

### 6.2 Linking Patterns by Page Type

**Category pages should link to:**
- Best-selling products (featured/hero links)
- Subcategories
- Related buying guides from the blog
- Parent category (breadcrumb)

**Product pages should link to:**
- Parent category (breadcrumb)
- Related/complementary products ("También te puede gustar")
- Same-collection products ("De la misma colección")
- Relevant blog content ("Descubre cómo elegir tu fragancia")
- Size/variant alternatives

**Blog posts should link to:**
- Relevant product pages (contextual links within content)
- Category pages when discussing product types
- Other related blog posts

### 6.3 Best Practices

| Rule | Detail |
|---|---|
| **Anchor text** | Use descriptive, keyword-rich anchors (NOT "click here") |
| **Link density** | 2-5 internal links per 1,000 words of content |
| **Orphan pages** | Audit regularly; every indexed page needs at least 1 internal link |
| **Authority flow** | Link from high-traffic pages to pages that need ranking support |
| **Nofollow** | Apply to login, cart, checkout, user-generated content links |
| **Breadcrumbs** | Implement on every page with BreadcrumbList schema |
| **Related products** | Include 4-8 related product links on each product page |

### 6.4 Revenue Impact

- Category pages generate **3-5x more organic revenue** than individual product pages
- Contextual blog-to-product links are among the **highest-ROI ecommerce SEO tactics**
- Over 50% of clicks concentrate on the **top 3 search results** (prioritize internal link equity to your money pages)

**Sources:**
- [Shopify: Internal Links SEO 2026](https://www.shopify.com/blog/internal-links-seo)
- [IdeaMagix: Internal Linking Strategy 2026](https://www.ideamagix.com/blog/internal-linking-strategy-seo-guide-2026/)
- [FullThrottleSEO: Ecommerce SEO Best Practices 2026](https://fullthrottleseo.com/ecommerce-seo-best-practices/)
- [GetPassionfruit: Category Page Optimization 2026](https://www.getpassionfruit.com/blog/how-to-optimize-category-pages-for-e-commerce-seo-in-2026)
- [Flowmatters: Internal Link Building for Ecommerce](https://www.flowmatters.com/blog/create-an-effective-internal-link-building-strategy-for-ecommerce-websites-the-dos-and-donts-of-internal-link-building/)

---

## 7. Sitemap Best Practices for Next.js

### 7.1 Dynamic Sitemap Generation (Recommended)

Use Next.js App Router's native `sitemap.ts` convention:

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://fureliza.com';

  // Fetch all products from your CMS/database
  const products = await getAllProducts();
  const categories = await getAllCategories();
  const blogPosts = await getAllBlogPosts();

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/productos/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/fragancias/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const blogUrls = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...categoryUrls,
    ...productUrls,
    ...blogUrls,
  ];
}
```

### 7.2 Sitemap Index for Large Sites

If your site exceeds ~50,000 URLs, split into multiple sitemaps:

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // This generates a sitemap index if you use generateSitemaps()
  ];
}

export async function generateSitemaps() {
  const totalProducts = await getProductCount();
  const sitemapCount = Math.ceil(totalProducts / 50000);

  return Array.from({ length: sitemapCount }, (_, i) => ({ id: i }));
}
```

### 7.3 Sitemap Rules

- **Only include canonical, indexable URLs** (200 status, not noindexed, not blocked by robots.txt)
- **Always use absolute URLs** (https://fureliza.com/page, not /page)
- **Include `lastmod`** with actual modification dates
- **Priority values:** Homepage=1.0, Categories=0.9, Products=0.8, Blog=0.6, Legal/About=0.3
- **Do NOT include:** paginated URLs, filtered URLs, search results, cart/checkout pages
- **Submit via Google Search Console** and reference in robots.txt

**Sources:**
- [Next.js: Sitemap.xml Metadata](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [jsdevspace: SEO in Next.js 16](https://jsdevspace.substack.com/p/how-to-configure-seo-in-nextjs-16)
- [Dev.to: Generate sitemap.xml and robots.txt in Next.js](https://dev.to/prateekshaweb/generate-sitemapxml-and-robotstxt-in-nextjs-for-better-google-indexing-5c1l)

---

## 8. robots.txt Recommendations

### 8.1 Next.js Implementation

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/cart',
          '/checkout/',
          '/cuenta/',        // User account pages
          '/buscar',         // Search results pages
          '/*?sort=',        // Sorting parameters
          '/*?filter=',      // Filter parameters
          '/*?page=',        // Pagination (if handled via params)
          '/preview/',       // CMS preview pages
        ],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',          // Allow AI crawlers for GEO visibility
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',          // Allow Google AI training
      },
    ],
    sitemap: 'https://fureliza.com/sitemap.xml',
  };
}
```

### 8.2 Key Principles

| Rule | Rationale |
|---|---|
| **Allow all product pages** | These are your money pages |
| **Allow all category pages** | High-volume keyword targets |
| **Block cart/checkout** | No SEO value, waste of crawl budget |
| **Block filtered/sorted URLs** | Prevents duplicate content crawling |
| **Block API routes** | No user-facing content |
| **Block search results** | Low-value, often duplicate content |
| **Allow AI crawlers** | Critical for GEO/AI search visibility in 2026 |
| **Reference sitemap** | Ensures crawlers find your sitemap |

### 8.3 Testing

- Validate with Google Search Console's robots.txt tester
- Ensure no product or category pages are accidentally blocked
- Check that your sitemap URL is accessible

**Sources:**
- [Next.js: robots.txt Metadata](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- [jsdevspace: SEO in Next.js 16](https://jsdevspace.substack.com/p/how-to-configure-seo-in-nextjs-16)
- [ServerAvatar: Next.js robots.txt Guide](https://serveravatar.com/next-js-robots-txt-guide/)

---

## 9. International SEO (Colombia Market)

### 9.1 URL Structure Recommendation

For a Colombia-first luxury brand with potential LATAM expansion:

**Recommended: Subdirectory approach**
```
fureliza.com/          → Default (es-CO, Colombian Spanish)
fureliza.com/en/       → English (future)
fureliza.com/es-mx/    → Mexican Spanish (future expansion)
```

**Why subdirectories over ccTLDs:**
- Consolidates domain authority into a single domain
- Easier to maintain
- Lower cost than multiple ccTLDs
- Best for brands starting in one market and expanding

### 9.2 Hreflang Implementation

For a Colombia-focused site that may expand:

```html
<!-- On every page, in <head> -->
<link rel="alternate" hreflang="es-CO" href="https://fureliza.com/productos/rosa-silvestre" />
<link rel="alternate" hreflang="x-default" href="https://fureliza.com/productos/rosa-silvestre" />
```

**When expanding to other markets:**
```html
<link rel="alternate" hreflang="es-CO" href="https://fureliza.com/productos/rosa-silvestre" />
<link rel="alternate" hreflang="es-MX" href="https://fureliza.com/es-mx/productos/rosa-silvestre" />
<link rel="alternate" hreflang="en" href="https://fureliza.com/en/products/rosa-silvestre" />
<link rel="alternate" hreflang="x-default" href="https://fureliza.com/productos/rosa-silvestre" />
```

**In Next.js metadata:**
```typescript
export const metadata: Metadata = {
  alternates: {
    canonical: '/productos/rosa-silvestre',
    languages: {
      'es-CO': '/productos/rosa-silvestre',
      'x-default': '/productos/rosa-silvestre',
      // Future:
      // 'es-MX': '/es-mx/productos/rosa-silvestre',
      // 'en': '/en/products/rosa-silvestre',
    },
  },
};
```

### 9.3 Colombia-Specific Localization

| Element | Implementation |
|---|---|
| **Currency** | COP (Colombian Peso), formatted as $350.000 |
| **Language** | Colombian Spanish (es-CO), not Spain Spanish |
| **Terminology** | Use local terms: "fragancia" not "perfume" exclusively; "envío" not "despacho" |
| **Addresses** | Colombian address format (city, departamento) |
| **Phone format** | +57 country code, local mobile format |
| **Legal** | Colombian consumer protection laws, Ley 1480 de 2011 |
| **Payment methods** | PSE, Nequi, Daviplata alongside cards |
| **Shipping regions** | Reference Colombian cities and departamentos |
| **Seasonal content** | Colombian holidays (Día de la Madre, Amor y Amistad in September) |

### 9.4 Hreflang Rules

- Tags must be **bidirectional** (if A points to B, B must point back to A)
- Every page must include a **self-referencing** hreflang tag
- Always use **absolute URLs**
- Include `x-default` for users outside specified regions
- Also include hreflang annotations in XML sitemaps
- Validate with Google Search Console International Targeting report

### 9.5 Structured Data Localization

Ensure all structured data uses localized values:
- `priceCurrency: "COP"`
- `addressCountry: "CO"`
- `availableLanguage: "Spanish"`
- `areaServed` for shipping regions

**Sources:**
- [SearchFlex: International SEO Ecommerce Checklist 2026](https://searchflex.com/blog/international-seo-ecommerce-checklist/)
- [Search Engine Land: International SEO Basics](https://searchengineland.com/guide/international-seo)
- [Weglot: Hreflang Tag Guide](https://www.weglot.com/guides/hreflang-tag)
- [LinkGraph: Hreflang Implementation Guide 2026](https://www.linkgraph.com/blog/hreflang-implementation-guide/)
- [Claneo: SEO for Spain and Latin America](https://www.claneo.com/en/international-seo/spain-latam/)
- [GoInflow: International SEO for Ecommerce](https://www.goinflow.com/blog/international-seo-strategy/)

---

## 10. Rich Snippets & Featured Snippets Optimization

### 10.1 Rich Snippet Types for Perfume Ecommerce

| Rich Result Type | Requirements | Impact |
|---|---|---|
| **Product** | Product schema + Offer | Price, availability in SERPs |
| **Review snippet** | AggregateRating or Review schema | Star ratings in SERPs (20-82% CTR boost) |
| **Price drop** | Offer with price history | "Price drop" badge in results |
| **Shipping info** | OfferShippingDetails | Shipping cost/time in results |
| **Return policy** | MerchantReturnPolicy | Return info in results |
| **Product variants** | ProductGroup schema | Size/color options in results |
| **Breadcrumb** | BreadcrumbList schema | Path display instead of URL |
| **FAQ** | FAQPage schema | Expandable Q&A in results |
| **Sitelinks search** | WebSite + SearchAction | Search box in brand results |

### 10.2 FAQ Schema for Product Pages

Add 3-5 FAQs per product page with genuine questions:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cuánto dura la fragancia Rosa Silvestre?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Rosa Silvestre Eau de Parfum tiene una duración de 8-10 horas en la piel, gracias a su alta concentración de aceites esenciales (20%). La estela se mantiene perceptible durante todo el día."
      }
    },
    {
      "@type": "Question",
      "name": "¿Es Rosa Silvestre un perfume para mujer o unisex?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Rosa Silvestre es una fragancia unisex con predominio floral. Sus notas de rosa silvestre y jazmín se equilibran con la calidez del sándalo, creando un perfil versátil."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cómo se aplica correctamente este perfume?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Aplique Rosa Silvestre en los puntos de pulso: muñecas, cuello, detrás de las orejas y en la parte interna de los codos. No frote las muñecas después de aplicar, ya que esto rompe las moléculas de la fragancia."
      }
    }
  ]
}
```

### 10.3 Featured Snippet Optimization

To win featured snippets (Position Zero):

- **Answer questions directly** in the first paragraph (40-60 words)
- **Use structured headers** (H2/H3) matching common search queries
- **Include lists and tables** (Google loves extracting these)
- **Target question-based keywords:** "cómo elegir perfume," "cuál es el mejor perfume para regalar"
- **Create comparison content:** Tables comparing scent families, concentrations, durations

### 10.4 Voice Search Optimization

Most voice search results come from featured snippets. Optimize by:
- Writing in conversational, natural language
- Answering who/what/where/when/why/how questions
- Keeping answers concise (29-word average for voice results)
- Ensuring FAQPage schema is on all product pages

### 10.5 New Schema Features (2024-2026)

| Feature | Date Added | Relevance |
|---|---|---|
| **Product Variants** | Feb 2024 | Critical for perfume sizes |
| **Loyalty Programme** | Jun 2025 | If offering rewards program |
| **Price Drop annotations** | Ongoing | Show price reductions in SERPs |
| **Merchant Listing** | Ongoing | Free product listings in Google Shopping |

**Sources:**
- [Shopify: Rich Snippets 2026](https://www.shopify.com/blog/rich-snippets)
- [WISEPIM: Rich Snippets for Ecommerce](https://wisepim.com/ecommerce-dictionary/rich-snippets-for-e-commerce)
- [Prerender: Rich Snippets for Ecommerce SEO](https://prerender.io/blog/rich-snippets-for-ecommerce-seo/)
- [Neil Patel: Product Schema](https://neilpatel.com/blog/product-schema/)
- [Search Engine Journal: 8 Ecommerce Rich Snippets](https://www.searchenginejournal.com/ecommerce-rich-snippets/465106/)
- [CausalFunnel: Ecommerce SEO Best Practices 2026](https://www.causalfunnel.com/blog/ecommerce-seo-best-practices-the-ultimate-2026-step-by-step-guide/)

---

## 11. Next.js-Specific SEO Implementation

### 11.1 Metadata API (Root Layout)

```typescript
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://fureliza.com'),
  title: {
    default: 'Fur Eliza | Fragancias Artesanales Colombianas',
    template: '%s | Fur Eliza',
  },
  description: 'Casa de fragancias artesanales colombianas. Perfumes únicos elaborados con ingredientes naturales de origen local.',
  openGraph: {
    title: 'Fur Eliza | Fragancias Artesanales Colombianas',
    description: 'Descubre nuestras fragancias artesanales colombianas.',
    url: '/',
    siteName: 'Fur Eliza',
    images: ['/images/og/fur-eliza-brand.jpg'],
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fur Eliza | Fragancias Artesanales Colombianas',
    description: 'Fragancias artesanales colombianas.',
    images: ['/images/twitter/fur-eliza-brand.jpg'],
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};
```

### 11.2 Dynamic Product Page Metadata

```typescript
// app/productos/[slug]/page.tsx
import type { Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const product = await getProduct(params.slug);

  return {
    title: `${product.name} ${product.size} | Fur Eliza`,
    description: product.metaDescription || product.shortDescription,
    alternates: {
      canonical: `/productos/${params.slug}`,
    },
    openGraph: {
      title: `${product.name} | Fur Eliza`,
      description: product.shortDescription,
      url: `/productos/${params.slug}`,
      images: product.images.map(img => ({
        url: img.url,
        width: 1200,
        height: 630,
        alt: img.alt,
      })),
      type: 'website',
      locale: 'es_CO',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Fur Eliza`,
      description: product.shortDescription,
      images: [product.images[0]?.url],
    },
  };
}
```

### 11.3 JSON-LD Structured Data Component

```typescript
// components/seo/ProductJsonLd.tsx
import { Product, WithContext } from 'schema-dts';

interface ProductJsonLdProps {
  product: ProductData;
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const jsonLd: WithContext<Product> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'Fur Eliza',
    },
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      url: `https://fureliza.com/productos/${product.slug}`,
      priceCurrency: 'COP',
      price: product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.average,
        reviewCount: product.rating.count,
        bestRating: '5',
        worstRating: '1',
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
      }}
    />
  );
}
```

### 11.4 Rendering Strategy Recommendations

| Page Type | Strategy | Rationale |
|---|---|---|
| **Homepage** | SSG + ISR (revalidate: 3600) | Mostly static, update hourly |
| **Category pages** | SSG + ISR (revalidate: 1800) | Product lists change with inventory |
| **Product pages** | SSG + ISR (revalidate: 900) | Price/availability changes |
| **Blog posts** | SSG | Rarely change after publish |
| **Cart/Checkout** | CSR | No SEO value, user-specific |
| **Search results** | SSR | Dynamic, user-dependent |

**Never use CSR (client-side rendering) for any public-facing, SEO-important page.**

### 11.5 TypeScript Typing for Schema

Install the `schema-dts` package for type-safe structured data:

```bash
npm install schema-dts
```

```typescript
import { Product, WithContext, BreadcrumbList, FAQPage } from 'schema-dts';
```

**Sources:**
- [Next.js: JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld)
- [Next.js: generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js: Metadata and OG Images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [jsdevspace: SEO in Next.js 16](https://jsdevspace.substack.com/p/how-to-configure-seo-in-nextjs-16)
- [Strapi: Next.js SEO Guide](https://strapi.io/blog/nextjs-seo)

---

## 12. AI Search Optimization (GEO - Generative Engine Optimization)

### 12.1 Why This Matters in 2026

Nearly 60% of shoppers now use AI assistants (ChatGPT, Perplexity, Claude, Google AI Overviews) during purchase decisions. There are no special technical optimizations for AI search -- your page needs to be indexed, eligible for snippets, and well-structured.

### 12.2 GEO Best Practices

| Strategy | Implementation |
|---|---|
| **Structured data completeness** | Full Product + Offer + Rating schema on every product page |
| **Clear, factual content** | Write descriptions that state facts AI can extract and quote |
| **FAQ sections** | Structured Q&A that AI assistants can pull answers from |
| **Author credibility** | Show expertise signals (brand story, ingredient sourcing) |
| **Allow AI crawlers** | Do NOT block GPTBot, Google-Extended, ClaudeBot in robots.txt |
| **Consistent NAP data** | Same business name/address/phone across all platforms |

### 12.3 Content That AI Can Quote

Write product descriptions as structured facts, not just marketing copy:

**Good (AI-extractable):**
> Rosa Silvestre es un Eau de Parfum con concentración del 20%, notas de salida de bergamota y rosa silvestre colombiana, notas de corazón de jazmín y peonia, y notas de fondo de sándalo y almizcle. Duración: 8-10 horas. Volumen: 100ml. Origen: Colombia.

**Bad (pure marketing, hard for AI to extract):**
> Déjate envolver por la magia de la naturaleza colombiana con nuestra creación más sublime...

**Best approach:** Include BOTH. Lead with factual, structured content, then add the emotional/luxury copywriting.

**Sources:**
- [DebugBear: Ecommerce SEO 2026](https://www.debugbear.com/blog/ecommerce-website-seo)
- [FullThrottleSEO: Ecommerce SEO Best Practices 2026](https://fullthrottleseo.com/ecommerce-seo-best-practices/)
- [Neotype: Ecommerce SEO 2026 Strategy](https://neotype.ai/ecommerce-seo-best-practices-and-strategy/)

---

## 13. Actionable Implementation Checklist

### Phase 1: Foundation (Week 1-2)

- [ ] **Metadata API setup** in `app/layout.tsx` with title template, description, OG, Twitter
- [ ] **robots.ts** configuration blocking cart/checkout/API/filters
- [ ] **sitemap.ts** dynamic generation for all products, categories, blog posts
- [ ] **Organization schema** in root layout (JSON-LD)
- [ ] **WebSite schema** with SearchAction on homepage
- [ ] **Next.js Image config** with AVIF + WebP formats
- [ ] **Install `schema-dts`** for type-safe structured data
- [ ] **Canonical URLs** on every page via metadata alternates

### Phase 2: Product Pages (Week 2-3)

- [ ] **Product JSON-LD** on every product page (Product + Offer + AggregateRating)
- [ ] **ProductGroup JSON-LD** for products with size variants
- [ ] **BreadcrumbList JSON-LD** on every page
- [ ] **FAQPage JSON-LD** with 3-5 FAQs per product
- [ ] **generateMetadata** for dynamic product meta titles/descriptions
- [ ] **Open Graph product images** (1200x630) for each product
- [ ] **Alt text** following the pattern: `[Brand] [Product] [Attribute] - [Visual Description]`
- [ ] **Product images:** minimum 1200px, `priority={true}` on main image

### Phase 3: Category & Collection Pages (Week 3-4)

- [ ] **Category page metadata** with keyword-rich titles
- [ ] **CollectionPage schema** or ItemList schema
- [ ] **Internal links** from categories to best sellers and guides
- [ ] **300-600 words intro content** on each category page
- [ ] **Faceted navigation** control (noindex low-value filter combinations)

### Phase 4: Content & Authority (Week 4-6)

- [ ] **Blog content** targeting informational queries (fragrance guides, how-tos)
- [ ] **Internal links** from blog to products and categories
- [ ] **E-E-A-T signals** (about page, brand story, ingredient sourcing stories)
- [ ] **Social proof** integration (reviews with schema markup)

### Phase 5: International & Advanced (Week 6-8)

- [ ] **Hreflang tags** (es-CO + x-default minimum)
- [ ] **Localized structured data** (COP currency, CO addresses)
- [ ] **Image sitemap** generation
- [ ] **Google Search Console** verification and sitemap submission
- [ ] **Google Merchant Center** structured data alignment
- [ ] **Core Web Vitals audit** with target thresholds

### Phase 6: Monitoring & Iteration (Ongoing)

- [ ] **Google Search Console** monitoring for indexing issues
- [ ] **Rich Results Test** validation for all schema types
- [ ] **Core Web Vitals** monitoring via PageSpeed Insights / CrUX
- [ ] **Organic revenue tracking** per landing page
- [ ] **Featured snippet monitoring** for target keywords
- [ ] **AI search visibility** testing (search your products on ChatGPT, Perplexity)

---

## Key Statistics Summary

| Metric | Value | Source |
|---|---|---|
| CTR improvement from schema | 20-82% | Multiple studies |
| Conversion increase from CWV optimization | 15-30% | Webgaro, 2026 |
| Organic traffic increase from CWV | 12-20% | DigitalByteTeck, 2026 |
| Category vs product page revenue | 3-5x higher | FullThrottleSEO |
| AVIF compression vs JPEG | 50% smaller | Elementor/FreeImages |
| WebP compression vs JPEG | 25-35% smaller | Elementor/FreeImages |
| Mobile ecommerce traffic share | 75%+ | FullThrottleSEO |
| AI assistant usage in purchase decisions | 60% | FullThrottleSEO |
| Search engine meta description override rate | 62%+ | Straight North |
| Top 3 results click concentration | 50%+ | FullThrottleSEO |
| Conversion drop per extra second of load time | 2.11% | SEOProfy |
| Google Lens monthly queries | 12B+ | DigitalApplied |
