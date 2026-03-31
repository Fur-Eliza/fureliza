# Fur Eliza — Estado del Proyecto y Próximos Pasos

> Última actualización: 31 de Marzo 2026

---

## 1. Lo Que Ya Está Hecho (Completado)

### Frontend Core
| Componente | Estado | Archivo |
|---|---|---|
| ScrollSmoother (smooth scroll global) | Hecho | `src/components/SmoothScroll.tsx` |
| SplitText character animations | Hecho | `src/components/SplitTitle.tsx` |
| View Transitions API (page transitions) | Hecho | `next.config.ts` + `globals.css` |
| Homepage con HeroScroll (120 frames) | Hecho | `src/app/page.tsx` |
| Página de colección con filtros (familia + mood) | Hecho | `src/app/collection/` |
| Página de producto detallada | Hecho | `src/app/perfume/[slug]/` |
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
| Datos estáticos de productos | Hecho | `src/data/products.ts` (2 productos) |
| Carrito con Zustand (COP/USD, WhatsApp URL) | Hecho | `src/store/cartStore.ts` |
| Constantes centralizadas | Hecho | `src/lib/constants.ts` |

### SEO y Accesibilidad
| Componente | Estado | Detalle |
|---|---|---|
| JSON-LD Organization (root layout) | Hecho | `src/app/layout.tsx` |
| JSON-LD AggregateOffer (productos) | Hecho | `src/components/ProductJsonLd.tsx` |
| JSON-LD FAQPage | Hecho | `src/app/faq/page.tsx` |
| Sitemap dinámico | Hecho | `src/app/sitemap.ts` |
| Robots.txt | Hecho | `src/app/robots.ts` |
| Canonical URLs en todas las páginas | Hecho | Todas las pages |
| Skip-nav link | Hecho | `src/app/layout.tsx` |
| Focus visible rings (dorado) | Hecho | `globals.css` |
| prefers-reduced-motion | Hecho | `globals.css` + componentes |
| safeJsonLd() anti-XSS | Hecho | `src/lib/constants.ts` |

### Seguridad
| Componente | Estado | Detalle |
|---|---|---|
| CSP headers | Hecho | `next.config.ts` |
| X-Frame-Options DENY | Hecho | `next.config.ts` |
| X-Content-Type-Options nosniff | Hecho | `next.config.ts` |
| Referrer-Policy | Hecho | `next.config.ts` |
| Permissions-Policy | Hecho | `next.config.ts` |
| .env en .gitignore | Hecho | `.gitignore` |

### Backend (Scaffold)
| Componente | Estado | Detalle |
|---|---|---|
| Rust/Axum catalog-service | Scaffold | Mock data, sin DB queries reales |
| Docker Compose (Postgres + Rust) | Hecho | `backend/docker-compose.yml` |
| Dockerfile multi-stage | Hecho | Alpine-based, non-root user |
| Health check endpoint | Hecho | `/health` |

### Calidad de Código
| Acción | Estado |
|---|---|
| `tsc --noEmit` — 0 errores | Pasando |
| `next build` — 11/11 páginas | Pasando |
| Code review (39 issues corregidos) | Completado |

---

## 2. Lo Que Falta por Implementar

### Fase 1 — La Base (Prioridad: AHORA)

#### Crítico (bloquea lanzamiento)

| Tarea | Dificultad | Tiempo estimado | Dependencias |
|---|---|---|---|
| **Contenido real de productos** — Agregar 6-10 fragancias más al catálogo | Media | 2-4 horas | Decisión de Elizabeth sobre cuáles |
| **Fotografía de productos** — Fotos reales para cards y hero images | Alta | Externo | Fotógrafo o Elizabeth |
| **Frames de animación** — Generar 120 frames WebP por producto | Alta | Blender/After Effects | Modelos 3D o video del frasco |
| **Deploy a Vercel** — Conectar repo, configurar dominio fureliza.com | Baja | 30 min | Acceso DNS del dominio |
| **Variables de entorno en producción** — NEXT_PUBLIC_WHATSAPP_NUMBER | Baja | 5 min | Deploy configurado |

#### Importante (mejora experiencia)

