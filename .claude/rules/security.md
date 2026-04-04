# Security Rules

- `safeJsonLd()` in `src/lib/constants.ts` — use for ALL JSON-LD to prevent XSS
- CSP headers in `next.config.ts` — update `connect-src` when adding new APIs
- WhatsApp number from env var `NEXT_PUBLIC_WHATSAPP_NUMBER` with fallback in constants.ts
- Never commit `.env` files (patterns in `.gitignore`)
- Security headers configured: X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy
