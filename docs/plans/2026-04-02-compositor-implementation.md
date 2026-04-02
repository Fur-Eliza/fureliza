# "El Compositor" — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the automated pipeline that turns "I bought a perfume bottle" into "it's live on fureliza.com with scroll animation, poetic descriptions, and psychological pricing" in ~45 minutes.

**Architecture:** Three standalone scripts (frame extraction, catalog generation, master pipeline) plus a UI update for psychological pricing. Scripts live in `scripts/` at project root. Frame extraction is pure bash/FFmpeg. Catalog generation uses Node.js with the Anthropic SDK to generate content from Fragella API data. The master pipeline orchestrates everything with a single command.

**Tech Stack:** Bash + FFmpeg (frames), Node.js + TypeScript + Anthropic SDK (catalog), Next.js (UI updates)

---

## Task 1: FFmpeg Frame Extraction Script

> **Qué hace (fácil):** Le das un video de tu celular y te genera las 150 fotos WebP listas para la animación scroll de la web. También genera 75 versiones más chiquitas para celular.

**Files:**
- Create: `scripts/extract-frames.sh`

**Step 1: Create the scripts directory**

Run: `mkdir -p scripts`

**Step 2: Write the frame extraction script**

```bash
#!/usr/bin/env bash
# extract-frames.sh — Extract scroll animation frames from a product video
# Usage: ./scripts/extract-frames.sh <video-file> <product-slug> [desktop-frames] [mobile-frames]
#
# Example: ./scripts/extract-frames.sh video.mp4 layton 150 75

set -euo pipefail

VIDEO="$1"
SLUG="$2"
DESKTOP_FRAMES="${3:-150}"
MOBILE_FRAMES="${4:-75}"
DESKTOP_QUALITY=80
MOBILE_QUALITY=70
MOBILE_WIDTH=960

OUT_DIR="public/frames/${SLUG}"
MOBILE_DIR="${OUT_DIR}/mobile"

# Validate input
if [[ ! -f "$VIDEO" ]]; then
  echo "Error: Video file '$VIDEO' not found"
  exit 1
fi

command -v ffmpeg >/dev/null 2>&1 || { echo "Error: ffmpeg not installed"; exit 1; }
command -v ffprobe >/dev/null 2>&1 || { echo "Error: ffprobe not installed"; exit 1; }

# Get total frame count from video
TOTAL=$(ffprobe -v error -select_streams v:0 -count_frames \
  -show_entries stream=nb_read_frames -of csv=p=0 "$VIDEO")

if [[ -z "$TOTAL" || "$TOTAL" -eq 0 ]]; then
  # Fallback: estimate from duration and fps
  TOTAL=$(ffprobe -v error -select_streams v:0 \
    -show_entries stream=nb_frames -of csv=p=0 "$VIDEO")
fi

echo "Source video: $VIDEO ($TOTAL frames)"
echo "Output: $OUT_DIR"
echo "Desktop: $DESKTOP_FRAMES frames @ WebP quality $DESKTOP_QUALITY"
echo "Mobile:  $MOBILE_FRAMES frames @ ${MOBILE_WIDTH}px @ WebP quality $MOBILE_QUALITY"

# Create output directories
mkdir -p "$OUT_DIR" "$MOBILE_DIR"

# Calculate step size (pick every Nth frame)
DESKTOP_STEP=$((TOTAL / DESKTOP_FRAMES))
MOBILE_STEP=$((TOTAL / MOBILE_FRAMES))

# Ensure step is at least 1
[[ "$DESKTOP_STEP" -lt 1 ]] && DESKTOP_STEP=1
[[ "$MOBILE_STEP" -lt 1 ]] && MOBILE_STEP=1

echo ""
echo "Extracting desktop frames (every ${DESKTOP_STEP}th frame)..."
ffmpeg -i "$VIDEO" \
  -vf "select=not(mod(n\,${DESKTOP_STEP}))" \
  -vsync vfr \
  -frames:v "$DESKTOP_FRAMES" \
  -c:v libwebp -quality "$DESKTOP_QUALITY" \
  "${OUT_DIR}/frame_%04d.webp" \
  -y -loglevel warning

ACTUAL_DESKTOP=$(ls -1 "${OUT_DIR}"/frame_*.webp 2>/dev/null | wc -l)
echo "Desktop: $ACTUAL_DESKTOP frames extracted"

echo ""
echo "Extracting mobile frames (every ${MOBILE_STEP}th frame, ${MOBILE_WIDTH}px)..."
ffmpeg -i "$VIDEO" \
  -vf "select=not(mod(n\,${MOBILE_STEP})),scale=${MOBILE_WIDTH}:-1" \
  -vsync vfr \
  -frames:v "$MOBILE_FRAMES" \
  -c:v libwebp -quality "$MOBILE_QUALITY" \
  "${MOBILE_DIR}/frame_%04d.webp" \
  -y -loglevel warning

ACTUAL_MOBILE=$(ls -1 "${MOBILE_DIR}"/frame_*.webp 2>/dev/null | wc -l)
echo "Mobile: $ACTUAL_MOBILE frames extracted"

# Generate manifest
cat > "${OUT_DIR}/manifest.json" << MANIFEST
{
  "slug": "${SLUG}",
  "desktop": { "count": ${ACTUAL_DESKTOP}, "quality": ${DESKTOP_QUALITY}, "format": "webp" },
  "mobile": { "count": ${ACTUAL_MOBILE}, "quality": ${MOBILE_QUALITY}, "width": ${MOBILE_WIDTH}, "format": "webp" }
}
MANIFEST

# Size report
DESKTOP_SIZE=$(du -sh "$OUT_DIR" --exclude="mobile" 2>/dev/null | cut -f1)
MOBILE_SIZE=$(du -sh "$MOBILE_DIR" 2>/dev/null | cut -f1)
echo ""
echo "Done! Desktop: ~${DESKTOP_SIZE}, Mobile: ~${MOBILE_SIZE}"
echo "Manifest: ${OUT_DIR}/manifest.json"
echo ""
echo "Add to products.ts:"
echo "  frames: { directory: \"/frames/${SLUG}\", count: ${ACTUAL_DESKTOP}, format: \"webp\" }"
```

