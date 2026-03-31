# Fur Eliza — Lo Que Queda Pendiente

> Tareas que NO se pueden hacer solo con código — requieren decisiones de negocio, contenido externo o acceso a servicios.

---

## Bloquea Lanzamiento (necesita acción de Elizabeth/equipo)

### 1. Contenido de Productos
- **Qué falta**: Solo hay 2 fragancias (Megamare, Baccarat Rouge 540). Se necesitan 6-10 más.
- **Quién**: Elizabeth decide cuáles fragancias incluir.
- **Formato**: Para cada fragancia nueva, llenar estos campos:
  - Nombre, Casa, Descripción poética
  - Notas: salida, corazón, fondo
  - Familia olfativa (amaderada, floral, cítrica, acuática, oriental, gourmand)
  - Mood (poder, seducción, energía, confort, misterio, elegancia, inocencia, rebeldía)
  - Variantes con precios COP/USD (sample 2ml, decant 5ml, decant 10ml, botella)
  - Intensidad, proyección, longevidad (1-10)
  - Ocasiones y temporadas

### 2. Fotografía / Renders de Productos
- **Qué falta**: Las carpetas `public/frames/` y `public/products/` están vacías.
- **Opciones**:
  - **Render 3D** (~$100-300/frasco en Fiverr): Se necesita modelo 3D + 120 frames renderizados
  - **Fotografía real**: Frasco real + lightbox + turntable para 120 fotos
  - **Mínimo viable**: 1 foto hero + 1 foto card por producto (sin animación scroll)
- **Formato**: WebP, 1920x1080 para frames, 800x1000 para cards

### 3. Deploy a Vercel
- **Qué falta**: Conectar el repositorio Git a Vercel y apuntar el dominio.
- **Pasos**:
  1. Ir a vercel.com → Import Git Repository
  2. Root directory: `/` (no `/fureliza`)
  3. Environment variable: `NEXT_PUBLIC_WHATSAPP_NUMBER=573004228021`
  4. Apuntar DNS de fureliza.com a Vercel
- **Tiempo**: 30 minutos
- **Costo**: $0 (Hobby tier)

### 4. Grain SVG
- **Qué falta**: El archivo `public/grain.svg` referenciado en `globals.css` (overlay de textura).
- **Opción**: Generar con un generador online de SVG noise o crear uno simple.

---

## Se Puede Hacer con Código (próximas sesiones)

### Prioridad Alta
| Tarea | Tiempo | Notas |
|---|---|---|
| Integrar Sanity.io como CMS | 4-6h | Crear schemas, migrar datos, conectar Next.js |
| Configurar Cloudinary | 2h | Crear cuenta, subir imágenes, configurar next-cloudinary |
| Favicon + OG Image | 1h | Necesita logo/diseño de Elizabeth |
| Vercel Analytics | 30min | `npm install @vercel/analytics` + un import |

### Prioridad Media (Fase 2)
| Tarea | Tiempo | Notas |
|---|---|---|
| Quiz "El Compositor" (UI) | 8-12h | 7 pantallas con animaciones, lógica de scoring |
| Quiz (Motor IA) | 4-6h | Qdrant + embeddings + API route |
| n8n self-hosted | 2-3h | Docker setup + workflows iniciales |
| WhatsApp Business API | 2-3h | Cuenta Meta Business + webhook + n8n connection |
| Chatbot RAG básico | 6-8h | System prompt + RAG pipeline + testing |

### Prioridad Baja (Fase 3+)
| Tarea | Tiempo | Notas |
|---|---|---|
| Modelos 3D de frascos | Externo | $100-300/frasco en Fiverr/Upwork |
| React Three Fiber viewer | 4-6h | Después de tener modelos .glb |
| Tone.js ambient sound | 4-6h | Diseño sonoro + implementación |
| NFC tags | Externo | Comprar hardware + desarrollar landing |
| Nx Monorepo migration | 8-16h | Restructurar todo el proyecto |

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
- 7 páginas completas

---

*Actualizado: 31 de Marzo 2026*
