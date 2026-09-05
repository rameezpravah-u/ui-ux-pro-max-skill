# NixWoods wooden board page redesign

Design concept for https://nixwoods.com/collections/wooden-board, produced with the
ui-ux-pro-max design-system search (`--variance 6 --motion 4 --density 4`).

- `template.html` – the page source; image slots are `{{IMG:name}}` placeholders
- `img/` – product photos pulled from the Shopify CDN at 1100px
- `build.py` – inlines the photos as data URIs and writes `nixwoods-one-of-one.html`
- `nixwoods-one-of-one.html` – the self-contained built page (open directly in a browser)

Prices, sizes, registry numbers and FAQ copy come from the live collection page and
the Shopify product data. The reviews section is a layout placeholder only.
