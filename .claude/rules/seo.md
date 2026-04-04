# SEO Rules

- Every page needs `alternates: { canonical: "/path" }` in metadata export
- Product pages: use `ProductJsonLd` component (AggregateOffer schema) in server component
- FAQ page: FAQPage JSON-LD schema
- Root layout: Organization JSON-LD
- All JSON-LD must use `safeJsonLd()` from `src/lib/constants.ts` to prevent XSS
- Sitemap: `src/app/sitemap.ts` — add new routes here
- Robots: `src/app/robots.ts`
- metadataBase: `https://fureliza.com` (set in layout.tsx)
