---
version: 1.0
name: NixWoods
description: Quiet-luxury system for a solid-wood lighting maker. Warm espresso and bone grounds, one amber accent that stands for the 3000K glow, a warm old-style serif for display and a clean grotesque for everything else. Photography carries the page; chrome stays out of the way. Built from the NixWoods Brand Kit (2 Jul 2026) and Type Spec (26 Aug 2026).

colors:
  espresso: "#1A1614"
  walnut: "#3B2C22"
  amber: "#E8A24A"
  bone: "#F3EDE3"
  sand: "#D8C7B0"
  ink: "#2A2320"
  ink-muted: "#6F6259"
  hairline: "#E6DCCF"
  hairline-on-dark: "#2E2622"
  sage: "#8A8B7A"
  bone-bright: "#F6F1E7"
  signal-amber: "#F5A524"
  bone-muted: "#D7D0C5"
  petrol: "#0B3B3C"
  error: "#A33E2E"
  on-amber: "#2A2320"
  on-espresso: "#F3EDE3"

typography:
  display-xl:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: 40px
    fontSizeDesktop: 60px
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: -0.01em
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: 32px
    fontSizeDesktop: 44px
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: -0.005em
  heading:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: 24px
    fontSizeDesktop: 30px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0
  subheading:
    fontFamily: "Archivo, Inter, system-ui, sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  lead:
    fontFamily: "Archivo, Inter, system-ui, sans-serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body:
    fontFamily: "Archivo, Inter, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-sm:
    fontFamily: "Archivo, Inter, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  label:
    fontFamily: "Archivo, Inter, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.08em
    textTransform: uppercase
  price:
    fontFamily: "Archivo, Inter, system-ui, sans-serif"
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0
  button:
    fontFamily: "Archivo, Inter, system-ui, sans-serif"
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.02em
  caption:
    fontFamily: "Archivo, Inter, system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0
  pull-quote:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: 22px
    fontWeight: 400
    fontStyle: italic
    lineHeight: 1.35
    letterSpacing: 0

rounded:
  none: 0px
  xs: 4px
  sm: 8px
  md: 12px
  pill: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 96px
  gutter-mobile: 16px
  gutter-desktop: 32px
  container: 1200px
  section-mobile: 48px
  section-desktop: 96px

breakpoints:
  sm: 480px
  md: 768px
  lg: 1024px
  xl: 1280px
---

## Overview

NixWoods makes solid-wood lighting by hand in Khatauli, Uttar Pradesh. No MDF, no veneer, no two pieces alike. The design system exists to make that truth visible on a phone screen: warm, dark, tactile, unhurried.

The audience is "The Keeper", 32 to 52, metro India, design-aware, almost always on a phone (91% of sessions). They are buying something they intend to keep. The page should feel like the object: solid, warm, quiet.

Three principles decide everything below.

1. **Photography does the talking.** The product's own glow is the light source. Chrome, badges and decoration recede.
2. **One accent.** Amber Glow is the 3000K light made into a colour. It appears on the primary action and almost nowhere else. Discipline in colour is the luxury signal.
3. **Honest over loud.** No strike-through theatre, no countdown timers, no shouting. Specific facts, real photos, real reviews.

Decision note: the Brand Kit names Inter as the body face; the later, tested Type Spec names Archivo. This system uses **Archivo** so site and video share one supporting family. Inter is the fallback.

## Colors

### Grounds

| Token | Hex | Use |
|---|---|---|
| espresso | #1A1614 | Primary dark ground: hero, footer, story sections. Warm near-black, never #000. |
| walnut | #3B2C22 | Secondary dark ground, cards on espresso, hover states on dark. |
| bone | #F3EDE3 | Primary light ground: product pages, collection grids, email body. Never #FFFFFF. |
| sand | #D8C7B0 | Dividers, secondary surfaces, quiet chips on bone. |

A page alternates bone and espresso sections. Product pages are mostly bone so the warm photography reads as warm; story and trust sections may go espresso.

### Accent

| Token | Hex | Use |
|---|---|---|
| amber | #E8A24A | The only accent. Primary buttons, the active state of a chooser, one rule under a heading, star ratings. Under 5% of any screen. |
| signal-amber | #F5A524 | Video and ad overlays only (measured for footage contrast). Not for web UI. |

### Text

| Token | Hex | Use |
|---|---|---|
| ink | #2A2320 | Body and headings on bone. Warm dark, never pure black. |
| ink-muted | #6F6259 | Secondary text on bone: captions, specs labels, helper text. Contrast on bone 5.4:1. |
| on-espresso | #F3EDE3 | Body and headings on espresso or walnut. |
| bone-muted | #D7D0C5 | Secondary text on dark. Video price and URL lines. |
| bone-bright | #F6F1E7 | Video display lines only. |

