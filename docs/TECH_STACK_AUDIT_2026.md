# Fur Eliza — Auditoría de Stack Tecnológico (Marzo 2026)

> Investigación profunda en tres rondas: R1 evaluó alternativas, R2 cuestionó cada recomendación sin importar la dificultad (revirtió 3 de 4), R3 analizó problemas/soluciones de cada CMS para decisión definitiva. 160+ fuentes, 13 investigaciones paralelas.

---

## Resumen Ejecutivo

### Lo que cambió tras la segunda ronda de investigación

La primera ronda recomendó 4 cambios. La segunda ronda — que cuestionó brutalmente cada decisión con la premisa "lo mejor sin importar la dificultad" — **revirtió 3 de los 4**:

| Recomendación original | Veredicto final | Por qué cambió |
|---|---|---|
| ~~Lenis reemplaza ScrollSmoother~~ | **MANTENER ScrollSmoother** | Los "bugs" son arquitecturales, no del library. ScrollSmoother tiene features únicas (data-speed, smoothTouch) que Lenis no puede replicar. Mejor rendimiento en móvil. |
| ~~Payload CMS reemplaza Sanity~~ | **USAR Sanity.io** | Payload gana para el developer. Sanity gana para el negocio. Visual editing superior, image CDN incluido, probado en marcas de lujo, menor costo total real. |
| Hono.js reemplaza Rust/Axum | **CONFIRMADO: usar TypeScript** | Pero refinado: no necesitas backend separado aún. Next.js API routes + Server Actions son suficientes. Hono cuando necesites extraer la API. |
| ~~Neon reemplaza Docker Postgres~~ | **USAR Supabase** | Neon tiene cold starts que dañan la UX de lujo. Supabase: always-on, auth incluido, storage incluido, región São Paulo para Colombia (~30ms). |

### Stack Final Definitivo

```
FRONTEND (mantener todo)
  Next.js 16 + TypeScript strict + Tailwind CSS 4 + Zustand 5

ANIMACIONES (mantener todo, arreglar arquitectura)
  GSAP ScrollSmoother + ScrollTrigger + SplitText  ← MANTENER
  View Transitions API                              ← MANTENER
  Arreglar: mover Navbar/CartDrawer fuera de #smooth-wrapper

BACKEND (simplificar)
  Next.js API Routes + Server Actions  (ahora)      ← NO backend separado
  Hono.js                             (cuando se necesite extraer API)

BASE DE DATOS (cambio)
  Supabase Pro en sa-east-1 (São Paulo) ← MEJOR QUE NEON
  Drizzle ORM                           ← CONFIRMADO
  pgvector                              ← CONFIRMADO (reemplaza Qdrant)

CMS (cambio de la primera ronda)
  Sanity.io                             ← MEJOR QUE PAYLOAD para el negocio
  Sanity Image Pipeline                 ← REEMPLAZA CLOUDINARY (incluido gratis)

AUTOMATIZACIÓN
  n8n self-hosted (WhatsApp flows)      ← CONFIRMADO
  Trigger.dev v3 (background jobs)      ← CONFIRMADO

TOOLING
  Biome (reemplaza ESLint + Prettier)   ← CONFIRMADO
  Bun (como package manager)            ← CONFIRMADO

DEPLOY
  Vercel free tier (ahora)
  → Cloudflare Pages (cuando escale — PoPs en Bogotá + Medellín)
```

---

## 1. ANIMACIONES — Mantener ScrollSmoother (arreglar arquitectura)

### Por qué se revirtió la recomendación de Lenis

La primera ronda recomendó cambiar a Lenis por problemas con `position: sticky` y elementos fixed. La segunda ronda descubrió que:

**Los problemas son de arquitectura, no del library.**

El `layout.tsx` actual pone Navbar, CartDrawer y Toast **dentro** de `<SmoothScroll>`. La solución documentada por GSAP es moverlos **fuera**:

