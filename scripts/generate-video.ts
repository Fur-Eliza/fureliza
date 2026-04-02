// generate-video.ts — Generate cinematic product video from a product photo
// Usage: FAL_KEY=... npx tsx scripts/generate-video.ts <image-path> <product-slug> [style]
//
// Styles: hero | orbit | macro | mood | transform | floating | water
// Default: hero
//
// Env vars:
//   FAL_KEY          — fal.ai API key (required)
//   FAL_MODEL        — Model endpoint (default: fal-ai/kling-video/v2.5-turbo/pro/image-to-video)
//   VIDEO_DURATION   — Duration in seconds: 5 or 10 (default: 5)

import { fal } from "@fal-ai/client";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { resolve, extname } from "path";

// --- Prompt Templates ---

type VideoStyle = "hero" | "orbit" | "macro" | "mood" | "transform" | "floating" | "water";

interface PromptTemplate {
  name: string;
  prompt: string;
  negative: string;
  bestFor: string;
}

const PROMPTS: Record<VideoStyle, PromptTemplate> = {
  hero: {
    name: "Hero Reveal",
    bestFor: "Product page hero, dramatic entrance",
    prompt: `Spotlight glides slowly across the perfume bottle on a velvet-black surface. Slow crane shot descending from darkness to product level. High-contrast rim lighting with dramatic golden highlights from upper right. Soft fog drifts in background. The bottle catches light sequentially revealing glass facets and gold details. Shot on 35mm film, shallow depth of field, luxury Dior commercial aesthetic, photorealistic, 4K quality, 16:9.`,
    negative: "blurry, warping, text morphing, flickering, cartoon, cluttered background, jitter, low resolution",
  },
  orbit: {
    name: "360-Degree Showcase",
    bestFor: "Product detail, e-commerce showcase",
    prompt: `Elegant perfume bottle rotating slowly on a polished black marble pedestal. Smooth 360-degree orbit shot at eye level. Soft spotlight from above with subtle warm rim light from behind creating clean surface reflections and a soft Fresnel effect on edges. Rose petals scattered on the marble surface. Black background, commercial photography style, photorealistic, 4K quality.`,
    negative: "jitter, stutter, warping, morphing, inconsistent lighting, text morphing, fingerprints, dust, choppy",
  },
  macro: {
    name: "Macro Detail — Notes Visualization",
    bestFor: "Fragrance notes storytelling, sensory content",
    prompt: `Extreme macro close-up of the perfume bottle glass surface. Slow push-in revealing crystal facets. Delicate rose petals, cardamom pods, and wisps of vanilla smoke drift into frame from edges. Rack focus shifts from petals in foreground to golden liquid through glass. Warm key light from upper left with caustic light patterns dancing on surface. Shallow depth of field, luxury brand macro photography, photorealistic, 4K.`,
    negative: "blurry, extra objects, cluttered, fingerprints, dust, warping, morphing, cartoon",
  },
  mood: {
    name: "Lifestyle / Mood",
    bestFor: "Brand storytelling, Instagram, editorial",
    prompt: `The perfume bottle resting on weathered leather-bound books beside a crackling fireplace. Warm amber firelight creates dancing golden reflections on bottle surface. Wisps of aromatic smoke curl upward in slow motion. Gentle dolly-in from medium shot to close-up. Shallow depth of field with soft bokeh from fire in background. Moody, intimate atmosphere. Rich browns, deep golds, warm amber palette. Luxury editorial style, photorealistic.`,
    negative: "cartoon, oversaturated, bright, clinical, sterile, cluttered, multiple products, harsh light",
  },
  transform: {
    name: "Liquid Gold Transformation",
    bestFor: "TikTok viral, artistic, shareable",
    prompt: `A cascade of dark liquid gold flowing in slow motion, gradually coalescing and solidifying into the form of a luxury perfume bottle. As the bottle takes shape, rose petals and fragments of wood orbit around it caught in the liquid flow. Slow orbit camera as transformation completes. Volumetric golden light from behind. Black background with subtle smoke. Surreal, artistic, high-fashion perfume commercial aesthetic. Smooth liquid movement, photorealistic, 4K.`,
    negative: "jerky, sudden cuts, inconsistent physics, flickering, warping, low resolution, cartoon",
  },
  floating: {
    name: "Floating / Zero Gravity",
    bestFor: "Social media hook, TikTok/Reels first 3 seconds",
    prompt: `A dark luxury perfume bottle floating and slowly rotating in mid-air against a pure black background. Golden particles of light orbit around the bottle like a constellation. The glass surface catches and refracts particle light creating prismatic glints. Slow push-in from medium to close-up. Dramatic side lighting with soft rim light creating clean reflections. Zero gravity, ethereal, futuristic luxury aesthetic, photorealistic, 4K.`,
    negative: "ground, surface, table, shadows on floor, warping, morphing, cartoon, jitter, cluttered",
  },
  water: {
    name: "Water Submersion",
    bestFor: "Aquatic/fresh fragrances, sensory immersion",
    prompt: `A luxury perfume bottle slowly sinking into deep crystal-clear dark blue water. Sunlight shafts penetrate from above creating caustic light patterns dancing across glass surface. Tiny air bubbles rise from bottle in slow motion. Golden liquid inside catches refracted underwater light. Smooth dolly-down tracking the descent. Macro detail of water surface tension breaking. Premium aquatic luxury, slow motion, photorealistic, 4K quality.`,
    negative: "murky water, dirty, bubbles too large, warping, morphing, flickering, fast movement, cartoon",
  },
};

