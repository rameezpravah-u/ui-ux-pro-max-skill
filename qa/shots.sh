#!/usr/bin/env bash
# Mobile screenshots of the NixWoods pages that matter, plus HTML weight.
# Usage: qa/shots.sh [label]      -> qa/runs/<date>-<label>/
#        qa/shots.sh baseline     -> qa/baseline/<date>/
# Needs playwright-cli (tools/install-design-skills.sh installs it).
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
LABEL="${1:-run}"
DATE="$(date +%Y-%m-%d)"
if [ "$LABEL" = baseline ]; then OUT="$HERE/baseline/$DATE"; else OUT="$HERE/runs/$DATE-$LABEL"; fi
mkdir -p "$OUT"

export PLAYWRIGHT_MCP_BROWSER="${PLAYWRIGHT_MCP_BROWSER:-chromium}"
if [ -z "${PLAYWRIGHT_MCP_EXECUTABLE_PATH:-}" ] && [ -x /opt/pw-browsers/chromium-1194/chrome-linux/chrome ]; then
  export PLAYWRIGHT_MCP_EXECUTABLE_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
fi

BASE="https://nixwoods.com"
PAGES=(
  "home|/"
  "pdp-cube|/products/rubiks-cube-table-lamp-sheesham-wood"
  "pdp-aurora|/products/nixwoods-aurora-linear-wall-light"
  "pdp-pendant|/products/scandinavian-rosewood-round-pendant-light"
  "pdp-nixline|/products/nix-line-solid-wood-floor-lamp"
  "col-wall-lights|/collections/wooden-wall-lights"
  "col-pendants|/collections/wooden-pendant-lights"
  "cart|/cart"
)

echo "page,html_bytes,console_lines" > "$OUT/weights.csv"
cd "$OUT"
playwright-cli close >/dev/null 2>&1 || true
first=1
for entry in "${PAGES[@]}"; do
  name="${entry%%|*}"; path="${entry#*|}"
  if [ $first = 1 ]; then
    timeout 120 playwright-cli open "$BASE$path" --mobile >/dev/null 2>&1 || { echo "open failed: $path"; continue; }
    first=0
  else
    timeout 120 playwright-cli goto "$BASE$path" >/dev/null 2>&1 || { echo "goto failed: $path"; continue; }
  fi
  timeout 90 playwright-cli screenshot --full-page --filename "$name.png" >/dev/null 2>&1 && echo "shot $name"
  bytes=$(curl -sL -A "Mozilla/5.0 (Linux; Android 13) QA" "$BASE$path" | wc -c)
  lines=$(cat .playwright-cli/console-*.log 2>/dev/null | wc -l)
  echo "$name,$bytes,$lines" >> "$OUT/weights.csv"
done
playwright-cli close >/dev/null 2>&1 || true
rm -rf .playwright-cli
echo "done -> $OUT"
cat "$OUT/weights.csv"