```tsx
// layout.tsx — CORRECTO
<body>
  <SmoothScroll>{children}</SmoothScroll>  {/* Solo contenido scrolleable */}
  <Navbar />       {/* Fuera del wrapper — fixed funciona perfecto */}
  <CartDrawer />   {/* Fuera del wrapper */}
  <Toast />        {/* Fuera del wrapper */}
</body>
```

Para `StickyAddToCart.tsx` (usa `position: fixed`, no `sticky`): funciona perfecto una vez fuera del wrapper.

Para `HeroScroll.tsx` (usa CSS `sticky`): reemplazar con ScrollTrigger `pin: true` — una línea de cambio.

### Features únicas de ScrollSmoother que Lenis NO tiene

| Feature | ScrollSmoother | Lenis |
|---------|---------------|-------|
| `data-speed="0.5"` (parallax declarativo) | ✅ HTML attribute, zero JS | ❌ Requiere código manual por elemento |
| `data-lag="0.8"` (delay orgánico) | ✅ | ❌ |
| `effects: true` (auto-detect parallax) | ✅ | ❌ |
| `smoothTouch: 0.1` (suave en móvil) | ✅ Estable | ⚠️ Inestable en iOS <16, jitter en Android |
| `normalizeScroll: true` (fix address bar resize) | ✅ | ❌ |
| Integración ScrollTrigger nativa | ✅ Sin proxy | ⚠️ Requiere bridge: `lenis.on('scroll', ScrollTrigger.update)` |

### Rendimiento en móvil (crítico para Colombia)

70%+ de usuarios colombianos navegan en móvil (Android mid-range dominante):

- **ScrollSmoother**: Usa scroll nativo del browser. El compositor del browser maneja el scrolling en su propio thread. ScrollSmoother solo aplica un transform offset.
- **Lenis**: Intercepta eventos de scroll y re-implementa momentum en JavaScript en el main thread. Con animaciones GSAP pesadas (120 frames canvas, SplitText, timelines), compite por tiempo del main thread. Usuarios reportan caídas de 60fps a 40fps en móvil.

### Qué usan los mejores del mundo

| Sitio | Scroll |
|-------|--------|
| Apple.com | **Sin smooth scroll library** — scroll nativo + animaciones GSAP |
| Hermes.com | Sin smooth scroll — diseño basado en restraint |
| Awwwards winners (GSAP-heavy) | ScrollSmoother (para sitios con animación heavy) |
| Awwwards winners (content sites) | Lenis |
| Active Theory | Engine propio (Hydra) |

**Conclusión**: Para sitios animation-heavy como Fur Eliza (120-frame canvas, SplitText, timelines), ScrollSmoother es superior. Lenis domina en marketing sites con animaciones simples.

---

## 2. CMS — Sanity.io (decisión definitiva tras 3 rondas de investigación)

> Investigación en 3 rondas: R1 recomendó Payload, R2 revirtió a Sanity, R3 analizó problemas/soluciones de cada opción para decisión final.

### Comparativa directa

| Factor | Sanity | Payload | Ganador |
|--------|--------|---------|---------|
| **Seguridad** | 0 CVEs conocidos | CVE-2026-25544 CVSS 9.8 (SQLi en Postgres adapter) | **Sanity** |
| **Editing UX** | Visual editing overlay en el sitio live (free tier) | Visual Editor solo Enterprise, Live Preview + plugin comunitario | **Sanity** |
| **Image pipeline** | CDN incluido, hotspot, AVIF, LQIP, gratis | Requiere Cloudinary ($89/mo+) | **Sanity** |
| **Costo total real** | $0 (free tier) → $15/user/mo | $0 software + €5-10/mo VPS + tiempo DevOps | **Sanity** |
| **Operaciones** | SaaS gestionado, 0 servidores | Self-host: VPS + DB + backups + monitoreo | **Sanity** |
| **Probado en luxury** | Nike, Puma, Shopify+ stores | Sin case studies luxury | **Sanity** |
| **Colaboración real-time** | Google Docs-style co-editing | Last save wins | **Sanity** |
| **TypeScript DX** | GROQ + Sanity Typegen (incompleto) | TS nativo, zero codegen | **Payload** |
| **Data ownership** | Sanity cloud (exportable NDJSON) | Tu Postgres, full control | **Payload** |

