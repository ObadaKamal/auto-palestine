# Auto Palestine — دليل السيارات الفلسطيني

Bilingual (Arabic-first, RTL) automotive directory & marketplace for Palestine.

## Stack

- Next.js 15 (App Router) · React 19 · TypeScript (strict)
- Tailwind CSS v4 (CSS-first `@theme`) + shadcn/ui (new-york)
- next-intl (locale-routed `/ar` default RTL, `/en` LTR)
- next-themes (light/dark) · IBM Plex Sans Arabic (`@fontsource`)
- ESLint 9 (flat) · Prettier · Husky · Commitlint · lint-staged

## Getting started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

## Scripts

| Script           | Description          |
| ---------------- | -------------------- |
| `pnpm dev`       | Start the dev server |
| `pnpm build`     | Production build     |
| `pnpm lint`      | ESLint               |
| `pnpm typecheck` | TypeScript (no emit) |
| `pnpm format`    | Prettier write       |

> Phase 0 (foundation) only — no application pages or business features yet.