// --- Models ---

const MODELS: Record<string, string> = {
  "kling-turbo": "fal-ai/kling-video/v2.5-turbo/pro/image-to-video",
  "kling-3": "fal-ai/kling-video/v3/standard/image-to-video",
  "kling-2.6": "fal-ai/kling-video/v2.6/pro/image-to-video",
  "veo-3": "fal-ai/veo3/image-to-video",
  "veo-3.1-fast": "fal-ai/veo3.1/fast/image-to-video",
  "hailuo": "fal-ai/minimax/hailuo-2.3-fast/pro/image-to-video",
  "wan": "fal-ai/wan-pro/image-to-video",
  "luma": "fal-ai/luma-dream-machine/image-to-video",
  "sora": "fal-ai/sora-2/image-to-video/pro",
};

const DEFAULT_MODEL = "kling-turbo";

// --- Upload image ---

async function uploadImage(imagePath: string): Promise<string> {
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const absPath = resolve(imagePath);
  if (!existsSync(absPath)) {
    throw new Error(`Image not found: ${absPath}`);
  }

  const buffer = readFileSync(absPath);
  const ext = extname(absPath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
  };
  const contentType = mimeTypes[ext] ?? "image/jpeg";
  const blob = new Blob([buffer], { type: contentType });

  console.log(`  Uploading ${absPath} to fal.ai storage...`);
  const url = await fal.storage.upload(blob);
  console.log(`  Uploaded: ${url}`);
  return url;
}

// --- Generate video ---

async function generateVideo(
  imageUrl: string,
  style: VideoStyle,
  modelKey: string,
  duration: number
): Promise<string> {
  const template = PROMPTS[style];
  const endpoint = MODELS[modelKey] ?? MODELS[DEFAULT_MODEL];

  console.log(`\n  Style: ${template.name}`);
  console.log(`  Model: ${modelKey} → ${endpoint}`);
  console.log(`  Duration: ${duration}s`);
  console.log(`  Best for: ${template.bestFor}`);
  console.log(`\n  Generating video (this takes 1-3 minutes)...\n`);

  const result = await fal.subscribe(endpoint, {
    input: {
      prompt: template.prompt,
      image_url: imageUrl,
      duration: String(duration),
      negative_prompt: template.negative,
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_QUEUE") {
        console.log(`  Status: in queue...`);
      } else if (update.status === "IN_PROGRESS") {
        const logs = (update as { logs?: Array<{ message: string }> }).logs;
        if (logs) {
          logs.map((log) => log.message).forEach((msg) => console.log(`  Progress: ${msg}`));
        }
      }
    },
  });

  const data = result.data as { video?: { url?: string } };
  const videoUrl = data?.video?.url;

  if (!videoUrl) {
    throw new Error(`No video URL in response: ${JSON.stringify(result.data)}`);
  }

  return videoUrl;
}

