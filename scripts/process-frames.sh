#!/usr/bin/env bash
# scripts/process-frames.sh
# Usage: ./scripts/process-frames.sh <product-slug> <video-file> [fps]
#
# Extracts frames from a video, optimizes to WebP (and AVIF when available),
# auto-selects hero + card images, generates mobile variant, and outputs manifest.

set -euo pipefail

SLUG="${1:?Usage: process-frames.sh <slug> <video-file> [fps]}"
VIDEO="${2:?Usage: process-frames.sh <slug> <video-file> [fps]}"
FPS="${3:-24}"

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="${PROJECT_ROOT}/public/frames/${SLUG}"
PRODUCTS_DIR="${PROJECT_ROOT}/public/products"
TEMP_DIR=$(mktemp -d)

echo "==> Processing frames for: ${SLUG}"
echo "    Video: ${VIDEO}"
echo "    FPS: ${FPS}"

# 1. Extract frames
echo "==> Extracting frames at ${FPS}fps..."
mkdir -p "${OUT_DIR}"
ffmpeg -i "${VIDEO}" -vf "fps=${FPS}" -q:v 2 "${TEMP_DIR}/frame_%04d.png" -y -loglevel warning

FRAME_COUNT=$(ls -1 "${TEMP_DIR}"/frame_*.png | wc -l)
echo "    Extracted ${FRAME_COUNT} frames"

# 2. Convert to WebP
echo "==> Converting to WebP..."
for f in "${TEMP_DIR}"/frame_*.png; do
  base=$(basename "$f" .png)
  npx sharp-cli --input "$f" --output "${OUT_DIR}/${base}.webp" --format webp --quality 65 2>/dev/null || \
    ffmpeg -i "$f" -quality 65 "${OUT_DIR}/${base}.webp" -y -loglevel warning
done

# 3. Auto-select hero image (frame at 30% — usually the most visually interesting)
HERO_FRAME=$((FRAME_COUNT * 30 / 100))
HERO_FRAME_PAD=$(printf "%04d" $HERO_FRAME)
echo "==> Selecting hero frame: ${HERO_FRAME_PAD}"
mkdir -p "${PRODUCTS_DIR}"
cp "${OUT_DIR}/frame_${HERO_FRAME_PAD}.webp" "${PRODUCTS_DIR}/${SLUG}-hero.webp"
cp "${OUT_DIR}/frame_${HERO_FRAME_PAD}.webp" "${PRODUCTS_DIR}/${SLUG}-card.webp"

# 4. Generate mobile variant (skip every 2nd frame)
echo "==> Generating mobile frames..."
MOBILE_DIR="${OUT_DIR}/mobile"
mkdir -p "${MOBILE_DIR}"
MOBILE_COUNT=0
i=1
for f in "${OUT_DIR}"/frame_*.webp; do
  if (( i % 2 == 1 )); then
    MOBILE_COUNT=$((MOBILE_COUNT + 1))
    MOBILE_PAD=$(printf "%04d" $MOBILE_COUNT)
    cp "$f" "${MOBILE_DIR}/frame_${MOBILE_PAD}.webp"
  fi
  i=$((i + 1))
done
echo "    Mobile frames: ${MOBILE_COUNT}"

# 5. Calculate total size
TOTAL_SIZE=$(du -sh "${OUT_DIR}" | cut -f1)

# 6. Write manifest
cat > "${OUT_DIR}/manifest.json" <<MANIFEST
{
  "slug": "${SLUG}",
  "count": ${FRAME_COUNT},
  "mobileCount": ${MOBILE_COUNT},
  "format": "webp",
  "fps": ${FPS},
  "totalSize": "${TOTAL_SIZE}"
}
MANIFEST

echo "==> Done!"
echo "    Frames: ${OUT_DIR}/ (${FRAME_COUNT} frames, ${TOTAL_SIZE})"
echo "    Hero:   ${PRODUCTS_DIR}/${SLUG}-hero.webp"
echo "    Card:   ${PRODUCTS_DIR}/${SLUG}-card.webp"
echo "    Mobile: ${MOBILE_DIR}/ (${MOBILE_COUNT} frames)"

# Cleanup
rm -rf "${TEMP_DIR}"
