# Styling guide

How to change fonts, colours, corner radius, and spacing on this site from VS Code.

Almost everything visual is controlled from **one file**:

```
src/styles/globals.css
```

Open it first. Only reach for the component files in `src/components/` when this guide
sends you there.

---

## Before you start

Your shell defaults to Node v17, which is too old to run this project. In VS Code's
integrated terminal, run this once per terminal session:

```bash
nvm use 24
```

`.nvmrc` says `v20`, which is not installed — a bare `nvm use` will fail. Use `24`.

Two dev servers may already be running (`localhost:3000` for the site, `localhost:3333`
for the Sanity Studio). Both hot-reload, so you'll see CSS edits the instant you save,
with no restart. If nothing is running, start the site with:

```bash
npm run dev
```

If you get `EADDRINUSE`, a server is already up — just open the browser.

---

## 1. Fonts

### Change the typeface

Two places must agree: the CSS variable and the font file being downloaded.

**Step 1 —** in `src/styles/globals.css`, edit the `@theme` block near the top:

```css
@theme {
    --font-sans: 'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif;
    --default-font-family: var(--font-sans);
}
```

Replace `'IBM Plex Sans'` with your font's name. Keep the fallbacks after it — they're
what visitors see while the webfont loads.

**Step 2 —** in `src/layouts/Layout.astro`, update the Google Fonts `<link>` (around
line 49) so the font is actually fetched:

```html
<link
    href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap"
    rel="stylesheet"
/>
```

Spaces in the family name become `+`. The `wght@` list is `style,weight` pairs —
`0,` means upright and `1,` means italic. Only request weights you actually use; each
one is a separate download.