// --- Download video ---

async function downloadVideo(url: string, outputPath: string): Promise<void> {
  console.log(`  Downloading video...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(outputPath, buffer);
  const sizeMB = (buffer.length / 1024 / 1024).toFixed(1);
  console.log(`  Saved: ${outputPath} (${sizeMB} MB)`);
}

// --- Main ---

async function main() {
  const imagePath = process.argv[2];
  const slug = process.argv[3];
  const style = (process.argv[4] ?? "hero") as VideoStyle;

  if (!imagePath || !slug) {
    console.log("Fur Eliza — El Compositor Video Generator\n");
    console.log('Usage: FAL_KEY=... npx tsx scripts/generate-video.ts <image> <slug> [style]\n');
    console.log("Arguments:");
    console.log("  <image>   Path to product photo or URL");
    console.log("  <slug>    Product slug (e.g., layton)");
    console.log("  [style]   Video style (default: hero)\n");
    console.log("Styles:");
    for (const [key, tmpl] of Object.entries(PROMPTS)) {
      console.log(`  ${key.padEnd(12)} ${tmpl.name} — ${tmpl.bestFor}`);
    }
    console.log("\nModels (set via FAL_MODEL):");
    for (const [key, endpoint] of Object.entries(MODELS)) {
      console.log(`  ${key.padEnd(15)} ${endpoint}`);
    }
    console.log(`\nDefault model: ${DEFAULT_MODEL}`);
    console.log("\nEnv vars:");
    console.log("  FAL_KEY        — fal.ai API key (required)");
    console.log("  FAL_MODEL      — Model shortname (default: kling-turbo)");
    console.log("  VIDEO_DURATION — Duration: 5 or 10 (default: 5)");
    process.exit(1);
  }

  const apiKey = process.env.FAL_KEY;
  if (!apiKey) {
    console.error("Error: FAL_KEY is required");
    console.error("Get one at: https://fal.ai/dashboard/keys");
    process.exit(1);
  }

  if (!PROMPTS[style]) {
    console.error(`Error: Unknown style "${style}". Options: ${Object.keys(PROMPTS).join(", ")}`);
    process.exit(1);
  }

  fal.config({ credentials: apiKey });

  const modelKey = process.env.FAL_MODEL ?? DEFAULT_MODEL;
  const duration = parseInt(process.env.VIDEO_DURATION ?? "5", 10);

  console.log("==========================================");
  console.log("  Fur Eliza — Video Generator");
  console.log("==========================================");
  console.log(`\n  Product: ${slug}`);

  // Step 1: Upload image
  console.log("\n1. Preparing image...");
  const imageUrl = await uploadImage(imagePath);

  // Step 2: Generate video
  console.log("\n2. Generating video...");
  const videoUrl = await generateVideo(imageUrl, style, modelKey, duration);

  // Step 3: Download
  console.log("\n3. Downloading result...");
  const outputDir = `public/videos/${slug}`;
  const outputFile = `${outputDir}/${style}.mp4`;
  const { mkdirSync } = await import("fs");
  mkdirSync(outputDir, { recursive: true });
  await downloadVideo(videoUrl, outputFile);

  // Step 4: Summary
  console.log("\n==========================================");
  console.log("  Video generated!");
  console.log("==========================================");
  console.log(`\n  File: ${outputFile}`);
  console.log(`  Style: ${PROMPTS[style].name}`);
  console.log(`  Model: ${modelKey}`);
  console.log(`\n  Next: Run 'npm run frames ${outputFile} ${slug}' to extract scroll frames`);
  console.log(`  Or use directly as a hero video on the product page.`);
}

main().catch((err) => {
  console.error("\nError:", err.message ?? err);
  process.exit(1);
});
