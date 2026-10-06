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
- Copy `.env.example` to `.env.local`: `MINT_API_URL` (the backend) and
  `SITE_REVALIDATE_SECRET` (the same value as the backend's).
- A published site: `http://<publicSlug>.localhost:3300/` (the backend maps
  `<slug>.localhost` to the project in development). Any other host shows
  "No site here".

## How a published page is served

1. `src/proxy.ts` asks the backend which site the host is
   (`GET /public/sites/resolve?host=`, cached a minute) and rewrites
   `<host>/<path>` to `/_s/<slug>/<path>`, passing `x-mint-site`,
   `x-mint-project` and `x-mint-origin` as request headers. `/__mint/*` and
   `/api/*` are the renderer's own; every other path belongs to the site (so
   `/_s/other` on one site's domain is just a missing page of that site).
2. `src/app/%5Fs/[site]/[[...path]]/page.tsx` fetches
   `GET /public/api/<slug>/render?path=` (`src/lib/api.ts`), cached with the
   tags `site:<projectId>` and `site-slug:<slug>` for 5 minutes, and draws it
   with `LivePage` (theme CSS, one `<style>` for every node, header, page,
   footer, the tracker and mint.js as async scripts). `generateMetadata`
   builds the head (`src/render/metadata.ts`). Redirects from Site setup →
   `redirect()` / `permanentRedirect()`.
3. No page → `not-found.tsx`: the site's own `/404` page, or "Page not found"
   in the site's look. Status 404 either way.
4. `/sitemap.xml` and `/robots.txt` come from the backend with this request's
   address in them.
5. Publish → the backend POSTs `/api/revalidate` (HMAC of the body with
   `SITE_REVALIDATE_SECRET` in `x-mint-signature`) → `revalidateTag(…, { expire: 0 })`
   → the next request renders the new version.

Every backend call carries `x-mint-renderer: <SITE_REVALIDATE_SECRET>`, so the
public API's per-IP limit doesn't apply to the renderer.

No block or page ships client JS unless it must: images are plain `<img>`
straight from the media host, scripts are plain `<script async>` (not
`next/script`).

**No image optimizer.** Not `next/image`, not `/_next/image`
(`images.unoptimized` is on): Vercel bills it per image, and the renderer
serves every tenant's pictures. Smaller copies, if ever needed, are made once
at upload time and stored next to the original.

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
src/render/LivePage.tsx      a published page: SiteDocument + the tracker and mint.js
src/render/metadata.ts       a page's <head> from the render answer
src/lib/api.ts               render + resolve calls to the backend
src/proxy.ts                 host → site → rewrite
src/app/%5Fs/[site]/…        published pages, 404, sitemap.xml, robots.txt
src/app/api/revalidate       the backend's signal after Publish
src/themes/<key>.ts          themes (Studio first)
src/presets/index.ts         presets (header-simple, hero-centered, footer-simple)
src/manifest.ts              buildManifest()
src/app/%5F_mint/…           the /__mint/* routes (a folder starting with "_"
                             is private in the App Router; %5F makes the URL "_")
src/app/%5Fnosite            where unknown hosts go (→ the root 404 "No site here")
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