| Tarea | Dificultad | Tiempo |
|---|---|---|
| **Integrar Sanity.io** — Migrar productos de `data/products.ts` a CMS | Media | 4-6 horas |
| **Cloudinary** — Subir imágenes y frames, configurar f_auto/q_auto | Baja | 2 horas |
| ~~**ScrollSmoother** — Habilitar smooth scroll global~~ | ~~Hecho~~ | ~~Implementado~~ |
| ~~**SplitText** — Animaciones de caracteres en títulos principales~~ | ~~Hecho~~ | ~~Implementado~~ |
| ~~**View Transitions** — Transiciones cinematográficas entre páginas~~ | ~~Hecho~~ | ~~Implementado~~ |
| ~~**Acentos pendientes** — Corregir tildes en todo el sitio~~ | ~~Hecho~~ | ~~30+ tildes corregidas~~ |
| **Favicon y OG image** — Crear y configurar para redes sociales | Baja | 1 hora |
| **Google Analytics / Vercel Analytics** — Tracking básico | Baja | 30 min |

### Fase 2 — La Inteligencia (1-3 meses)

| Tarea | Dificultad | Detalle |
|---|---|---|
| **Quiz "El Compositor"** — 7 preguntas emocionales + UI inmersiva | Alta | Diseñar preguntas, crear componentes, integrar IA |
| **Qdrant + OpenAI embeddings** — Indexar productos, motor semántico | Media | Docker Qdrant, script de indexación, API route |
| **Resultado del Quiz como experiencia** — Revelación cinematográfica | Alta | Animación GSAP, transición, narración personalizada |
| **n8n self-hosted** — Instalar y configurar workflows básicos | Media | Docker, configuración |
| **WhatsApp Business API** — Conectar Meta API con n8n | Media | Cuenta de Meta Business, webhook config |
| **Chatbot RAG** — Entrenar con catálogo, system prompt de "perfumista" | Alta | RAG pipeline, prompt engineering, testing |
| **Automatización de pedidos** — WhatsApp → Supabase → notificación | Media | n8n workflow, Supabase setup |
| **Briefing matutino** — Cron workflow para resumen diario a Elizabeth | Baja | n8n scheduled workflow |

### Fase 3 — La Magia Visual (3-6 meses)

| Tarea | Dificultad | Detalle |
|---|---|---|
| **Frascos 3D interactivos** — Modelos en Three.js/R3F | Muy Alta | Modelado 3D, optimización, React Three Fiber |
| **Partículas de notas** — Shaders personalizados por familia | Muy Alta | GLSL, particle systems |
| **View Transitions API** — Transiciones cinematográficas entre páginas | Media | Config Next.js 16, CSS animations |
| **Sonido ambiente** — Tone.js generativo por familia olfativa | Alta | Diseño sonoro, implementación, opt-in UX |
| **AR "Ver en tu espacio"** — Model Viewer + WebXR | Alta | Modelos GLB, Model Viewer component |
| **Modo "Ritual"** — Experiencia inmersiva con luz volumétrica | Alta | Three.js + GSAP + audio |

### Fase 4 — El Ecosistema (6-12 meses)

| Tarea | Dificultad | Detalle |
|---|---|---|
| **Migración a Nx Monorepo** — Restructurar todo el proyecto | Muy Alta | apps/web, libs/ui, tools/ |
| **Protobuf + Buf + Connect** — Contratos tipados entre servicios | Alta | .proto files, codegen |
| **Catalog Service real** — Conectar Rust a PostgreSQL con SQLx | Alta | Queries, migraciones Atlas |
| **Order Service (Go + Temporal)** — Workflows durables de pedidos | Muy Alta | Go service, Temporal setup |
| **AI Worker (Python)** — RAG con Qdrant, embeddings | Alta | Python service, API |
| **NFC tags en packaging** — NTAG215 + landing personalizada | Media | Hardware, landing pages |
| **QR de autenticidad** — Hash + verificación en Supabase | Media | Generador de QR, verificación |
| **"El Salón" comunidad** — Espacio privado para collectors | Alta | Auth, dashboard, contenido exclusivo |
| **Suscripción mensual** — Programa de descubrimiento | Alta | Billing, lógica de selección, shipping |

### Fase 5 — Escala Regional (12+ meses)

| Tarea | Detalle |
|---|---|
| Expansión a México, Chile, Perú | Multi-moneda, shipping regional |
| Multi-idioma (ES/EN/PT) | next-intl o similar |
| App móvil nativa | React Native o Expo |
| Pop-ups sensoriales físicos | Eventos presenciales |
| Partnerships hoteles/restaurantes | Business development |

---

## 3. Gotchas y Problemas Conocidos

### Críticos

