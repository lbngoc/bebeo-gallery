# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

BeBeo Gallery — a static one-page landing site for a family to browse photo
albums and featured videos. It stores **only metadata and small thumbnails**;
the actual photos/videos live on external cloud storage (Google Drive,
pCloud). There is no backend and no database — see
`.specify/memory/constitution.md` for the governing constraints (this file
is the source of truth for "why", not just "how"):

- No database / ORM / backend runtime — content is flat JSON under `src/_data/`.
- Mobile-first UI.
- Original media is never stored here — only metadata + optimized thumbnails.
- Locked stack: Eleventy (11ty) + Vite + Tailwind CSS + Alpine.js. Don't add another framework, bundler, or backend without amending the constitution first.
- Site is fully public (no auth) by design.

## Commands

```bash
npm install        # first-time setup
npm run dev         # eleventy --serve (dev server + Vite HMR) at http://localhost:8080
npm run build        # validates content, then builds static site to _site/
npm run validate:content   # runs scripts/validate-content.mjs standalone
```

There is no test suite and no linter configured in this repo (no `npm test`,
no ESLint/Prettier config). `npm run build` running clean is the closest
thing to a CI gate — it fails if content JSON is malformed.

## Architecture

### Build pipeline (11ty + Vite) — a non-obvious two-stage handoff

`.eleventy.js` registers `@11ty/eleventy-plugin-vite`, which **post-processes
Eleventy's own output**: Eleventy renders templates to `_site/` first, then
Vite bundles/hashes the JS and CSS it finds referenced in that HTML. This
means any raw asset that Vite needs to bundle (`src/assets/scripts/`,
`src/assets/styles/`, fonts, favicon) **must be passthrough-copied** into
`_site/` via `eleventyConfig.addPassthroughCopy(...)` first — otherwise Vite
can't find the file to bundle and the build fails with a "Failed to resolve"
error. If you add a new raw asset directory, add a passthrough for it.

Tailwind CSS v4 is wired in via the `@tailwindcss/vite` plugin (not the old
PostCSS config). Dark mode is class-based and requires the v4 opt-in line in
`src/assets/styles/main.css`:
```css
@custom-variant dark (&:where(.dark, .dark *));
```
(v4 dropped `darkMode: 'class'` from config — without this line, `dark:`
utilities silently do nothing.)

### Nunjucks async shortcodes — easy to get wrong

`.eleventy.js` defines two `addAsyncShortcode`s: `cardImage` (album/video
thumbnails) and `heroBackground` (Hero's decorative background/photo). Both
wrap `@11ty/eleventy-img` and fall back to a placeholder when the source
image is missing/invalid, so templates never need their own error handling.

Two gotchas when touching templates that call these:
- Call them with **tag syntax** `{% cardImage src, alt, class %}`, not
  `{{ cardImage(...) }}` — the function-call form throws "undefined or
  falsey" for shortcodes registered this way.
- If the call is inside a `{% for %}` loop, it silently renders **nothing**
  (no error) unless the loop is `{% asyncEach ... %}` / `{% endeach %}`.
  See `gallery.njk` and `video-section.njk` for the working pattern.

### Content model (flat files, no DB)

`src/_data/`:
- `albums.json`, `videos.json` — the actual content, validated by
  `scripts/validate-content.mjs` (hand-rolled checks, no JSON Schema
  library, run as part of `npm run build`). Required fields, URL shape,
  enum values, duplicate-id detection.
- `categories.js` — **computed**, not authored: derives the unique,
  sorted list of album categories from `albums.json` at build time. Don't
  add a separate categories file — it would become a second source of
  truth.
- `heroBackground.json` — optional. `{ "image": null | "path", "filter":
  "mono" | "tinted" }`. Absent/`image: null` → Hero renders an abstract CSS
  gradient. A configured image is processed through `eleventy-img` and
  gets a CSS filter applied (see `.hero-bg-abstract`, `.hero-filter-*` in
  `main.css`); a missing/broken image path silently falls back to the
  abstract background rather than failing the build.
- `site.js` — small computed values (e.g. current year for the footer).

Schemas for the above live under `specs/*/contracts/*.json` — check there
before changing field shapes.

### Client-side JS (Alpine.js, no framework)

`src/assets/scripts/main.js` is the single entry point: it imports every
other script (which register Alpine `Alpine.data(...)` components or
`Alpine.store(...)` stores as a side effect) and then calls `Alpine.start()`.
Order matters — stores/components must be registered before `start()`.

Notable cross-component coupling:
- `video-modal.js` owns the `videoModal` Alpine store (open state, current
  video, embed URL builder for youtube/google-drive/pcloud). `video-carousel.js`
  reads/writes it to open videos; `section-scroll.js` reads
  `Alpine.store('videoModal').open` so it can **suspend** desktop
  keyboard/wheel section navigation while the modal is open.
- `section-scroll.js` implements the desktop-only "one screen per section"
  navigation (arrow keys + wheel), gated by `matchMedia('(min-width: ...)')`
  and `prefers-reduced-motion`. It's independent of the CSS
  `scroll-snap-type` set on `<html>`/each `<section>` in `main.css` /
  `index.njk` — the two work together, not through shared code.
- `hero-parallax.js` reads `[data-hero-parallax-layer]` (set by the
  `heroBackground` shortcode output) and applies a scroll-driven
  `transform`, skipped entirely under `prefers-reduced-motion`.

### Video embedding

Videos have a `sourceType` (`youtube` | `google-drive` | `pcloud`) and an
`embedRef` whose meaning depends on it; `video-modal.js` builds the iframe
`src` per type. The exact URL formats are documented in
`specs/001-gallery-landing-page/contracts/video-embed-contract.md` — check
it before changing embed logic.

### Spec-driven workflow

This repo is developed with GitHub Spec-Kit (`.specify/`, `specs/`,
`.claude/skills/speckit-*`). Each feature lives under `specs/NNN-slug/`
(`spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/`,
`tasks.md`) and was built via the `/speckit-specify` → `/speckit-clarify` →
`/speckit-plan` → `/speckit-tasks` → `/speckit-implement` slash-command
sequence. For non-trivial changes, prefer continuing that flow (or at least
reading the relevant `specs/NNN-*/plan.md` + `research.md` first) rather than
editing templates ad hoc — several implementation choices above (async
shortcode fallback behavior, section background pairing, parallax approach)
were deliberate decisions recorded there, not incidental.
