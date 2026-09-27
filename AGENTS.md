# AGENTS.md — atelier-store

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + Better Auth + Drizzle ORM + Neon Postgres.
Minimal starter: wiring only. No e-commerce features, auth tables, or UI built yet.

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build (`npx next typegen` first if `LayoutProps` / route types are missing)
- `npm run lint` — eslint
- `npx tsc --noEmit` — typecheck
- `npm run db:generate` / `db:migrate` / `db:push` / `db:studio` — Drizzle Kit
- `npm run auth:generate` — scaffold Better Auth tables to `src/db/auth-schema.ts` from `src/lib/auth.ts`

Build needs env (use dummy values for type-only builds):
```powershell
$env:DATABASE_URL="postgresql://user:pass@ep-test.neon.tech/db?sslmode=require"
$env:BETTER_AUTH_SECRET="test-secret-12345678901234567890"
$env:BETTER_AUTH_URL="http://localhost:3000"
$env:NEXT_PUBLIC_APP_URL="http://localhost:3000"
npm run build
```

## Env

See `.env.example`. Copy to `.env.local` (gitignored via `.env*`):
- `DATABASE_URL` — Neon pooled URL (`?sslmode=require`)
- `BETTER_AUTH_SECRET` — generate via `npx @better-auth/cli secret`
- `BETTER_AUTH_URL` / `NEXT_PUBLIC_APP_URL` — `http://localhost:3000` locally

Never commit real secrets. Never create a real `.env` in automated runs; use `.env.example` as reference.

## Architecture

- `src/app/layout.tsx`, `page.tsx`, `globals.css` — App Router shell + Tailwind v4 (`@import "tailwindcss"`). Default CNA landing page, no store UI.
- `src/app/api/auth/[...all]/route.ts` — `toNextJsHandler(auth)` GET/POST, mounted at `/api/auth/*`.
- `src/db/index.ts` — `neon()` + `drizzle({ client, schema })` (uses `drizzle-orm/neon-http`). Warns if `DATABASE_URL` missing; doesn't throw at import so builds pass without env.
- `src/db/schema.ts` — intentionally empty (`export {}`). Add domain tables here or split into `src/db/schema/*` later. Run `auth:generate` before hand-writing auth tables.
- `src/lib/auth.ts` — server `betterAuth({ drizzleAdapter(db, { provider: "pg" }), emailAndPassword.enabled })`. No OAuth/providers yet.
- `src/lib/auth-client.ts` — `"use client"` + `createAuthClient()`. Not wired to UI yet.
- `drizzle.config.ts` — `schema: ./src/db/schema.ts`, `out: ./drizzle`, `dialect: postgresql`.
- `tsconfig.json` — alias `@/* -> ./src/*`. Prefer `@/db`, `@/lib/*`.

## Conventions for agents

- App Router only: server components by default; add `"use client"` only for interactive parts / `authClient` usage.
- Use Next 16 typed routes (`LayoutProps<"/">` needs `.next/types` — run `npx next typegen` if missing).
- Tailwind v4 CSS-first: use utilities + `@theme` in CSS, no `tailwind.config.js` unless explicitly needed.
- DB: use `db` from `@/db`; Neon HTTP (no long-lived pool, no `pg` driver). Keep schema changes via Drizzle Kit, not raw SQL.
- Auth: extend `src/lib/auth.ts`, then `npm run auth:generate` + `db:push`/`migrate`. Don't hand-write `user/session/account/verification` tables.
- Minimal scope: don't add payments, full auth flows, cart/orders, or deployments unless explicitly asked.
- Verify with `npx tsc --noEmit` + `npm run lint`; run `npx drizzle-kit check` after touching `drizzle.config.ts` / schema.

## Design system (Atelier, original — luxury principles only)

- Tokens in `src/app/globals.css` via Tailwind v4 `@theme`: `canvas/surface/ink/muted/line/accent/accent-ink`, `font-display` (Cormorant Garamond) + `font-sans` (Geist), `container-atelier: 80rem`, `radius-atelier: 2px`. Dark mode via `prefers-color-scheme`.
- Base: `body bg-canvas text-ink font-sans`, accent `::selection`, accent `:focus-visible`, fluid images.
- Reusable classes: `container-atelier`, `section`/`section-sm`, `eyebrow` (12px uppercase 0.22em), `h-display`/`h-section` (clamp serif), `body-muted`, `btn` + `btn-primary`/`btn-secondary`/`btn-ghost` (44px, uppercase, hairline), `link-underline`, `hairline`, `card-product` (+ `card-product-media` 4/5 with hover zoom), `input`, `grid-product` (2 → 3 → 4 cols).
- React primitives in `src/components/ui/`: `Container`/`Section` (`container.tsx`), `Button` (`button.tsx`), `SectionHeading` (`section-heading.tsx`), `ProductCard` (`product-card.tsx`). Server-safe, `className` passthrough, no extra deps.
- Fonts in `src/app/layout.tsx`: `Cormorant_Garamond --font-display` + Geist. No third-party brand fonts/assets.

## Expected build note

`next build` currently logs `[Better Auth]: Drizzle schema mismatch — Missing tables user, session, account, verification`. Expected until `auth:generate` + migration is run.
