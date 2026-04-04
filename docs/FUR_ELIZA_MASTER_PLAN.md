# Fur Eliza — Master Plan & Strategy 2026

## 1. El Alma del Proyecto

Fur Eliza es una curaduría de perfumería de autor (nicho) creada como un tributo a **Elizabeth**. La marca no vende fragancias; vende **Lux Intra** (La luz interior) a través de experiencias sensoriales inmersivas.

> "Für Elise fue una carta de amor convertida en música. Fur Eliza es una carta de amor convertida en aroma."

---

## 2. Estrategia de Negocio

### Pilares de Revenue

1. **Discovery Decants** (core) — 5ml/10ml en atomizadores de cristal. Puente de confianza → botella completa.
2. **Sinfonías Olfativas** — Sets curados por emoción (3 decants temáticos: "Poder", "Seducción", "Misterio").
3. **Drops "Opus"** — Ediciones limitadas numeradas. La comunidad "El Salón" vota el próximo Opus.
4. **Tarjetas de Colección** — 1ml en tarjetas coleccionables con QR → experiencia digital.
5. **Unboxing de Alta Costura** — Cajas negras Soft Touch, sellos de lacre, papel de algodón. Content-ready para TikTok.
6. **Secretos Digitales** — NFC/QR en cada pedido → videos exclusivos, guías olfativas, playlist curada.

### Modelo de Distribución

**Hub & Spoke** con red global de contactos confiables:
- **Compra local**: Contactos compran donde sea más barato en su país
- **Decanteo centralizado**: Estándares de calidad unificados
- **Envío local**: Cada spoke despacha en su región
- **WhatsApp-first checkout**: Conversión 13-19x vs ecommerce tradicional

### Funnel de Adquisición

```
TikTok/Reels (descubrimiento)
    → Instagram (comunidad)
        → fureliza.com (experiencia inmersiva)
            → WhatsApp (conversión conversacional)
                → "El Salón" (retención + referidos)
```

---

## 3. Catálogo de Lanzamiento

### 10 Fragancias Seleccionadas

| # | Fragancia | Casa | Familia | Margen |
|---|-----------|------|---------|--------|
| 1 | Megamare | Orto Parisi | ocean-marine | — |
| 2 | Baccarat Rouge 540 | MFK | oriental-spiced | — |
| 3 | Hacivat | Nishane | deep-woods | ~168% |
| 4 | Layton | Parfums de Marly | oriental-spiced | ~110% |
| 5 | Naxos | Xerjoff | oriental-spiced | ~99% |
| 6 | Side Effect | Initio | gourmand-sweet | ~47% |
| 7 | Santal 33 | Le Labo | deep-woods | ~75% |
| 8 | Lost Cherry | Tom Ford | gourmand-sweet | ~21% |
| 9 | Delina | Parfums de Marly | opulent-florals | ~27% |
| 10 | Grand Soir | MFK | oriental-spiced | ~23% |

**Inversión total (8 nuevos)**: ~$2,283 USD landed
**ROI promedio en decants**: ~73%
**Revenue proyectado mes 1**: ~$400-800 USD

### Organización

- **Por emoción** (nunca por género): Power, Seduction, Energy, Comfort, Mystery, Elegance, Innocence, Rebellion
- **Por familia olfativa**: deep-woods, oriental-spiced, gourmand-sweet, ocean-marine, opulent-florals
- **8/8 moods cubiertos** con las 10 fragancias

---

## 4. Arquitectura Técnica

### Stack Actual (Producción)
| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 16 + TypeScript strict + Tailwind CSS 4 |
| Animations | GSAP (ScrollTrigger, ScrollSmoother, SplitText) |
| State | Zustand 5 (selectores obligatorios) |
| Pipeline | OpenRouter (texto) + fal.ai/Gemini (video) + FFmpeg (frames) |
| Deploy | Vercel (fureliza.vercel.app → fureliza.com) |
| Checkout | WhatsApp conversacional |