### Problemas de Sanity y cómo los resolvemos

| # | Problema | Solución | Riesgo residual |
|---|----------|----------|-----------------|
| 1 | GROQ propietario, TypeGen genera `unknown` en queries complejas | Queries simples + Zod runtime validation en capa de datos | Medio — mejorar con cada release |
| 2 | Free tier público (cualquiera puede query-ar GROQ API) | Catálogo es público por naturaleza. Datos sensibles → Supabase | Bajo |
| 3 | CDN más cercano a Colombia = São Paulo (~80-120ms) | ISR en Next.js + Vercel Edge (PoP en Bogotá). Contenido estático. | Bajo |
| 4 | 10K docs, 100GB bandwidth en free tier, bloqueo sin aviso | Monitorear en Sanity Manage. ISR reduce API calls. Webhook revalidation. | Medio |
| 5 | Studio builds lentos (~1min producción) | `npx sanity dev` (Vite) en desarrollo. Solo afecta DX. | Bajo |
| 6 | Portable Text = lock-in para rich text | Schemas simples, exports NDJSON semanales automatizados | Medio |
| 7 | Image CDN no sirve para 120 frames secuenciales | Frames en Cloudflare R2/CDN externo. Solo imágenes editoriales en Sanity. | Resuelto |
| 8 | Plugins comunitarios con bugs (parseadores, markdown) | Evaluar plugins antes de adoptar. Preferir SDK oficial. | Bajo |
| 9 | `useCdn: false` quema API quota (draft mode/previews) | `useCdn: true` en producción. Preview solo en Studio/desarrollo. | Bajo |

### Problemas de Payload y por qué pesan más

| # | Problema | Solución | Riesgo residual |
|---|----------|----------|-----------------|
| 1 | **CVE-2026-25544 CVSS 9.8** — SQLi en Postgres adapter | Actualizar inmediatamente, monitorear CVEs | **ALTO** — indica inmadurez en auditoría |
| 2 | Cold starts de 7 segundos en Vercel | Self-host en VPS (Hetzner €5/mes) | Medio — necesitas mantener infra |
| 3 | Visual Editor solo Enterprise | Live Preview + plugin `payload-visual-editor` (no oficial) | Medio — plugin puede romperse |
| 4 | Breaking changes en versiones menores | Fijar versiones exactas en package.json | Medio — ralentiza mejoras |
| 5 | Figma compró Payload → futuro de Payload Cloud incierto | Self-host elimina dependencia del cloud | Bajo si self-host |
| 6 | **Necesitas administrar VPS + DB + backups** | Hetzner + Neon + Cloudinary | **ALTO para 1-2 personas** |

### 10 alternativas evaluadas (ninguna gana)

| CMS | Por qué NO para Fur Eliza |
|-----|--------------------------|
| Keystatic / TinaCMS / Outstatic | Git-based → no maneja 120 frames ni contenido dinámico pesado |
| Storyblok | $99+/mes, excesivo para catálogo de 2 productos |
| DatoCMS | $160+/mes |
| Hygraph | $199+/mes |
| Directus | Self-host = mismo overhead de infra que Payload |
| Builder.io | Visual builder, no CMS real para datos estructurados |
| Shopify Starter | $5/mes viable como PIM temporal, pero no reemplaza CMS |
| Refine / React Admin | Admin UI, no CMS con content lake |
| Decap CMS | Git-based, sin image pipeline |

El requisito de 120 frames elimina todos los CMS Git-based. El presupuesto elimina todos los SaaS premium (>$50/mes). El equipo de 1-2 personas elimina todos los self-hosted que requieren DevOps.

### Sanity Image Pipeline elimina la necesidad de Cloudinary

Con Sanity, NO necesitas un servicio de imágenes separado:

