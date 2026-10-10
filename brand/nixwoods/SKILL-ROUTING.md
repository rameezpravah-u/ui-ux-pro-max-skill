# Skill routing guide for NixWoods design work

Read by the `skill-router` agent before any design task in this workspace. The router returns one decision card; the main session then loads only the skills named on it.

The brand file `brand/nixwoods/DESIGN.md` always loads first for anything NixWoods. It is not a skill and is not scored.

## 1. The rule in one paragraph

Pick one lead. For anything that is an interface (page, section, component, email, audit) the lead comes from the core-rules group. For an ad, a print piece, a deck, a mood board, a reference look, a 3D build or a QA check, the lead is the skill the ready-made table names for that row. Add at most one visual-style skill, and only with a stated reason. Add building-block skills when the output is code or tokens. Add asset skills when the output is an image, a deck or a board. End every page task with `playwright-cli`; other tasks end with the rendered check their row names. Use the fewest skills that cover the task, usually one to three. The "Never" column of the ready-made table overrides any score. Reject anything whose stack assumption does not match Shopify Liquid and plain HTML.

Two words that need defining:
- **Redesign** where the layout is replaced means impeccable leads (craft, then polish). Redesign where the layout is kept and the look is upgraded inside it means redesign-existing-projects leads.
- **Rebuild** always means impeccable.

## 2. Groups

| Group | Skills | How many per task |
|---|---|---|
| A. Core design rules | ui-ux-pro-max, impeccable, design-taste-frontend, redesign-existing-projects, design-taste-frontend-v1 | exactly one lead |
| B. Visual style | high-end-visual-design, minimalist-ui, industrial-brutalist-ui, gpt-taste, stitch-design-taste | zero or one |
| C. Building blocks | design-system, ui-styling, full-output-enforcement | as needed |
| D. Assets and visuals | banner-design, brand, design, brandkit, imagegen-frontend-web, imagegen-frontend-mobile, image-to-code, slides | as needed |
| E. Reference library | awesome-design-md | when a reference look is asked for |
| F. 3D | img2threejs | only for 3D |
| G. QA | playwright-cli | always on page tasks |

## 3. Skill cards

Format: best at / avoid when / needs / produces / cost / pairs with / clashes with.

### Group A: core design rules

**ui-ux-pro-max** (this repo)
- Best at: looking things up. Styles, palettes, font pairings, UX rules, chart types, icons, stack guidelines, GSAP snippets. Design-system generation from a brief.
- Avoid when: the brand file already answers the question. For NixWoods the palette and type are fixed, so use it for UX rules, chart and icon lookups, and stack guidelines, not for styles or colours.
- Needs: a query and a domain. Python 3.
- Produces: search results, a generated design system file.
- Cost: low.
- Pairs with: impeccable, design-system.
- Clashes with: nothing. It is a reference, not a method.

**impeccable**
- Best at: the full working method for an interface. Shape, craft, critique, audit, polish, extract, typeset, layout, colorize, animate, harden, adapt. Deterministic detector for AI-design tells. Best choice for product pages, collection pages, components, and any audit.
- Avoid when: the task is an image or a deck, not an interface. Its `init` writes PRODUCT.md and DESIGN.md at the project root; for NixWoods point it at `brand/nixwoods/DESIGN.md` instead of letting it generate one.
- Needs: the page or component source, or a URL for the detector. Its engine binary downloads on first use.
- Produces: edited code, review notes, detector reports.
- Cost: medium. Its reference files are long; load only the command needed.
- Pairs with: design-system, ui-ux-pro-max, playwright-cli, full-output-enforcement.
- Clashes with: design-taste-frontend when both are asked to lead the same page. Pick one.

**design-taste-frontend** (Taste v2)
- Best at: landing pages, homepages, portfolios and redesigns that must not look templated. Reads a brief, infers a direction, audits first on redesigns. Strong on layout variance and typography.
- Avoid when: the task is a conversion-critical commerce component (buy box, cart, specs). Its instincts favour editorial layouts over commerce clarity. Also avoid when impeccable is already leading.
- Needs: a brief with audience and purpose. The brand file.
- Produces: a complete page in HTML or a framework.
- Cost: medium to high; long instructions.
- Pairs with: playwright-cli, full-output-enforcement, one style skill.
- Clashes with: impeccable as co-lead; gpt-taste; brutalist.