### Stack Futuro (Phase 2-3)
| Capa | Tecnología |
|------|-----------|
| CMS | Sanity.io (visual editing para Elizabeth) |
| DB | Supabase Pro (PostgreSQL, São Paulo ~30ms) |
| AI | Qdrant (embeddings) + RAG (chatbot) |
| Automation | WhatsApp Business API + n8n |
| 3D | Three.js / React Three Fiber |

### Stack Enterprise (Phase 4+)
| Capa | Tecnología |
|------|-----------|
| Monorepo | Nx (The Onyx Protocol) |
| Services | Rust/Axum (catalog) + Go/Temporal (orders) + Python (AI) |
| API | Protobuf + gRPC (Connect) |
| Infra | Cloudflare Pages + Workers |

---

## 5. Ideas de Innovación

### "El Compositor Biológico" — Perfume por ADN + Microbioma
- Test de saliva → genes de receptores olfativos (OR5A1, OR7D4, OR5AN1)
- Test de microbioma de piel → cómo tu cuerpo transforma las moléculas
- IA cruza datos → recomienda o CREA tu perfume único
- **Ciencia**: Paper bioRxiv 2026 es proof-of-concept. DSM-Firmenich ya tiene pro-fragancias activadas por microbioma (Haloscent Pure You). Osmo ($133.5M funding) digitalizó el olfato.
- **Moat**: Nadie combina genómica + microbioma + IA en perfumería.

### "Componer tu Sinfonía" — Layering Musical
- Cada fragancia = un "movimiento" en una composición musical
- Cliente combina 2-3 movimientos para crear su sinfonía única
- La identidad Beethoven se convierte en mecánica de producto
- **Moat**: Jo Malone inventó layering, pero nadie lo fusionó con la metáfora musical.

### Terroir Colombiano
- Colombia = 2do país más biodiverso (51,203+ plantas, 4,000+ orquídeas)
- Ingredientes: tagua, flor de café, orquídea Cattleya, cacao del Catatumbo
- **Moat**: Imposible de copiar sin el acceso al territorio.

### El Flywheel de Beethoven
La identidad musical crea un framework unificado:
- Fragancias → **"Opus"** (ediciones numeradas)
- Layering → **"Componer una Sinfonía"**
- Colección → **"Partitura"** (score musical)
- Embajadores → **"Los Compositores"**
- Comunidad → **"El Salón"** / **"El Coro"**
- Subscripción → **"Abono de Temporada"** (season tickets)

---

## 6. Hoja de Ruta

| Fase | Timeline | Foco |
|------|----------|------|
| ~~Fase 0~~ | ~~Mar 2026~~ | ✅ Base técnica completa |
| **Fase 1** | **Abr 2026** | **Launch: 10 productos, DNS, contenido, "El Salón"** |
| Fase 2 | May-Jul 2026 | Inteligencia: Quiz, Layering, Sanity, WhatsApp AI |
| Fase 3 | Jul 2026-Mar 2027 | Dominación: Compositor Biológico, NFC, Terroir, 3D |
| Fase 4 | 2027+ | Escala: Monorepo, microservicios, expansión regional |

Ver plan detallado: `docs/plans/2026-04-04-launch-roadmap-design.md`

---

## 7. Métricas de Éxito

| Métrica | Mes 1 | Mes 3 | Mes 12 |
|---------|-------|-------|--------|
| Productos en catálogo | 10 | 15 | 30+ |
| Decants vendidos/mes | 20 | 80 | 300+ |
| Revenue mensual | $400 USD | $1,500 USD | $5,000+ USD |
| Miembros "El Salón" | 30 | 150 | 500+ |
| Conversión web→WhatsApp | 5% | 12% | 15% |
| Lighthouse Performance | 95+ | 95+ | 90+ |

---

*Master Plan — v2.0.0 — 4 Abril 2026*
*Actualizado con catálogo investigado, análisis de márgenes, modelo de distribución, e ideas de innovación.*
