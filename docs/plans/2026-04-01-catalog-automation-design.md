# Fur Eliza — Sistema de Automatización de Catálogo y Contenido

> **Nombre clave**: "El Compositor"
> **Fecha**: 1 de Abril 2026
> **Enfoque**: B — Plataforma emocional automatizada
> **Presupuesto**: $200-500 USD inicial, ~$20/mo operativo

---

## 1. Visión General

Un sistema de 4 capas que automatiza el ciclo completo: desde encontrar la fragancia al mejor precio hasta tenerla publicada en fureliza.com con scroll animation, descripciones poéticas y pricing optimizado — todo en ~45 minutos por producto.

```
SOURCING → CATÁLOGO → VISUAL → NEGOCIO
(dónde comprar)  (datos + contenido)  (video + frames)  (cómo vender)
```

Lo que hace diferente a Fur Eliza de los 20+ decantadores en Colombia:
- Organización por **emoción**, no por género ni casa
- Experiencia web **inmersiva** (scroll animation estilo Apple)
- Contenido **sinestésico** (aroma traducido a visual + sonido)
- Quiz **"El Compositor"** que revela tu identidad olfativa
- **Tarjetas de Colección** (1ml + card con QR)
- Comunidad con **votación** del próximo drop

---

## 2. Capa 1 — Sourcing Inteligente

### Fuentes de compra (ranking por precio)

| # | Fuente | Descuento vs retail | Envío a Colombia | Mejor para |
|---|--------|---------------------|------------------|------------|
| 1 | **Jomashop** (testers) | 20-40% | Casillero virtual | PDM, Initio, Amouage |
| 2 | **AllBeauty UK** | 35-47% | Directo o casillero | PDM Layton, Nishane |
| 3 | **FragranceNet** | 30-40% + cupones | Directo a Colombia | Selección amplia |
| 4 | **FragranceX** | 20-40% | Directo | Descontinuados |
| 5 | **Arabic brands (AliExpress/UAE)** | 70-90% vs reventa | Directo | Lattafa, Afnan, Al Haramain |
| 6 | **eBay lots/estate sales** | Variable | Casillero | Vintage, descontinuados |

### Costos de importación a Colombia

| Concepto | Tasa |
|----------|------|
| Arancel de importación | 10% sobre CIF |
| IVA | 19% sobre (CIF + arancel) |
| **Total carga impositiva** | **~31%** sobre valor CIF |
| Casillero virtual (Coordinadora) | ~$17-23 USD/lb |

### Fórmula de ROI por botella

```
COSTO_TOTAL = (precio_compra + envío_US) × 1.31 + casillero
REVENUE = (ml_útiles / ml_decant) × precio_decant_COP
MARGEN = (REVENUE - COSTO_TOTAL) / COSTO_TOTAL × 100

ml_útiles = ml_botella × 0.90  (10% pérdida por transferencia)
```

### Starter Kit Recomendado ($350 en inventario)

| Fragancia | Precio compra | ml | Costo/ml | Decants 5ml | Precio venta c/u | Revenue |
|-----------|--------------|-----|----------|-------------|-------------------|---------|
| PDM Layton 125ml (tester, Jomashop) | ~$165 | 112 útiles | $1.47/ml | 22 | $30,000 COP (~$7) | $154 |
| Lattafa Raghba (AliExpress) | ~$25 | 90 útiles | $0.28/ml | 18 | $18,000 COP (~$4.20) | $75 |
| Nishane Hacivat 100ml (AllBeauty) | ~$160 | 90 útiles | $1.78/ml | 18 | $45,000 COP (~$10.50) | $189 |
| **Total** | **$350** | | | **58 decants** | | **~$418** |

**ROI estimado**: 19% neto después de impuestos, casillero y supplies.
**Con pricing colombiano optimizado**: 30-50% neto.

### Monitor de precios (futuro)

Script que revisa diariamente:
- Jomashop, AllBeauty, FragranceNet para fragancias target
- Alerta por WhatsApp/email cuando el precio baja del umbral
- Calcula ROI automáticamente incluyendo impuestos

---

## 3. Capa 2 — Catálogo Automático

### Pipeline de datos

```
Fragella API ($12/mo)          Claude API (~$0.01/producto)
       │                                │
       ▼                                ▼
┌─────────────┐                ┌──────────────────┐
│ Datos base: │                │ Contenido generado│
│ - Notas     │───────────────▶│ - Descripción ES  │
│ - Accords   │                │ - Tags emocionales│
│ - Sillage   │                │ - Mood            │
│ - Longevity │                │ - Occasions       │
│ - Ratings   │                │ - SEO meta        │
└─────────────┘                └──────────────────┘
                                        │
                                        ▼
                               ┌──────────────────┐
                               │ ProductInput +    │
                               │ ProductGenerated  │
                               │ → products.ts     │
                               └──────────────────┘
```