**Step 3: Make it executable**

Run: `chmod +x scripts/extract-frames.sh`

**Step 4: Test with an existing video or dummy**

Run: `cd /home/jegx/jegx/desktop/work/org/fureliza && ffmpeg -version | head -1`
Expected: FFmpeg version info (confirms it's installed)

**Step 5: Commit**

```bash
git add scripts/extract-frames.sh
git commit -m "feat: add FFmpeg frame extraction script for product videos"
```

---

## Task 2: Add Pricing Psychology to Product Types

> **Qué hace (fácil):** Agrega el precio de botella completa al modelo de datos para poder mostrarlo tachado en la web. También agrega la variante "sample" (1ml, para las tarjetas de colección).

**Files:**
- Modify: `src/types/product.ts`
- Modify: `src/data/products.ts`

**Step 1: Update ProductInput to include retail anchor price**

In `src/types/product.ts`, add `retailPrice` to `ProductInput`:

```typescript
export interface ProductInput {
  slug: string;
  name: string;
  house: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  variants: ProductVariant[];
  retailPrice?: {           // Full bottle retail (for price anchoring)
    cop: number;
    usd: number;
    size: string;           // "100ml", "70ml"
  };
}
```

**Step 2: Update existing products with retailPrice**

In `src/data/products.ts`, add to Megamare:

```typescript
retailPrice: { cop: 1350000, usd: 320, size: "50ml" },
```

Add to Baccarat Rouge 540:

```typescript
retailPrice: { cop: 1450000, usd: 345, size: "70ml" },
```

**Step 3: Type check**

Run: `cd /home/jegx/jegx/desktop/work/org/fureliza && npx tsc --noEmit`
Expected: Clean (0 errors) — retailPrice is optional so existing code works

**Step 4: Commit**

```bash
git add src/types/product.ts src/data/products.ts
git commit -m "feat: add retailPrice for psychological price anchoring"
```

---

## Task 3: Psychological Pricing UI on Product Page

> **Qué hace (fácil):** En la página de cada perfume, muestra el precio de la botella completa tachado arriba, y abajo los precios de decant con etiquetas como "Ahorra 93%" y "Desde $1,167/día". Esto hace que el decant se sienta como una ganga increíble.

**Files:**
- Modify: `src/app/perfume/[slug]/ProductPageClient.tsx`

**Step 1: Read the current file**

Read `src/app/perfume/[slug]/ProductPageClient.tsx` to understand the current variant selector.

**Step 2: Add price anchoring display**

Above the variant selector, show:

```tsx
{/* Price anchoring: show retail price crossed out */}
{product.retailPrice && (
  <div className="mb-4">
    <p className="text-xs tracking-widest uppercase text-[var(--color-ink-soft)] mb-1">
      Botella completa {product.retailPrice.size}
    </p>
    <p className="text-lg line-through text-[var(--color-ink-soft)]/50">
      {formatPrice(product.retailPrice.cop, "COP")}
    </p>
  </div>
)}
```

**Step 3: Add savings percentage to each variant**

For each variant, calculate and show the savings vs retail:

```tsx
{product.retailPrice && (
  <span className="text-xs text-[var(--color-gold)]">
    Ahorra {Math.round((1 - (variant.price.cop / product.retailPrice.cop)) * 100)}%
  </span>
)}
```

**Step 4: Add per-day cost for decants**

Below each decant variant price, show the per-day cost:

```tsx
{variant.type === "decant" && (
  <span className="text-[10px] text-[var(--color-ink-soft)]">
    ~{formatPrice(Math.round(variant.price.cop / 30), "COP")}/día
  </span>
)}
```

**Step 5: Type check and build**

Run: `cd /home/jegx/jegx/desktop/work/org/fureliza && npx tsc --noEmit && npm run build`
Expected: Clean build, 11/11 pages

**Step 6: Commit**

```bash
git add src/app/perfume/[slug]/ProductPageClient.tsx
git commit -m "feat: add psychological pricing — retail anchor, savings %, per-day cost"
```

---

## Task 4: Catalog Generation Script

> **Qué hace (fácil):** Le dices el nombre de un perfume y automáticamente: (1) busca todos sus datos en internet (notas, ratings, performance), (2) le pide a Claude que escriba una descripción poética en español, y (3) genera el código TypeScript listo para pegar en products.ts.

**Files:**
- Create: `scripts/generate-product.ts`
- Create: `scripts/tsconfig.json`

**Step 1: Install dependencies**

Run: `cd /home/jegx/jegx/desktop/work/org/fureliza && npm install --save-dev tsx @anthropic-ai/sdk`

> `tsx` lets us run TypeScript files directly. `@anthropic-ai/sdk` is the official Claude API client.

**Step 2: Create scripts tsconfig**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "rootDir": "."
  },
  "include": ["*.ts"]
}
```

**Step 3: Write the catalog generation script**

```typescript
// generate-product.ts — Generate a complete Product object from fragrance name
// Usage: ANTHROPIC_API_KEY=sk-... npx tsx scripts/generate-product.ts "Layton" "Parfums de Marly"
//
// Optional env: FRAGELLA_API_KEY for real data. Without it, uses manual input mode.