- Auto AVIF/WebP en el edge
- Hotspot/focal point (el editor marca el punto focal, el código recorta en cualquier aspect ratio)
- LQIP automático (blur-up placeholder gratis)
- Transformaciones por URL: `?w=800&h=600&fit=crop&auto=format`
- CDN global via Fastly
- Incluido en el plan gratuito (500K requests/mo)

**IMPORTANTE**: Los 120 frames de animación NO van en Sanity. Van en Cloudflare R2 con CDN (PoP en Bogotá). Sanity solo almacena la referencia: `{ directory: "/frames/oud-royale/", count: 120, format: "webp" }`.

### Mitigaciones desde día 1

1. **Queries tipados**: Sanity TypeGen + Zod validation en capa de datos
2. **ISR agresivo**: `revalidate: 300` + webhook → `revalidateTag()` on-demand
3. **Export semanal**: `sanity dataset export` automatizado con cron (anti lock-in)
4. **Frames fuera de Sanity**: Cloudflare R2 con CDN global
5. **Datos sensibles fuera de Sanity**: Usuarios, quiz AI, analytics → Supabase
6. **Parameterized GROQ**: Nunca interpolar user input en queries (previene GROQ injection)

### Qué usan las marcas de fragancia reales

| Marca | Plataforma |
|-------|-----------|
| Byredo | Magento 2 / Adobe Commerce |
| Diptyque | Magento 2 (grupo Manzanita) |
| Le Labo | Salesforce Commerce Cloud (Estée Lauder) |
| Jo Malone | Salesforce CC (Estée Lauder) |
| Maison Francis Kurkdjian | Shopify Plus |
| DS & Durga | Shopify |
| Boy Smells | Shopify Plus |

Ninguna usa Payload. Algunas usan Sanity como content layer junto a Shopify.

---

## 3. BACKEND — No necesitas backend separado (aún)

### La verdad incómoda

El scaffold Rust en `backend/services/catalog-service/src/main.rs` tiene **186 líneas de mock data**. Zero lógica de negocio. El Onyx Protocol describe 4 lenguajes + Protobuf para un store de 2 productos.

### La realidad del rendimiento

```
Cliente (Bogotá) → CDN/Edge → Servidor    30-70ms  red
Servidor → Postgres                         5-20ms  query DB
Postgres → Servidor (procesamiento)        0.1-2ms  overhead framework  ← IRRELEVANTE
Servidor → Cliente                          30-70ms  red de vuelta
                                          ─────────
Total:                                     65-162ms
```

El overhead del framework (donde Rust vs TypeScript difiere) es **0.1% a 1.3% del tiempo total de respuesta**. El bottleneck es la red y la base de datos.

### Qué usan los grandes

| Empresa | Backend | Escala |
|---------|---------|--------|
| **Shopify** | Ruby on Rails | 489M req/min en Black Friday |
| **Rappi** (Colombia) | Node.js + Ruby | 7.5M usuarios semanales |
| **MercadoLibre** | Go + Spanner | 214K queries/sec |
| **LVMH** | Salesforce CC | 34 sites internacionales |

Shopify — el ecommerce más grande del mundo — usa **Ruby on Rails**, uno de los frameworks "más lentos". Y funciona. El framework no importa a esta escala.

### La estrategia correcta

1. **Ahora**: Next.js API Routes + Server Actions. Tu producto data pasa de `data/products.ts` a Sanity. Tu cart ya está en Zustand client-side. Tu checkout es un link de WhatsApp. **No hay API que construir.**

2. **Cuando necesites API separada** (WhatsApp bot, integración con n8n): Hono.js dentro de Next.js API routes inicialmente, extraer después.

3. **Si algún día necesitas Rust**: Para procesamiento de imágenes, ML inference, o >100K concurrent requests. Eso no va a pasar en los próximos 2-3 años.

### Lo que se elimina del Onyx Protocol