**redesign-existing-projects**
- Best at: upgrading an existing page without breaking it. Audits generic patterns, then applies higher standards inside the current framework.
- Avoid when: the page is being rebuilt from scratch; use impeccable craft or design-taste-frontend instead.
- Needs: the existing source (Liquid, HTML, CSS).
- Produces: a diff against the existing page.
- Cost: medium.
- Pairs with: playwright-cli, impeccable audit for the before state.
- Clashes with: design-taste-frontend (same family, overlapping advice).

**design-taste-frontend-v1**
- Best at: nothing the v2 does not do. Kept for backward compatibility only.
- Avoid when: always, for NixWoods.
- Cost: medium.

### Group B: visual style

**high-end-visual-design** ("soft skill")
- Best at: making a page feel expensive. Fonts, spacing, shadows, cards, animations that avoid the cheap defaults.
- Avoid when: it conflicts with the brand file. Its shadow and animation guidance is richer than NixWoods allows (flat, no shadows). Use only its spacing and hierarchy advice.
- Pairs with: design-taste-frontend, impeccable polish.
- Clashes with: minimalist-ui, brutalist, DESIGN.md's elevation rules.

**minimalist-ui**
- Best at: clean editorial interfaces, warm monochrome, flat bento grids, no gradients or heavy shadows. The closest of the style skills to NixWoods.
- Avoid when: the page needs the espresso dark ground; its instincts are light. Also avoid its pastel accents.
- Pairs with: impeccable, design-taste-frontend.
- Clashes with: high-end-visual-design, brutalist, gpt-taste.

**industrial-brutalist-ui**
- Best at: raw mechanical interfaces, Swiss type, terminal aesthetics, blueprints.
- Avoid when: NixWoods. Warm craft is the opposite of this. Only ever with a stated reason, for example a B2B spec sheet for architects.
- Clashes with: everything in the NixWoods brand file.

**gpt-taste**
- Best at: GSAP-heavy motion pages, wide editorial type, gapless bento grids, AIDA structure, randomised layout variance.
- Avoid when: NixWoods pages. Its motion load (pinning, scrubbing, stacking) breaks the "unhurried, no parallax" rule and the mobile performance budget. Only with a stated reason, for example a one-off campaign microsite on desktop.
- Clashes with: DESIGN.md motion rules, design-taste-frontend.

**stitch-design-taste**
- Best at: writing a DESIGN.md for Google Stitch in the semantic design-system format.
- Avoid when: the brand file already exists. Use it only if DESIGN.md needs regenerating in Stitch's exact dialect.
- Cost: low.

### Group C: building blocks

**design-system** (this repo)
- Best at: three-layer tokens (primitive, semantic, component), CSS variables, spacing and type scales, component specs.
- On a product or collection page, where tokens.css already exists: it writes the component spec (states, sizes, spacing) for any new component such as a finish-following gallery or a sticky buy bar, and extends tokens.css only where a token is missing. It does not restate the palette or type.
- Avoid when: the task adds no new component. Use it to extend tokens for email or print.
- Pairs with: impeccable extract, ui-styling.

**ui-styling** (this repo)
- Best at: shadcn/ui, Radix, Tailwind, canvas visuals.
- Avoid when: the target is Shopify Liquid with plain CSS, which is every NixWoods page. Its React assumption fails the stack-fit test. Use only if a React widget is being built.
- Clashes with: the NixWoods stack.

**full-output-enforcement**
- Best at: forcing complete, unabridged code output with no placeholders, and clean splitting at token limits.
- Avoid when: the output is short. Add it for any page over roughly 300 lines, any Shopify Page build, and any section set.
- Cost: low.
- Pairs with: everything that produces code.

### Group D: assets and visuals

**banner-design** (this repo)
- Best at: social, ad, hero and print banners with several art directions. Platform sizes, Meta safe zones and the text-area rule are built in. Static images only; it does not produce video.
- Needs: brand file for colours and type. Its own workflow calls four helper skills (ai-artist, ai-multimodal with Gemini, frontend-design, chrome-devtools) that are not installed here. Substitute: compose on a real product photograph from the repo or Drive, build the frame as HTML with tokens.css, and render it with a playwright-cli screenshot at the target size. Generated backdrops only through the Canva, Higgsfield or ElevenLabs connectors, and only if Rameez asks for them.
- Produces: banner files and art-direction options.
- Pairs with: brand, DESIGN.md.
- Clashes with: brandkit (overlapping purpose; pick by output: banner-design for a finished ad, brandkit for an identity board).
- Video reels are out of its scope. A reel is a Descript or Higgsfield connector job with the Type Spec overlay rules from DESIGN.md, not a skill task.

