# Fur Eliza — Lo Que Queda Pendiente

> Tareas que NO se pueden hacer solo con código — requieren decisiones de negocio, contenido externo o acceso a servicios.

---

## Bloquea Lanzamiento (necesita acción de Elizabeth/equipo)

### 1. Contenido de Productos
- **Qué falta**: Solo hay 2 fragancias (Megamare, Baccarat Rouge 540). Se necesitan 6-10 más.
- **Quién**: Elizabeth decide cuáles fragancias incluir.
- **Cómo agregar**: Con El Compositor, solo se necesita el nombre y la casa:
  ```bash
  npm run pipeline "Layton" "Parfums de Marly" foto.jpg
  ```
  El pipeline genera automáticamente: descripción, notas, familia, mood, variantes, precios, video AI y frames.
- **Lo único manual**: Elizabeth fotografía cada frasco con celular (fondo oscuro).

### 2. Fotografía de Productos
- **Qué falta**: Al menos 1 foto por frasco para alimentar el pipeline de video AI.
- **Requisitos**: Foto con celular, fondo oscuro, buena iluminación. No necesita ser profesional — el AI video la transforma.
- **Pipeline**: Foto → fal.ai (video AI cinemático) → FFmpeg (150 desktop + 75 mobile WebP frames)
- **Formatos de salida**: WebP frames 1920x1080 (desktop), 1080x1920 (mobile)

### 3. Crear Cuenta fal.ai
- **Qué falta**: Registrarse en fal.ai y obtener `FAL_KEY` para generar videos AI.
- **Pasos**: Ir a fal.ai → Sign up → Dashboard → API Keys → Copiar key
- **Configurar**: Agregar `FAL_KEY=...` en `.env`
- **Costo**: ~$0.07/segundo (Kling Turbo). Un video de 5s = ~$0.35

### 4. Configurar Dominio fureliza.com
- **Qué falta**: Apuntar DNS del dominio a Vercel (el deploy ya está hecho en fureliza.vercel.app)
- **Pasos**:
  1. En el registrador del dominio, agregar: A record `@` → `76.76.21.21`
  2. CNAME `www` → `cname.vercel-dns.com`
  3. O desde Vercel Dashboard → Settings → Domains → Add `fureliza.com`

### 5. Grain SVG
- **Qué falta**: El archivo `public/grain.svg` referenciado en `globals.css` (overlay de textura).
- **Opción**: Generar con un generador online de SVG noise o crear uno simple.

---

## Se Puede Hacer con Código (próximas sesiones)

### Prioridad Alta
| Tarea | Notas |
|---|---|
| Integrar Sanity.io como CMS | Crear schemas, migrar datos de `data/products.ts`, conectar Next.js |
| Configurar Cloudinary | Subir imágenes y frames, configurar f_auto/q_auto |
| Favicon + OG Image | Necesita logo/diseño de Elizabeth |
| Vercel Analytics | `npm install @vercel/analytics` + un import |
| Actualizar modelo AI default | DeepSeek V3.2 ($0.64/M tokens) o Gemini 2.5 Flash ($0.30/M) |

### Prioridad Media (Fase 2)
| Tarea | Notas |
|---|---|
| Quiz "El Compositor" (UI) | 7 pantallas con animaciones, lógica de scoring |
| Quiz (Motor IA) | Qdrant + embeddings + API route |
| WhatsApp Business API | Cuenta Meta Business + webhook + automación |
| Chatbot RAG básico | "Perfumista virtual" entrenado con catálogo |
| TikTok content pipeline | AI video → scheduling → posting |

### Prioridad Baja (Fase 3+)
| Tarea | Notas |
|---|---|
| React Three Fiber viewer | Después de tener modelos .glb |
| Tone.js ambient sound | Diseño sonoro + implementación |
| NFC tags | Comprar hardware + desarrollar landing |
| Nx Monorepo migration | Restructurar todo el proyecto (docs/THE_ONYX_PROTOCOL.md) |

---

## Lo Que Está HECHO y No Hay que Tocar

- TypeScript compila limpio (0 errores)
- Build pasa (11/11 páginas)
- 39 issues de code review corregidos
- ScrollSmoother (smooth scroll global)
- SplitText (animaciones de caracteres en títulos)
- View Transitions API (transiciones GPU entre páginas)
- Acentos corregidos en todo el sitio (30+ tildes)
- SEO: JSON-LD, sitemap, canonical URLs, robots.txt
- Seguridad: CSP, X-Frame-Options, XSS prevention
- Accesibilidad: skip-nav, focus rings, reduced-motion
- Carrito WhatsApp COP/USD
- 11 páginas completas
- **El Compositor pipeline completo**: generate + video + frames en un comando
- Psychological pricing (precio tachado, ahorro %, costo/día)
- Repo público en GitHub (Fur-Eliza/fureliza)

---

*Actualizado: 2 de Abril 2026*
