# Fur Eliza — Launch Roadmap Design

> v1.0.0 — 4 Abril 2026

---

## 1. Contexto

Fur Eliza tiene la base técnica completa: 11 páginas, GSAP animations, Zustand cart, WhatsApp checkout, SEO, accessibility, security headers, y El Compositor pipeline. TypeScript compila limpio, build pasa, deploy en Vercel funcional.

**Lo que falta es lanzar con producto real.**

Este documento define el plan concreto para pasar de 2 productos demo a un catálogo de 10 fragancias live, con modelo de negocio validado y ruta clara de crecimiento.

---

## 2. Catálogo de Lanzamiento — 10 Fragancias

### Productos existentes

| # | Fragancia | Casa | Familia | Moods |
|---|-----------|------|---------|-------|
| 1 | Megamare | Orto Parisi | ocean-marine | power, mystery, rebellion |
| 2 | Baccarat Rouge 540 | MFK | oriental-spiced | seduction, elegance |

### Nuevas fragancias (8)

| # | Fragancia | Casa | Tamaño | Grey Market | Landed* | Familia | Moods | Margen Decants |
|---|-----------|------|--------|-------------|---------|---------|-------|----------------|
| 3 | **Hacivat** | Nishane | 100ml EDP | $145 | ~$203 | deep-woods | energy, power | ~168% |
| 4 | **Layton** | Parfums de Marly | 125ml EDP | $205 | ~$280 | oriental-spiced | comfort, elegance | ~110% |
| 5 | **Naxos** | Xerjoff | 100ml EDP | $190 | ~$260 | oriental-spiced | comfort, elegance | ~99% |
| 6 | **Side Effect** | Initio | 90ml EDP | $260 | ~$350 | gourmand-sweet | seduction, rebellion | ~47% |
| 7 | **Santal 33** | Le Labo | 100ml EDP | $230 | ~$310 | deep-woods | mystery, rebellion | ~75% |
| 8 | **Lost Cherry** | Tom Ford | 50ml EDP | $200 | ~$270 | gourmand-sweet | seduction, mystery | ~21% |
| 9 | **Delina** | Parfums de Marly | 75ml EDP | $210 | ~$285 | opulent-florals | elegance, innocence | ~27% |
| 10 | **Grand Soir** | MFK | 70ml EDP | $240 | ~$325 | oriental-spiced | comfort, mystery | ~23% |

*\*Landed = grey market × 1.31 (arancel 10% + IVA 19%) + casillero ~$10 USD*

### Cobertura

**Familias olfativas:**
- oriental-spiced: BR540, Layton, Naxos, Grand Soir (4)
- gourmand-sweet: Side Effect, Lost Cherry (2)
- deep-woods: Hacivat, Santal 33 (2)
- ocean-marine: Megamare (1)
- opulent-florals: Delina (1)
- vibrant-citrus: *(futuro)*

**Moods (8/8 cubiertos):**
- power: Megamare, Hacivat
- seduction: BR540, Side Effect, Lost Cherry
- energy: Hacivat
- comfort: Layton, Naxos, Grand Soir
- mystery: Megamare, Lost Cherry, Grand Soir, Santal 33
- elegance: BR540, Layton, Naxos, Delina
- innocence: Delina
- rebellion: Megamare, Side Effect, Santal 33

---

## 3. Modelo de Negocio

### Revenue streams

1. **Discovery Decants** (core) — 5ml y 10ml en atomizadores de cristal
2. **Botellas completas** — Para clientes que ya probaron decants
3. **"Sinfonías Olfativas"** — Sets curados por emoción (3 decants temáticos)
4. **"Tarjetas de Colección"** — 1ml en tarjetas con QR (futuro, Phase 2)

### Pricing (COP)

| Segmento | 5ml | 10ml |
|----------|-----|------|
| Premium Niche (PDM, MFK, Le Labo) | $90,000 - $120,000 | $160,000 - $200,000 |
| Ultra Niche (Xerjoff, Orto Parisi, Initio) | $100,000 - $140,000 | $180,000 - $250,000 |
| Tom Ford | $110,000 - $130,000 | $190,000 - $230,000 |

### Costos de importación a Colombia

