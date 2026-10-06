# mint-sites

The renderer for websites built with the Mint site builder: one Next.js app
that serves every published site (by host) and draws the editor's canvas.
The plan, decisions and contracts live in the e-mint monorepo at
`backend/docs/site-builder/` (README, WORK_ORDERS, CHANGELOG).

Next 16 (App Router, Turbopack), React 19, Tailwind v4, TypeScript strict. No
UI kit.

## Run

```bash
npm install
npm run dev          # http://localhost:3300
```

- `http://localhost:3300/__mint/fixture` — every block on one page with the
  Studio theme (`?theme=dark` for dark). Dev only; a production build serves
  it only with `MINT_FIXTURES=1`.
- Copy `.env.example` to `.env.local` for the backend URL and secrets (used
  from SB-04 on).

## Check

```bash
npm test             # vitest: compileStyles, tokens, sanitizer, RenderTree, manifest
npm run type-check
npm run build
```

## The block manifest

```bash
npm run manifest     # writes block-manifest.json — commit it
```

The manifest lists every block (props, slots, style groups, defaults),
presets, themes, the token and style schemas, the icon names, the allowed
embed hosts and the limits, with a `version` hash of the content. The backend
keeps a copy (`backend/scripts/siteBuilder/syncManifest.mjs` copies it from
`../mint-sites`) and validates every page against it; a test fails when the
committed file is out of date.

## Layout

```
src/types.ts                 Node, Style, Binding, Action, Tokens, BlockDef, PropDef, Manifest
src/blocks/<type>/schema.ts  the block's description (BlockDef)
src/blocks/<type>/index.tsx  the component (server component unless def.client)
src/blocks/defs.ts           every schema (manifest + tests)
src/blocks/registry.ts       type → { def, Component }; client blocks via next/dynamic
src/blocks/icon/icons.ts     the curated icon set (generated, see below)
src/render/RenderTree.tsx    walks Node[]; data-n="<id>" on each block root; slots
src/render/compileStyles.ts  node styles → one CSS string ([data-n] rules + media queries)
src/render/styleSchema.ts    the fixed style keys and their allowed values
src/render/tokens.ts         theme tokens (+ overrides) → CSS variables, Google Fonts link
src/render/actions.ts        node actions → href / data-mint-* attributes
src/render/sanitize.ts       rich text allowlist, safe hrefs
src/render/SiteDocument.tsx  fonts + token CSS + node CSS + header/page/footer
src/themes/<key>.ts          themes (Studio first)
src/presets/index.ts         presets (header-simple, hero-centered, footer-simple)
src/manifest.ts              buildManifest()
src/app/%5F_mint/…           the /__mint/* routes (a folder starting with "_"
                             is private in the App Router; %5F makes the URL "_")
fixtures/home.json           the fixture page
```

## Rules

- **Never build Tailwind class names from data** — Tailwind only sees class
  names written in the source. Blocks map props to full class strings in
  lookup tables; a node's own style goes through `compileStyles`.
- Every block spreads `attrs` on its root element (`data-n` for styles and
  the editor, `id` when something scrolls to it).
- Hand-written CSS reads the `--mint-*` variables, never Tailwind's
  `--color-*` aliases (those resolve at `:root`, so a dark wrapper wouldn't
  apply).
- No webfont fetch at build time; fonts load at runtime from Google Fonts for
  the theme's families.
- Style values, token overrides, URLs and rich text from data are checked
  before they reach CSS or HTML; anything that doesn't fit is dropped.

## Adding a block

1. `src/blocks/<type>/schema.ts` (`def: BlockDef`) and `index.tsx` (the
   component; spread `attrs` on the root).
2. Add it to `src/blocks/defs.ts` and `src/blocks/registry.ts` (through
   `next/dynamic` if `client: true`).
3. Use it in `fixtures/home.json`, run `npm run manifest`, `npm test`.
4. Sync the manifest to the backend (`node scripts/siteBuilder/syncManifest.mjs`
   in `backend/`).

## Icons

`src/blocks/icon/icons.ts` is generated from Phosphor Icons (regular weight,
MIT): `node scripts/icons.mjs <path to node_modules/@phosphor-icons/react>`.
Edit the list in the script; at most 200 icons.
