# Auto Palestine — دليل السيارات الفلسطيني

> دليل وسوق إلكتروني ثنائي اللغة (عربي أولاً RTL + إنجليزي) لخدمات وورش ومعارض السيارات في فلسطين.
>
> A bilingual (Arabic-first, RTL + English) automotive directory & marketplace for Palestine.

The UI is built to match a Google Stitch design ("Horizon Auto" design system) — navy `#0B192C` + orange `#FF6500`, with a full light/dark theme.

---

## ✨ Features

### Visitors / Customers

- Browse a localized home page with featured shops and categories
- Search & filter shops (by query, city, category, rating)
- Category landing pages
- Dynamic shop profile page (resolved by **slug or id**) with gallery, services, working hours, "open now" status, map, contact actions (call / WhatsApp / directions), and reviews
- Submit reviews
- Pricing/plans, Blog, FAQ, About, Contact pages

### Merchants (shop owners) — `/dashboard`

- Dashboard overview with key stats (profile views, leads, rating, contact clicks)
- **Leads management** (mark won/lost/contacted)
- Edit business profile
- Manage services (add / delete)
- Reviews — read & reply
- Verified Shop workflow (request verification)
- Subscription & billing (current plan, invoices, upgrade)
- **Notifications center**

### Admins — `/admin`

- Platform overview (metrics, growth chart, category distribution, recent registration requests)
- Businesses management (suspend / activate)
- Verification queue (approve / reject)
- Users directory
- Reviews moderation
- Subscription plans

Three roles — **visitor**, **owner**, **admin** — are gated by a cookie-based session (`ap_session`) with guards in the route-group layouts.

---

## 🧱 Tech Stack

| Area            | Choice                                                                         |
| --------------- | ------------------------------------------------------------------------------ |
| Framework       | Next.js 15 (App Router) · React 19                                             |
| Language        | TypeScript (strict)                                                            |
| Styling         | Tailwind CSS v4 (CSS-first `@theme`) + shadcn/ui (new-york) + Radix primitives |
| i18n            | next-intl v4 (locale-routed `/ar` default RTL, `/en` LTR)                      |
| Theming         | next-themes (light/dark)                                                       |
| Fonts           | IBM Plex Sans Arabic (`@fontsource`, no external egress)                       |
| Forms           | React Hook Form + Zod                                                          |
| Icons           | lucide-react                                                                   |
| Tooling         | ESLint 9 (flat) · Prettier · Husky · Commitlint · lint-staged · Vitest         |
| Package manager | pnpm                                                                           |

> The data layer is a **server-only mock API** with an in-memory mutable store (`src/lib/api`), and mutations run through **server actions** (`src/lib/actions.ts`). This makes the app fully interactive without an external database — ready to be swapped for a real backend.

---

## 🗂️ Project Structure

```
src/
├── app/
│   └── [locale]/
│       ├── (public)/        # home, search, business/[slug], categories, pricing,
│       │                    # blog, faq, about, contact
│       ├── (auth)/          # login, register
│       ├── dashboard/       # owner console: overview, leads, profile, services,
│       │                    # reviews, subscription, verification, notifications
│       ├── admin/           # admin console: overview, businesses, verification,
│       │                    # users, reviews, plans
│       └── onboarding/      # multi-step "list your business" wizard
├── components/              # ui/ (shadcn), layout/, common/, business/, dashboard/, auth/
├── i18n/                    # routing + messages/{ar,en}.json
├── lib/
│   ├── api/                 # server-only mock API + mock data
│   ├── actions.ts           # 'use server' mutations
│   ├── auth/                # cookie session
│   ├── format.ts            # locale number/price/rating/date helpers
│   ├── hours.ts             # isOpenNow()
│   └── status.ts            # badge tone maps
├── schemas/                 # Zod schemas
├── types/                   # shared TypeScript types
└── middleware.ts            # next-intl locale routing
```

---

## 🌐 Internationalization

- Default locale `ar` (RTL); `en` (LTR) also fully supported.
- All UI strings live in `src/i18n/messages/ar.json` and `en.json` — **keep namespace parity between both files**.
- Routes are locale-prefixed (`/ar/...`, `/en/...`); `/` redirects to `/ar`.

---

## 🚀 Getting Started

```bash
pnpm install
pnpm dev          # http://localhost:3000  → redirects to /ar
```

### Trying the consoles locally

The owner/admin areas are protected by the `ap_session` cookie. To preview them, set a cookie like:

```js
// in the browser console
document.cookie =
  'ap_session=' +
  encodeURIComponent('{"role":"owner","name":"Demo"}') +
  '; path=/';
// role can be "owner" or "admin"
```

Then visit `/ar/dashboard` or `/ar/admin`.

---

## 📜 Scripts

| Script           | Description              |
| ---------------- | ------------------------ |
| `pnpm dev`       | Start the dev server     |
| `pnpm build`     | Production build         |
| `pnpm start`     | Run the production build |
| `pnpm lint`      | ESLint                   |
| `pnpm typecheck` | TypeScript (no emit)     |
| `pnpm format`    | Prettier write           |
| `pnpm test`      | Vitest (run once)        |

---

## 🎨 Design System

- **Colors:** navy `#0B192C` (secondary), orange `#FF6500` (primary), plus success/warning/destructive and a full surface scale — defined as CSS variables with light/dark values in `src/app/globals.css`.
- **Typography:** IBM Plex Sans Arabic with custom `display`, `headline`, `body`, and `label` type scales.
- **Logo:** lives in `public/logo.svg` (color) and `public/logo-light.svg` (white for dark backgrounds); rendered via `src/components/common/logo.tsx`. Replace these files to swap the brand mark.
- Shop/cover imagery uses a deterministic gradient placeholder (`CoverPlaceholder`) so no external image hosts are required.

---

## 🔄 Replacing the mock backend

All reads go through `src/lib/api` and all writes through `src/lib/actions.ts`. To connect a real backend, reimplement those functions (e.g. with a database client or REST/GraphQL calls) while keeping the same signatures — the pages and components won't need to change.

---

## 📦 Status

Functional MVP with the full page set implemented and matched to the Stitch design across public, auth, owner, and admin areas. Data is mock/in-memory and resets on restart.