| Gotcha | Detalle | Solución |
|---|---|---|
| **Shell CWD se resetea** | Cada comando Bash resetea a `/fureliza/fureliza` | Siempre prefixar con `cd /home/jegx/jegx/desktop/work/org/fureliza &&` |
| **No hay imágenes reales** | Los directorios `public/frames/` y `public/products/` están en `.gitignore` y vacíos | Necesita fotografía real o renders 3D |
| **Backend es solo scaffold** | El servicio Rust usa mock data, no queries PostgreSQL reales | Fase 4: conectar SQLx |
| **npm audit: vulnerabilidades moderadas** | Next.js 16.2.1 tiene deps con vulnerabilidades conocidas, sin fix disponible aún | Monitorear updates de Next.js |
| **CSP `unsafe-inline` y `unsafe-eval`** | Necesarios para GSAP y Next.js dev mode, pero debilitan CSP | Fase 2: implementar nonces para scripts |

### Importantes

| Gotcha | Detalle | Solución |
|---|---|---|
| **GSAP con adblockers** | Algunos adblockers bloquean GSAP CDN/chunks | try/catch wrapper + `.gsap-animated` CSS fallback (ya implementado) |
| **120 frames = mucho bandwidth** | 120 WebP por producto × N productos = pesado | Cloudinary con q_auto + lazy loading (ya implementado parcialmente) |
| **WhatsApp URL encoding** | Caracteres especiales en nombres de producto pueden romper el URL | `encodeURIComponent()` ya aplicado en `whatsappCheckoutUrl()` |
| **Zustand stale closure** | `totalPrice()` debe computarse inline, no almacenarse en variable | Ya corregido en code review |
| **ScrollTrigger cleanup** | `ScrollTrigger.killAll()` mata triggers de OTROS componentes | Usar `st.kill()` solo para el trigger propio (ya corregido) |
| **Accordion key={index}** | Usar index como key causa bugs con reordering | Cambiado a `key={item.question}` |
| **Acentos en texto** | Textos iniciales tenían tildes faltantes (Coleccion → Colección) | Corregido en code review, pero revisar nuevos textos |
| **Permissions-Policy bloquea camera/mic** | Si implementamos AR, hay que actualizar Permissions-Policy | Actualizar `next.config.ts` antes de Fase 3 |
| **CSP connect-src limitado** | Solo permite `'self'` y `https://wa.me` | Agregar dominios de Sanity, Cloudinary, Qdrant, etc. al migrar |
| **View Transitions + Safari** | Safari 18 soporta pero versiones anteriores no | Progressive enhancement: funciona sin transiciones |

### Notas de Arquitectura

| Decisión | Por qué | Cuándo cambiar |
|---|---|---|
| Datos en `src/data/products.ts` (estático) | Rápido de iterar, 0 latencia, funciona offline | Migrar a Sanity.io cuando haya >5 productos |
| WhatsApp como checkout | 13-19x más conversión en LATAM, sin necesidad de pasarela de pago | Agregar pasarela solo si el volumen lo justifica |
| Zustand (no Redux/Jotai) | Mínimo boilerplate, selector pattern nativo, perfecto para carrito | No cambiar — es la decisión correcta |
| GSAP (no Framer Motion) | Scroll-driven animations, SplitText, ScrollSmoother — Framer no puede | No cambiar — GSAP es superior para este caso |
| Rust para backend (no Node) | Performance extremo, type safety, la visión es "lo mejor sin importar dificultad" | Supabase Edge Functions para cosas simples, Rust para lo heavy |

---

## 4. Prioridades Inmediatas (Top 5)

1. **Contenido de productos** — Sin fotos reales y más fragancias, no hay tienda
2. **Deploy a Vercel** — Hacer la web accesible al público
3. **Sanity.io** — Para que Elizabeth pueda gestionar productos sin código
4. **Cloudinary** — Optimización automática de imágenes (AVIF/WebP)
5. **Favicon + OG Image** — Branding visual en redes sociales y navegador

---

## 5. Costos Actuales

| Servicio | Costo mensual |
|---|---|
| Vercel (hobby tier) | $0 |
| Sanity.io (free tier) | $0 |
| Supabase (free tier) | $0 |
| Cloudinary (free tier) | $0 |
| Dominio fureliza.com | ~$12/año |
| **Total** | **~$1/mes** |

---

*Documento de estado — v1.1.0 — 31 Marzo 2026*