### Lines and states

| Token | Hex | Use |
|---|---|---|
| hairline | #E6DCCF | Borders, table rules, card edges on bone. 1px. |
| hairline-on-dark | #2E2622 | Borders on espresso. |
| error | #A33E2E | Form errors and out-of-stock only. Never decorative. |
| sage | #8A8B7A | Optional, rare. A second accent for data or a calm label. Under 1% of a screen. Most pages never use it. |
| petrol | #0B3B3C | Background only, for video interstitial cards. Never as text. Never on the website. |

### Rules

- One accent. If amber is already on the screen for the primary action, a second amber element must earn its place.
- No gradients on UI. The only gradient allowed is the photo scrim (see Photography).
- No pure black, no pure white, anywhere, including logos.
- Contrast: body text 4.5:1 minimum, large display 3:1 minimum. Amber on espresso is for large type and icons only (3.9:1). Amber never carries body text.

## Typography

### Families

- **Fraunces** (Google Fonts), weights 400 and 600, plus 400 italic. Display, headings H1 and H2, pull quotes. An old-style serif with warmth and a little wonk: craft, not fashion luxury.
- **Archivo** (Google Fonts), weights 400, 500, 600. Everything else: H3 down, body, buttons, labels, prices, specs. Its width axis lets long spec lines condense without a third family.
- Never a third family. Never Playfair, Cormorant, Jost, Josefin Sans, Assistant or Domine, all of which the live site currently loads.

Load with `display=swap`. Preload the two files used above the fold. Subset Latin plus the rupee sign; both families render ₹ correctly, which several candidates did not.

### Hierarchy

| Role | Face | Mobile | Desktop | Notes |
|---|---|---|---|---|
| display-xl | Fraunces 600 | 40/1.08 | 60/1.08 | Hero only. One per page. Sentence case. |
| display | Fraunces 600 | 32/1.12 | 44/1.12 | Section openers, product name on PDP. |
| heading | Fraunces 600 | 24/1.2 | 30/1.2 | Content blocks inside a section. |
| subheading | Archivo 600 | 18/1.3 | 18/1.3 | Card titles, FAQ questions, spec group names. |
| lead | Archivo 400 | 18/1.5 | 20/1.5 | First paragraph under a display line. |
| body | Archivo 400 | 16/1.6 | 17/1.6 | Everything readable. Max line 65 characters. |
| body-sm | Archivo 400 | 14/1.5 | | Specs, policy text, secondary card text. |
| label | Archivo 500 | 12/1.2, +0.08em, uppercase | | The only uppercase in the system. Section eyebrows, spec keys. |
| price | Archivo 500 | 18/1.2 | 20 | Tabular numerals. |
| button | Archivo 500 | 15/1, +0.02em | | Sentence case. |
| caption | Archivo 400 | 13/1.45 | | Photo captions, helper text, in ink-muted. |
| pull-quote | Fraunces 400 italic | 22/1.35 | 26 | Review quotes, the brand line. |

### Principles

- Sentence case everywhere except the label style. Never all-caps headlines. The all-caps "TABLE LAMPS" hero on the live site is the pattern to stop.
- Display sizes are big but few. A page has one display-xl and at most four display lines.
- Line length 55 to 65 characters on body. On mobile that is the full gutter width at 16px, which is right.
- Weight range is narrow: 400, 500, 600. No 700 or above except inside the logotype.
- Numbers in specs and prices use tabular figures (`font-variant-numeric: tabular-nums`).

## Layout

### Spacing

A 4px base. Use the scale, not arbitrary values: 4, 8, 12, 16, 24, 32, 48, 64, 96.

- Section padding: 48px top and bottom on mobile, 96px on desktop.
- Between a heading and its first paragraph: 12px. Between paragraphs: 16px. Between content blocks: 32px.
- Card internal padding: 16px mobile, 24px desktop.
- Gutter: 16px mobile, 32px desktop. Container max 1200px.

### Grid

- Mobile: single column. Product grids two columns with a 12px gap.
- Tablet (768px up): product grids three columns.
- Desktop (1024px up): product grids four columns, 24px gap; PDP splits 55/45 gallery to buy box.

### Whitespace

Generous. A NixWoods page breathes the way a well-lit room does. When in doubt, remove an element rather than shrink the space around it. Never fill space with a second promo band, a marquee, or a repeated badge.

## Elevation and Depth

Flat. The system has no UI shadows.

