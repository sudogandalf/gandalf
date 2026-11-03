# Design System: Gandalf

**Skill:** `stitch-design-taste` (opt-in) · **Source of truth for:** every new Gandalf screen prompted into Google Stitch, and for the coding agent that turns the generated screens into the real site.

**Project:** Gandalf — a software studio that builds websites and applications, then runs the domains, SSL, business email and cPanel hosting behind them. One contract, one point of contact.
**Direction (current): black terminal session — supersedes the body of this document.** Near-black ground `#060608` with tone steps `#0D0D10` / `#15151A`, white ink ramp, one cool blue accent `rgb(75,145,231)` spent only as light. Layout: split-screen hero (GANDALF + one action left, the Gandalf ASCII figure with motes right, ripple field behind), a build/run ledger, the live Lorenz attractor (`<AsciiArt piece="lorenz-attractor">`) full-width, the process as a terminal-log panel, an asymmetric principles split, the address as the contact headline with a blinking caret, and the drawn wordmark filling the footer. Every background is dark — no paper, no white bars. Sections §1–§11 below still describe the earlier paper pass and need regenerating; the code in `apps/web/src/site.css` and `App.tsx` is the source of truth until they are.

**Current implementation:** `apps/web` (Vite + React 19 + TypeScript + Tailwind v4), tokens in `packages/ui/src/styles/globals.css` and `apps/web/src/site.css`. The values below are read from that code, not invented — a screen that honours this file looks like the site that already exists.
**Verified against the running site** (`npm run dev`, `http://localhost:5173`) at **1440×900 and 390×844**: computed styles, font load state, control heights, section heights, scroll overflow and contrast were measured in a real browser, and the hero, services, process, principles, contact and footer were looked at as screenshots. Every claim marked **[measured]** below comes from those passes. **Second pass** audited 375, 768 and 1024 as well; **third pass** was the redesign itself — the house rules applied to the code, which changed the ground, the accent, the hero's action count, the principles composition and the touch targets. **Fourth pass, and the one that counts: the direction changed.** The site flipped from night-mode to the printed sheet below — ground, ink ramp, accent, plate inversion, ASCII ramps, the figure's inversion and the hero scrim were all rebuilt, and one real defect (an ink scrim left painted over the new paper ground) was caught by looking at the screenshots rather than by trusting the diff. §11 records every deviation closed along the way. Every token below is the **paper direction**, and it is what `apps/web` ships.

---

## Configuration — Set Your Style

| Dial | Level | Description |
|------|-------|-------------|
| **Creativity** | `7` | Expressive but disciplined. The character lives in the ASCII layer (drawn ripples, decoding headlines, a printed slip), not in colour or decoration. `10` would put the motif on top of the reading; this site never does. |
| **Density** | `3` | Gallery-airy. Every section is at least one viewport tall with its content centred; the paper between blocks is part of the design. |
| **Variance** | `7` | Offset and asymmetric inside the grid — hero copy on the 43% axis, process split 1fr/0.85fr, capabilities as two unequal columns, principles as three. Considered asymmetry, never chaos. |
| **Motion Intent** | `7` | Kinetic where it reads as the machine working (decode, ripples, cursor, motes), still everywhere else. Nothing travels further than 22px. |

> **How to use:** the four numbers set the temperature; the numbered rules below are the law. When a generated screen contradicts a rule, the rule wins.

---

## 1. Visual Theme & Atmosphere

A **printed sheet, not a screen**: the studio's site as a technical manual set in warm paper (#F4F1EA) with near-black ink (#0B0B0D) and exactly one colour — a printer's green. Nothing glows, because nothing is lit: texture comes from ink spread and halftone, and every mark on the page is something a press could have put there. The paper is the same #F4F1EA the process slip has always been printed on, so the whole page is now made of the material the brand already used.

Three ideas carry the whole identity, and no screen may drop them:

1. **The ASCII layer.** The subject's name is Gandalf; the studio's craft is software; the site renders one in the other. Headlines resolve out of a field of random characters, section rules are C-style comments stretched edge to edge, list items are marked `>`, a 5×5 drawn wordmark closes the page. It is a texture and a signage system, not a costume: it never competes with running text.
2. **Print, literally.** The ground is paper all over, so the page's one object earns its object-ness by inversion: the process is set as an **inked plate** laid on the sheet — dot leaders, a zigzag-cut bottom edge, and a paper-coloured total bar printed back out of it.
3. **Air.** Sections are separated by fields of paper and by scale, never by boxes. The site has no cards, no panels, no grid lines. Hierarchy comes from type size, tone steps, and the ASCII rules.

