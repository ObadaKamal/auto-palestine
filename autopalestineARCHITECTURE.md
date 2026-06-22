# Auto Palestine (دليل السيارات الفلسطيني) — Project Architecture

> Status: **Architecture proposal — awaiting approval.** No application code yet.
> Target repository: `ObadaKamal/auto-palestine`.
> Design source: Stitch project `18222420213841824360`, design system **"Horizon Auto"**.

Product: a bilingual (Arabic-first, RTL), SEO-driven automotive **directory + marketplace** for Palestine, with
self-service business onboarding, an owner dashboard (incl. **Leads** and **Notifications** in MVP), a **Verified
Shop** workflow, subscriptions, and an admin moderation/governance layer.

Roles: **Visitor/Customer**, **Business Owner**, **Admin**.

---

## 1. Stack & Conventions

| Concern | Decision |
|---|---|
| Framework | Next.js (App Router) + TypeScript (strict) |
| Styling | Tailwind CSS, themed from Horizon Auto tokens + CSS variables (light/dark) |
| i18n / RTL | `next-intl`, locale-routed (`/ar` default RTL, `/en` LTR), logical CSS properties |
| Components | Local `ui/` kit on Radix primitives (a11y), themed to tokens |
| Data | Server Components first; typed API client; TanStack Query for client islands |
| Forms | React Hook Form + Zod resolver |
| Validation | Zod schemas as the single source of truth (client + server) |
| Auth | Role-based sessions, enforced in middleware + layout guards |
| Maps | MapLibre/Leaflet (location picker + profile map + directions) |

Rendering: public pages SSG/ISR (SEO), search SSR with cached facets, dashboards SSR/CSR behind auth.

---

## 2. Final Folder Structure

```
auto-palestine/
├─ app/
│  └─ [locale]/
│     ├─ layout.tsx                     # sets <html lang dir>, fonts, providers
│     ├─ (public)/
│     │  ├─ layout.tsx                  # PublicLayout (Navbar/Footer)
│     │  ├─ page.tsx                    # Home
│     │  ├─ search/page.tsx
│     │  ├─ categories/[slug]/page.tsx
│     │  ├─ business/[slug]/page.tsx    # shop profile
│     │  ├─ pricing/page.tsx
│     │  ├─ blog/[slug]/page.tsx
│     │  ├─ about/ contact/ faq/page.tsx
│     ├─ (auth)/
│     │  ├─ layout.tsx                  # AuthLayout
│     │  ├─ login/  register/page.tsx
│     ├─ onboarding/
│     │  ├─ layout.tsx                  # OnboardingLayout (wizard shell)
│     │  └─ [step]/page.tsx             # location | media | services | review
│     ├─ dashboard/                     # OWNER (DashboardLayout)
│     │  ├─ layout.tsx
│     │  ├─ overview/page.tsx
│     │  ├─ leads/page.tsx              # ★ added
│     │  ├─ profile/page.tsx
│     │  ├─ services/page.tsx
│     │  ├─ reviews/page.tsx
│     │  ├─ verification/page.tsx       # ★ verification status mgmt
│     │  ├─ subscription/page.tsx
│     │  └─ notifications/page.tsx      # ★ MVP
│     └─ admin/                         # ADMIN (AdminLayout)
│        ├─ layout.tsx
│        ├─ overview/page.tsx
│        ├─ businesses/page.tsx         # approvals
│        ├─ verification/page.tsx       # ★ verification review queue
│        ├─ reviews/  users/  plans/page.tsx
├─ src/
│  ├─ components/
│  │  ├─ ui/                            # primitives
│  │  ├─ layout/                        # Navbar, Footer, Sidebars, WizardShell
│  │  ├─ business/  search/  reviews/
│  │  ├─ dashboard/                     # StatCard, DataTable, PlanCard, LeadCard, VerifiedBadge
│  │  ├─ feedback/                      # StateView, Toast, Skeleton
│  │  └─ content/                       # BlogCard, FaqAccordion, ContactForm
│  ├─ features/                         # feature modules (Section 6)
│  ├─ lib/                              # api/, auth/, maps/, i18n/, format/, rtl/
│  ├─ hooks/
│  ├─ types/                            # domain models (Section 7)
│  ├─ schemas/                          # Zod (Section 11)
│  ├─ i18n/                             # config + messages/{ar,en}.json
│  └─ styles/                           # globals.css, tokens.css
├─ public/                              # logo, icons, images
├─ tailwind.config.ts                   # Horizon Auto tokens
└─ middleware.ts                        # locale + auth/role routing
```