- Cards sit on their ground with a 1px hairline or no border at all.
- The only shadow is the product's own: a soft drop under product imagery resting on a surface, baked into the photograph, never CSS.
- Depth comes from the alternation of bone and espresso sections and from photography, not from layering.
- No glassmorphism, no blur panels, no gradients, no glow effects. The glow is in the photo.

## Shapes

| Token | Value | Use |
|---|---|---|
| none | 0 | Images, section edges, tables. |
| xs | 4px | Inputs, chips, small tags. |
| sm | 8px | Buttons, cards. |
| md | 12px | Large cards, modal sheets, the sticky buy bar. |
| pill | 9999px | Finish chooser chips and filter chips only. |

Product photography is never rounded on mobile edge-to-edge images. Inset images may use sm.

The NX monogram: bold geometric N and X with the dot on the tail of the X. The dot is the light. Keep it in every lockup. Clear space equals the height of the N. Minimum 24px for the monogram, 120px wide for the stacked lockup. Monochrome only: espresso on bone, bone on espresso. Never amber, never multicolour, never with effects.

## Components

### Announcement bar

Espresso ground, on-espresso text, body-sm. One message at a time; rotate between the welcome offer, free shipping, and the warranty. Never two offers with different numbers. Never a marquee.

### Header

Bone ground, hairline below. Monogram centred on mobile at 40px, wordmark lockup on desktop. Menu, search, cart as outline icons in ink. Height 56px mobile. Sticky.

### Hero

Full-bleed photograph or muted video with a bottom scrim. One display-xl line in on-espresso, one lead line, one amber primary button, one text link. A trust strip of three short facts in label style beneath, on espresso. Never a slideshow of category names. Never text baked into the image.

### Trust row

Three or four items, icon plus two words plus one line of body-sm. Only claims verified in Shopify, Judge.me, or the policy pages: shipping terms, COD terms, warranty term as stated on the Warranty page, review count and rating as reported by Judge.me, "Handcrafted in Khatauli, UP". If a figure is small, show the small figure.

### Product card

Image in 4:5, no rounding, second image on hover (desktop) or on tap (mobile) showing the piece switched on. Below: subheading name in the naming system (Line name, wood, type), one line of body-sm for the key variant, price in price style, then the Judge.me star and count in caption. A single "from" prefix only where variants differ in price. Badges are reserved for "New" and "Last few"; never a percentage.

### Buy box

Order: name (display), rating line, price, variant chooser, delivery line, primary button, secondary button, trust row. On mobile a sticky bar (md radius, bone ground, hairline top) carries price and the primary button once the real button scrolls off screen.

### Finish and size chooser

Pill chips, Archivo 500, 44px tall. Selected: amber fill, on-amber text. Unselected: hairline border, ink text. Each chip changes the gallery to that finish. Out of stock: hairline border, ink-muted text, no strike-through.

### Buttons

- Primary: amber ground, on-amber text, sm radius, 48px tall, full width on mobile. One per view.
- Secondary: transparent, 1px ink border on bone or 1px on-espresso border on dark, same height.
- Text link: ink or on-espresso, underline on hover, with an arrow when it leads to a page.
- No icon tiles in rounded squares above headings. No pill-shaped primaries.

### Specs table

Two columns, label style keys in ink-muted, body values in ink, hairline rules, tabular numbers. Material always says the wood by name and "solid, no veneer".

### FAQ

Accordion, subheading question, body answer, hairline between. Questions written the way a customer types them.

### Review block

Judge.me widget scoped to the product. Star in amber, count in caption. Quote in pull-quote style, reviewer first name and city in caption. Where a product has under five reviews, show the store-wide rating with the words "across all pieces" rather than hiding the count.

### Section header

Label eyebrow in amber or ink-muted, then display or heading in Fraunces, then an optional lead. Left-aligned on mobile. One amber rule, 32px wide and 2px tall, may sit between eyebrow and heading. Never centred all-caps titles.

### Footer

Espresso ground, on-espresso text, three link columns on desktop that stack on mobile. The one-paragraph brand story, the name written NixWoods, the Khatauli line, phone and email, policy links. Newsletter field with a secondary button.

## Voice

**Tagline:** Solid wood. No two alike.
**Ad hook (secondary, ads only):** Stop buying boring lights.

**One line:** Handcrafted solid-wood lighting, made by our own artisans in Khatauli. No veneer, no two alike.

**Tone:** warm, plain-spoken, quietly confident. The voice of a maker who knows the material. Specific over flowery. Product copy is tactile and factual with a little poetry. Ads are one sharp hook then substance. Support is human and unhurried.

