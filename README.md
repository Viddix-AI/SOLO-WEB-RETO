# RETO Health — Portal

Premium preventive-medicine storefront. **The future of health, today.**

Stack: **Next.js 15** (App Router) · TypeScript · Tailwind CSS v3 · pnpm.
Payments: **Amazon Pay** (Checkout v2). Planned (later blocks): Supabase · QuickBooks Online · Resend. Hosting: Vercel.

## Status

Built in blocks: **A** foundation/identity · **B** public home · **C** marketplace
(shop, product pages, chamber concierge request) · **D** book checkout via
**Amazon Pay** (Checkout v2, sandbox; enabled per region — LATAM and unconfigured
regions show "Coming soon"). Persistence is currently mock (in-memory / console);
real DB (Supabase) and the QuickBooks SalesReceipt come in later blocks.

## Getting started

```bash
pnpm install
pnpm dev          # dev server (Turbopack)
```

Open http://localhost:3000 → it redirects to `/us`.

> **Note:** on this machine port 3000 is already used by another app. Use a free
> port, e.g. `pnpm dev -p 3100`, then open http://localhost:3100.

Scripts: `pnpm build` (production build), `pnpm start` (serve build),
`pnpm lint`, `pnpm typecheck`.

## Design source

`_design/` is the **source of truth**, extracted from the approved prototype:

- `design-tokens.css` — all CSS variables (ported verbatim into `src/app/globals.css`).
- `reto-data.js` — regions, price book, products, the en/es dictionary, chamber specs.
- `DESIGN_REFERENCE.md` — architecture, screens, products and prices.

Colors are **not** invented — every token matches the reference exactly.

## Architecture

```
src/
  middleware.ts              # redirects / -> /us
  app/
    [region]/
      layout.tsx             # ROOT layout: <html lang> per region, fonts, header, footer
      page.tsx               # foundation landing (hero + live price panel)
    globals.css              # design tokens (:root) + ported base utilities
  components/
    site-header.tsx          # logo + nav + region selector
    site-footer.tsx          # mantra · Miami · Madrid · © 2026 RETO
    region-selector.tsx      # client: swaps region segment, switches lang+currency live
    reto-logo.tsx            # iridescent wordmark
  lib/
    fonts.ts                 # IBM Plex Mono via next/font (sans = Helvetica Neue system stack)
    regions.ts               # typed regions: US (en/USD), LATAM (es/USD), EU (es/EUR)
    products.ts              # typed products + price book + chamber specs + priceFor()
    region-context.tsx       # client RegionProvider + useRegion()/useT()
    i18n/
      dictionary.ts          # full en/es dictionary (compiler-enforced key parity)
      index.ts               # translate() / createTranslator()
```

### Regions

| Region | Route   | Language | Currency |
|--------|---------|----------|----------|
| US     | `/us`   | English  | USD `$`  |
| LATAM  | `/latam`| Español  | USD `$`  |
| EU     | `/eu`   | Español  | EUR `€`  |

The three regions are statically generated; the region selector changes the
URL segment, which switches language and currency live.

### Design tokens in Tailwind

Tokens live as CSS variables in `globals.css` and are exposed to Tailwind via
`theme.extend` in `tailwind.config.ts` (e.g. `bg-bg`, `text-ink-2`,
`border-line`, `text-display`). The CSS variables remain the single source of
truth so the palette never forks.

## Logo

No official logo asset was supplied in the design reference, so the wordmark in
`reto-logo.tsx` (and `public/reto-logo.svg`) is a faithful typographic
placeholder. Drop in the official PNG/SVG to replace it.
