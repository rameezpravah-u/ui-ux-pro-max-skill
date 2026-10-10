#!/usr/bin/env bash
# Installs the reviewed third-party design skills into the user skills folder.
# Pinned to the exact commits reviewed on 2026-10-10 so nothing unreviewed
# arrives later. Idempotent: safe to run at every session start. Quiet when
# offline: whatever is already installed stays in place.
#
# Installs:
#   impeccable           pbakaus/impeccable            (skill + engine launcher)
#   13 Taste skills      Leonxlnx/taste-skill          (Markdown only)
#   playwright-cli       microsoft/playwright-cli      (skill) + npm CLI 0.1.22
#   img2threejs          hoainho/img2threejs           (skill + Python pipeline)
#   awesome-design-md    VoltAgent/awesome-design-md   (74 DESIGN.md files + index)
set -u
S="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"
T="$(mktemp -d)"
trap 'rm -rf "$T"' EXIT
log(){ printf '[design-skills] %s\n' "$*"; }

PIN_IMPECCABLE=d631a8827f99414d2b6daba4ef08b7f8701751d7
PIN_TASTE=717446e07a78d4e6d7918b1fde1a263378eebac9
PIN_PLAYWRIGHT=b85c7a736bb473bf55b584e54a09ffa698d6d871
PIN_IMG2THREEJS=d508b596cb221f1509f6e50ab68fce275a5cfb44
PIN_AWESOME=13be5c05c63be24b57581162364167028020f043
PLAYWRIGHT_CLI_VERSION=0.1.22

fetch(){ # dir repo sha
  local d="$T/$1"
  git init -q "$d" 2>/dev/null && \
  git -C "$d" fetch -q --depth 1 "https://github.com/$2" "$3" 2>/dev/null && \
  git -C "$d" checkout -q FETCH_HEAD 2>/dev/null
}
place(){ # src dst   (replace dst with src, drop any .git)
  rm -rf "$2"; mkdir -p "$(dirname "$2")"; cp -R "$1" "$2"; rm -rf "$2/.git"
}
stamp(){ printf '%s\n' "$2" > "$1/.pinned-commit"; }
current(){ cat "$1/.pinned-commit" 2>/dev/null || true; }

mkdir -p "$S"

# impeccable
if [ "$(current "$S/impeccable")" != "$PIN_IMPECCABLE" ]; then
  if fetch imp pbakaus/impeccable "$PIN_IMPECCABLE"; then
    place "$T/imp/.claude/skills/impeccable" "$S/impeccable"
    stamp "$S/impeccable" "$PIN_IMPECCABLE"; log "impeccable installed"
  else log "impeccable: fetch failed, keeping what is there"; fi
fi

# Taste: every skill under skills/, named by its frontmatter name
if [ "$(current "$S/design-taste-frontend")" != "$PIN_TASTE" ]; then
  if fetch taste Leonxlnx/taste-skill "$PIN_TASTE"; then
    for d in "$T"/taste/skills/*/; do
      [ -f "$d/SKILL.md" ] || continue
      n=$(sed -n 's/^name:[[:space:]]*//p' "$d/SKILL.md" | head -1)
      [ -n "$n" ] || continue
      place "$d" "$S/$n"; stamp "$S/$n" "$PIN_TASTE"
    done
    log "taste skills installed"
  else log "taste: fetch failed, keeping what is there"; fi
fi

# playwright-cli skill
if [ "$(current "$S/playwright-cli")" != "$PIN_PLAYWRIGHT" ]; then
  if fetch pw microsoft/playwright-cli "$PIN_PLAYWRIGHT"; then
    place "$T/pw/skills/playwright-cli" "$S/playwright-cli"
    stamp "$S/playwright-cli" "$PIN_PLAYWRIGHT"; log "playwright-cli skill installed"
  else log "playwright-cli: fetch failed, keeping what is there"; fi
fi