| Componente | Tasa |
|------------|------|
| Producto | Precio grey market (Jomashop, AllBeauty, FragranceNet) |
| Casillero | ~$6-18 USD/paquete (Miami → Colombia, 5-7 días hábiles) |
| Arancel | 10% del valor CIF |
| IVA | 19% sobre (CIF + arancel) |
| **Multiplicador total** | **~1.31x** sobre precio + envío |

### Inversión por tiers

| Tier | Fragancias | Inversión Grey | Inversión Landed | Revenue Est. | ROI |
|------|-----------|----------------|------------------|--------------|-----|
| Tier 1 | Hacivat, Layton, Naxos | $540 USD | ~$743 USD | ~$1,550 USD | ~110% |
| Tier 2 | Side Effect, Santal 33, Lost Cherry | $690 USD | ~$930 USD | ~$1,500 USD | ~61% |
| Tier 3 | Delina, Grand Soir | $450 USD | ~$610 USD | ~$900 USD | ~48% |
| **Total** | **8 nuevas** | **$1,680 USD** | **~$2,283 USD** | **~$3,950 USD** | **~73%** |

### Red de distribución

Modelo hub & spoke usando la red global de contactos confiables:
- **Compra local**: Contactos compran donde sea más barato en su país
- **Decanteo centralizado**: Un punto con estándares de calidad
- **Envío directo**: Cada spoke despacha en su región (elimina casillero + aranceles)
- **Control de calidad**: Kits estandarizados + packaging unificado

---

## 4. Generación de Videos

### Flujo actual (temporal)

1. Foto del frasco → Gemini (manual) → Video MP4
2. `npm run frames video.mp4 slug` → 150 desktop + 75 mobile WebP frames
3. Agregar a `public/frames/{slug}/`

### Flujo objetivo (cuando se recargue fal.ai)

1. Foto del frasco → `npm run pipeline "Name" "House" foto.jpg [style]` → Todo automatizado

### Prompts para Gemini

Los prompts están en `docs/AI_VIDEO_GENERATION_GUIDE.md`. Los 7 estilos:

**Hero Reveal** (recomendado para mayoría):
> "Cinematic product reveal of a luxury perfume bottle. The [bottle description] emerges slowly from complete darkness. A single beam of warm golden light sweeps across the glass surface from left to right, revealing intricate details of the bottle design. The camera performs a slow dolly-in from medium shot to close-up. Shallow depth of field creates a dreamy bokeh background. Dark moody atmosphere. Professional studio lighting. 4K quality. Luxury advertising aesthetic. The movement is deliberate and unhurried, evoking exclusivity and desire."

**Orbit** (360° showcase):
> "Elegant 360-degree turntable shot of a luxury perfume bottle on a dark reflective surface. The [bottle description] rotates smoothly counterclockwise at a constant speed. Rim lighting from behind creates a golden halo effect on the glass edges. Front fill light is soft and warm. The background is a deep gradient from charcoal to pure black. No camera movement — only the product rotates. Studio product photography style. Seamless loop. Premium luxury advertisement."

*(Los 7 estilos completos están en AI_VIDEO_GENERATION_GUIDE.md)*

---

## 5. Ideas de Innovación — Roadmap Diferenciador

### Tier S — Cambio de industria (Meses 3-12)

**"El Compositor Biológico" — Perfume personalizado por ADN + microbioma**
- Test de saliva → analizar genes de receptores olfativos (OR5A1, OR7D4, OR5AN1)
- Test de microbioma de piel → entender cómo tu cuerpo transforma moléculas
- IA cruza datos con base de fragancias → recomienda o CREA tu perfume
- Ciencia: EMERGENTE. Paper de bioRxiv 2026 es proof-of-concept (OR5A1 predice preferencia por beta-ionona)
- Nadie combina genómica + microbioma + IA en perfumería
- Requiere alianza con lab de genómica

**"Componer tu Sinfonía" — Layering como composición musical**
- Cada fragancia es un "movimiento" musical
- El usuario combina 2-3 movimientos para crear su sinfonía única
- Jo Malone inventó layering, pero nadie lo fusionó con la metáfora musical
- Implementable con fragancias existentes, costo mínimo

**Terroir Colombiano — El moat imposible de copiar**
- Colombia = 2do país más biodiverso (51,203+ especies, 4,000+ orquídeas)
- Ninguna marca de lujo ha reclamado ese posicionamiento
- Ingredientes: tagua, flor de café, orquídea Cattleya, cacao del Catatumbo
- Requiere alianza con productores locales