---

## 3. Route Structure

| Path (under `/[locale]`) | Zone | Access | Rendering |
|---|---|---|---|
| `/` | Public | all | SSG/ISR |
| `/search`, `/categories/[slug]` | Public | all | SSR (cached facets) |
| `/business/[slug]` | Public | all | ISR + structured data |
| `/pricing`, `/blog/[slug]`, `/about`, `/contact`, `/faq` | Public | all | SSG/ISR |
| `/login`, `/register` | Auth | guests | CSR |
| `/onboarding/[step]` | Onboarding | owner | CSR + draft persistence |
| `/dashboard/overview` | Owner | owner | SSR |
| `/dashboard/leads` ★ | Owner | owner | SSR + client table |
| `/dashboard/profile`, `/services`, `/reviews` | Owner | owner | SSR |
| `/dashboard/verification` ★ | Owner | owner | SSR |
| `/dashboard/subscription`, `/notifications` ★ | Owner | owner | SSR |
| `/admin/overview` | Admin | admin | SSR |
| `/admin/businesses`, `/verification` ★, `/reviews`, `/users`, `/plans` | Admin | admin | SSR + data tables |

`middleware.ts`: resolves locale (default `ar`), sets `dir`, and guards `/onboarding`, `/dashboard/*` (owner), `/admin/*` (admin).

---

## 4. Layout Hierarchy

```
RootLayout (/[locale]/layout)  →  html lang/dir, fonts, ThemeProvider, IntlProvider, QueryProvider, Toaster
├─ PublicLayout      → Navbar (logo, search, categories, lang switch, login/CTA) + Footer
├─ AuthLayout        → centered branded card, lang switch
├─ OnboardingLayout  → WizardShell: StepProgress + content + sticky footer (Back/Save draft/Next) + summary rail
├─ DashboardLayout   → owner RTL Sidebar + Topbar (NotificationsBell, plan status, VerifiedBadge, profile)
└─ AdminLayout       → admin Sidebar (denser) + Topbar (global search, role badge)
```

---

## 5. Shared Component Inventory

**Primitives (`ui/`):** Button (Primary/Secondary/Ghost), IconButton, Input, Textarea, Select, Combobox, Checkbox, RadioGroup, Switch, Label, FormField, Chip/Badge, Card, Avatar, Tooltip, Dialog, Drawer/Sheet, Tabs, Accordion, Breadcrumb, Pagination, DropdownMenu, Divider, Spinner, Skeleton, ProgressStepper, Toast.

**Layout:** Navbar, MobileNav, Footer, LanguageSwitcher, ThemeToggle, Sidebar, AdminSidebar, DashboardTopbar, WizardShell, PageContainer, SectionHeader.

**Business / Discovery:** BusinessCard, BusinessCardGrid, FeaturedCarousel, BusinessHero, BusinessGallery, ContactBlock (call/WhatsApp/directions), WorkingHours, MapPanel, ServiceList/ServiceItem, CategoryCard, CategoryPills, **VerifiedBadge ★**.

**Search:** SearchBar, FilterPanel (city/category/rating/verified), SortMenu, ActiveFilters, ResultsHeader, EmptyResults.

**Reviews:** RatingStars (display+input), ReviewCard, ReviewForm, ReviewSummary, OwnerReplyBox.

**Dashboard / Admin:** StatCard, DataTable (sort/filter/paginate/row-actions), StatusBadge, PlanCard/PricingTable, SubscriptionStatus, **LeadCard / LeadsTable / LeadStatusSelect ★**, NotificationItem/NotificationList/NotificationsBell ★, **VerificationStatusCard / VerificationRequestForm / VerificationReviewRow ★**, ImageUploader/LogoUploader, ConfirmDialog.