# img2threejs
if [ "$(current "$S/img2threejs")" != "$PIN_IMG2THREEJS" ]; then
  if fetch i2t hoainho/img2threejs "$PIN_IMG2THREEJS"; then
    place "$T/i2t" "$S/img2threejs"
    stamp "$S/img2threejs" "$PIN_IMG2THREEJS"; log "img2threejs installed"
  else log "img2threejs: fetch failed, keeping what is there"; fi
fi

# awesome-design-md: the design files plus a small index SKILL.md
if [ "$(current "$S/awesome-design-md")" != "$PIN_AWESOME" ]; then
  if fetch adm VoltAgent/awesome-design-md "$PIN_AWESOME"; then
    rm -rf "$S/awesome-design-md"; mkdir -p "$S/awesome-design-md"
    cp -R "$T/adm/design-md" "$S/awesome-design-md/designs"
    cp "$T/adm/LICENSE" "$S/awesome-design-md/"
    find "$S/awesome-design-md/designs" -name README.md -delete
    count=$(ls "$S/awesome-design-md/designs" | wc -l | tr -d ' ')
    names=$(ls "$S/awesome-design-md/designs" | tr '\n' ' ')
    cat > "$S/awesome-design-md/SKILL.md" <<EOF
---
name: awesome-design-md
description: Library of $count ready-made DESIGN.md design systems extracted from real brands' websites (Apple, Stripe, Nike, Airbnb, Tesla, Shopify, Linear, Notion and more). Use when the user wants a page or UI to look "like <brand>", needs a concrete visual reference (colors, type scale, spacing, components) to anchor a design, or wants a DESIGN.md for a project.
---

# Awesome DESIGN.md library

Source: github.com/VoltAgent/awesome-design-md (MIT). Each file in \`designs/<brand>/DESIGN.md\`
is a plain-text design system: YAML tokens (colors, typography, spacing, radii) followed by
prose rules for layout, components, imagery and voice.

## How to use

1. Pick the brand whose look matches the brief. Available: $names
2. Read \`designs/<brand>/DESIGN.md\` in full before writing any UI.
3. Either build directly from its tokens and rules, or copy it to the project root as
   \`DESIGN.md\` when the user wants it to persist for later work.
4. Adapt, don't clone: keep the system's rhythm, type scale and restraint, but use the
   user's own brand colors, logo, copy and photography. Never reproduce another company's
   logo, trademarked names or exact marketing copy on the user's site.
EOF
    stamp "$S/awesome-design-md" "$PIN_AWESOME"; log "awesome-design-md installed ($count designs)"
  else log "awesome-design-md: fetch failed, keeping what is there"; fi
fi

# Playwright CLI binary and the preinstalled-Chromium fix
if command -v npm >/dev/null 2>&1; then
  have=$(playwright-cli --version 2>/dev/null || true)
  if [ "$have" != "$PLAYWRIGHT_CLI_VERSION" ]; then
    npm install -g "@playwright/cli@$PLAYWRIGHT_CLI_VERSION" >/dev/null 2>&1 \
      && log "playwright-cli $PLAYWRIGHT_CLI_VERSION installed" \
      || log "playwright-cli npm install failed"
  fi
fi
CHROME=""
for c in /opt/pw-browsers/chromium-*/chrome-linux/chrome; do [ -x "$c" ] && CHROME="$c"; done
if [ -n "$CHROME" ] && ! grep -q PLAYWRIGHT_MCP_EXECUTABLE_PATH "$HOME/.bashrc" 2>/dev/null; then
  printf '\n# playwright-cli: use the preinstalled Chromium\nexport PLAYWRIGHT_MCP_BROWSER=chromium\nexport PLAYWRIGHT_MCP_EXECUTABLE_PATH=%s\n' "$CHROME" >> "$HOME/.bashrc"
  log "playwright browser path written to ~/.bashrc"
fi

log "done. skills in $S:"
ls "$S" | tr '\n' ' '; echo
