#!/usr/bin/env bash
# Publish a Cursor .canvas.tsx file to the web via Cloudflare Workers.
#
# Usage:
#   publish.sh <path-to-canvas.canvas.tsx> [worker-name]
#
# Behavior:
#   - Copies the skill's Vite template to a temp work dir
#   - Drops the canvas in as src/canvas.canvas.tsx
#   - Builds with the cursor/canvas -> @thisismydesign/cursor-canvas-web alias
#   - Deploys dist/ as a static-assets Worker:
#       * If Cloudflare credentials exist (CLOUDFLARE_API_TOKEN or wrangler
#         login), a normal deploy to the account.
#       * Otherwise `wrangler deploy --temporary`: a temporary preview account
#         with a live workers.dev URL for 60 minutes and a claim URL to keep it.
set -euo pipefail

CANVAS_PATH="${1:?Usage: publish.sh <canvas.canvas.tsx> [worker-name]}"
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ ! -f "$CANVAS_PATH" ]]; then
  echo "Error: canvas file not found: $CANVAS_PATH" >&2
  exit 1
fi

# Derive a workers.dev-safe name from the canvas filename unless provided.
BASENAME="$(basename "$CANVAS_PATH" | sed 's/\.canvas\.tsx$//')"
DEFAULT_NAME="canvas-$(echo "$BASENAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g' | cut -c1-40)"
WORKER_NAME="${2:-$DEFAULT_NAME}"

WORK_DIR="$(mktemp -d /tmp/canvas-publish.XXXXXX)"
echo "Work dir: $WORK_DIR"

cp -r "$SKILL_DIR/template/." "$WORK_DIR/"
cp "$CANVAS_PATH" "$WORK_DIR/src/canvas.canvas.tsx"

cd "$WORK_DIR"

echo "Installing dependencies..."
npm install --no-audit --no-fund --loglevel=error

echo "Building..."
npm run build

echo "Deploying to Cloudflare as '$WORKER_NAME'..."
# `wrangler whoami` exits 0 even when logged out, so check its output.
if [[ -n "${CLOUDFLARE_API_TOKEN:-}" ]] || npx wrangler whoami 2>/dev/null | grep -q "associated with the email"; then
  npx wrangler deploy --name "$WORKER_NAME"
else
  # No credentials: temporary preview account (live 60 min, claimable).
  npx wrangler deploy --temporary --name "$WORKER_NAME"
fi

echo ""
echo "Done. If this was a temporary deploy, open the claim URL above within 60 minutes to keep it."