**Phrase bank:** no two alike · solid, not surface · the grain goes all the way through · made by hands we can name · built to keep · warm 3000K glow · handcrafted in Khatauli · real teak, sheesham, pine · a piece, not a product · knock on the wood.

**Banned:** discover, elevate, exquisite, journey, curated, unlock, stunning, delve, realm, luxurious, "premium quality", "shop now the sale", "limited time 50% off", "buy now before it's gone", emoji-stuffed copy, all-caps shouting.

**Name:** NixWoods. One word, capital N and W. Never "Nix Woods", "Nixwoods", or "NIXWOODS" outside the designed logotype.

**Product naming:** `Line name, wood, type`. Aurora, Teak Wall Light. Halo 360, Rosewood Pendant. Keyword tails go in the meta title, never the visible name. No dimensions in names. No third-party trademarks.

## Photography

- Warm, low-key, the product's own glow as the key light. Real rooms: bedside, console, dining, hallway. Restrained props.
- Every product needs: one hero on, one hero off, one macro of grain, one scale shot with a person or furniture, one real-room shot. 4:5 at 1600 by 2000, 90 to 260 KB.
- Colour grade warm (amber and espresso), matte, never cool or blue, never glossy.
- Avoid white-cyclorama catalogue shots, clutter, cold light, stock smiles, heavy filters, text baked into images.
- Text over photos uses the measured scrim: a black vertical gradient starting at 58% of the frame height, reaching 55% opacity at the bottom, easing exponent 0.85. Never a solid box behind text. Text shadow 3px black at 67% opacity.

## Motion

- Unhurried. Transitions 200 to 300ms, ease-out. Holds of 1.5 to 3 seconds in video.
- Allowed: fade and rise on scroll (8px, once), the off-to-on crossfade on product images, chip selection changing the gallery, accordion open.
- Not allowed: parallax, bounce, auto-playing carousels of text, marquees, countdown timers, confetti, anything that moves while the user reads.
- Respect `prefers-reduced-motion`: everything becomes an instant state change.
- Video: muted autoplay only when a poster frame is set and the clip is under 2 MB on mobile.

## Do's and Don'ts

### Do

- Lead every page with the objection the buyer is scanning for: is it real wood, will it fit, will it arrive safely, can I trust them.
- Name the timber and say "solid, no veneer" in the first screen of any product page.
- Show the piece switched off as well as on. The sculpture matters as much as the glow.
- Put the Judge.me star and count on every card and buy box, with the real number.
- Keep prices honest: the number on the page is the price. Where a discount exists, state it once, in words, not as wallpaper.
- Design for a 360px wide screen first and check at 390 and 414. Desktop is a check.
- Close every page task with a Playwright screenshot at mobile width.

### Don't

- Don't use percentage-off badges on cards, "UP TO 40% OFF" bands, strike-through prices on every card, or marquees. All of these are on the live site today and all are off-brand.
- Don't centre an all-caps category name as a hero.
- Don't load a third font family. Don't use the live site's Assistant, Jost, Josefin Sans or Domine.
- Don't use pure white backgrounds or pure black buttons.
- Don't add a second accent colour, a gradient, a drop shadow, or an icon tile.
- Don't invent social proof, review counts, warranty terms or shipping claims. Pull the figure from Judge.me, Shopify or the policy page, or leave the element out.
- Don't duplicate copy across collections. Each collection gets its own first paragraph.
- Don't write "Nix Woods".

## Responsive Behavior

- Breakpoints: 480, 768, 1024, 1280. Mobile is the design target; the others are checks.
- Touch targets 44px minimum. Chips and buttons 44 to 48px tall.
- Collapsing: PDP gallery becomes a swipe strip with dots; buy box stacks below; the specs table keeps two columns down to 360px; the FAQ is already stacked.
- Images: `srcset` with 480, 800, 1200 and 1600 widths, `loading="lazy"` below the fold, `fetchpriority="high"` on the hero.
- Performance budget on mobile: HTML under 200 KB, largest contentful paint under 2.5s on a mid-range Android on 4G, no layout shift from late-loading app widgets.

## Iteration Guide

When adding a component, ask in order: does photography carry it; does it use one of the two grounds; is amber reserved for the action; is every claim verifiable; does it read at 360px. If any answer is no, redesign before building.

## Known Gaps

- Master logo as SVG is still to be supplied. `nx-monogram-96.png` is a small raster fallback.
- The exact warranty term (months, wood versus LED) must be confirmed from the Warranty page before it is used in any trust row.
- Email-specific tokens (table-based layout limits) are not yet written.
- Packaging print tokens (CMYK equivalents of the palette) are not yet written.
