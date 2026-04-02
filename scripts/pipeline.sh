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