**Feedback:** StateView (loading/empty/error/404), InlineAlert, Skeletons.

**Content:** BlogCard, BlogPostBody, FaqAccordion, ContactForm, RichText.

---

## 6. Feature Modules (`src/features/`)

Each module owns its components, hooks, API calls, schemas, and types (colocated), exposing a thin public index.

- `discovery` — home, search, filters, category browsing.
- `business-profile` — public shop page, gallery, contact, map.
- `auth` — login/register, session.
- `onboarding` — 5-step wizard, draft persistence, publish.
- `dashboard-overview` — owner KPIs.
- `leads` ★ — capture (from profile contact actions), list, status pipeline, notes.
- `services` — owner CRUD of services/pricing.
- `reviews` — owner replies + admin moderation.
- `verification` ★ — owner request/status; admin review queue; badge propagation.
- `subscription` — plans, upgrade/downgrade, billing status.
- `notifications` ★ — center + bell, read/unread.
- `admin` — businesses, users, plans, moderation.
- `content` — blog, faq, static pages.

---

## 7. Domain Models

| Entity | Key fields |
|---|---|
| **User** | id, name, email, phone, role (`visitor`/`owner`/`admin`), locale, avatarUrl, createdAt |
| **Business** | id, ownerId, name{ar,en}, slug, description{ar,en}, categoryIds[], status (`draft`/`pending`/`active`/`suspended`), **verificationStatus (`unverified`/`pending`/`verified`/`rejected`) ★**, logoUrl, coverUrl, gallery[], rating, reviewCount, subscriptionTier, createdAt |
| **Location** | businessId, city, area, addressText, lat, lng, mapZoom |
| **Contact** | businessId, phones[], whatsapp, email, website, social{}, workingHours[] |
| **Category** | id, name{ar,en}, slug, icon, parentId, businessCount |
| **Service** | id, businessId, name{ar,en}, description, price, priceType (`fixed`/`from`/`quote`), durationMins |
| **Review** | id, businessId, authorId, rating(1–5), comment, status (`pending`/`published`/`hidden`), ownerReply, createdAt |
| **Lead ★** | id, businessId, customerName, phone, source (`call`/`whatsapp`/`form`/`directions`), serviceInterest, message, status (`new`/`contacted`/`won`/`lost`), notes, createdAt |
| **VerificationRequest ★** | id, businessId, documents[], submittedAt, status (`pending`/`approved`/`rejected`), reviewedBy, reviewedAt, rejectionReason |
| **SubscriptionPlan** | id, name{ar,en}, priceMonthly, priceYearly, features[], limits{listings,photos,featured}, isPopular |
| **Subscription** | id, businessId, planId, status, startsAt, renewsAt, paymentRef |
| **Notification** | id, userId, type, title, body, read, linkUrl, createdAt |
| **BlogPost** | id, title{ar,en}, slug, excerpt, body, coverUrl, author, tags[], publishedAt |
| **OnboardingDraft** | id, ownerId, step, payload (partial Business), updatedAt |

All bilingual text uses a `LocalizedText = { ar: string; en: string }` shape; all enums are defined once in `types/` and reused by schemas.

---

## 8. API Layer Architecture

- **Single typed client** in `lib/api/` — a thin `fetch` wrapper adding locale header, auth token, error normalization, and `AbortSignal`.
- **Resource modules** (`lib/api/business.ts`, `leads.ts`, `verification.ts`, …) export typed functions returning domain types from `types/`.
- **Server usage:** called directly inside Server Components / route handlers (no client roundtrip).
- **Client usage:** wrapped in TanStack Query hooks (`features/*/hooks`) with stable query keys (`['business', slug]`, `['leads', { status }]`).
- **Mutations:** Query mutations → invalidate affected keys; optimistic updates for lead-status and notification-read.
- **Errors:** normalized `ApiError { code, message, fieldErrors? }`; `fieldErrors` map back onto RHF fields.
- **Boundary contract:** request/response payloads validated by the same Zod schemas (Section 11) so the API edge is type-safe in both directions. Swappable: a `MockAdapter` lets the UI be built before the backend lands.