### Fragella API — Datos disponibles

- 74,000+ fragancias indexadas
- Notas: top, heart, base con porcentajes
- Accords con intensidad
- Performance: longevity, sillage, season ratings
- Imágenes CDN
- Precio: $12/mo (5,000 requests) — más que suficiente

### Prompt template para Claude API

```
Eres el poeta de Fur Eliza, una curaduría de experiencias olfativas
inspirada en Beethoven. Escribe en español colombiano, tono lírico
pero accesible.

Fragancia: {name} por {house}
Notas de salida: {top_notes}
Notas de corazón: {heart_notes}
Notas de fondo: {base_notes}
Accords principales: {accords}
Performance: intensidad {intensity}/10, proyección {projection}/10, longevidad {longevity}/10

Genera en JSON:
1. "description": Descripción poética (3 frases, máx 280 chars)
2. "emotionalTags": 6 tags emocionales en inglés
3. "mood": Array de moods (power|seduction|energy|comfort|mystery|elegance|innocence|rebellion)
4. "occasions": Array (evening|date-night|formal|casual|office|statement)
5. "season": Array (spring|summer|fall|winter)
6. "metaDescription": SEO meta en español (máx 155 chars)
```

### Output: Objeto Product completo

El script genera automáticamente el objeto TypeScript para `src/data/products.ts` con todos los campos de `ProductInput` + `ProductGenerated`. Solo falta agregar `ProductAssets` (Capa 3).

---

## 4. Capa 3 — Pipeline Visual

### Equipamiento físico ($55-80 una vez)

| Item | Costo | Dónde |
|------|-------|-------|
| Lazy Susan (base giratoria) | $15-20 | Ferretería local |
| Tela velvet negro (fondo) | $10-15 | Tienda de telas |
| Panel LED pequeño | $20-30 | Amazon/MercadoLibre |
| Trípode para celular | $10-15 | Amazon/MercadoLibre |

### Pipeline: Foto → Frames

```
1. FOTOGRAFIAR (15 min)
   └─ Celular en trípode + botella en turntable + velvet negro + LED lateral
   └─ Grabar video 360° O tomar foto estática para IA

2. GENERAR VIDEO (2-5 min)
   ├─ Opción A: Kling 3.0 ($7/mo) — subir mejor foto → video rotación 10s
   └─ Opción B: Video directo del turntable (gratis)

3. EXTRAER FRAMES (30 seg)
   └─ FFmpeg:
      Desktop: 150 frames @ 1920px, WebP quality 80
      Mobile:   75 frames @  960px, WebP quality 70

4. GENERAR HERO/CARD (5 min)
   ├─ Photoroom: remove background (gratis, 250/mo)
   ├─ Hero: foto sobre fondo oscuro estilizado
   └─ Card: crop cuadrado para grid de colección

5. DEPLOY
   └─ Copiar a public/frames/{slug}/ y public/products/
   └─ Agregar ProductAssets al objeto en products.ts
```

### Comandos FFmpeg

```bash
# Desktop: 150 frames, 1920px wide, WebP quality 80
ffmpeg -i input.mp4 \
  -vf "select=not(mod(n\,$(echo "$(ffprobe -v error -count_frames \
    -select_streams v:0 -show_entries stream=nb_read_frames \
    -of csv=p=0 input.mp4) / 150" | bc)))" \
  -vsync vfr -frames:v 150 -c:v libwebp -quality 80 \
  frames/frame_%04d.webp

# Mobile: 75 frames, 960px wide, WebP quality 70
ffmpeg -i input.mp4 \
  -vf "select=not(mod(n\,$(echo "$(ffprobe -v error -count_frames \
    -select_streams v:0 -show_entries stream=nb_read_frames \
    -of csv=p=0 input.mp4) / 75" | bc))),scale=960:-1" \
  -vsync vfr -frames:v 75 -c:v libwebp -quality 70 \
  frames/mobile/frame_%04d.webp
```

### Actualización del HeroScroll

Cambiar de 120 frames fijos a leer `frames.count` dinámicamente (ya lo hace). Solo actualizar el dato del producto:

```typescript
frames: {
  directory: "/frames/{slug}",
  count: 150,  // desktop
  format: "webp",
},
```

El componente `HeroScroll.tsx` ya usa `product.frames.count` para el loop — no necesita cambios.

### Presupuesto visual por tier

