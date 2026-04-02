#!/usr/bin/env bash
# pipeline.sh — Full product pipeline: data + content + AI video + frames
# Usage: ./scripts/pipeline.sh "Layton" "Parfums de Marly" [photo.jpg] [video-style]
#
# Requires:
#   OPENROUTER_API_KEY env var (for catalog generation)
#   FAL_KEY env var (for AI video generation)
#   Optional: OPENROUTER_MODEL, FAL_MODEL, FRAGELLA_API_KEY
#   ffmpeg installed (for frame extraction)

set -euo pipefail

NAME="$1"
HOUSE="$2"
PHOTO="${3:-}"
STYLE="${4:-hero}"

# Derive slug from name
SLUG=$(echo "$NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | sed 's/[^a-z0-9-]//g')

echo "=========================================="
echo "  Fur Eliza — El Compositor Pipeline"
echo "=========================================="
echo ""
echo "Fragrance: $NAME by $HOUSE"
echo "Slug: $SLUG"
echo ""

# Step 1: Generate product data + content
echo "--- Step 1: Generating catalog data ---"
npx tsx scripts/generate-product.ts "$NAME" "$HOUSE"

# Step 2: Generate AI video (if photo provided)
if [[ -n "$PHOTO" ]]; then
  echo ""
  echo "--- Step 2: Generating AI product video (style: $STYLE) ---"
  npx tsx scripts/generate-video.ts "$PHOTO" "$SLUG" "$STYLE"
  VIDEO="public/videos/${SLUG}/${STYLE}.mp4"

  # Step 3: Extract frames from generated video
  if command -v ffmpeg >/dev/null 2>&1; then
    echo ""
    echo "--- Step 3: Extracting scroll frames from video ---"
    ./scripts/extract-frames.sh "$VIDEO" "$SLUG" 150 75
    echo ""
    echo "Frames ready at: public/frames/${SLUG}/"
  else
    echo ""
    echo "--- Step 3: Skipped (ffmpeg not installed) ---"
    echo "Run later: ./scripts/extract-frames.sh $VIDEO $SLUG 150 75"
  fi
else
  echo ""
  echo "--- Step 2-3: Skipped (no photo provided) ---"
  echo "Run later: npm run video <photo> $SLUG $STYLE"
fi

echo ""
echo "=========================================="
echo "  Pipeline complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "  1. Fill in prices in the generated product object"
echo "  2. Paste into src/data/products.ts"
echo "  3. Run: npm run build"
echo "  4. Commit and push"
echo ""
echo "Generate more video styles:"
echo "  npm run video <photo> $SLUG orbit     # 360 turntable"
echo "  npm run video <photo> $SLUG transform  # Liquid gold morphing"
echo "  npm run video <photo> $SLUG floating   # Zero gravity TikTok hook"
echo "  npm run video <photo> $SLUG macro      # Notes visualization"
echo "  npm run video <photo> $SLUG mood       # Lifestyle editorial"
echo "  npm run video <photo> $SLUG water      # Underwater sensory"
