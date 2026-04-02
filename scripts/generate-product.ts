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