import Anthropic from "@anthropic-ai/sdk";

// --- Types (mirror src/types/product.ts) ---

interface ProductVariant {
  id: string;
  size: string;
  type: "decant" | "full" | "sample";
  price: { cop: number; usd: number };
  inStock: boolean;
}

interface GeneratedProduct {
  slug: string;
  name: string;
  house: string;
  notes: { top: string[]; heart: string[]; base: string[] };
  variants: ProductVariant[];
  retailPrice: { cop: number; usd: number; size: string };
  family: string;
  mood: string[];
  emotionalTags: string[];
  description: string;
  fragrance: { intensity: number; projection: number; longevity: number };
  occasions: string[];
  season: string[];
  related: string[];
  frames: { directory: string; count: number; format: string };
  images: { card: string; hero: string };
}

// --- Fragella API (or fallback) ---

interface FragellaData {
  name: string;
  house: string;
  notes: { top: string[]; heart: string[]; base: string[] };
  accords: string[];
  intensity: number;
  projection: number;
  longevity: number;
}

async function fetchFragellaData(
  name: string,
  house: string
): Promise<FragellaData> {
  const apiKey = process.env.FRAGELLA_API_KEY;

  if (apiKey) {
    try {
      const res = await fetch(
        `https://api.fragella.com/v1/search?q=${encodeURIComponent(name + " " + house)}`,
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.results?.length > 0) {
          const frag = data.results[0];
          return {
            name: frag.name,
            house: frag.brand,
            notes: {
              top: frag.notes?.top?.map((n: { name: string }) => n.name) ?? [],
              heart: frag.notes?.middle?.map((n: { name: string }) => n.name) ?? [],
              base: frag.notes?.base?.map((n: { name: string }) => n.name) ?? [],
            },
            accords: frag.accords?.map((a: { name: string }) => a.name) ?? [],
            intensity: frag.sillage ?? 7,
            projection: frag.projection ?? 7,
            longevity: frag.longevity ?? 7,
          };
        }
      }
    } catch {
      console.warn("Fragella API failed, using Claude for data generation");
    }
  }

  // Fallback: ask Claude to provide factual fragrance data
  console.log("No Fragella API key — Claude will generate based on its knowledge");
  return {
    name,
    house,
    notes: { top: [], heart: [], base: [] },
    accords: [],
    intensity: 0,
    projection: 0,
    longevity: 0,
  };
}

