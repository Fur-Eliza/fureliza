# Fur Eliza — Estado del Proyecto y Próximos Pasos

> Última actualización: 2 de Abril 2026

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
| Design doc | Hecho | `docs/plans/2026-04-01-catalog-automation-design.md` |
| Implementation plan (8 tasks) | Hecho | `docs/plans/2026-04-02-compositor-implementation.md` |

### SEO y Accesibilidad
| Componente | Estado |
|---|---|
| JSON-LD Organization (root layout) | Hecho |
| JSON-LD AggregateOffer (productos) | Hecho |
| JSON-LD FAQPage | Hecho |
| Sitemap dinámico | Hecho |
| Robots.txt | Hecho |
| Canonical URLs en todas las páginas | Hecho |
| Skip-nav link | Hecho |
| Focus visible rings (dorado) | Hecho |
| prefers-reduced-motion | Hecho |
| safeJsonLd() anti-XSS | Hecho |

### Seguridad
| Componente | Estado |
|---|---|
| CSP headers | Hecho |
| X-Frame-Options DENY | Hecho |
| X-Content-Type-Options nosniff | Hecho |
| Referrer-Policy | Hecho |
| Permissions-Policy | Hecho |
| .env en .gitignore | Hecho |

### Calidad de Código
| Acción | Estado |
|---|---|
| `tsc --noEmit` — 0 errores | Pasando |
| `next build` — 11/11 páginas + not-found | Pasando |
| Code review (39 issues corregidos) | Completado |
| Pre-deploy audit (3 agentes, 19 fixes) | Completado |
| Repo público en GitHub | Hecho |
| Deploy a Vercel (fureliza.vercel.app) | Hecho |
| Claude Code setup (.claude/ rules, commands, hooks) | Hecho |

---

## 2. Lo Que Falta por Implementar

### Fase 1 — La Base (Prioridad: AHORA)

#### Crítico (bloquea lanzamiento)

| Tarea | Dificultad | Dependencias |
|---|---|---|
| **Contenido real de productos** — Agregar 6-10 fragancias al catálogo | Baja (automatizado) | Elizabeth decide cuáles. Pipeline genera todo. |
| **Fotos de productos** — Al menos 1 foto por frasco para el AI video | Media | Elizabeth fotografía frascos con celular |
| **Crear cuenta fal.ai** — Para generar videos AI del pipeline | Baja | Registrarse en fal.ai, obtener FAL_KEY |
| ~~**Deploy a Vercel**~~ | ~~Hecho~~ | Deployado en fureliza.vercel.app |
| ~~**Variables de entorno en producción**~~ | ~~Hecho~~ | WHATSAPP_NUMBER configurado |

#### Importante (mejora experiencia)

| Tarea | Dificultad |
|---|---|
| **Integrar Sanity.io** — Migrar productos de `data/products.ts` a CMS | Media |
| **Cloudinary** — Subir imágenes y frames, configurar f_auto/q_auto | Baja |
| **Favicon y OG image** — Crear y configurar para redes sociales | Baja |
| **Google Analytics / Vercel Analytics** — Tracking básico | Baja |
| **Actualizar default model** — Cambiar a DeepSeek V3.2 ($0.64/M tokens, 4x más barato) | Baja |

### Fase 2 — La Inteligencia (1-3 meses)

| Tarea | Dificultad |
|---|---|
| **Quiz "El Compositor"** — 7 preguntas emocionales + UI inmersiva | Alta |
| **Qdrant + OpenAI embeddings** — Motor de recomendación semántico | Media |
| **WhatsApp Business API** — Conectar Meta API con automación | Media |
| **Chatbot RAG** — "Perfumista virtual" entrenado con catálogo | Alta |
| **TikTok content pipeline** — AI video → scheduling → posting | Media |

### Fase 3+ — Ver `docs/VISION.md` para roadmap completo

---

## 3. Costos Actuales

| Servicio | Costo mensual |
|---|---|
| Vercel (hobby tier) | $0 |
| OpenRouter (pipeline texto) | ~$1 (300 productos/mes) |
| fal.ai (pipeline video) | ~$5-25 (10-50 videos/mes) |
| Dominio fureliza.com | ~$1/mes ($12/año) |
| Fragella API (opcional) | $12 |
| **Total sin Fragella** | **~$7-27/mes** |
| **Total con Fragella** | **~$19-39/mes** |

---

## 4. Prioridades Inmediatas (Top 5)

1. **Crear cuenta fal.ai** — Registrarse, obtener FAL_KEY, agregar a `.env`
2. **Fotografiar 5-10 frascos** — Elizabeth con celular, fondo oscuro
3. **Correr pipeline** — `npm run pipeline "Layton" "Parfums de Marly" foto.jpg`
4. **Configurar dominio** — Apuntar DNS de fureliza.com a Vercel
5. **TikTok/Reels** — Usar los AI videos generados como contenido social

---

*Documento de estado — v2.1.0 — 4 Abril 2026*
