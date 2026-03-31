# Fur Eliza — Investigación de Tecnologías y Herramientas

> Investigación detallada de las mejores tecnologías, herramientas y servicios para implementar la visión de Fur Eliza. Cada sección incluye: qué es, por qué es la mejor opción, alternativas, cómo se integra, y el costo.

---

## Índice

1. [Experiencia Web Inmersiva](#1-experiencia-web-inmersiva)
2. [Visualización 3D de Productos](#2-visualización-3d-de-productos)
3. [Transiciones Cinematográficas](#3-transiciones-cinematográficas)
4. [Sonido Ambiente Generativo](#4-sonido-ambiente-generativo)
5. [Quiz de Fragancia con IA](#5-quiz-de-fragancia-con-ia)
6. [Mayordomo Digital WhatsApp](#6-mayordomo-digital-whatsapp)
7. [CMS para Elizabeth](#7-cms-para-elizabeth)
8. [Base de Datos y Backend](#8-base-de-datos-y-backend)
9. [Imágenes y Media](#9-imágenes-y-media)
10. [Experiencia Phygital (NFC)](#10-experiencia-phygital-nfc)
11. [AR "Pruébalo en tu Espacio"](#11-ar-pruébalo-en-tu-espacio)
12. [Monorepo y Arquitectura](#12-monorepo-y-arquitectura)
13. [Procesamiento de Pedidos](#13-procesamiento-de-pedidos)
14. [Automatización de Workflows](#14-automatización-de-workflows)
15. [Stack Completo Recomendado](#15-stack-completo-recomendado)

---

## 1. Experiencia Web Inmersiva

### GSAP + ScrollTrigger + ScrollSmoother + SplitText

**Qué es:** GSAP (GreenSock Animation Platform) es la librería de animación web más potente y profesional. ScrollTrigger vincula animaciones al scroll. ScrollSmoother añade smooth scrolling "buttery". SplitText anima caracteres individuales.

**Por qué es la mejor:**
- **100% gratis desde 2025** — todos los plugins premium (ScrollSmoother, SplitText, MorphSVG) ahora son gratuitos. Antes costaban $100/año.
- Apple, Nike y Spotify lo usan para sus páginas de producto.
- Performance optimizada: las animaciones corren a 60fps sin bloquear el thread principal.
- Integración oficial con React via `@gsap/react` y hook `useGSAP()`.

**Instalación:**
```bash
npm install gsap @gsap/react
```

**Configuración Next.js (archivo central de plugins):**
```typescript
// src/lib/gsap.ts
"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);
}

export { gsap, ScrollTrigger, ScrollSmoother, SplitText };
```

**Best Practices para Next.js App Router:**
- Centralizar registro de plugins en un solo archivo (evita registrar múltiples veces).
- Usar `useGSAP()` en vez de `useEffect()` — maneja cleanup automáticamente.
- Llamar `ScrollTrigger.refresh()` una sola vez después de inicializar todas las animaciones.
- Limpiar solo los triggers propios del componente, no `ScrollTrigger.killAll()`.

**Alternativas descartadas:**
| Alternativa | Por qué no |
|---|---|
| Framer Motion | Buena para UI, pobre para scroll-driven animations complejas |
| Lenis + CSS | Buen smooth scroll, pero no tiene el ecosistema de GSAP |
| Motion One | Prometedora pero inmadura para producción |

**Costo:** $0 (open source desde 2025)

---

## 2. Visualización 3D de Productos

### React Three Fiber (R3F) + drei + postprocessing

**Qué es:** React Three Fiber es un renderer de React para Three.js. Permite construir escenas 3D con componentes React declarativos. `drei` provee helpers (OrbitControls, Environment, etc.). `postprocessing` añade efectos (bloom, depth of field).

**Por qué es la mejor:**
- Declarativo: los objetos 3D son componentes React que reaccionan a estado.
- Ecosistema maduro: gltfjsx convierte modelos GLTF en componentes JSX automáticamente.
- Performance: puede correr a 60fps con modelos optimizados.
- Starter oficial para Next.js: `pmndrs/react-three-next` resuelve la navegación sin recrear canvas.

**Instalación:**
```bash
npm install @react-three/fiber three @react-three/drei @react-three/postprocessing
```

**Flujo de trabajo para frascos:**
1. **Modelar** el frasco en Blender (o contratar modelado en Fiverr/Upwork ~$100-300/frasco).
2. **Exportar** como GLTF/GLB comprimido con Draco.
3. **Convertir** a componente JSX con [gltf.pmnd.rs](https://gltf.pmnd.rs).
4. **Optimizar**: texture baking, LOD (Level of Detail), lazy loading.
5. **Renderizar** con iluminación HDR (Environment de drei) + postprocessing bloom para el efecto dorado.

**Ejemplo de componente de frasco:**
```tsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Float } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

function BottleViewer({ modelUrl }: { modelUrl: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
      <Environment preset="studio" />
      <Float speed={1.5} rotationIntensity={0.5}>
        <BottleModel url={modelUrl} />
      </Float>
      <OrbitControls enableZoom enablePan={false} />
      <EffectComposer>
        <Bloom intensity={0.3} luminanceThreshold={0.8} />
      </EffectComposer>
    </Canvas>
  );
}
```

**Partículas de notas olfativas:**
Usar `@react-three/fiber` con shaders personalizados (GLSL) para crear partículas que representen las notas. Cristales de sal para marinas, pétalos para florales, humo para orientales.

**Alternativas consideradas:**
| Alternativa | Veredicto |
|---|---|
| Spline | Más fácil pero menos control, no ideal para producción |
| Model Viewer (Google) | Bueno para AR simple, limitado para efectos avanzados |
| Babylon.js | Poderoso pero ecosistema React inmaduro |

**Costo:** $0 (open source) + $100-300 por modelo 3D de frasco

---

## 3. Transiciones Cinematográficas

### View Transitions API (nativa en Next.js 16)

**Qué es:** API nativa del navegador que crea transiciones animadas entre estados de UI. Next.js 16 y React 19.2 tienen integración oficial.

**Por qué es la mejor:**
- **GPU-accelerada**: corre a 60fps sin bloquear JavaScript. 2-3x más rápido que GSAP para transiciones de página.
- **Soporte**: Chrome, Edge, Safari 18, Opera — ~78% global (marzo 2026).
- **Zero JavaScript**: las transiciones se definen en CSS.
- **Integración nativa con Next.js 16**: una línea de config y funciona.

**Configuración:**
```typescript
// next.config.ts
const config = {
  experimental: {
    viewTransition: true,
  },
};
```

**Transiciones CSS para Fur Eliza:**
```css
/* Transición de fade + scale para cambio de página */
::view-transition-old(root) {
  animation: fade-out 0.3s ease-out;
}
::view-transition-new(root) {
  animation: fade-in 0.4s ease-in;
}

/* Transición compartida para imagen de producto */
::view-transition-old(product-image) {
  animation: scale-down 0.3s ease-out;
}
::view-transition-new(product-image) {
  animation: scale-up 0.4s ease-in;
}
```

**Efecto "Shared Element":** Cuando el usuario hace click en un ProductCard, la imagen del frasco se expande suavemente hacia la página de detalle — como una app nativa de iOS.

**Fallback:** Para navegadores sin soporte, la navegación funciona normal sin transiciones (progressive enhancement).

**Costo:** $0 (API nativa del navegador)

---

## 4. Sonido Ambiente Generativo

### Tone.js + Web Audio API

**Qué es:** Tone.js es un framework de audio web para crear música interactiva en el navegador. Construido sobre la Web Audio API nativa.

**Por qué es la mejor:**
- Diseñada específicamente para música generativa e interactiva.
- API familiar para músicos: sintetizadores, efectos, secuenciadores.
- Funciona en todos los navegadores modernos.
- Ligera: se carga bajo demanda, no afecta performance inicial.

**Concepto para Fur Eliza — "Sinfonía por Familia Olfativa":**

| Familia | Sonido | Instrumentos |
|---|---|---|
| Amaderadas (deep-woods) | Cuerdas graves, cello | Synth pad grave + reverb largo |
| Florales (opulent-florals) | Piano suave, arpa | Piano FM + delay |
| Cítricos (vibrant-citrus) | Marimba, bells | Pluck synth + chorus |
| Acuáticos (ocean-marine) | Sintetizadores etéreos, olas | Noise + filter sweep |
| Orientales (oriental-spiced) | Oud, percusión | Sine bass + metallic FM |
| Gourmand (gourmand-sweet) | Celesta, calidez | Warm pad + soft attack |

**Instalación:**
```bash
npm install tone
```

**Implementación conceptual:**
```typescript
import * as Tone from "tone";

// Solo se activa después de interacción del usuario (requerido por browsers)
async function startAmbientSound(family: OlfactoryFamily) {
  await Tone.start();
  const synth = new Tone.PolySynth(Tone.FMSynth).toDestination();
  synth.volume.value = -20; // Muy sutil
  // ... configurar según familia
}
```

**Importante:** El audio solo se activa después de un click/touch del usuario (política de autoplay de los navegadores). Se presenta como un botón discreto: "Activar experiencia sonora".

**Alternativas:**
| Alternativa | Veredicto |
|---|---|
| Howler.js | Buena para efectos de sonido, no para generativo |
| Web Audio API directo | Demasiado bajo nivel, Tone.js lo abstrae perfectamente |
| Samples pregrabados | Menos dinámico, archivos más pesados |

**Costo:** $0 (open source)

---

## 5. Quiz de Fragancia con IA

### Qdrant + OpenAI Embeddings + Next.js Server Actions

**Qué es:** Un motor de recomendación semántico que convierte las respuestas del usuario en vectores y los compara con los vectores de cada producto.

**Stack del Quiz:**
- **Qdrant** — Base de datos vectorial escrita en Rust. Ultra rápida (<100ms por query). Open source y auto-hosteable.
- **OpenAI text-embedding-3-small** — Modelo de embeddings más costo-eficiente. 5x más barato que la versión anterior con performance similar.
- **Alternativa open source**: Nomic Embed Text V2 (gratis, multilingüe, MoE architecture).

**Flujo del Quiz "El Compositor":**

```
Usuario responde 7 preguntas emocionales
         ↓
Respuestas se concatenan en texto natural:
"Busco algo que se sienta como terciopelo,
 que evoque un atardecer en Estambul,
 con la intensidad de la 5ta Sinfonía"
         ↓
OpenAI genera embedding del texto
         ↓
Qdrant busca los productos con vectores más cercanos
(previamente indexados con sus emotionalTags + mood + description)
         ↓
Top 3 resultados con score de similitud
         ↓
Revelación cinematográfica con animación 120-frame
```

**Configuración de Qdrant:**
```bash
# Docker local
docker run -p 6333:6333 qdrant/qdrant

# O Qdrant Cloud (tier gratis: 1GB, 1M vectores)
```

**Indexación de productos:**
```typescript
import { QdrantClient } from "@qdrant/js-client-rest";
import OpenAI from "openai";

const qdrant = new QdrantClient({ url: "http://localhost:6333" });
const openai = new OpenAI();

async function indexProduct(product: Product) {
  const text = `${product.description} ${product.emotionalTags.join(" ")} ${product.mood.join(" ")}`;
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  await qdrant.upsert("fragrances", {
    points: [{
      id: product.slug,
      vector: embedding.data[0].embedding,
      payload: { name: product.name, slug: product.slug, family: product.family },
    }],
  });
}
```

**Dato clave:** Los quizzes de fragancia logran **25% de conversión** vs 0.5-1% estándar. 89% de satisfacción con el match. Esto solo justifica la inversión en IA.

**Costos:**
| Servicio | Costo |
|---|---|
| Qdrant Cloud (free tier) | $0 (1GB, suficiente para <100 productos) |
| OpenAI text-embedding-3-small | ~$0.02 por 1M tokens (~$0.001/quiz) |
| Alternativa: Nomic Embed V2 (self-hosted) | $0 |

---

## 6. Mayordomo Digital WhatsApp

### n8n + WhatsApp Business API + Qdrant RAG + Claude/GPT-4o

**Qué es:** Un asistente de WhatsApp con inteligencia artificial que atiende clientes, recomienda fragancias y procesa pedidos automáticamente.

**Stack recomendado:**

| Componente | Herramienta | Por qué |
|---|---|---|
| **Orquestador** | n8n (self-hosted) | Workflow visual, integraciones nativas con WhatsApp + Supabase, 100% auto-hosteable |
| **WhatsApp API** | Meta WhatsApp Business Cloud API | Oficial de Meta, gratuito hasta 1000 conversaciones/mes |
| **LLM** | Claude 3.5 Sonnet o GPT-4o | Mejor calidad de respuesta en español para contexto de lujo |
| **RAG** | Qdrant + embeddings del catálogo | Respuestas basadas en datos reales del inventario |
| **Base de datos** | Supabase | Almacena conversaciones, pedidos, perfil de cliente |

**Flujo del Mayordomo:**

```
Cliente envía WhatsApp: "Quiero algo para una cena romántica"
         ↓
n8n recibe webhook de Meta WhatsApp API
         ↓
n8n envía mensaje a RAG pipeline:
  1. Genera embedding de la consulta
  2. Busca en Qdrant productos relevantes
  3. Obtiene contexto: productos en stock, historial del cliente
         ↓
Envía a Claude/GPT-4o con system prompt:
  "Eres el perfumista digital de Fur Eliza.
   Habla con elegancia, calidez y conocimiento.
   Recomienda basándote en emoción, no en técnica.
   Nunca inventes información sobre productos."
         ↓
Respuesta personalizada por WhatsApp:
  "Para una cena romántica, Baccarat Rouge 540 es
   tu sinfonía ideal — envuelve en un halo dorado
   de saffron y jasmine. ¿Te preparo un decant de
   descubrimiento de 5ml por $120.000 COP?"
         ↓
Si confirma → n8n crea pedido en Supabase
         ↓
n8n notifica a Elizabeth con resumen
```

**Briefing matutino automático:**
Workflow de n8n programado a las 8am que genera un resumen:
- Pedidos nuevos del día anterior
- Inventario bajo (< 3 unidades)
- Mensajes pendientes de respuesta
- Métricas: ventas del día, producto más consultado

**Alternativas consideradas:**
| Alternativa | Por qué no |
|---|---|
| Landbot / ManyChat | Más fácil pero limitado en RAG custom y personalización |
| WAHA (unofficial API) | Gratis pero viola ToS de Meta, riesgo de ban |
| Twilio | Bueno pero más caro que Meta API directa |
| Construir desde cero (Node.js) | Posible pero n8n ahorra meses de desarrollo |

**Costos:**
| Servicio | Costo |
|---|---|
| n8n self-hosted | $0 (open source) |
| n8n Cloud (si prefieres managed) | $20/mes (starter) |
| WhatsApp Business API | $0 primeras 1000 conv/mes, ~$0.05/conv después |
| Claude 3.5 Sonnet | ~$0.003-0.015/conversación |
| GPT-4o (alternativa) | ~$0.005-0.02/conversación |

---

## 7. CMS para Elizabeth

### Sanity.io

**Qué es:** Headless CMS #1 para desarrolladores. Schema-as-code, real-time collaboration, y live preview. Evolucionó a "Content Operating System" en 2025.

**Por qué es la mejor para Fur Eliza:**
- **Visual e intuitivo**: Elizabeth puede arrastrar y soltar notas olfativas, subir fotos, editar descripciones — sin tocar código.
- **Schema como código**: Los developers definen la estructura (TypeScript), Elizabeth llena el contenido.
- **Real-time**: Cambios se reflejan instantáneamente en preview.
- **AI Canvas**: Herramienta de escritura asistida por IA integrada (Spring 2025 release).
- **Next.js nativo**: El mejor soporte de integración con Next.js de todos los CMS.

**Schema de ejemplo para Fur Eliza:**
```typescript
// schemas/product.ts (Sanity schema)
export default {
  name: "product",
  title: "Fragancia",
  type: "document",
  fields: [
    { name: "name", title: "Nombre", type: "string" },
    { name: "house", title: "Casa", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "name" } },
    { name: "description", title: "Descripción Poética", type: "text" },
    { name: "family", title: "Familia Olfativa", type: "string",
      options: { list: ["deep-woods","opulent-florals","vibrant-citrus","ocean-marine","oriental-spiced","gourmand-sweet"] }
    },
    { name: "mood", title: "Estados de Ánimo", type: "array", of: [{ type: "string" }] },
    { name: "notes", title: "Notas", type: "object",
      fields: [
        { name: "top", title: "Notas de Salida", type: "array", of: [{ type: "string" }] },
        { name: "heart", title: "Notas de Corazón", type: "array", of: [{ type: "string" }] },
        { name: "base", title: "Notas de Fondo", type: "array", of: [{ type: "string" }] },
      ]
    },
    { name: "variants", title: "Variantes", type: "array", of: [{ type: "variant" }] },
    { name: "heroImage", title: "Imagen Principal", type: "image" },
    { name: "cardImage", title: "Imagen de Card", type: "image" },
  ],
};
```

**Migración de datos estáticos → Sanity:**
Los productos actuales en `src/data/products.ts` se migran a Sanity. Next.js los consume via GROQ queries en Server Components. Los datos estáticos se eliminan.

**Costo:**
| Plan | Precio | Incluye |
|---|---|---|
| Free | $0/mes | 100K API requests, 500MB assets, 3 usuarios |
| Growth | $15/mes | 1M requests, 20GB assets, 20 usuarios |

**Para el volumen de Fur Eliza, el tier gratuito es más que suficiente.**

---

## 8. Base de Datos y Backend

### Supabase (PostgreSQL) + Edge Functions

**Qué es:** Supabase es una plataforma de desarrollo sobre PostgreSQL. Provee: base de datos, auth, APIs instantáneas, Edge Functions, Realtime subscriptions, Storage, y Vector embeddings.

**Por qué es la mejor para Fur Eliza:**

1. **Realtime nativo**: Si alguien compra, Elizabeth recibe notificación al instante. El inventario se actualiza en vivo.
2. **Vector embeddings integrado** (pgvector): Puede reemplazar Qdrant para el quiz si el volumen es bajo (<10K vectores). Simplifica la arquitectura.
3. **Auth listo**: Si en el futuro queremos cuentas de cliente / "El Salón" (comunidad privada).
4. **Edge Functions**: Serverless functions en Deno para lógica de backend sin servidor separado.
5. **Row Level Security**: Seguridad a nivel de fila para datos sensibles de clientes.

**Schema de base de datos:**
```sql
-- Pedidos
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  items JSONB NOT NULL,
  total_cop INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, confirmed, shipped, delivered
  whatsapp_thread_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Inventario
CREATE TABLE inventory (
  variant_id TEXT PRIMARY KEY,
  product_slug TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Perfiles de cliente (para recomendaciones)
CREATE TABLE customer_profiles (
  phone TEXT PRIMARY KEY,
  name TEXT,
  preferences JSONB, -- quiz results, purchase history
  last_order_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Integración con Next.js:**
```bash
npm install @supabase/supabase-js @supabase/ssr
```

**Costo:**
| Plan | Precio | Incluye |
|---|---|---|
| Free | $0/mes | 500MB DB, 1GB storage, 50K auth users, 500K Edge Function invocations |
| Pro | $25/mes | 8GB DB, 100GB storage, 150K auth users, 2M Edge Functions |

**El tier gratuito es más que suficiente para lanzar.**

### Backend Rust (Fase 4+)

Para cuando el volumen lo justifique, el servicio de catálogo en Rust (ya existe en `backend/services/catalog-service/`) se conectará via gRPC. Por ahora, Supabase + Edge Functions cubre todo.

---

## 9. Imágenes y Media

### Cloudinary

**Qué es:** Servicio de gestión de imágenes y video con CDN global, optimización automática, y transformaciones en tiempo real.

**Por qué es la mejor:**
- **f_auto**: Detecta el navegador y sirve AVIF, WebP o JPEG automáticamente. Reduce tamaño hasta 80%.
- **q_auto**: Optimización de calidad inteligente — encuentra el punto óptimo entre calidad visual y tamaño.
- **Responsive**: Genera automáticamente variantes para cada tamaño de pantalla.
- **Integración Next.js**: `next-cloudinary` provee `CldImage` que reemplaza `next/image` con todas las optimizaciones.

**Instalación:**
```bash
npm install next-cloudinary
```

**Uso para frames de animación:**
Los 120 frames WebP de cada producto se suben a Cloudinary. Se sirven con f_auto + q_auto desde CDN global. Lazy loading de frames 30-120 con `requestIdleCallback` (ya implementado).

**Costo:**
| Plan | Precio | Incluye |
|---|---|---|
| Free | $0/mes | 25K transformaciones, 25GB storage, 25GB bandwidth |
| Plus | $89/mes | 225K transformaciones, 225GB storage, 225GB bandwidth |

**Para el volumen actual (2 productos × 120 frames = 240 imágenes), el tier gratuito sobra.**

---

## 10. Experiencia Phygital (NFC)

### Web NFC API + NTAG215 Tags

**Qué es:** La Web NFC API permite leer y escribir tags NFC desde el navegador Chrome en Android. Los tags NTAG215 son chips NFC baratos que se pegan al packaging.

**Implementación:**

1. **Hardware**: Tags NTAG215 con adhesivo (~$0.15-0.30 por unidad en volumen).
2. **Escritura**: Cada tag se programa con una URL NDEF tipo `https://fureliza.com/nfc/{unique-id}`.
3. **Lectura**: El cliente acerca su teléfono → Chrome abre la URL → landing personalizada.

**Landing NFC exclusiva:**
```
https://fureliza.com/nfc/br540-abc123
         ↓
Muestra:
- Video exclusivo de la casa MFK
- Guía olfativa: "Cómo usar Baccarat Rouge 540"
- Playlist de Spotify curada: "Sinfonía Dorada"
- Invitación a "El Salón" (comunidad VIP)
- Certificado de autenticidad con QR
```

**Soporte de navegadores:**
- Chrome Android 89+: Soporte completo.
- iOS/Safari: No soporta Web NFC, pero los tags NDEF con URL funcionan nativamente (iOS lee el tag y abre Safari automáticamente).

**Alternativa para autenticidad (blockchain ligero):**
No se necesita blockchain completo. Un simple hash SHA-256 del ID del tag + timestamp, almacenado en Supabase, es suficiente para verificar autenticidad. Blockchain es overkill para este volumen.

**Costo:**
| Item | Precio |
|---|---|
| Tags NTAG215 (100 unidades) | ~$15-25 |
| Lector/escritor NFC USB | ~$25 (una vez) |
| Desarrollo de landing NFC | Incluido en el frontend |

---

## 11. AR "Pruébalo en tu Espacio"

### Model Viewer (Google) + WebXR

**Qué es:** `<model-viewer>` es un web component de Google que muestra modelos 3D con AR integrado. WebXR es la API del navegador para experiencias AR/VR.

**Por qué Model Viewer (no Three.js para AR):**
- **Una línea de HTML**: `<model-viewer src="bottle.glb" ar>` y ya tienes AR.
- **iOS compatible**: Usa Quick Look de Apple automáticamente (no necesita WebXR).
- **Android**: Usa Scene Viewer de Google o WebXR.
- **No requiere app**: Funciona desde el navegador directamente.

**Dato: Shopify reporta 94% más conversión en productos con 3D/AR. 40% menos devoluciones.**

**Implementación:**
```bash
npm install @google/model-viewer
```

```html
<model-viewer
  src="/models/baccarat-rouge-540.glb"
  ar
  ar-modes="webxr scene-viewer quick-look"
  camera-controls
  shadow-intensity="1"
  environment-image="/hdr/studio.hdr"
  alt="Baccarat Rouge 540 - Fur Eliza"
>
  <button slot="ar-button" class="ar-button">
    Ver en tu espacio
  </button>
</model-viewer>
```

**Flujo:**
1. Usuario ve el frasco 3D en la web (React Three Fiber).
2. Toca "Ver en tu espacio".
3. Se abre la cámara con AR — ve el frasco en su tocador/escritorio.
4. Puede tomar foto y compartir en Instagram/TikTok.

**Costo:** $0 (open source) + costo de modelos 3D (ver sección 2)

---

## 12. Monorepo y Arquitectura

### Nx Workspace (Fase 4)

**Qué es:** Nx es la plataforma de monorepo más avanzada. Core escrito en Rust para performance. Soporta proyectos políglotas (TypeScript, Rust, Go, Python).

**Estructura propuesta para Fur Eliza:**
```
fureliza/
├── apps/
│   ├── web/              → Next.js 16 (Frontend)
│   ├── catalog-api/      → Rust + Axum (gRPC)
│   ├── order-processor/  → Go + Temporal
│   └── ai-worker/        → Python (RAG + Embeddings)
├── libs/
│   ├── ui/               → Componentes React compartidos
│   ├── schema/           → Protobuf definitions
│   └── generated/        → Código autogenerado (ts, rs, go)
├── tools/
│   ├── buf/              → Config de Protobuf
│   └── atlas/            → Migraciones de DB
└── docker-compose.yml
```

**Comunicación entre servicios:**
- **Buf + Connect (gRPC-Web)**: Define contratos en Protobuf → genera tipos para TS, Rust y Go automáticamente. El frontend llama al backend directamente sin proxy.
- **Type safety end-to-end**: Un cambio en el proto actualiza todos los tipos en un solo commit.

**Por qué Nx sobre Turborepo:**
| Feature | Nx | Turborepo |
|---|---|---|
| Polyglot (Rust, Go, Python) | Sí (plugins) | Solo JS/TS |
| Grafo de dependencias | Visual + interactivo | Básico |
| Caché distribuida | Nx Cloud (o self-hosted) | Vercel Remote Cache |
| Generadores de código | Sí | No |

**Instalación:**
```bash
npx create-nx-workspace@latest fureliza --preset=next
```

**Costo:**
| Plan | Precio |
|---|---|
| Nx (open source) | $0 |
| Nx Cloud (CI cache) | $0 free tier (500 task hours/mes) |

---

## 13. Procesamiento de Pedidos

### Temporal.io (Go SDK)

**Qué es:** Plataforma de ejecución durable. Los workflows sobreviven a crashes, reinicios y fallos de red. Si algo falla a la mitad, retoma exactamente donde quedó.

**Por qué es la mejor para pedidos:**
- **Durable execution**: Si se cae el servidor durante un pedido, Temporal lo retoma automáticamente.
- **Saga pattern nativo**: Si falla el pago, automáticamente revierte la reserva de inventario.
- **Visibilidad**: Dashboard web para ver el estado de cada pedido en tiempo real.
- **Uber Eats lo usa** para manejar millones de pedidos. Fur Eliza no necesita esa escala, pero obtiene la misma confiabilidad.

**Workflow de pedido:**
```
1. WhatsApp: cliente confirma compra
2. Temporal Workflow inicia:
   a. Reservar inventario en Supabase
   b. Esperar confirmación de pago (con timeout de 24h)
   c. Si pago confirmado → actualizar inventario → generar guía
   d. Si timeout → liberar inventario → notificar cliente
   e. Enviar confirmación por WhatsApp
   f. Programar seguimiento post-entrega (3 días después)
3. Elizabeth recibe notificación
```

**Cuándo implementar:** Fase 4. Para las primeras fases, n8n + Supabase manejan el volumen.

**Costo:**
| Plan | Precio |
|---|---|
| Temporal (self-hosted) | $0 (open source) |
| Temporal Cloud | $0 free tier (1000 actions/mes), luego $25/mes |

---

## 14. Automatización de Workflows

### n8n (Self-Hosted)

**Qué es:** Plataforma de automatización de workflows visual y self-hosteable. Es el "Zapier open source" pero con capacidades de IA y RAG integradas.

**Por qué es el puente perfecto para Fur Eliza:**
- **Visual**: Elizabeth puede ver y entender los workflows.
- **Self-hosted**: Los datos de clientes nunca salen de tu servidor.
- **Integraciones nativas**: WhatsApp Business Cloud + Supabase + OpenAI en un solo workflow.
- **RAG built-in**: Templates listos para chatbot de WhatsApp con RAG.

**Workflows para Fur Eliza:**
1. **Chatbot WhatsApp**: Recibe mensaje → RAG → responde → log en Supabase.
2. **Procesamiento de pedido**: Confirmación de pago → actualizar inventario → notificar.
3. **Briefing matutino**: Cron 8am → consultar Supabase → generar resumen → enviar a Elizabeth.
4. **Seguimiento post-venta**: 3 días después de entrega → preguntar satisfacción.
5. **Alerta de inventario**: Stock < 3 → notificar a Elizabeth por WhatsApp.

**Instalación self-hosted:**
```bash
docker run -d --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n n8nio/n8n
```

**Costo:** $0 (self-hosted, open source)

---

## 15. Stack Completo Recomendado

### Por Fase

#### Fase 1 — La Base (ahora)
| Área | Herramienta | Costo/mes |
|---|---|---|
| Frontend | Next.js 16 + GSAP + Tailwind 4 | $0 |
| Hosting | Vercel (hobby) | $0 |
| Animaciones | GSAP ScrollTrigger + ScrollSmoother + SplitText | $0 |
| Imágenes | Cloudinary (free tier) | $0 |
| CMS | Sanity.io (free tier) | $0 |
| Base de datos | Supabase (free tier) | $0 |
| WhatsApp | Manual (ya funciona) | $0 |
| **Total Fase 1** | | **$0/mes** |

#### Fase 2 — La Inteligencia (1-3 meses)
| Área | Herramienta | Costo/mes |
|---|---|---|
| Quiz IA | Qdrant Cloud (free) + OpenAI embeddings | ~$1 |
| Chatbot WhatsApp | n8n self-hosted + Meta WhatsApp API + Claude | ~$5-15 |
| Automatización | n8n workflows | $0 |
| **Total Fase 2** | | **~$5-16/mes** |

#### Fase 3 — La Magia Visual (3-6 meses)
| Área | Herramienta | Costo/mes |
|---|---|---|
| 3D | React Three Fiber + drei | $0 |
| AR | Model Viewer (Google) | $0 |
| Transiciones | View Transitions API | $0 |
| Sonido | Tone.js | $0 |
| Modelos 3D | Blender / freelancer | $100-300 (una vez por frasco) |
| **Total Fase 3** | | **$0/mes** + inversión en modelos |

#### Fase 4 — El Ecosistema (6-12 meses)
| Área | Herramienta | Costo/mes |
|---|---|---|
| Monorepo | Nx | $0 |
| Backend | Rust/Axum + Go/Temporal | $0 (self-hosted) |
| Contratos | Buf + Connect (Protobuf) | $0 |
| NFC | NTAG215 tags | ~$0.20/pedido |
| Hosting escalado | Vercel Pro + Supabase Pro | ~$45 |
| **Total Fase 4** | | **~$45/mes** |

### Costo Total Proyectado

| Fase | Período | Costo mensual | Inversión única |
|---|---|---|---|
| Fase 1 | Ahora | $0 | $0 |
| Fase 2 | 1-3 meses | $5-16 | $0 |
| Fase 3 | 3-6 meses | $5-16 | $300-1800 (modelos 3D) |
| Fase 4 | 6-12 meses | $45-65 | $25 (NFC reader) |

**El stack completo de Fur Eliza puede lanzarse por $0/mes y escalar gradualmente.**

---

## Resumen Ejecutivo

| Necesidad | Mejor Herramienta | Tipo |
|---|---|---|
| Animaciones scroll | GSAP + ScrollTrigger + ScrollSmoother | Open source (ahora gratis) |
| 3D interactivo | React Three Fiber + drei | Open source |
| Transiciones de página | View Transitions API (nativa Next.js 16) | API del navegador |
| Sonido ambiente | Tone.js | Open source |
| Quiz IA | Qdrant + OpenAI embeddings | Cloud free tier |
| Chatbot WhatsApp | n8n + Meta API + Claude RAG | Self-hosted + API |
| CMS | Sanity.io | Free tier |
| Base de datos | Supabase (PostgreSQL) | Free tier |
| Imágenes | Cloudinary | Free tier |
| NFC phygital | NTAG215 + Web NFC API | Hardware barato |
| AR | Model Viewer (Google) | Open source |
| Monorepo | Nx | Open source |
| Pedidos durables | Temporal.io | Open source |
| Automatización | n8n | Self-hosted |

**Filosofía: usar lo mejor del mundo, empezar gratis, escalar con ingresos.**

---

*Documento de investigación tecnológica — v1.0.0 — Marzo 2026*