// --- Claude API content generation ---

async function generateContent(
  client: Anthropic,
  data: FragellaData
): Promise<Omit<GeneratedProduct, "variants" | "retailPrice" | "frames" | "images">> {
  const needsFactualData = data.notes.top.length === 0;

  const prompt = `Eres el poeta y perfumista experto de Fur Eliza, una curaduría de experiencias olfativas inspirada en Beethoven. Tu trabajo es generar la ficha completa de un perfume.

Fragancia: ${data.name} por ${data.house}
${needsFactualData ? "No tengo los datos — genera notas, accords y performance basado en tu conocimiento." : `
Notas de salida: ${data.notes.top.join(", ")}
Notas de corazón: ${data.notes.heart.join(", ")}
Notas de fondo: ${data.notes.base.join(", ")}
Accords: ${data.accords.join(", ")}
Performance: intensidad ${data.intensity}/10, proyección ${data.projection}/10, longevidad ${data.longevity}/10
`}

Genera un JSON con EXACTAMENTE esta estructura (sin markdown, solo JSON puro):
{
  "slug": "nombre-en-kebab-case",
  "name": "Nombre exacto",
  "house": "Casa exacta",
  "notes": {
    "top": ["nota1", "nota2"],
    "heart": ["nota1", "nota2"],
    "base": ["nota1", "nota2"]
  },
  "family": "Una de: deep-woods | opulent-florals | vibrant-citrus | ocean-marine | oriental-spiced | gourmand-sweet",
  "mood": ["Array de: power | seduction | energy | comfort | mystery | elegance | innocence | rebellion"],
  "emotionalTags": ["6 tags emocionales en inglés que capturen la esencia"],
  "description": "Descripción poética en INGLÉS, 3 frases, máximo 280 caracteres. Tono: lírico, sensorial, evocador. Como si describieras una pieza musical.",
  "fragrance": {
    "intensity": 8,
    "projection": 7,
    "longevity": 9
  },
  "occasions": ["Array de: evening | date-night | formal | casual | office | statement"],
  "season": ["Array de: spring | summer | fall | winter"],
  "related": []
}

IMPORTANTE: Solo JSON puro, sin backticks, sin explicaciones.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  return JSON.parse(text.trim());
}

// --- Main ---

async function main() {
  const name = process.argv[2];
  const house = process.argv[3];

  if (!name || !house) {
    console.error(
      'Usage: ANTHROPIC_API_KEY=sk-... npx tsx scripts/generate-product.ts "Layton" "Parfums de Marly"'
    );
    console.error("");
    console.error("Optional env vars:");
    console.error("  FRAGELLA_API_KEY  — For real fragrance data from Fragella API");
    console.error("  ANTHROPIC_API_KEY — For AI-generated descriptions (required)");
    process.exit(1);
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("Error: ANTHROPIC_API_KEY is required");
    console.error("Get one at: https://console.anthropic.com/");
    process.exit(1);
  }

  console.log(`Generating product data for: ${name} by ${house}\n`);

  // Step 1: Fetch fragrance data
  console.log("1. Fetching fragrance data...");
  const fragellaData = await fetchFragellaData(name, house);

  // Step 2: Generate content with Claude
  console.log("2. Generating poetic content with Claude...");
  const client = new Anthropic({ apiKey });
  const generated = await generateContent(client, fragellaData);

  // Step 3: Assemble full product
  const slug = generated.slug;
  const product: GeneratedProduct = {
    ...generated,
    variants: [
      {
        id: `${slug}-full`,
        type: "full",
        size: "100ml",
        price: { cop: 0, usd: 0 },
        inStock: false,
      },
      {
        id: `${slug}-decant-10`,
        type: "decant",
        size: "10ml",
        price: { cop: 0, usd: 0 },
        inStock: true,
      },
      {
        id: `${slug}-decant-5`,
        type: "decant",
        size: "5ml",
        price: { cop: 0, usd: 0 },
        inStock: true,
      },
      {
        id: `${slug}-sample`,
        type: "sample",
        size: "1ml",
        price: { cop: 0, usd: 0 },
        inStock: true,
      },
    ],
    retailPrice: { cop: 0, usd: 0, size: "100ml" },
    frames: { directory: `/frames/${slug}`, count: 150, format: "webp" },
    images: {
      card: `/products/${slug}-card.webp`,
      hero: `/products/${slug}-hero.webp`,
    },
  };

  // Step 4: Output
  console.log("\n3. Product generated!\n");
  console.log("--- PASTE INTO src/data/products.ts ---\n");

  // Pretty print as TypeScript
  const ts = JSON.stringify(product, null, 2)
    .replace(/"([^"]+)":/g, "$1:")  // Remove quotes from keys
    .replace(/"/g, '"');            // Keep string quotes

  console.log(ts);

  console.log("\n--- END ---");
  console.log("\nTODO: Fill in prices (cop/usd) for variants and retailPrice");
  console.log(`TODO: Run ./scripts/extract-frames.sh <video> ${slug} to generate frames`);
  console.log(`TODO: Add hero/card images to public/products/${slug}-hero.webp and ${slug}-card.webp`);
}

main().catch(console.error);
```

**Step 4: Test the script (dry run)**

Run: `cd /home/jegx/jegx/desktop/work/org/fureliza && ANTHROPIC_API_KEY=test npx tsx scripts/generate-product.ts`
Expected: Usage message (no crash)

**Step 5: Commit**

```bash
git add scripts/generate-product.ts scripts/tsconfig.json package.json package-lock.json
git commit -m "feat: add catalog generation script — Fragella API + Claude content"
```

---

## Task 5: Master Pipeline Script

> **Qué hace (fácil):** Un solo comando que ejecuta todo el pipeline. Le das: nombre del perfume, casa, y video. Él hace todo: busca datos, genera descripción, extrae frames, y te dice exactamente qué pegar en el código.

**Files:**
- Create: `scripts/pipeline.sh`

**Step 1: Write the master pipeline**

```bash
#!/usr/bin/env bash
# pipeline.sh — Full product pipeline: data + content + frames
# Usage: ./scripts/pipeline.sh "Layton" "Parfums de Marly" video.mp4
#
# Requires:
#   ANTHROPIC_API_KEY env var
#   Optional: FRAGELLA_API_KEY env var
#   ffmpeg installed

set -euo pipefail

NAME="$1"
HOUSE="$2"
VIDEO="${3:-}"

echo "=========================================="
echo "  Fur Eliza — El Compositor Pipeline"
echo "=========================================="
echo ""
echo "Fragrance: $NAME by $HOUSE"
echo ""

# Step 1: Generate product data + content
echo "--- Step 1: Generating catalog data ---"
npx tsx scripts/generate-product.ts "$NAME" "$HOUSE"

# Step 2: Extract frames (if video provided)
if [[ -n "$VIDEO" ]]; then
  # Derive slug from name (lowercase, spaces to hyphens)
  SLUG=$(echo "$NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | sed 's/[^a-z0-9-]//g')

  echo ""
  echo "--- Step 2: Extracting frames from video ---"
  ./scripts/extract-frames.sh "$VIDEO" "$SLUG" 150 75
  echo ""
  echo "Frames ready at: public/frames/${SLUG}/"
else
  echo ""
  echo "--- Step 2: Skipped (no video provided) ---"
  echo "Run later: ./scripts/extract-frames.sh <video> <slug> 150 75"
fi

echo ""
echo "=========================================="
echo "  Pipeline complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "  1. Fill in prices in the generated product object"
echo "  2. Paste into src/data/products.ts"
echo "  3. Add hero/card images to public/products/"
echo "  4. Run: npm run build"
echo "  5. Commit and push"
```

**Step 2: Make executable**

Run: `chmod +x scripts/pipeline.sh`

**Step 3: Commit**

```bash
git add scripts/pipeline.sh
git commit -m "feat: add master pipeline script — single command product creation"
```

---

## Task 6: Update Existing Products Frame Count

> **Qué hace (fácil):** Actualiza los 2 productos que ya tenemos para que usen 150 frames en vez de 120. El HeroScroll ya lee el número dinámicamente, así que solo hay que cambiar el dato.

**Files:**
- Modify: `src/data/products.ts`

**Step 1: Update Megamare frames count**

Change `count: 120` to `count: 150` for Megamare (or keep at 120 since current frames are 120 — only change when re-generated).

Actually: keep current products at their actual frame count (120). New products will use 150. The system is already dynamic. No code change needed.

**Step 2: Verify HeroScroll reads count dynamically**

Confirm `HeroScroll.tsx` line 26: `const TOTAL_FRAMES = frames.count;` — already dynamic. No change needed.

**This task is a no-op.** The architecture already supports variable frame counts per product.

---

## Task 7: Add NPM Scripts for Pipeline

> **Qué hace (fácil):** Agrega comandos cortos para que en vez de escribir todo el path, solo digas `npm run generate` o `npm run pipeline`.

**Files:**
- Modify: `package.json`

**Step 1: Add pipeline scripts to package.json**

Add to the `"scripts"` section:

```json
"generate": "tsx scripts/generate-product.ts",
"frames": "./scripts/extract-frames.sh",
"pipeline": "./scripts/pipeline.sh"
```

**Step 2: Verify**

Run: `cd /home/jegx/jegx/desktop/work/org/fureliza && npm run generate 2>&1 | head -5`
Expected: Usage message from generate-product.ts

**Step 3: Commit**

```bash
git add package.json
git commit -m "feat: add npm scripts for product pipeline commands"
```

---

## Task 8: Final Build Verification + Push

> **Qué hace (fácil):** Verifica que todo compile bien y sube todo a GitHub.

**Step 1: Type check**

Run: `cd /home/jegx/jegx/desktop/work/org/fureliza && npx tsc --noEmit`
Expected: 0 errors

**Step 2: Production build**

Run: `cd /home/jegx/jegx/desktop/work/org/fureliza && npm run build`
Expected: 11/11 pages

**Step 3: Push all commits**

Run: `git push origin main`

---

## Summary: What You Get

After all 8 tasks, you have:

| Command | What it does |
|---------|-------------|
| `npm run generate "Layton" "Parfums de Marly"` | Generates full product data + poetic description |
| `npm run frames video.mp4 layton 150 75` | Extracts 150 desktop + 75 mobile WebP frames |
| `npm run pipeline "Layton" "Parfums de Marly" video.mp4` | Does everything in one command |

**Time per new product: ~45 minutes**
1. Take video of bottle on turntable (15 min)
2. Run `npm run pipeline` (2 min)
3. Fill in prices, paste into code (10 min)
4. Add hero/card images (10 min)
5. Build + commit + push (5 min)

---

## Parking Lot (Future Tasks, Not Now)

- [ ] Price monitor script (Jomashop, AllBeauty scraping)
- [ ] WhatsApp Business API integration for quiz automation
- [ ] Sinfonías Olfativas as a product type in the data model
- [ ] Tarjetas de Colección product cards (Figma/Canva template)
- [ ] NFC tag content pages
- [ ] TikTok content calendar automation

---

*Implementation plan — v1.0.0 — 2 Abril 2026*
