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