**brand** (this repo)
- Best at: brand voice, messaging frameworks, asset management, consistency checks.
- Avoid when: the brand file already answers it. Use it to check copy against the banned list and tone, and for packaging and email voice.
- Cost: low.

**design** (this repo)
- Best at: a broad kit: logo generation (needs Gemini), corporate identity deliverables and mockups, HTML presentations with Chart.js.
- Avoid when: a narrower skill fits. Use for packaging mockups and the CIP-style deliverables (insert card, box, labels).
- Needs: Gemini access for logo generation, which this workspace does not have. Mockup guidance works without it.

**brandkit**
- Best at: premium brand-guideline boards, logo system presentations, identity decks as images.
- Needs: an image generator.
- Avoid when: a finished web or ad asset is wanted.

**imagegen-frontend-web**
- Best at: one reference image per page section for a website, composition variety, consistent palette, for a developer to rebuild from.
- Needs: an image generator. Use for mood and direction before a homepage build, not for final assets.
- Clashes with: image-to-code if both are used on the same page without a decision on which is the source of truth.

**imagegen-frontend-mobile**
- Best at: app-screen concepts in phone mockups.
- Avoid when: NixWoods has no app. Almost never.

**image-to-code**
- Best at: generating design images first, then implementing the page to match them.
- Avoid when: a brand file and real photography exist; it prefers to invent visuals. Only for a wholly new page type with no reference.
- Needs: an image generator.

**slides**
- Best at: HTML decks with Chart.js, tokens, copy formulas.
- Use for: the hotel and office B2B pitch, internal reviews.

### Group E: reference library

**awesome-design-md**
- Best at: 74 real-brand design files. Pull one when the ask is "make it feel like Apple, Aesop, Stripe" or when a concrete reference for a component pattern is needed.
- Rule: adapt the rhythm and restraint, never the brand's colours, logo or copy. NixWoods tokens always win.
- Pairs with: impeccable adapt.

### Group F: 3D

**img2threejs**
- Best at: rebuilding an object from a reference photo as a procedural Three.js model, animation-ready.
- Needs: one clear reference image per run (its documented input is a single `--reference`; it warns that one image cannot show hidden sides, so pick the most complete view and expect to hand-correct the back), Python 3.10 or newer (check with `python3 --version`; this environment has 3.11 to 3.13), and time. It is a multi-stage pipeline with its own gates.
- Avoid when: a photo or video answers the need. Use for the cube lamp interactive viewer experiment only, with Rameez aware it is the one high-cost item the guide allows.
- Cost: high.

### Group G: QA

**playwright-cli**
- Best at: opening pages, mobile emulation, screenshots, clicking through a flow, reading console errors, measuring timing.
- Rule: every page task ends with a mobile screenshot at 360 to 390px width and a check of the console. Buy-flow checks stop before checkout.
- Ready scripts: `qa/shots.sh <label>` screenshots the eight pages that matter and records HTML weight; `qa/buy-flow.sh [handle] [variant]` runs the add-to-cart check and compares against the variant id from the product JSON. Use them before writing a new Playwright sequence.
- Needs: the Chromium path set (see tools/install-design-skills.sh).
- Cost: low.

## 4. Scoring sheet

Score each candidate 0 to 3 on five criteria. Total out of 15. The lead is the top-scoring skill from the group the row names (group A for interfaces). A supporter needs a total of 9 or more **and** Task fit of 2 or more; a cheap, independent skill with nothing to contribute does not get in on cost alone. Below 6 is rejected. The ready-made row's "Never" column and a "nothing" in its support column override the score.

| Criterion | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Task fit | wrong output type | partial | good | this is what it is for |
| Stack fit | assumes React or an app | framework-neutral with effort | plain HTML and CSS | Liquid and plain HTML |
| Inputs available | needs a tool or data we do not have | needs something Rameez must supply | needs a quick lookup | everything is in hand |
| Clash risk | contradicts DESIGN.md or the lead | overlaps heavily | minor overlap | independent |
| Cost | very long instructions or a pipeline | long | medium | short |

Worked example, "rebuild the Aurora wall light product page":