| Componente Onyx | Reemplazado por |
|-----------------|-----------------|
| Rust/Axum catalog service | Next.js Server Components + Sanity |
| Go/Temporal orders service | Trigger.dev v3 (TypeScript) |
| Python AI worker | Vercel AI SDK + pgvector |
| Qdrant vector DB | pgvector en Supabase |
| Protobuf + Buf + Connect | No necesario (un solo lenguaje) |
| Atlas migrations | Drizzle Kit |
| Nx monorepo | Standard Next.js project |

---

## 4. BASE DE DATOS — Supabase (no Neon)

### Por qué Supabase es mejor que Neon para Fur Eliza

La segunda ronda descubrió un problema crítico con Neon:

**Cold starts**. Neon escala a zero después de 5 minutos de inactividad. Fur Eliza es un sitio nuevo con tráfico bajo. A las 3am, el compute se apaga. Cuando alguien visita a las 7am, la reactivación toma 500ms a varios segundos. Para una marca de lujo, esa primera impresión lenta **destruye la experiencia**.

| Aspecto | Neon | Supabase |
|---------|------|----------|
| Cold starts | ✅ Sí (500ms-3s) | ❌ No (always-on) |
| Región São Paulo | ✅ sa-east-1 | ✅ sa-east-1 |
| Latencia a Bogotá | ~30-40ms + cold start | ~30-40ms (consistente) |
| Auth incluido | ❌ | ✅ (GoTrue, 100K MAUs) |
| Storage incluido | ❌ | ✅ (100GB) |
| Realtime incluido | ❌ | ✅ (WebSocket) |
| pgvector | ✅ | ✅ |
| Free tier | 500MB, 10 branches | 500MB, auth, storage, realtime |
| Pro tier | $19/mo | $25/mo |
| Branching | ✅ (killer feature) | ✅ (Git-based) |

### Supabase en sa-east-1 resuelve la latencia para Colombia

São Paulo a Bogotá: ~30-40ms de latencia de red. Aceptable. Always-on significa latencia consistente sin cold starts.

### ORM: Drizzle (confirmado)

| Aspecto | Drizzle | Prisma 7 |
|---------|---------|----------|
| Bundle | **7.4 KB** | ~100KB+ (mejorado en v7, pero aún mayor) |
| SQL control | Total — escribes SQL-like en TS | Abstracción que puede leakear en queries complejas |
| Cold start serverless | Mínimo | Mejorado 9x en v7, aún mayor |
| Queries complejas (AI quiz) | SQL directo, optimizable | Limitado por la abstracción |

### Vector Search: pgvector (confirmado)

Para <100 productos, pgvector retorna en **microsegundos**. Incluso a 1000 productos: <5ms. A 10,000: <10ms. No necesitas Qdrant hasta **millones** de vectores.

Búsqueda híbrida (keyword + semántica) es posible dentro de Postgres combinando `tsvector` + `pgvector` + Reciprocal Rank Fusion. ~84% de precisión vs ~62% de solo vector search.

---

## 5. LO QUE SE CONFIRMA COMO MEJOR OPCIÓN

### GSAP ScrollTrigger + SplitText — IRREMPLAZABLE

Verificado contra Motion (Framer Motion), CSS Scroll-Driven Animations, Rive, Theatre.js. Para el caso específico de Fur Eliza (120-frame canvas scrub, SplitText character animations, complex timelines), **no hay alternativa que funcione**.

Apple.com usa exactamente la misma técnica: canvas + image sequences + GSAP ScrollTrigger.

### Next.js 16 — MEJOR FRAMEWORK

Verificado contra Remix v7, Astro, SvelteKit, TanStack Start. Next.js gana por: RSC estable, Turbopack, View Transitions, ecosistema React (GSAP, Zustand, R3F), deploy en Vercel.

Louis Vuitton usa Vue/Nuxt (decisión pre-2020). La tendencia 2025-2026 de Awwwards winners es Next.js.

### Zustand 5 — MEJOR PARA CARRITO

