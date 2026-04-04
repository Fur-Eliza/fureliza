# Fur Eliza — Estado del Proyecto y Próximos Pasos

> Última actualización: 4 de Abril 2026

---

## 1. Lo Que Ya Está Hecho (Completado)

### Frontend Core
| Componente | Estado | Archivo |
|---|---|---|
| ScrollSmoother (smooth scroll global) | Hecho | `src/components/SmoothScroll.tsx` |
| SplitText character animations | Hecho | `src/components/SplitTitle.tsx` |
| View Transitions API (page transitions) | Hecho | `next.config.ts` + `globals.css` |
| Homepage con HeroScroll (frames dinámicos) | Hecho | `src/app/page.tsx` |
| Página de colección con filtros (familia + mood) | Hecho | `src/app/collection/` |
| Página de producto detallada | Hecho | `src/app/perfume/[slug]/` |
| Psychological pricing (precio tachado, ahorro %, costo/día) | Hecho | `ProductPageClient.tsx` |
| Página About (historia + filosofía) | Hecho | `src/app/about/page.tsx` |
| Página FAQ con accordion | Hecho | `src/app/faq/page.tsx` |
| Página Legal (términos, privacidad, devoluciones) | Hecho | `src/app/legal/page.tsx` |
| Navbar con mobile hamburger | Hecho | `src/components/Navbar.tsx` |
| Carrito drawer con checkout WhatsApp | Hecho | `src/components/CartDrawer.tsx` |
| Toast de "agregado al carrito" | Hecho | `src/components/Toast.tsx` |
| CTA WhatsApp (frosted glass) | Hecho | `src/components/CTAWhatsApp.tsx` |
| Footer con links y GSAP | Hecho | `src/components/Footer.tsx` |
| FragranceMeter (intensidad/proyección/longevidad) | Hecho | `src/components/FragranceMeter.tsx` |
| StickyAddToCart (mobile) | Hecho | `src/components/StickyAddToCart.tsx` |
| RelatedProducts (cross-selling) | Hecho | `src/components/RelatedProducts.tsx` |
| AnimatedSection (GSAP wrapper genérico) | Hecho | `src/components/AnimatedSection.tsx` |

### Sistema de Datos
| Componente | Estado | Detalle |
|---|---|---|
| Tipos TypeScript (Product, Variant, Family, Mood) | Hecho | `src/types/product.ts` |
| retailPrice para psychological pricing | Hecho | `src/types/product.ts` (campo opcional) |
| Datos estáticos de productos | Hecho | `src/data/products.ts` (2 productos con retailPrice) |
| Carrito con Zustand (COP/USD, WhatsApp URL) | Hecho | `src/store/cartStore.ts` |
| Constantes centralizadas | Hecho | `src/lib/constants.ts` |

### "El Compositor" — Pipeline de Automatización
| Componente | Estado | Archivo |
|---|---|---|
| FFmpeg frame extraction script | Hecho | `scripts/extract-frames.sh` |
| Catalog generation (OpenRouter AI) | Hecho | `scripts/generate-product.ts` |
| AI video generation (fal.ai, 7 estilos) | Hecho | `scripts/generate-video.ts` |
| Master pipeline (todo en un comando) | Hecho | `scripts/pipeline.sh` |
| NPM scripts (generate, video, frames, pipeline) | Hecho | `package.json` |
| Video prompt engineering guide | Hecho | `docs/AI_VIDEO_GENERATION_GUIDE.md` |

### SEO, Accesibilidad y Seguridad
| Componente | Estado |
|---|---|
| JSON-LD Organization, AggregateOffer, FAQPage | Hecho |
| Sitemap dinámico + Robots.txt + Canonical URLs | Hecho |
| Skip-nav, focus rings (dorado), prefers-reduced-motion | Hecho |
| safeJsonLd() anti-XSS | Hecho |
| CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy | Hecho |

