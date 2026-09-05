# NixWoods glass block lamp page concept

Concept for https://nixwoods.com/products/rubiks-cube-table-lamp-sheesham-wood.
Built from live Shopify product data (variants, prices, stock, Judge.me rating and
histogram), the brand kit in Drive (Fraunces + Inter, espresso/amber/bone, banned
words, the planned "Mosaic" rename), the PDP fixes note and Clarity findings, and the
Voice of Customer log.

- `template.html` – page source with `{{IMG:name}}` slots
- `img/` – the 11 Shopify product photos at 1100px, plus `green_w.jpg`, a hue-shifted
  copy of the red photo standing in for the unshot green face (labelled as such on
  the page), and the NX logo
- `build.py` – inlines the images and writes `nixwoods-mosaic-lamp.html`

## v2 (after the conversion audit)

`template-v2.html` → `nixwoods-cube-lamp-v2.html` (build with `build-v2.py`). Hero first
line matches the ad wording, one CTA, proof strip with real order and review counts, pair
offer, pincode delivery window, gift note path, lights on/off toggle, to-scale drawing,
three review-quote slots beside the buy panel, review block with the real Judge.me
histogram and owner-photo slots, comparison against the ₹899 plastic cube lamp,
in-the-box strip, merged straight answers, mobile sticky bar with finish picker, and a
no-discount WhatsApp exit capture. Post-it card maker, trade block and half the room
tiles removed. `?face=red` in the URL starts the hero on that face for ad matching.
