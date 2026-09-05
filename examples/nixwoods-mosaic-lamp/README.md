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