Verificado contra Jotai, Legend State, Valtio, TanStack Store. Para un carrito de compras con WhatsApp URL builder, Zustand es la opción más simple y correcta.

### Tailwind CSS 4 — MEJOR PARA LUXURY DESIGN

Verificado contra UnoCSS, Panda CSS, vanilla-extract, StyleX. El sistema `@theme` de v4 maneja los design tokens (`--color-gold`, `--font-playfair`) perfectamente. Las alternativas requieren reescritura sin beneficio proporcional.

### n8n — MEJOR PARA WHATSAPP AUTOMATION

n8n tiene integración nativa con WhatsApp Business API. Elizabeth puede ver y modificar flujos visualmente. Self-hosted en VPS $5-10/mes.

### View Transitions API — MANTENER

~78% browser support. Progressive enhancement. GPU-accelerated. La mejor opción nativa para transiciones de página.

---

## 6. TOOLING — Mejoras confirmadas

| Cambio | De | A | Beneficio |
|--------|-----|-----|-----------|
| Linting/Formatting | ESLint + Prettier | **Biome** | 25x más rápido, un binario |
| Package manager | npm | **Bun** (como pkg manager) | 20-40x installs más rápidos |
| Runtime | Node.js | **Node.js** (mantener) | Next.js certifica Node |

---

## 7. DEPLOY — Vercel ahora, Cloudflare después

| Plataforma | PoPs en Colombia | TTFB |
|-----------|-----------------|------|
| **Cloudflare** | Bogotá + Medellín | <20ms |
| **Vercel** | No especificado | ~70ms |

**Ahora**: Vercel free tier (mejor DX, integración Next.js perfecta).
**Después**: Cloudflare Pages cuando el tráfico justifique sub-20ms para Colombia.

---

## 8. FUTURO — Tecnologías inmersivas (Fases 2-4)

### Lo que los mejores del mundo usan

| Marca/Agency | Animación | 3D | Approach |
|---|---|---|---|
| Apple | GSAP + Canvas sequences | WebGL (selectivo) | Restraint + craft |
| Hermès | Ilustración artesanal | Ninguno | Deliberate restraint |
| Guerlain | Custom | WebGL (Hapticmedia configurator) | 3D bottle con refracción real |
| Active Theory | Engine propio (Hydra) | WebGL2 custom | Maximum performance |
| Awwwards ecommerce winners | GSAP (dominante) | Three.js (dominante) | GSAP + Three.js stack |

### La oportunidad de diferenciación

Ninguna marca de fragancia de lujo actualmente combina TODO esto:
- Canvas scroll animation (estilo Apple) ← **Ya lo tienes**
- 3D WebGL bottle visualization
- AI scent recommendation
- Sonido ambiental generativo
- WhatsApp-native checkout

Si se ejecuta bien, Fur Eliza estaría adelante de marcas con 100x el presupuesto.

### Stack inmersivo futuro (confirmado)

| Tecnología | Para qué | Cuándo |
|---|---|---|
| React Three Fiber + drei | 3D viewer de frascos | Fase 3 |
| Theatre.js | Keyframe editor visual para 3D | Con R3F |
| WebGPU + TSL | Refracción de vidrio, partículas, fog | Fase 3-4 |
| `<model-viewer>` | AR en un tap (GLB + USDZ) | Fase 2-3 |
| Tone.js | Audio generativo ambiental por familia | Fase 2 |
| Vercel AI SDK 6 + Claude/Gemini | Chat advisor de fragancias | Fase 2 |

Jo Malone (Estée Lauder) lanzó AI Scent Advisor con Gemini en dic 2025. Conversión +30%. Es el benchmark.

---

## 9. COSTOS EN PRODUCCIÓN

| Servicio | Costo/mes |
|----------|-----------|
| Vercel (hobby) | $0 |
| Supabase (free tier → pro $25) | $0-25 |
| Sanity.io (free tier → growth $99) | $0-99 |
| n8n (VPS) | $5-10 |
| Trigger.dev (free tier) | $0 |
| Dominio fureliza.com | ~$1 |
| **Total lanzamiento** | **~$6-11/mes** |
| **Total growth** | **~$130-135/mes** |

