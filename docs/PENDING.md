# Fur Eliza — Lo Que Queda Pendiente

> Tareas que NO se pueden hacer solo con código — requieren decisiones de negocio, contenido externo o acceso a servicios.

---

## Bloquea Lanzamiento

### 1. Comprar Inventario (Tier 1 primero)
- **Qué**: Hacivat (Nishane), Layton (PDM), Naxos (Xerjoff) — $540 USD grey market
- **Dónde**: Jomashop, AllBeauty, FragranceNet
- **Casillero**: ~$10-18 USD per paquete (Miami → Colombia)
- **Landed total Tier 1**: ~$743 USD

### 2. Fotografía de Productos
- **Qué**: Al menos 1 foto por frasco para alimentar el pipeline de video
- **Requisitos**: Foto con celular, fondo oscuro, buena iluminación
- **Pipeline**: Foto → Gemini (temporal) o fal.ai → FFmpeg (150 desktop + 75 mobile WebP frames)

### 3. Generar Videos con Gemini (temporal)
- **Qué**: Crear video cinemático de 5s para cada fragancia usando Gemini
- **Prompts**: Ver `docs/AI_VIDEO_GENERATION_GUIDE.md` (7 estilos, recomendado "hero")
- **Después**: Extraer frames con `npm run frames video.mp4 slug`
- **Nota**: Esto es temporal mientras se recarga fal.ai. Después se usa `npm run pipeline` automatizado.

### 4. Configurar Dominio fureliza.com
- **Qué**: Apuntar DNS del dominio a Vercel
- **Pasos**:
  1. A record `@` → `76.76.21.21`
  2. CNAME `www` → `cname.vercel-dns.com`
  3. O desde Vercel Dashboard → Settings → Domains → Add `fureliza.com`

### 5. Recargar fal.ai
- **Qué**: Recargar créditos en fal.ai para volver al pipeline automatizado
- **Costo**: ~$0.07/segundo (Kling Turbo). Un video de 5s = ~$0.35
- **Configurar**: `FAL_KEY=...` en `.env`

---

## Se Puede Hacer con Código (próximas sesiones)

### Prioridad Alta (Launch)
| Tarea | Notas |
|---|---|
| Agregar productos al catálogo | `npm run generate "Name" "House"` + editar `src/data/products.ts` |
| Extraer frames de videos | `npm run frames video.mp4 slug` |
| Grain SVG | Generar overlay de textura para `public/grain.svg` |
| Favicon + OG Image | Crear y configurar para redes sociales |
| Vercel Analytics | `npm install @vercel/analytics` + un import |

### Prioridad Alta (Phase 2)
| Tarea | Notas |
|---|---|
| Quiz "El Compositor" (UI) | 7 pantallas con animaciones, lógica de scoring |
| "Componer tu Sinfonía" — Layering system | UI + guías de combinación |
| Tarjetas de Colección 1ml | Diseño + QR → experiencia digital |
| Sanity.io CMS | Migrar de `data/products.ts` a CMS para Elizabeth |
| WhatsApp AI Concierge | RAG + WhatsApp Business API |

### Prioridad Media (Phase 3)
| Tarea | Notas |
|---|---|
| NFC tags | Hardware + landing de autenticidad |
| "El Compositor Biológico" | Investigación genómica + alianza con lab |
| Terroir Colombiano | Sourcing de ingredientes locales |
| Three.js 3D viewer | Modelos .glb de frascos |
| Ambient sound | Diseño sonoro por familia olfativa |

---

## Lo Que Está HECHO y No Hay que Tocar

- TypeScript compila limpio (0 errores)
- Build pasa (11/11 páginas)
- 39 issues de code review + 19 fixes pre-deploy = todo corregido
- GSAP (ScrollSmoother, SplitText, ScrollTrigger) con cleanup correcto
- SEO: JSON-LD, sitemap, canonical URLs, robots.txt
- Seguridad: CSP, X-Frame-Options, XSS prevention
- Accesibilidad: skip-nav, focus rings, reduced-motion
- Carrito WhatsApp COP/USD
- 11 páginas completas
- El Compositor pipeline completo
- Psychological pricing
- Deploy en Vercel (fureliza.vercel.app)
- Repo público en GitHub (Fur-Eliza/fureliza)
- Claude Code setup (.claude/ rules, commands, hooks)

---

*Actualizado: 4 de Abril 2026*