| Tier | Herramientas | Costo/mo | Calidad |
|------|-------------|----------|---------|
| **Budget** (arranque) | Turntable video + FFmpeg | $0 | Aceptable |
| **Recomendado** | Kling 3.0 + Photoroom free | $7 | Buena |
| **Semi-Pro** (mes 3+) | Kling Pro + Meshy + Topaz | $60 | Muy buena |
| **Premium** (revenue alto) | Veo 3.1 + Rodin + Runway | $200+ | Estudio profesional |

---

## 5. Capa 4 — Modelo de Negocio Disruptivo

### 5.1 "Sinfonías Olfativas" — Discovery sets por emoción

Sets de 3 decants (5ml c/u) curados por estado emocional:

| Sinfonía | Emoción | Ejemplo de contenido |
|----------|---------|---------------------|
| "Allegro del Poder" | Poder + Confianza | Layton + Hacivat + Interlude |
| "Adagio de la Nostalgia" | Confort + Misterio | BR540 + Angel's Share + Naxos |
| "Scherzo de la Rebeldía" | Rebeldía + Energía | Megamare + Side Effect + Oud Wood |

**Pricing**: $95,000-$130,000 COP el set (~$22-30 USD)
**Costo**: ~$35,000-$50,000 COP en producto
**Margen**: 60-75%
**Diferenciador**: Nadie en Colombia vende por emoción, todos venden por casa/marca.

### 5.2 "Tarjetas de Colección" — 1ml + card coleccionable

- Card impresa con: artwork, notas, historia emocional, QR code
- QR enlaza a: experiencia sinestésica en fureliza.com (video + Beethoven)
- **Costo card**: ~$500-1,000 COP ($0.12-0.25 USD) por impresión
- **Costo 1ml**: ~$2,000-5,000 COP en producto
- **Precio venta**: $12,000-18,000 COP ($2.80-4.20 USD)
- **Margen**: 50-70%
- **Efecto**: Coleccionabilidad → repeat purchase → comunidad

### 5.3 Quiz "El Compositor" — WhatsApp-native

Flujo conversacional en WhatsApp (7 preguntas):

```
1. ¿Qué te hace sentir más vivo? → Mapea a mood
2. ¿Cuál es tu momento favorito del día? → Mapea a occasion
3. Si fueras un instrumento, ¿cuál serías? → Mapea a intensidad
4. ¿Qué textura te atrae? → Mapea a familia olfativa
5. ¿Cómo quieres que te recuerden? → Mapea a sillage/projection
6. ¿Qué estación te inspira más? → Mapea a season
7. ¿Qué emociones buscas despertar? → Mapea a emotionalTags
```

Output: "Tu composición es [Fragancia] — tu movimiento es [mood]"
→ Link a la página del producto con scroll animation
→ CTA de compra de decant o tarjeta de colección

**Implementación inicial**: Manual por WhatsApp (Elizabeth responde con guía)
**Fase 2**: Automatizado con WhatsApp Business API + lógica de matching

### 5.4 Comunidad + Votación

- Grupo de WhatsApp "El Salón de Fur Eliza"
- Encuesta mensual: "¿Cuál fragancia compramos y decantamos este mes?"
  - Reduce riesgo de inventario (demanda pre-validada)
  - Crea anticipación y engagement
  - 98% open rate en WhatsApp vs 20% en email

### 5.5 Pricing Psicológico

En cada listing mostrar:

```
Botella completa: $1,200,000 COP
─────────────────────────────────
Decant 10ml:  $55,000 COP  ← Ahorra 95%
Decant 5ml:   $35,000 COP  ← Desde $1,167/día
Tarjeta 1ml:  $15,000 COP  ← Descubre primero
```

- **Anclaje**: El precio de botella completa hace que el decant parezca una ganga
- **Per-day framing**: "Lujo por menos que tu café diario"
- **Escalera de compromiso**: Tarjeta → Decant 5ml → Decant 10ml → Sinfonía

### 5.6 Funnel de adquisición

```
TikTok/Reels (contenido educativo ES)
    │ "¿Qué perfume huele a poder?"
    ▼
Instagram (aesthetic + social proof)
    │ Stories, reels, UGC
    ▼
WhatsApp (conversión)
    │ Quiz "El Compositor" → Recomendación → Compra
    ▼
Comunidad "El Salón" (retención)
    │ Votación, drops, colección
    ▼
fureliza.com (experiencia premium)
    └ Scroll animation, contenido sinestésico
```

**Dato clave**: 67% de usuarios TikTok en LATAM han descubierto una marca en la plataforma. 93% usan WhatsApp diariamente. El funnel TikTok → WhatsApp es el más natural en Colombia.