**The impression to protect:** warm, precise, quietly technical, printed. A service manual art-directed by someone who writes code.

---

## 2. Color Palette & Roles

One ground, one ink, one accent. Every value below is a real token from `apps/web/src/site.css`, and every contrast figure is computed against the paper.

### Paper (separated by tone, never by a line or a shadow)
- **Paper Ground** (#F4F1EA) — the page ground and every section band, the site's largest surface. Warm (31% saturation), never a clinical white, and it is the *same* value as the process plate's paper so page and print are one material.
- **Paper Step One** (#EDE9E0) — `--surface-2`. A quieter band that still reads as the same sheet.
- **Paper Step Two** (#E6E1D6) — `--surface-3`. The furthest step, for a band that needs separating by tone alone.

### Ink ramp (solid inks, one ladder, no warm/cool drift)
- **Full Ink** (#0B0B0D, 17.4:1) — display type, headlines, the hero.
- **Soft Ink** (#1C1C1E) — high-emphasis list items and first-paragraph body.
- **Body Ink** (#2A2A2C, 12.7:1) — **running text sits here, not in grey.** A page whose body copy is greyed reads unfinished.
- **Muted Ink** (#4A4A4E, 7.8:1) — the second line of a two-line headline, secondary paragraph text, the `key` half of a contact row.
- **Faint Ink** (#6B6B70, 4.7:1) — notes under a list, section descriptions, the lede's supporting detail.
- **Dim Ink** (#8A8A8F, 3.1:1) — the ASCII layer only: rules, brackets, list markers, footer sign-off. **Never for running text** (see §11).
- The ramp is set in **solid inks, not white-at-alpha**: on paper a transparent value lets the ground show through and the grey drifts warm. Nothing here is `#000000` either — that would read as a hole punched in the sheet.

### Structural hairlines (used as rules between content, never as card outlines)
- **Line** rgba(11,11,13,0.14) · **Line Soft** 0.10 · **Line Faint** 0.07 · **Line Strong** 0.30 — also used as an *opaque ink* rule (`border-[var(--ink)]`) under a column heading, where a real division is needed.

### Inverted plates
- **Plate Ink** (#0B0B0D) with **Plate Paper** (#F4F1EA) — a solid control or object inverts against the sheet. One shape, decided once: square. Everything filled on this page is filled with ink; nothing is filled with the accent.

### Accent (exactly one, and it is a printed mark rather than a fill)
- **Printer's Green** (#1F6F4A, HSL 152° 56% 28%, 5.4:1 on the paper) — the site's single accent, and it passes AA as text as well as working as a mark. Roles: focus rings, **the ridge of each ASCII ripple** (the only thing on the page printed in colour), the blinking cursor block, the current position on the scroll rail, a link's hover underline, and the ring on the CTA at hover.
- **Pale Green Wash** (#7AA589, under 60% saturation) — `--accent-soft`. The second note, inside the ambient blooms only; it never appears as a solid, a border or a plate.
- **Rule:** the accent is spent as **ink** — a printed mark, a hairline ring, a faint wash. It never fills a button, a card, a panel or a field. If a generated screen shows a green-filled component, the screen is wrong.

### Banned colours
- Purple, violet, indigo, or any "AI purple / neon gradient" treatment, at any opacity.
- The accent as a fill, at any size. Only ink fills anything.
- Glows. On paper there is no emitted light: any `box-shadow` that reads as a lamp, any neon halo on a control, is wrong. A soft *bleed* at low alpha is the paper equivalent and that is the only permitted form.
- Decorative gradients. The **only** permitted gradients are the paper scrim that lifts the hero copy off the ASCII field, and the two faint accent washes behind it.
- Mixed warm/cool greys. One warm value (the paper), one neutral ink ladder, full stop.
- Pure black (#000000) anywhere — ground, text, plate or label.

---

## 3. Typography Rules

Two faces and no third option. **[measured]** Cabinet Grotesk loads three *static* weights — 400 / 500 / 800 — from Fontshare (`api.fontshare.com`); it is **not** a variable face. JetBrains Mono *is* variable, served by `@fontsource-variable/jetbrains-mono` and loading at weight range 100–800. Both report `loaded` on first paint, so there is no fallback flash to design around.

- **Display — Cabinet Grotesk** (`--font-sans`, weight 800 for display, 500 for headings and the small labels). Track-tight `-0.035em`, leading `0.9` on display and `1.05` on the small label. Hierarchy is carried by **weight and colour**, then by size: a headline is full ink, its second line steps down to Muted Ink, and only then does the size change.
- **Mono — JetBrains Mono Variable** (`--font-mono`), ligatures **off** (`font-variant-ligatures: none`) so character pairs never merge and ASCII columns stay aligned. Its territory: the ASCII art, the section rules `/* 01 services --- */`, the tiny tracked labels, the `>` list markers, the middot tag line, the scroll rail and the code-like metadata. **It is never used for body copy or headlines.**
- **Scale — seven nominal steps, and no eighth. [measured]** At 1440px the running page computes **18 distinct font sizes**; this is the real ladder, and the token set only covers part of it:
  - **11px** — the ASCII layer and the tracked labels: `.eyebrow`, `.ascii-rule`, the `SOFTWARE` / `INFRASTRUCTURE` column tags. Mono, uppercase, `0.16em`–`0.22em` tracking, Dim Ink.
  - **13px** — `.label-small`, slip notes, the footer sign-off and "Back to top" (`--step-small` clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem), the only small token that actually resolves).
  - **14px** — **every control label**: buttons, nav links, menu rows (`text-sm`).
  - **16px** — **running body copy and list rows** (`text-base`). This is the body floor in practice, not the 17px a token-based reading would suggest.
  - **18px** — lead paragraphs (`text-[1.125rem]`): the hero's supporting sentence, the process lede.
  - **17–19px** — the process plate's rows, via `--step-body` clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem).
  - **44 / 52 / 56 / 60 / 63 / 72 / 88 / 112 / 136px** — the display clamps, written per call site as `text-[clamp(...)]` (all nine measured at 1440px). The hero `h1` sits at its ceiling: **136px, leading 122.4px (0.9), tracking −4.76px (−0.035em)**, confirmed from the computed style.
  - **Measured warning:** `--step-head` and `--step-lead` are declared in the Tailwind `@theme` block but **nothing references them, so no CSS variable is emitted** — both resolve to the empty string at `:root`. Only `--step-small` and `--step-body` exist. Write a display size as an explicit clamp; do not reach for `--step-head`.
- **Measure:** body 30–32ch in the hero and 65ch absolute maximum anywhere. Headline line-height `0.9`; body `1.6`–1.7.
- **Quotes and dashes:** real typographic quotes and en dashes ("Design and build", "4–8 weeks"). No straight quotes in visible copy.
- **Figures:** tabular numerals wherever figures align in a column (`font-variant-numeric: tabular-nums` — the slip's durations).
- **Banned:** `Inter` (anywhere, in any context, including inside a component library default); generic serifs (`Times New Roman`, `Georgia`, `Garamond`, `Palatino`, default browser serif stacks); a third typeface; italic or coloured emphasis inside a headline; gradient text; script or decorative display faces.

---

## 4. Component Stylings

**The site has no cards.** Hierarchy is communicated by position, type size and tone. Do not introduce a card to hold content that the layout can simply set.

- **Buttons** — two variants, one shape: **square corners** (`--radius-ui: 0px`), no shadow at rest.
  - *Primary:* **Plate Ink** fill, **Plate Paper** label, 1px ink border, `px-7 py-3.5`, 14px medium label. Hover/focus: the plate gives up its fill, the label goes ink, an accent hairline rings it and it casts a soft ink shadow (a printed object, not a lamp). Active is a 1px push, not a scale-up.
  - *Secondary:* transparent with a 1px `var(--line-strong)` border, ink label; hover raises the border to full ink. Never two primaries on one screen.
  - On phones both are full width and stacked; measured at 1440px the hero pair is **171×50** (primary) and **157×50** (secondary), the header CTA 125×44 and the menu toggle 44×44. **[measured]** every interactive element on the page now clears 44px in both dimensions — zero offenders at 1440 and at 375.
- **Links** — text, not chips. Hover and focus reveal a 1px underline drawn **from left to right** (`transform: scaleX(0) → 1`, `transform-origin` flipping right→left, 400ms). Every interactive row lights its title *and* its arrow together on hover and has a visible `2px` accent focus ring at `4px` offset.
  - **The hit-area rule — do not undo this.** A small text link takes its 44px target from the *anchor* (`flex min-h-11 items-center`) while `.link-underline` stays on an inner `<span>`. Put both on one element and `::after`'s `bottom: -2px` moves to the bottom of the taller box, detaching the underline from the words. Footer list rows are 44px tall for the same reason, and the plain-text column beside them is padded to match so the two columns stay row-aligned.
- **The scroll rail** (desktop ≥1440px only) — a fixed column of box-drawing characters in the gutter beside the 1200px content column, one mark per section: faint ink ahead, dim behind, and the **current section in the accent with a `<` marker and an 8px bleed**. It lives in space that genuinely exists; it never overlaps the content column.
- **The process plate** (the page's one inverted object) — an **inked plate laid on the sheet**: `#0B0B0D` fill, paper type, 28px internal padding, a bottom edge **cut into 24 zigzag teeth with a clip-path** (the paper shows through the plate's own edge, no triangle strip painted on top), dot leaders between a label and its value, notes in `--step-small` at 60% opacity, and a final bar **printed back out in paper** carrying the result of the whole plate. Radii: none. Shadow: none.
- **Contact rows** — full-width bands at `clamp(1.35rem, 3.4vw, 2.75rem)`: a dim `key` on the left, the `value` right-aligned on the same baseline. Told apart by **space alone**, not by alternating bands or rules. The final row pairs the word "Hello" at display size with one solid round button — **[measured]** 56×56px, fully round — that lifts `translate(3px, -3px)` on hover. Roundness belongs to the *object*, not the style system: the live page contains exactly three round things — this orb, the **18** drifting motes, and the two blurred ambient blooms (50% circles). **Every panel, control and container is square** (measured: 19 elements at `9999px`, all motes + orb; nothing else rounds).
- **Inputs / forms** — **there are none, deliberately.** The site's one action opens a real `mailto:` to `hello@gandalf.dev`. Never fake a contact form, a chat widget or a booking calendar: a form that goes nowhere is worse than an address that works. If a screen must carry a form, label above, error below, 0.5rem stack gap, accent focus ring, no floating labels — and build it before shipping the screen.
- **Loading states** — the site's animated surfaces are canvases: three ASCII field canvases (hero, principles, contact) plus the Services constellation, which is an `<ascii-art>` web component drawing into a canvas inside its own shadow root. Skeletal shimmer matching the final layout dimensions is the only permitted loader. **No circular spinners.**
- **Empty / error states** — not applicable to this site (static marketing page, no data). A future Gandalf *application* screen inherits the same palette and type but follows the app-screen rules; do not invent dashboard chrome here.
- **Navigation** — a sticky header, transparent over the hero, gaining a frosted **paper** plate (`rgba(244,241,234,0.78)` with a 14px blur) plus a `var(--line)` bottom hairline once scrolled. One bar, two compositions: **on a phone** the wordmark and the menu toggle only — the bar stays 64px tall and carries no CTA, because the primary action sits one tap away inside the menu; **from 768px up** three plain links at `var(--muted)` (full ink on hover) and the **ink-plate** CTA join the wordmark and the toggle. The toggle exists at *every* width — the full-screen menu is the site's real navigation and the inline links are the shortcut. The wordmark here is type only; the square-mark lockup belongs to the footer. No pill nav, no glass floating chip, no icon row. **[measured]** wordmark hit area 44px tall, nav links 44px, CTA 125×44, toggle 44×44.
- **The menu** — a **full-screen panel at every width** (not a mobile-only dropdown): the band colour, the ASCII ripple field as texture, and each row rising in on its own delay. Every row carries a long right arrow that slides 6px and warms to the accent on hover/focus/touch. Escape closes it, focus is trapped inside it, the body scroll is locked, and the page must never become unreachable by keyboard.

---

## 5. Hero Section

The hero is the studio's one sentence, set enormous, on a field of drifting ASCII characters. It is a **bottom-anchored, asymmetric** composition — never centred, never a split 50/50 with a stock photo.

- **Structure:** a 180svh scroll section holding a `100svh` sticky panel (the extra height is the zoom's timeline). The animated ASCII ripple field fills it, masked by a soft ellipse so it fades rather than ending; a **paper** scrim rises from the bottom so the ink copy keeps its contrast without flattening the texture; two heavily blurred radial washes (green top-right, pale green bottom-left, 28s and 34s drifts) sit furthest back.
- **The title:** `GANDALF`, one word, one `h1`, `clamp(2.9rem, 12vw, 8.5rem)`, weight 800, tracking `-0.035em`, an **ASCII decode** resolving out of random glyphs. The headline exists **twice in the DOM**: a hidden base copy that reserves the exact final layout including line wrapping, and an absolutely-positioned animating copy laid over it — that is what stops the scramble from reflowing the page, and why reading `textContent` returns the title twice. Keep the pattern (the hidden copy must stay `visibility: hidden`, so assistive tech reads the name once). Nothing sits above it — no kicker, no badge, no "software & infrastructure" label repeating what the sentence below already says.
- **The axis:** a hairline rule at `var(--line)` separates title from the block below; the block is a `0.8fr / 1.2fr` grid with a 64px gap, so the statement starts at ~43% of the content width. **Left:** the supporting sentence in a 32ch measure at 18px Body Ink. **Right:** the two-line statement — "We build the software." in full ink, "We run the infrastructure." stepping down to Muted Ink — then **exactly one** action: the primary button ("Start a project", with a square-cap arrow). There is no secondary control of any kind — a second button beside the first asks the visitor to choose before they know what they are choosing between. The services live one scroll away and in the nav, and that is where the visitor finds them.
- **No cue at all.** The `↓` that used to drift at the foot of the hero is gone: a scroll chevron is filler, and on a first screen this strong the content pulls the visitor down on its own. No "scroll to explore", no chevron stack, no mouse icon.
- **On load, not on scroll:** the hero rises in with staggered delays (90 / 190 / 290ms) because it is already on screen; keying it to a scroll observer would leave the headline invisible until the visitor happened to scroll. 1s, `translateY(16px) → 0`, opacity 0 → 1.
- **Scroll behaviour:** as the section scrolls, the field scales up, blurs and fades while the copy lifts — carried entirely in `transform` / `opacity` / `filter` on the compositor, so nothing re-renders and nothing triggers layout.
- **The first screen answers the first question in large type:** what this is (websites and applications) and what else they do (domains, SSL, email, hosting) — in the headline pair and the supporting sentence, not in small print.

---

## 6. Layout Principles

- **Grid-first.** CSS Grid for every structural layout; flex only for rows of items and one-dimensional alignment. No percentage math in flex (`calc(33% - 1rem)` is banned).
- **One frame, one pair of margins.** Content is contained at `max-width: 1200px`, centred, with horizontal padding of **20px at base and 32px from the `sm` breakpoint up**. The same pair of margins on every section. Asymmetry lives *inside* that grid; the two outer margins stay equal, and an off-centre block is always answered by something on the far side of the frame.
- **Section rhythm:** vertical padding `py-28` (112px) base → `py-40` (160px) `sm` → `py-56` (224px) `lg`, against a body measure that is never more than 65ch. Every section is at least one viewport tall (`min-h-svh`) with its content vertically centred — the paper between blocks is designed space, not empty space. **[measured]** at 1440×900: hero 1620px (180svh), services 2070px, process 1235px, principles 922px, contact 1216px; total document 7861px, and the frame measures `max-width: 1200px` with 32px of padding (20px on a phone) on every one of them.
- **No overlapping.** No absolute-positioned content stacked on content, no text over an image, no z-index underwater layers. Every element occupies its own grid cell or flow position. (The hero's field, scrim and blooms are `aria-hidden` decoration behind the copy, not content.)
- **No cards and no three equal boxes.** Capabilities are **two unequal columns** with an opaque ink rule under each heading. Principles are an **asymmetric `1.3fr / 1fr` split**: the first principle is the one the section is arguing, so it is set at statement size under a full-ink rule on the wide side, and the other two queue beside it at reading size under tone-stepped rules. The row of three identical tiles this replaced was both banned and flat. Feature sections use an asymmetric split, a zig-zag, or a full-width single moment — never three identical tiles.
- **One large moment per section.** The Services attraction is a full-width ASCII Lorenz attractor with the wordmark set over its faded centre. It is the page's one picture-sized thing, and it is drawn in code.
- **The slip** is allowed its own internal rhythm because it is an object, not a layout: it breaks the frame only by having its own paper edge.
- **Full-height sections use `100svh` / `min-h-svh`** — never `100vh` / `h-screen` (the iOS address-bar jump).
- **Footer is a designed close, not a sitemap:** the drawn wordmark, three columns (mark + description, Services, Company) with **44px rows** so the lists are thumb-reachable, then **the address itself as the display line** at `clamp(2rem, 8vw, 7rem)` weight 800, hard against the margin. Then a hairline, the copyright with a blinking block cursor, and "Back to top" — itself a 44px target. **[measured]** footer 798px tall.
- **Deliberate rest, once:** the space between the hero and the first rule. The page does not get a second one — any further large empty stretch is an underbuilt section, not a pause.

---

## 7. Responsive Rules

Every screen is verified at **375px, 390px, 768px, 1024px and 1440px**. Responsive is a requirement, not a polish pass.

| Width | scroll overflow | `h1` | section heights (px) | document |
|---|---|---|---|---|
| 375×812 | none | 46.4px, 1 line | 1462 / 1743 / 1328 / 812 / 872 | 7292 |
| 390×844 | none | 46.8px, 1 line | 1519 / 1743 / 1291 / 844 / 844 | 7316 |
| 768×1024 | none | 92.2px, 1 line | 1843 / 1971 / 1284 / 1024 / 1024 | 7890 |
| 1024×768 | none | 122.9px, 1 line | 1382 / 1832 / 1226 / 910 / 1127 | 7246 |
| 1440×900 | none | 136px, 1 line | 1620 / 2070 / 1235 / 922 / 1216 | 7861 |

Re-measured after the redesign. The headline holds **one line at every width** — the two-line rule is never even needed. **[measured]** no section falls below one viewport, and no vertical gap inside any section exceeds 45% of the viewport (checked at 1440px against every text, canvas and image box).

- **Collapse below 768px:** every multi-column layout becomes a single column — the hero's `0.8fr/1.2fr` axis, the process `1fr/0.85fr`, the two capability columns, the three principles, the footer's three columns, the contact rows stack. No exceptions.
- **No horizontal scroll, ever.** **[measured]** at 390×844: `scrollWidth` 390 = `clientWidth` 390, and the hero renders 1519px tall with a 46.8px headline. This is a critical failure if it ever breaks. The known trap on this site: negative horizontal insets (the process plate's paper bar, the wash behind the figure, the mobile bleed). Bleed is applied to **frame elements only**, via `margin-inline: -20px` under 640px, so the screen edge becomes the section's side border while the copy keeps its inset.
- **Type scales with `clamp()`.** **[measured]** running body copy sits at 16px (`text-base`) and never below it; the small label never below 13px; the hero's 12vw headline floors at 2.9rem and measures 46.8px at 390px wide.
- **Touch targets: 44px, everywhere, measured.** Buttons go full width on phones, stacked with a 12px gap. The hero pair is 50px, the header CTA 125×44, the menu toggle 44×44, every nav and footer link 44px tall, and each menu row 83px. **[measured]** zero interactive elements under 44px at 1440 and at 375. The pattern that achieves this without moving a single underline is in §4.
- **The ASCII layer is not scaled, it is re-gridded.** The field's row count is fixed (18 rows derived from the canvas *height*), so a portrait phone shows the same ripple pattern as a desktop with fewer characters across. Never stretch the canvas.
- **The hero's whole scroll timeline is dropped under `prefers-reduced-motion`:** the section collapses to `100svh` and the panel unsticks, so no one has to scroll through dead distance.
- **The scroll rail only exists at ≥1440px**, where 1200px of content plus a 120px gutter genuinely leaves room. Below that it is absent, not squeezed.
- **Navigation** is a full-screen panel at every width, with the body scroll locked, a reachable close button, Escape to dismiss and focus trapped inside.

---

## 8. Motion & Interaction

Motion exists to say *the machine is working*. It is never used to make a static screen feel expensive.

- **Easing:** one curve, `cubic-bezier(0.16, 1, 0.3, 1)`. Durations: 0.28s (state fades) · 0.4s (underlines, arrows) · 0.6s (menu rows) · 0.9s (reveals) · 1.0s (hero rise). No linear easing, no bounce, no spring overshoot.
- **The signature moves, all four of them:**
  1. **ASCII decode** on every headline. Characters resolve left-to-right out of a random glyph field; whitespace is preserved so words never move; the real text is rendered first and merely hidden, and the scrambled copy is absolutely positioned over it, so the reveal can never reflow the page. 900–1100ms, staggered 120–430ms per line.
  2. **The ASCII ripple field** — a 4-step ink ramp from neutral haze to accent; the ridge of each ripple is the only coloured thing on screen. 14fps in the hero, 10fps at quarter speed in Principles, 10fps at half opacity in Contact.
  3. **Entrance stagger** — the hero rises on load (90/190/290ms), every other section on scroll (`translateY(22px) → 0`, 0.9s, 80–180ms apart). Never one fade for a whole block, and never content that stays hidden if the script fails.
  4. **The scroll zoom** — the hero's field scales, blurs and fades while the copy lifts, over 180svh, entirely on the compositor.
- **Perpetual micro-loops:** drifting motes around the figure (5.6–9.5s, opacity 0.28 → 1, fixed positions rather than runtime randomness so the scatter stays reviewable); the two ambient blooms (28s / 34s); the block cursor blinking hard on/off (`steps(1, end)`, 1.15s — that is what a real cursor does). Three loops, each saying something about the subject; nothing loops for decoration.
- **Feedback on every control:** press, hover and focus. Buttons **push 1px on `active`** (the design system's tactile press), give up their fill on hover and take an accent ring with a soft ink shadow; links draw a 1px underline; the round orb lifts `translate(3px, -3px)`; service rows light title and arrow together in the accent; the rail's current mark brightens into it.
- **Hardware rules:** animate **only** `transform` and `opacity` (plus `filter` on the hero field). Never `top`, `left`, `width`, `height`. Nothing animates anything that can trigger layout, and no scroll effect re-renders React.
- **Reduced motion:** everything holds still. Motes stay visible at 70% opacity, reveals render in their final state, animations are switched off rather than shortened, and the hero collapses to one screen. Nothing may become unreachable because motion was disabled.

---

## 9. The ASCII Layer (site-specific, and non-negotiable)

This is the motif that makes the page Gandalf's. It has a fixed vocabulary — never improvise new ASCII decoration:

| Element | Form | Where |
|---|---|---|
| Section rule | `/* 01 services ` + a 400-character dash run clipped by overflow + ` */`, mono, 11px, `0.16em` tracking, Dim Ink | Top of every section, numbered 01–05 |
| Brackets | `[` … `]` in Dim Ink around a decoded section label | Section labels only |
| List markers | `>` in mono, Dim Ink, not a bullet or a check icon | Capability lists, slip rows |
| Tag separator | `·` middot in Line Strong between mono, 10px, uppercase tags | Capability footers |
| Scroll rail | `│` stacked, with `<` on the current mark | ≥1440px, right gutter |
| Block cursor | 10px × 0.85em rectangle in the accent, hard blink | After the footer sign-off |
| The wordmark | Drawn on a fixed **5×5 grid** so every row is exactly the same width — never hand-typed, which is how a ragged T and a drifting N happen | Footer top row |
| The figure | Gandalf as a raster of ASCII characters, `clamp(170px, 23vw, 330px)`. The source is *white ink on transparency*, which is invisible on paper, so the element carries `filter: invert(1)` — the letters become ink, the alpha is untouched, and no second asset is needed. Behind it, a faint accent wash and the drifting motes | Services |
| The constellation | An animated Lorenz attractor traced in characters, cropped to hide its printed equations, then **masked twice**: the soft ellipse (opaque to 58%, transparent by 100%) that dissolves its sides, intersected with a top fade (`--art-fade`, 34→106px across the breakpoints) so the cropped rows melt into the page instead of ending on a straight cut. Wordmark set over the faded centre. **[measured]** 1440×673px, drawing into a shadow-root canvas | Services, full width, the section's centrepiece |

Rules: mono only, ligatures off, whitespace preserved, column widths exact. The ASCII layer sits at Dim Ink and below; the accent only touches the ridge of a ripple, the current rail mark and the cursor. It is a background and a signage system — if it ever competes with a sentence for attention, it is too loud.

---

## 10. Anti-Patterns (Banned)

**Never do any of these. A generated screen containing one is rejected, not adjusted.**

- No emoji, anywhere, in UI, code, alt text or copy.
- No `Inter`, no generic serif, no default browser font stack, no third typeface.
- No purple/violet/indigo, no neon gradient, and **no glows at all** — on paper there is no emitted light. A low-alpha bleed is the only permitted form.
- No filled accent components — the green is a printed mark, never a surface. The only filled things on the page are ink.
- No decorative gradients; only the hero's paper scrim and the two ambient radial washes.
- No cards, no icon-topped feature cards, no rows of three identical tiles, no bento of grey bars, no fake dashboards.
- No overlapping elements: text never over an image, text never over text, no absolutely-positioned content layers.
- No shadows on things at rest, no glows on things at rest.
- No centred hero, no centred headline stack, no pill badge above a title, no kicker repeating the title.
- No filler UI text: "Scroll to explore", "Swipe down", "Discover more below", bouncing chevrons, scroll-arrow stacks, "Learn more" as a second CTA.
- No custom mouse cursors.
- No stock-photo stand-ins, no placeholders, no `picsum`/Unsplash URLs, no broken image links, no abstract shapes or blobs standing in for a picture.
- No fake forms, no fake checkout, no chat widget that goes nowhere. The action is a real `mailto:`.
- No generic names ("Acme", "Nexus", "John Doe") and no fake round numbers (99.99%, 50%) — use organic values that add up (2–3 days, 4–5 days, 3–5 weeks, 4–8 weeks).
- No AI copywriting clichés: Elevate, Seamless, Unleash, Next-Gen, Revolutionize, Empower, Transform your digital presence.
- No stock shadcn/ui defaults — radii, colours and shadows come from this file, not from the library. (`--radius-ui: 0px`; the only round things are the orb, the motes and the blooms.)
- No `h-screen` / `100vh`. Use `100svh`.
- No z-index spam. Only the sticky header, the menu overlay, the scroll rail and the ASCII wordmark-over-drawing may create layers.
- No grey body copy — running text is Body Ink (#2A2A2C, 12.7:1) or darker.
- No circular loading spinners.

### Voice (the copy is part of the design)
Plain, declarative, unhurried, British spelling ("maintainable", "optimise"). Short sentences, one claim each, concrete nouns and real numbers over adjectives. Two-line headlines that state what happens ("How the work happens.", "Tell us what you're building.", "One contract. One point of contact."). Never marketing register, never a superlative, never a promise without a mechanism behind it — the site's whole argument is that the people who build the thing are the people who answer.

---

## 11. Stated Deviations from the House Rules

**One deviation survives the redesign.** Everything else this brand used to do against the house rules has been brought into line, and the changes are recorded below so they are not quietly undone. A builder working from this document should treat item 1 as the only open question.

1. **The ASCII layer runs below the legibility floor — and only the ASCII layer.** Dim Ink is #8A8A8F (3.1:1 on the paper, under WCAG AA) and the section rules and bracketed labels are 11px mono with 0.16–0.22em tracking (under the skill's 13px floor). This is sanctioned because the layer is **signage, not copy**: rules, brackets, `>` markers, middot tags, the footer sign-off. Every sentence a visitor needs sits in Body Ink (12.7:1) or darker at 16px+. The bracketed section label is the one tracked uppercase label on the page, and it exists to carry the `[ ]` motif the site is named for. **Do not extend either value to real copy, and do not let a second tracked caps label appear.**

**Closed by the redesign** (each was a measured or rule conflict, each fixed and re-verified):

- **Pure black ground → off-black, then paper.** The ground first moved from `#000000` to a real off-black with a tone ladder behind it; the direction then changed outright (see below), so the ground is now **warm paper with a solid ink ramp** and pure black appears nowhere.
- **Accent at 94% saturation → #1F6F4A at 56%.** The blue was first desaturated to 76%; the direction change replaced it with a printer's green at 56% saturation, which passes AA as text (5.4:1) — the ASCII ramp in `ascii-hero.tsx`, the dark sections' field ink and the two blooms were rebuilt around it.
- **The `↓` scroll cue → removed.** Markup, the `.scroll-cue` rule, its keyframes and its reduced-motion line all went with it. Its one job was telling people the page scrolls.
3. **Sub-44px secondary targets — RESOLVED.** Before: header CTA 42px, menu toggle 40×40, nav and footer text links 17–24px. Fixed by moving the hit area onto the anchor (`flex min-h-11 items-center`) with `.link-underline` left on an inner span, and taking the toggle and CTA to `size-11` / `min-h-11`. After: **no interactive element under 44px at 1440 or at 375.**
4. **The constellation's hard top edge — RESOLVED.** The three-row crop that hides the drawing's printed equations used to land as a visible straight cut across the top. Fixed with a second mask layer (`linear-gradient(to bottom, transparent, #000 var(--art-fade))`, composited `intersect` with the existing ellipse and sized per breakpoint), so those rows fade into the sheet the way the sides already did. Verified on the running page and in a screenshot. **Do not revert to `overflow: hidden` alone.**

Everything else in the house rules applies unchanged.
