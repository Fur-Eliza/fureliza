#!/usr/bin/env node
// scripts/generate-placeholder-frames.mjs
// Generates 120 colored gradient placeholder frames for development testing
// Usage: node scripts/generate-placeholder-frames.mjs <slug> <color-hex>

import sharp from "sharp";
import { mkdirSync, writeFileSync, copyFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, "..");

const SLUG = process.argv[2];
const COLOR = process.argv[3] || "1a3a5c";
const FRAMES = 120;
const WIDTH = 1920;
const HEIGHT = 1080;

if (!SLUG) {
  console.error("Usage: node generate-placeholder-frames.mjs <slug> [color-hex]");
  process.exit(1);
}

const OUT_DIR = join(PROJECT_ROOT, "public", "frames", SLUG);
const MOBILE_DIR = join(OUT_DIR, "mobile");
const PRODUCTS_DIR = join(PROJECT_ROOT, "public", "products");

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(MOBILE_DIR, { recursive: true });
mkdirSync(PRODUCTS_DIR, { recursive: true });

// Parse hex color
const r = parseInt(COLOR.slice(0, 2), 16);
const g = parseInt(COLOR.slice(2, 4), 16);
const b = parseInt(COLOR.slice(4, 6), 16);

console.log(`==> Generating ${FRAMES} placeholder frames for: ${SLUG}`);
console.log(`    Color: #${COLOR} (${r}, ${g}, ${b})`);

for (let i = 1; i <= FRAMES; i++) {
  const pad = String(i).padStart(4, "0");
  const progress = i / FRAMES;

  // Vary brightness across frames to simulate scroll animation
  const brightness = 0.3 + progress * 0.7;
  const cr = Math.round(r * brightness);
  const cg = Math.round(g * brightness);
  const cb = Math.round(b * brightness);

  // Create SVG with gradient + text label
  const svg = `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="rgb(${cr},${cg},${cb})"/>
        <stop offset="100%" stop-color="rgb(${Math.round(cr*0.5)},${Math.round(cg*0.5)},${Math.round(cb*0.5)})"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
      font-family="sans-serif" font-size="64" fill="rgba(255,255,255,0.3)"
      font-weight="bold">${SLUG} ${pad}</text>
    <text x="50%" y="60%" text-anchor="middle" dominant-baseline="middle"
      font-family="sans-serif" font-size="24" fill="rgba(255,255,255,0.15)">
      Fur Eliza — Placeholder Frame</text>
  </svg>`;

  const outPath = join(OUT_DIR, `frame_${pad}.webp`);
  await sharp(Buffer.from(svg)).webp({ quality: 65 }).toFile(outPath);

  if (i % 20 === 0) console.log(`    ${i}/${FRAMES} frames...`);
}

// Hero + card (frame at 30%)
const heroFrame = String(Math.round(FRAMES * 0.3)).padStart(4, "0");
copyFileSync(join(OUT_DIR, `frame_${heroFrame}.webp`), join(PRODUCTS_DIR, `${SLUG}-hero.webp`));
copyFileSync(join(OUT_DIR, `frame_${heroFrame}.webp`), join(PRODUCTS_DIR, `${SLUG}-card.webp`));

// Mobile (every 2nd frame)
let mobileCount = 0;
for (let i = 1; i <= FRAMES; i += 2) {
  mobileCount++;
  const srcPad = String(i).padStart(4, "0");
  const dstPad = String(mobileCount).padStart(4, "0");
  copyFileSync(join(OUT_DIR, `frame_${srcPad}.webp`), join(MOBILE_DIR, `frame_${dstPad}.webp`));
}

// Manifest
writeFileSync(join(OUT_DIR, "manifest.json"), JSON.stringify({
  slug: SLUG,
  count: FRAMES,
  mobileCount,
  format: "webp",
  fps: 24,
  totalSize: "placeholder",
}, null, 2));

console.log(`==> Done: ${OUT_DIR}/ (${FRAMES} frames, ${mobileCount} mobile)`);
console.log(`    Hero: ${PRODUCTS_DIR}/${SLUG}-hero.webp`);
console.log(`    Card: ${PRODUCTS_DIR}/${SLUG}-card.webp`);
