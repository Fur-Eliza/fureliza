# El Compositor Pipeline

## Overview
Automated product creation: fragrance name → product data → AI video → scroll frames

## Components
- **Text generation**: `scripts/generate-product.ts` — OpenRouter API (default: Gemini 2.5 Flash). Env: `OPENROUTER_API_KEY`
- **Video generation**: `scripts/generate-video.ts` — fal.ai (default: Kling Turbo). Env: `FAL_KEY`. 7 cinematic styles
- **Frame extraction**: `scripts/extract-frames.sh` — FFmpeg local. 150 desktop + 75 mobile WebP frames + manifest.json
- **Master pipeline**: `scripts/pipeline.sh` — all three in one command
- **Fragrance data**: Optional Fragella API ($12/mo, 74K+ fragrances). Env: `FRAGELLA_API_KEY`

## Video styles
hero | orbit | macro | mood | transform | floating | water

## Usage
```bash
npm run pipeline "Layton" "Parfums de Marly" photo.jpg hero
```

## Reference
- Prompt templates and camera vocabulary: `docs/AI_VIDEO_GENERATION_GUIDE.md`
- Design doc: `docs/plans/2026-04-01-catalog-automation-design.md`