| Skill | Fit | Stack | Inputs | Clash | Cost | Total | Verdict |
|---|---|---|---|---|---|---|---|
| impeccable | 3 | 3 | 3 | 3 | 1 | 13 | lead |
| design-taste-frontend | 2 | 2 | 3 | 1 | 1 | 9 | rejected, clashes with lead on a commerce page |
| ui-ux-pro-max | 2 | 3 | 3 | 3 | 3 | 14 | support, lookups only |
| design-system | 2 | 3 | 3 | 3 | 2 | 13 | support, tokens |
| full-output-enforcement | 2 | 3 | 3 | 3 | 3 | 14 | support |
| high-end-visual-design | 1 | 2 | 3 | 1 | 2 | 9 | rejected, shadow guidance clashes |
| ui-styling | 1 | 0 | 3 | 1 | 2 | 7 | rejected, React |
| playwright-cli | 3 | 3 | 3 | 3 | 3 | 15 | closes the task |

## 5. Ready-made combinations for NixWoods jobs

| Job | Lead | Support, in order | Closes with | Never |
|---|---|---|---|---|
| Product page (new or rebuild) | impeccable (shape, then craft, then polish) | ui-ux-pro-max lookups, design-system, full-output-enforcement | playwright-cli mobile shots and buy-flow | design-taste-frontend as co-lead |
| Collection page | impeccable | ui-ux-pro-max (ux and landing domains), full-output-enforcement | playwright-cli | gpt-taste |
| Homepage | design-taste-frontend | impeccable critique at the end, minimalist-ui for restraint if needed | playwright-cli | high-end-visual-design shadows |
| Single section or component | impeccable (craft or polish) | design-system | playwright-cli | anything else |
| Shopify Page build (long form) | impeccable | full-output-enforcement | playwright-cli | design-taste-frontend |
| Audit or critique | impeccable (audit, then critique) | ui-ux-pro-max ux domain | playwright-cli | style skills |
| Meta or Instagram ad creative (static) | banner-design | brand (copy check) | a playwright-cli render of the HTML frame at 1080 by 1920 | imagegen-frontend-web; video is a connector job, not a skill task |
| Email template | impeccable (typeset, layout) | design-system for email tokens, brand | a rendered HTML preview at 360px | design-taste-frontend |
| Packaging insert or print | design (repo, CIP mockups) | brand, design-system print tokens | a PDF proof | banner-design |
| Mood board or direction | imagegen-frontend-web | awesome-design-md reference | nothing | image-to-code |
| "Make it feel like brand X" | awesome-design-md | impeccable adapt | playwright-cli | copying that brand's tokens |
| Mobile QA or buy-flow check | playwright-cli (`qa/shots.sh`, `qa/buy-flow.sh`) | none | the lead is the close | everything else, including impeccable detect, which reads design tells and cannot judge cart state |
| 3D product viewer (object build plus page embed) | img2threejs | none for the build; impeccable only if the viewer later becomes a page section | playwright-cli embed check | style skills |
| B2B deck (hotels, offices) | slides | brand | a rendered deck | nothing |
| Brand file maintenance | stitch-design-taste only if regenerating | design-system | nothing | style skills |

## 6. Hard rules

1. `brand/nixwoods/DESIGN.md` loads before any NixWoods skill.
2. One lead. Two core-rules skills on one page is a routing error.
3. A visual-style skill needs a written reason on the card.
4. industrial-brutalist-ui and gpt-taste need a reason and Rameez's awareness.
5. playwright-cli closes every page task.
6. Reference files from awesome-design-md are adapted, never copied.
7. Nothing on a card may introduce a claim, number or review that is not verifiable in Shopify, Judge.me or a policy page.
8. Small edits (a price, a link, a typo, a single CSS value) skip the router.

## 7. Decision card format

```
TASK: <one line>
TYPE: product page | collection | homepage | component | page-build | audit | ad | email | print | mood | reference | qa | 3d | deck | brand-file
LEAD: <skill> — <why in one line>
SUPPORT:
  1. <skill> — <role>
  2. <skill> — <role>
  (or the single line: none)
CLOSE: <playwright-cli, or the rendered check the row names> — <what to check>
REJECTED:
  - <skill> — <reason>
STYLE REASON: <only if a group B skill is included>
DESIGN.md SECTIONS: <which sections apply>
INPUTS MISSING: <none, or what Rameez must supply>
CONFIDENCE: high | medium | low — <why>
```