---

## 6. Stack Técnico

| Componente | Herramienta | Costo |
|------------|-------------|-------|
| Web frontend | Next.js 16 + GSAP (ya hecho) | $0 |
| Hosting | Vercel (hobby) | $0 |
| Datos de fragancias | Fragella API | $12/mo |
| Generación de contenido | Claude API | ~$1/mo |
| Video de producto | Kling 3.0 Starter | $7/mo |
| Extracción de frames | FFmpeg (local) | $0 |
| Edición de fotos | Photoroom free tier | $0 |
| Estado del carrito | Zustand (ya hecho) | $0 |
| Checkout | WhatsApp Business | $0 |
| Comunidad | WhatsApp grupo | $0 |
| Contenido social | TikTok + Instagram | $0 |
| **Total mensual** | | **~$20/mo** |

---

## 7. Timeline de Implementación

### Semana 1 — Fundación
- [ ] Crear script de pipeline: Fragella API → Claude API → Product object
- [ ] Crear script FFmpeg de extracción de frames (150 desktop / 75 mobile)
- [ ] Actualizar `HeroScroll.tsx` para soportar frame count dinámico
- [ ] Comprar setup físico (turntable, velvet, LED, trípode)

### Semana 2 — Primer producto real
- [ ] Ordenar 3 botellas (Layton + Lattafa + Hacivat)
- [ ] Mientras llegan: diseñar tarjetas de colección (template Canva/Figma)
- [ ] Crear grupo WhatsApp "El Salón de Fur Eliza"
- [ ] Grabar primer TikTok educativo

### Semana 3 — Contenido
- [ ] Recibir botellas, fotografiar, generar frames
- [ ] Ejecutar pipeline completo: datos → contenido → frames → deploy
- [ ] Publicar 3 nuevos productos en fureliza.com
- [ ] Lanzar Quiz "El Compositor" manual por WhatsApp

### Semana 4 — Lanzamiento
- [ ] Deploy a Vercel con productos reales
- [ ] Primera "Sinfonía Olfativa" (set de 3 decants)
- [ ] Primera votación en El Salón
- [ ] Contenido TikTok consistente (3-5 videos/semana)

### Mes 2+ — Escala
- [ ] Agregar 2-3 productos nuevos por mes (45 min c/u)
- [ ] Automatizar quiz con WhatsApp Business API
- [ ] Agregar NFC tags al packaging
- [ ] Upgrade a Kling Pro si el revenue lo justifica

---

## 8. Métricas de Éxito

| Métrica | Meta mes 1 | Meta mes 3 |
|---------|-----------|-----------|
| Productos en catálogo | 5 | 15 |
| Decants vendidos | 20 | 80 |
| Revenue | $400 USD | $1,500 USD |
| Miembros "El Salón" | 30 | 150 |
| TikTok followers | 500 | 3,000 |
| Tiempo por producto nuevo | 45 min | 30 min |
| Tasa de conversión quiz→compra | 20% | 35% |

---

## 9. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Mitigación |
|--------|-------------|------------|
| Botella se daña en envío | Media | Casillero con seguro, empaque doble |
| Fragella API cambia precios/ToS | Baja | Kaggle datasets como backup, scraping manual |
| Kling 3.0 no genera bien vidrio/cristal | Media | Fallback: video directo con turntable |
| Baja conversión inicial | Alta (normal) | Loss-leader con tarjetas 1ml, contenido educativo |
| Competidores copian el modelo | Media | La marca (Beethoven, sinestesia, web inmersiva) no se copia fácil |
| INVIMA requiere registro sanitario | Media | Investigar requisitos para reventa de perfumes originales vs fabricación |

---

## 10. Evolución a Enfoque C (Premium)

Cuando el revenue mensual supere $500 USD:

| Upgrade | Costo adicional | Impacto |
|---------|----------------|---------|
| Kling Pro → Veo 3.1 | +$25/mo | Video calidad estudio |
| Meshy Pro (modelos 3D) | +$14.50/mo | Viewer 3D interactivo en web |
| Topaz Gigapixel | $199 una vez | Upscale de fotos a calidad pro |
| NFC tags en packaging | $0.10-0.50/tag | Contenido digital desbloqueado |
| WhatsApp Business API | ~$15/mo | Quiz automatizado + chatbot |
| n8n self-hosted | $0 (Docker) | Workflows automatizados |

---

*Documento de diseño — v1.0.0 — 1 Abril 2026*
*Enfoque B: "El Compositor" — Plataforma emocional automatizada*
