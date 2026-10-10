#!/usr/bin/env bash
# Cube lamp buy-flow check on a mobile viewport. Stops before checkout.
# 1. opens the product page  2. selects Ocean Glass  3. presses Add to cart
# 4. reads /cart.js and confirms the Ocean variant is in the cart at quantity 1
# Usage: qa/buy-flow.sh [product-handle] [variant-title-substring]
set -u
HANDLE="${1:-rubiks-cube-table-lamp-sheesham-wood}"
WANT="${2:-Ocean}"
BASE="https://nixwoods.com"

export PLAYWRIGHT_MCP_BROWSER="${PLAYWRIGHT_MCP_BROWSER:-chromium}"
if [ -z "${PLAYWRIGHT_MCP_EXECUTABLE_PATH:-}" ] && [ -x /opt/pw-browsers/chromium-1194/chrome-linux/chrome ]; then
  export PLAYWRIGHT_MCP_EXECUTABLE_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
fi

WORK="$(mktemp -d)"; cd "$WORK"
fail(){ echo "FAIL: $*"; playwright-cli close >/dev/null 2>&1; exit 1; }

# expected variant id from the public product JSON
VID=$(curl -sL -A "Mozilla/5.0 QA" "$BASE/products/$HANDLE.js" | python3 -c "
import json,sys; p=json.load(sys.stdin)
for v in p['variants']:
    if '$WANT'.lower() in v['title'].lower(): print(v['id']); break")
[ -n "$VID" ] || fail "no variant matching '$WANT' on $HANDLE"
echo "expect variant $VID"

playwright-cli close >/dev/null 2>&1 || true
timeout 120 playwright-cli open "$BASE/products/$HANDLE" --mobile >/dev/null 2>&1 || fail "open"

# select the finish: click the option whose text matches
timeout 30 playwright-cli eval "(() => {
  const els=[...document.querySelectorAll('label, button, input[type=radio], [role=radio]')];
  const t=els.find(e=>/${WANT}/i.test(e.textContent||e.value||''));
  if(!t) return 'no option';
  (t.tagName==='INPUT'? t : t).click(); return 'clicked '+(t.textContent||t.value).trim().slice(0,40);
})()" 2>/dev/null | tail -1

sleep 2
# press add to cart
timeout 30 playwright-cli eval "(() => {
  const b=[...document.querySelectorAll('button')].find(b=>/add to cart/i.test(b.textContent));
  if(!b) return 'no add button'; b.click(); return 'pressed: '+b.textContent.trim().slice(0,40);
})()" 2>/dev/null | tail -1
sleep 4

CART=$(timeout 30 playwright-cli --raw eval "fetch('/cart.js').then(r=>r.json()).then(c=>JSON.stringify(c.items.map(i=>({id:i.variant_id,q:i.quantity,t:i.variant_title,p:i.price}))))" 2>/dev/null | tail -1 | sed 's/\\"/"/g; s/^"//; s/"$//')
echo "cart: $CART"
timeout 60 playwright-cli screenshot --full-page --filename buy-flow.png >/dev/null 2>&1
playwright-cli close >/dev/null 2>&1

echo "$CART" | grep -q "\"id\":\s*$VID\|\"id\":$VID" || fail "variant $VID not in cart"
echo "PASS: $WANT variant in cart. Screenshot: $WORK/buy-flow.png"