---

## 9. State Management Strategy

- **Server state** → TanStack Query (lists, profiles, leads, notifications). No global store for server data.
- **URL state** → search/filter/sort/pagination live in query params (shareable, SSR-friendly).
- **Local UI state** → component `useState`/`useReducer` (dialogs, tabs).
- **Cross-cutting client state** → small React Context only: `theme`, `locale/dir`, `session`, `toast`. No Redux.
- **Wizard state** → RHF form state + persisted `OnboardingDraft` (autosave per step to server/localStorage).
- **Notifications** → Query with polling/refetch-on-focus (MVP); upgradeable to realtime later.

---

## 10. Form Strategy

- **React Hook Form** everywhere; one `<FormField>` wrapper binds label/control/error and handles RTL label alignment.
- **Zod resolver** for validation; schema is the contract.
- **Multi-step onboarding:** one composed schema split per step; each step validates its slice before `Next`; draft autosaved; final step re-validates the whole.
- **Server errors** mapped into field errors via `ApiError.fieldErrors`.
- **Uploads:** `ImageUploader`/`LogoUploader` with client-side type/size checks mirrored by schema.

---

## 11. Validation Strategy

- **Zod as single source of truth** in `src/schemas/`, organized by entity (`business.schema.ts`, `lead.schema.ts`, `verification.schema.ts`, …).
- Domain `types/` are derived via `z.infer` so types and validation never drift.
- Same schemas validate: form input (client), API request bodies, and API responses (boundary parsing).
- Bilingual fields validated for both `ar` and `en`; phone numbers validated for Palestinian formats; enums constrained to the shared unions.
- Reusable refinements: required-localized-text, phone, slug, price-by-priceType.

---

## 12. Internationalization Strategy

- **`next-intl`** with locale segment `/[locale]` — `ar` (default), `en`.
- Messages in `src/i18n/messages/{ar,en}.json`, namespaced per feature; no hardcoded UI strings.
- `generateStaticParams` for both locales; `setRequestLocale` in layouts for SSG.
- Locale-aware formatting (numbers, currency ₪, dates, relative time) via Intl helpers in `lib/format/`.
- **Content vs UI:** UI strings from message catalogs; domain content (business names, blog) stored bilingually via `LocalizedText` and selected by active locale with graceful fallback.
- Language switch preserves the current route and query params.

---

## 13. RTL / LTR Strategy

- `dir` derived from locale at `RootLayout` (`ar` → `rtl`, `en` → `ltr`); set on `<html>`.
- **Logical CSS only** — `ps/pe`, `ms/me`, `start/end`; never hardcode left/right. Tailwind logical utilities + `tailwindcss-rtl` (or v4 logical props).
- **Directional icons** (arrows/chevrons) auto-flip via a `DirectionalIcon` helper / `[dir=rtl]` rule.
- **Layout mirroring:** sidebars, steppers, breadcrumbs, carousels mirror automatically from logical props; the wizard progresses right-to-left in `ar`.
- **Forms:** labels right-aligned above inputs in RTL; checkbox graphic to the right of its label (per Horizon Auto spec).
- **Typography:** IBM Plex Sans Arabic; Arabic line-height ~1.5–1.6×; weights consistent across scripts.
- **Testing:** every screen reviewed in both `ar/rtl` and `en/ltr` × light/dark; Storybook toggles for both axes.

---

## 14. Build Order (recap, with approved additions)

0. Foundations → 1. Design system & primitives → 2. Public discovery + Business Profile (incl. **VerifiedBadge** + verified filter) → 3. Auth + Onboarding wizard → 4. **Owner Dashboard MVP: Overview, Leads ★, Profile, Services, Reviews, Verification status ★, Subscription, Notifications ★** → 5. Admin (approvals, **verification review queue ★**, moderation, users, plans) → 6. Content & polish (RTL/LTR + dark-mode + a11y + perf).

Build each repeated pattern once before its second use: `BusinessCard`, `RatingStars`, `DataTable`, `StateView`, `PricingTable`, `LeadsTable`, `VerifiedBadge`, `NotificationsBell`.