### Tier A — Alto impacto, implementable pronto (Meses 1-3)

**Quiz "El Compositor" + WhatsApp AI Concierge**
- 7 preguntas emocionales → recomendación personalizada
- 74% del comercio conversacional en LATAM es WhatsApp
- Conversión estimada: 25% vs 0.5-1% ecommerce estándar

**Drops "Opus" — Ediciones limitadas**
- Cada lanzamiento es un "Opus" numerado (Opus 1, Opus 2...)
- Escasez real + storytelling musical
- "El Salón" (comunidad WhatsApp) vota el próximo Opus

**NFC en botellas**
- Tap con teléfono → autenticidad, historia, guía de layering, contenido exclusivo
- Tags NFC ~$0.15 c/u
- Mercado de $6.35B, +20% tasa de recompra

**Tarjetas de Colección con QR**
- Muestras de 1ml en tarjetas coleccionables
- QR → experiencia digital (video AR del perfume)
- Coleccionables, intercambiables, completa el set

---

## 6. Plan de Ejecución — Launch MVP

### Semana 1: Producto
- [ ] Comprar Tier 1 (Hacivat, Layton, Naxos) via grey market
- [ ] Fotografiar frascos (fondo oscuro, celular)
- [ ] Generar videos con Gemini (estilo hero para cada uno)
- [ ] Extraer frames: `npm run frames video.mp4 slug`
- [ ] Generar datos de producto: `npm run generate "Name" "House"`
- [ ] Agregar 3 nuevos productos a `src/data/products.ts`
- [ ] Configurar DNS fureliza.com → Vercel

### Semana 2: Contenido + Escala
- [ ] Comprar Tier 2 (Side Effect, Santal 33, Lost Cherry)
- [ ] Repetir flujo: foto → video → frames → datos → productos
- [ ] Agregar 3 productos más al catálogo
- [ ] Crear contenido TikTok/Reels con los AI videos
- [ ] Abrir comunidad "El Salón" en WhatsApp

### Semana 3: Completar + Lanzar
- [ ] Comprar Tier 3 (Delina, Grand Soir)
- [ ] Completar catálogo a 10 productos
- [ ] Crear "Sinfonías Olfativas" (sets temáticos)
- [ ] Lanzamiento público: TikTok, Instagram, WhatsApp
- [ ] Primer drop "Opus 1"

### Semana 4: Optimizar
- [ ] Medir conversión web → WhatsApp
- [ ] Ajustar precios según demanda
- [ ] Crear favicon + OG images
- [ ] Activar Vercel Analytics
- [ ] Planear Phase 2 (Quiz, Sanity CMS)

---

## 7. Métricas de Éxito — Mes 1

| Métrica | Objetivo |
|---------|----------|
| Productos en catálogo | 10 |
| Decants vendidos | 20+ |
| Revenue | $400+ USD (~$1.5M COP) |
| Miembros "El Salón" | 30+ |
| Conversión web → WhatsApp | 5% |
| Lighthouse Performance | 95+ |

---

## 8. Presupuesto Total Launch

| Concepto | Costo USD |
|----------|-----------|
| Inventario (8 frascos) | ~$2,283 |
| Atomizadores + packaging | ~$150 |
| Dominio (anual) | ~$12 |
| Vercel (hobby) | $0 |
| OpenRouter (pipeline) | ~$1/mes |
| fal.ai (cuando se recargue) | ~$5-25/mes |
| NFC tags (50 unidades, futuro) | ~$8 |
| **Total inversión inicial** | **~$2,450 USD** |
| **Revenue proyectado mes 1** | **~$400-800 USD** |

---

## 9. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| INVIMA regulatorio | Media | Alto | Operar inicialmente como venta informal por WhatsApp (zona gris estándar del mercado colombiano de decants) |
| Producto dañado en envío | Baja | Medio | Packaging robusto + seguro de casillero |
| Baja conversión | Media | Medio | Quiz + contenido TikTok + "El Salón" como motor orgánico |
| Competencia de precio | Media | Bajo | Diferenciación por experiencia, no por precio. Nadie tiene animaciones cinematográficas + curaduría emocional |
| fal.ai no disponible | Baja | Bajo | Gemini como alternativa manual confirmada |

---

*Design doc — v1.0.0 — 4 Abril 2026*
*Basado en investigación de mercado, análisis de proveedores y estudio de ciencia de personalización olfativa.*