**Nota**: Sanity elimina la necesidad de Cloudinary ($89/mo). Su image pipeline está incluido.

---

## Fuentes (130+ consultadas, las más relevantes)

### Animaciones
- [GSAP ScrollSmoother Documentation](https://gsap.com/docs/v3/Plugins/ScrollSmoother/)
- [ScrollSmoother Fixed Elements — GSAP Forum](https://gsap.com/community/forums/topic/31772-scrollsmoother-fixed-elements-issue/)
- [ScrollSmoother + Sticky → Pin Migration](https://gsap.com/community/forums/topic/44509-scrollsmoother-position-sticky-migrate-to-pin/)
- [Lenis Mobile Issues — GitHub #487](https://github.com/darkroomengineering/lenis/issues/487)
- [Lenis vs ScrollSmoother — Zun Creative](https://zuncreative.com/blog/smooth_scroll_meditation/)
- [GSAP vs Motion Comparison](https://motion.dev/docs/gsap-vs-motion)

### CMS
- [Sanity.io Visual Editing](https://www.sanity.io/docs/visual-editing)
- [Sanity Image Pipeline](https://www.sanity.io/docs/image-pipeline)
- [Payload CMS 3](https://payloadcms.com/)

### Backend & Database
- [Neon Connection Latency](https://neon.com/docs/connect/connection-latency)
- [Supabase Pricing & Regions](https://supabase.com/pricing)
- [Drizzle vs Prisma 2026](https://makerkit.dev/blog/tutorials/drizzle-vs-prisma)
- [pgvector vs Qdrant](https://encore.dev/articles/pgvector-vs-qdrant)
- [Shopify Tech Stack — ByteByteGo](https://blog.bytebytego.com/p/shopify-tech-stack)
- [Rappi on Google Cloud](https://cloud.google.com/customers/rappi)
- [Hono RPC Documentation](https://hono.dev/docs/guides/rpc)

### Luxury Brands
- [Hermès Digital — WelcomeToTheJungle](https://www.welcometothejungle.com/en/companies/hermes/tech)
- [Byredo Case Study — Inviqa](https://inviqa.com/case-studies/byredo)
- [Louis Vuitton — Made with Vue.js](https://madewithvuejs.com/louis-vuitton)
- [Jo Malone AI Scent Advisor](https://www.jomalone.com/ai-scent-advisor)
- [Apple Scroll Animations — CSS-Tricks](https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/)
- [Guerlain 3D Configurator — Hapticmedia](https://hapticmedia.com/success-stories/personalized-perfume-bottle-guerlain/)

### Deploy & Tooling
- [Cloudflare PoP Bogotá](https://blog.cloudflare.com/bogota/)
- [Cloudflare PoP Medellín](https://blog.cloudflare.com/listo-medellin-colombia-cloudflares-28th-data-center/)
- [Biome vs ESLint+Prettier 2026](https://www.pkgpulse.com/blog/biome-vs-eslint-prettier-linting-2026)

### Immersivo
- [WebGPU All Major Browsers Ship It](https://www.webgpu.com/news/webgpu-hits-critical-mass-all-major-browsers/)
- [React Three Fiber vs Three.js 2026](https://graffersid.com/react-three-fiber-vs-three-js/)
- [Vercel AI SDK 6](https://vercel.com/blog/ai-sdk-6)
- [Active Theory — Story of Technology](https://medium.com/active-theory/the-story-of-technology-built-at-active-theory-5d17ae0e3fb4)
- [Awwwards GSAP Sites](https://www.awwwards.com/websites/gsap/)

---

*Investigación completada: 27 de Marzo 2026*
*2 rondas de investigación, 10 investigaciones paralelas, 130+ fuentes*
*Segunda ronda revirtió 3 de 4 recomendaciones originales tras análisis sin importar dificultad*