> **Careful:** if you request a weight or style the family doesn't publish, Google Fonts
> returns **HTTP 400** and *no* fonts load at all — the whole stylesheet fails, not just
> the missing weight. If text suddenly falls back to a system font, check the Network tab
> for a 400 on `fonts.googleapis.com`. Use the [Google Fonts](https://fonts.google.com)
> page for your family to confirm which weights exist.

### Use a different font for headings than body

Add a second variable and point the headings at it:

```css
@theme {
    --font-sans: 'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif;
    --font-display: 'IBM Plex Mono', ui-monospace, monospace;
    --default-font-family: var(--font-sans);
}

h1, h2, h3, h4, h5, h6,
.btn,
.badge {
    font-family: var(--font-display);
}
```

Remember to add the second family to the `<link>` in `Layout.astro` too, joined with
`&family=`.

### Font sizes and weights

Headings are sized by utility classes inside components (`text-4xl`, `sm:text-6xl`),
but their **weight and letter-spacing** are set centrally in `globals.css`:

```css
h1, h2, h3, h4, h5, h6 {
    font-weight: 600;          /* raise to 700/800 for heavier headings */
    letter-spacing: -0.01em;   /* 0 for neutral, positive to open it up */
}
```

Text rendered from the CMS (any markdown field) is styled by the `.markdown` rules at
the bottom of the same file:

```css
.markdown h2 { font-size: 1.5em; }
.markdown h3 { font-size: 1.25em; }
.markdown h4 { font-size: 1.0625em; }
```

These use `em`, so they scale relative to whatever surrounds them. Don't delete this
block — Tailwind's reset strips heading sizes and list bullets, and `.markdown` is what
puts them back.

To change the size of a specific heading on the page (e.g. the big hero title), edit the
utility classes in the component instead — see the table in section 4.

---

## 2. Colours

All colours live in two `@plugin "daisyui/theme"` blocks in `globals.css` — one named
`light`, one named `dark`. **Edit both**, or dark sections will drift out of step.

```css
@plugin "daisyui/theme" {
    name: 'light';
    --color-primary: #111111;          /* buttons, links, emphasis */
    --color-primary-content: #ffffff;  /* text ON primary */
    --color-secondary: #f2f2f2;
    --color-secondary-content: #111111;
    --color-accent: #eeeeee;
    --color-accent-content: #111111;
    --color-neutral: #111111;
    --color-neutral-content: #ffffff;
    --color-base-100: #ffffff;         /* page background */
    --color-base-200: #f2f2f2;         /* subtle raised background */
    --color-base-300: #cccccc;         /* borders and hairline rules */
    --color-base-content: #111111;     /* body text */
    ...
}
```

The rule to remember: every `--color-x` has a matching `--color-x-content`, which is the
text colour used **on top of** it. Change one without the other and you get grey-on-grey.

### Light vs dark sections

Each section on a page carries a theme, chosen per section in the Sanity Studio under
**Styles → Theme**. `light` uses the light block, `dark` uses the dark block. So to
restyle every dark band on the site, edit the `dark` block only.

### Why not to hardcode hex values in components

Colours are referenced through classes like `bg-base-100`, `text-base-content`,
`border-base-300`, `btn-primary`. Because those resolve to the variables above, editing
the theme block updates the whole site at once. Writing `bg-[#ff0000]` in a component
breaks that and won't follow the dark theme.

### Built-in themes are off

Near the top you'll see:

```css
@plugin "daisyui" {
    themes: false;
}
```

Leave that. daisyUI ships its own `light`/`dark` themes; with them enabled they collide
with ours at identical CSS specificity and ours only wins by being later in the file — a
silent revert waiting to happen. `false` makes our two blocks the only source of truth.

---

## 3. Corner radius

Three variables per theme block, currently a barely-there 2–4px:

```css
--radius-selector: 0.125rem;  /*  2px — badges, checkboxes, small controls */
--radius-field:    0.25rem;   /*  4px — buttons, inputs, selects */
--radius-box:      0.25rem;   /*  4px — cards, inset sections, nav panel */
```

| Want | Set all three to |
| :--- | :--- |
| Hard square, brutalist | `0` |
| Barely softened (current) | `0.125rem` / `0.25rem` / `0.25rem` |
| Noticeably rounded | `0.375rem` / `0.5rem` / `0.75rem` |
| Very rounded, modern SaaS | `0.5rem` / `0.75rem` / `1rem` |

**Change them in both the `light` and `dark` blocks.** Because components use daisyUI's
`rounded-box` class rather than fixed values, this reshapes cards, buttons, badges,
inputs and the mobile nav in one edit.

Two related knobs sit alongside them:

```css
--border: 1px;   /* thickness of all component borders */
--depth: 0;      /* 1 adds daisyUI's subtle 3D shading */
--noise: 0;      /* 1 adds a grain texture to surfaces */
```

---

## 4. Spacing and margins

Spacing is the one thing **not** fully centralised, because it's structural. There are
three levels.

### Level 1 — space around every section (most useful)

One line in `src/components/Section.astro` controls the vertical rhythm of the entire
site. Around line 23:

```astro
<section class:list={['relative w-full px-3 py-16 sm:px-6 sm:py-24', className]} ...>
```

| Class | Meaning |
| :--- | :--- |
| `py-16` | 4rem top+bottom padding on mobile |
| `sm:py-24` | 6rem from the `sm` breakpoint up |
| `px-3` / `sm:px-6` | left+right padding |

To tighten the whole site — a more old-school, dense feel — try `py-10 sm:py-14`.
Scale: `py-8` = 2rem, `py-12` = 3rem, `py-16` = 4rem, `py-24` = 6rem.

The same file has a second copy of these classes (around line 15) for sections set to
**Inset** width in the Studio. Edit both to keep the two variants consistent.

### Level 2 — maximum content width

Also in `Section.astro`:

```astro
<div class="relative mx-auto max-w-7xl">
```

`max-w-7xl` is 80rem. Narrower feels more document-like: `max-w-5xl` (64rem) or
`max-w-4xl` (56rem).

Long-form text has its own limit, `max-w-prose` (~65 characters), applied in
`Cards.astro`, `Cta.astro`, `Hero.astro`, `Domain.astro` and `Form.astro`. That's a
readability guardrail — widening it past `max-w-prose` makes paragraphs harder to read.

### Level 3 — space between elements inside a section

These are `mt-*` (margin-top) and `gap-*` classes in individual components:

| File | Controls |
| :--- | :--- |
| `src/components/Hero.astro` | gaps between heading, subtitle, body, buttons, small print |
| `src/components/Cards.astro` | gap between heading, body, the card grid, outro, CTA |
| `src/components/Cta.astro` | gap between heading, body, buttons |
| `src/components/Card.astro` | padding and gaps *inside* one card |
| `src/components/Domain.astro` | gaps between a domain's heading, examples, projects, lead |
| `src/components/Form.astro` | gaps between form fields |
| `src/components/Footer.astro` | gaps between logo, links, social, closing line |
| `src/components/Header.astro` | nav padding (`p-4 sm:p-5`) and link spacing (`gap-6`) |

The grid gap between cards is in `Cards.astro`:

```astro
'grid gap-8 justify-items-center'
```

Scale reference: `1` = 0.25rem, `2` = 0.5rem, `4` = 1rem, `6` = 1.5rem, `8` = 2rem,
`12` = 3rem, `16` = 4rem, `24` = 6rem.

### Spacing inside CMS text

Gaps between paragraphs, lists and headings in markdown come from `globals.css`:

```css
.markdown p, .markdown ul, .markdown ol, .markdown blockquote, .markdown table {
    margin-block: 0.75em;   /* raise to 1em for airier paragraphs */
}
```

### Conditional margins — read before editing

Many margins are conditional, so a section doesn't carry a gap above something that
isn't there:

```astro
class:list={[(heading || subheading) && 'mt-6', 'max-w-prose markdown']}
```

That reads: apply `mt-6` *only if* there's a heading or subheading above. Change the
value (`mt-6`), not the condition, unless you're deliberately reworking the logic.

---

## 5. Other visual details

All in `globals.css`, below the theme blocks:

```css
section + section {
    border-top: 1px solid var(--color-base-300);   /* hairline rule between sections */
}

a {
    text-decoration-thickness: 1px;
    text-underline-offset: 0.2em;
}

.btn {
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;   /* remove for normal-case buttons */
}

.markdown ul {
    list-style: square;    /* disc, circle, square, none */
}
```

---

## 6. The logo

The logo is **content, not code** — it's stored in Sanity, so change it in the Studio at
`localhost:3333` under **Site Configuration**, not in VS Code:

| Field | Where it appears |
| :--- | :--- |
| **Header → Logo** | top left, before the "The Plural Stack" wordmark |
| **Footer → Logo** | centred at the top of the footer |
| **Favicon** | browser tab |

Upload a new file to any of those and it updates everywhere it's used. Clear the field to
hide it — the header falls back to the wordmark alone.

Displayed **size** is code. In `Header.astro`, `class="w-7 h-7 sm:w-8 sm:h-8"` is
28px/32px; in `Footer.astro`, `class="w-10 h-10"` is 40px. The separate `width={64}` /
`width={96}` props are the *source* resolution Astro generates — keep them at roughly
2× the display size for sharpness on retina screens, and no larger, or you ship
needlessly heavy images.

> **Note:** the current logo is black artwork on a transparent background, so it would
> disappear on a dark background. It's fine today because the header and footer are
> always light. If you move either onto a dark theme, you'll need a white version.

---

## 7. Checking your work

CSS and component edits hot-reload — just save and look at `localhost:3000`.

Before committing, confirm a real build passes:

```bash
nvm use 24
set -a; . ./.env; set +a
npm run build
```

You should see `8 page(s) built` and `Complete!`. If a Tailwind class name is misspelled
it silently does nothing rather than erroring, so trust the browser over the build for
styling.

---

## Quick reference

| I want to change | File | What to look for |
| :--- | :--- | :--- |
| Typeface | `globals.css` + `Layout.astro` | `--font-sans` and the fonts `<link>` |
| Heading weight | `globals.css` | `h1, h2, h3...{ font-weight }` |
| Any colour | `globals.css` | both `@plugin "daisyui/theme"` blocks |
| Corner radius | `globals.css` | `--radius-*` in both theme blocks |
| Border thickness | `globals.css` | `--border` in both theme blocks |
| Space above/below sections | `Section.astro` | `py-16 sm:py-24` (two places) |
| Page width | `Section.astro` | `max-w-7xl` |
| Gap between cards | `Cards.astro` | `gap-8` |
| Paragraph spacing in CMS text | `globals.css` | `.markdown ... margin-block` |
| Uppercase buttons | `globals.css` | `.btn { text-transform }` |
| Rules between sections | `globals.css` | `section + section` |
| Logo image | Sanity Studio | Site Configuration |
| Logo size | `Header.astro` / `Footer.astro` | `w-7 h-7` / `w-10 h-10` |