### Calidad de Código
| Acción | Estado |
|---|---|
| `tsc --noEmit` — 0 errores | Pasando |
| `next build` — 11/11 páginas + not-found | Pasando |
| Code review (39 issues corregidos) | Completado |
| Pre-deploy audit (19 fixes adicionales) | Completado |
| Deploy a Vercel (fureliza.vercel.app) | Hecho |
| Claude Code setup (.claude/ rules, commands, hooks) | Hecho |

---

## 2. Catálogo de Lanzamiento — 10 Fragancias

### Seleccionadas (Abril 4, 2026)

| # | Fragancia | Casa | Tier | Estado |
|---|-----------|------|------|--------|
| 1 | Megamare | Orto Parisi | — | ✅ En sitio |
| 2 | Baccarat Rouge 540 | MFK | — | ✅ En sitio |
| 3 | Hacivat | Nishane | 1 | ⏳ Por agregar |
| 4 | Layton | Parfums de Marly | 1 | ⏳ Por agregar |
| 5 | Naxos | Xerjoff | 1 | ⏳ Por agregar |
| 6 | Side Effect | Initio | 2 | ⏳ Por agregar |
| 7 | Santal 33 | Le Labo | 2 | ⏳ Por agregar |
| 8 | Lost Cherry | Tom Ford | 2 | ⏳ Por agregar |
| 9 | Delina | Parfums de Marly | 3 | ⏳ Por agregar |
| 10 | Grand Soir | MFK | 3 | ⏳ Por agregar |

**Inversión total**: ~$2,283 USD landed (8 frascos nuevos)
**Revenue proyectado mes 1**: ~$400-800 USD

Ver detalles completos en `docs/plans/2026-04-04-launch-roadmap-design.md`

---

## 3. Plan de Ejecución

### Semana 1: Tier 1 + DNS
- [ ] Comprar Hacivat, Layton, Naxos
- [ ] Fotografiar frascos
- [ ] Generar videos (Gemini manual, fal.ai cuando se recargue)
- [ ] Extraer frames + generar datos + agregar al sitio
- [ ] Configurar DNS fureliza.com → Vercel

### Semana 2: Tier 2 + Contenido
- [ ] Comprar Side Effect, Santal 33, Lost Cherry
- [ ] Repetir flujo: foto → video → frames → datos
- [ ] Crear contenido TikTok/Reels
- [ ] Abrir "El Salón" (comunidad WhatsApp)

### Semana 3: Tier 3 + Lanzamiento
- [ ] Comprar Delina, Grand Soir
- [ ] Completar catálogo a 10 productos
- [ ] Crear "Sinfonías Olfativas" (sets por emoción)
- [ ] Lanzamiento público + primer drop "Opus 1"

### Semana 4: Optimizar
- [ ] Medir conversión web → WhatsApp
- [ ] Favicon + OG images
- [ ] Vercel Analytics
- [ ] Planear Phase 2

---

## 4. Fases Futuras

### Phase 2 — La Inteligencia (Meses 1-3)
- Quiz "El Compositor" (7 preguntas emocionales + UI inmersiva)
- "Componer tu Sinfonía" (sistema de layering musical)
- Tarjetas de Colección 1ml con QR
- WhatsApp AI Concierge
- Sanity.io CMS para Elizabeth
- "El Salón" comunidad con voting de Opus

### Phase 3 — Dominación (Meses 3-12)
- "El Compositor Biológico" (genómica + microbioma + IA → perfume personalizado)
- NFC en botellas (autenticidad + contenido exclusivo)
- Terroir Colombiano (ingredientes locales únicos)
- Subscription "Abono de Temporada"
- Three.js 3D, ambient sound, AR viewer

### Phase 4+ — Escala (12+ meses)
- Ver `docs/VISION.md` y `docs/THE_ONYX_PROTOCOL.md`

---

## 5. Costos Mensuales

| Servicio | Costo |
|----------|-------|
| Vercel (hobby) | $0 |
| OpenRouter (pipeline texto) | ~$1 |
| fal.ai (pipeline video) | ~$5-25 |
| Dominio fureliza.com | ~$1 |
| Fragella API (opcional) | $12 |
| **Total** | **~$7-39/mes** |

---

*Documento de estado — v3.0.0 — 4 Abril 2026*
