# CLAUDE.md - INGCO Ukraine E-Commerce Frontend

## Project Overview

E-commerce platform for INGCO Ukraine (official tool importer). Supports three user segments:

- **B2C Retail** (guest + registered) - consumer product catalog at `/` and `/retail`
- **B2B Wholesale** (verified businesses) - wholesale catalog at `/shop` with table views and bulk export
- **Admin Dashboard** - full CRM at `/dashboard` (product/order/user/category management, analytics)

**Live site:** https://ingco-service.win
**Backend API:** https://api-ingco-service.win/api (NestJS + PostgreSQL)

## Tech Stack

- **Framework:** Next.js 14 (App Router), React 18, TypeScript 5.2
- **State:** Redux Toolkit + Redux Persist (localStorage for token, cart, currency, shopView)
- **Styling:** Tailwind CSS 3.3 with custom theme (primary: `#f59e0b` orange)
- **Forms:** React Hook Form + Zod (Ukrainian/Cyrillic validation)
- **HTTP:** Axios with Bearer token auth (`apiIngco` instance in `lib/appState/user/operation.ts`)
- **UI libs:** Lucide icons, React Select, React Table, React Slick, Recharts, React Modal, React Toastify
- **Deployment:** Vercel (with Analytics + Speed Insights)
- **SEO:** next-sitemap, Schema.org JSON-LD, OpenGraph/Twitter cards

## Project Structure

```
app/
  (retail-catalog)/     # B2C route group (root `/` URLs)
  retail/               # Alternate retail layout with sidebar
  shop/                 # B2B wholesale (table view, export)
  auth/                 # Login, register, forgot password
  dashboard/            # Admin CRM (products, orders, categories, users, stats, support)
  home/                 # Info pages (contacts, support)
  legal/                # Legal pages (privacy, terms, returns, shipping, cookies, offer)
  api/                  # API routes (currency rates, YML feed)
  ui/                   # All reusable UI components
  service/              # StoreProvider, withAuth HOC
lib/
  appState/             # Redux store, slices (main, user/auth, dashboard), async thunks
  types.ts              # Core TypeScript interfaces (Product, User, Order, Category, etc.)
  hooks.tsx             # useAppDispatch, useAppSelector, useProductStats
  validationSchema.ts   # Zod schemas for registration forms
  metadata.ts           # SEO metadata generators
  utils.ts              # Pagination, password gen, Excel export
  novaPoshta.ts         # Nova Poshta delivery API
  constants.ts          # Feature content, chart colors
```

## Key Patterns

### Authentication

- Multi-role: guest, B2C client, B2B partner (with EDRPOU), admin
- Token stored in Redux Persist → localStorage, set via Axios default headers
- `withAuth()` HOC in `app/service/PrivateRouting.tsx` guards protected routes
- `refreshTokenThunk()` validates persisted token on page load

### API Integration

- All backend calls go through Redux async thunks using `apiIngco` Axios instance
- Base URL from `NEXT_PUBLIC_API` env var
- Currency rates fetched from `/api/currency` (internal route with Monobank/Privat/NBU/Fixer fallback chain)

### State Management

- `persistedMainReducer`: products, categories, pagination, currency rates, shopView
- `persistedAuthReducer`: user, token, isAuthenticated, isB2b, localStorageCart
- `dashboardSlice`: dashboard-specific admin state

### Styling

- Tailwind utility classes throughout, `clsx` for conditional classes
- Custom font: TT Firs Neue (loaded from `lib/fonts/`)
- Mobile-first responsive design
- Custom scrollbar styling (orange/gold theme)

## Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run postbuild    # Generate sitemap (runs after build)
npm run start        # Production server
npm run lint         # ESLint
npm run prettier     # Format all files
```

## Environment Variables

- `NEXT_PUBLIC_API` - Backend API base URL (exposed to client)
- `NEXT_PUBLIC_VIBER_URL`, `NEXT_PUBLIC_TIKTOK_URL`, `NEXT_PUBLIC_TELEGRAM_URL`, `NEXT_PUBLIC_FACEBOOK_URL` - Social links
- `NP_API_URL`, `NP_API_KEY` - Nova Poshta delivery API
- `FIXER_API_KEY` - (optional) Fixer.io currency fallback

## Important Notes

- **Language:** Ukrainian only (hardcoded, no i18n library)
- **No tests:** No testing framework configured
- **Duplicate routes:** Both `(retail-catalog)/` and `retail/` serve similar B2C catalog — `retail/` has sidebar layout
- **MongoDB-style IDs:** Backend migrated to PostgreSQL but types still use `_id: string` (MongoDB convention)
- **`images.domains` is deprecated** in Next.js 14 — should migrate to `images.remotePatterns`
- **react-table v7** is legacy — current version is TanStack Table v8
- **Error handling bug:** 24 thunks use `rejectWithValue(error)` without `return`, causing silent failures
- **Redundant thunk middleware:** `redux-thunk` is manually added but RTK already includes it by default
- **Full issue registry:** See [ISSUES.md](./ISSUES.md) for 60+ documented issues with severity ratings

## Redesign Guidelines & UI Constraints
When implementing catalog or component redesigns:
- **Language & Localization:** Hardcode all UI and badge labels in Ukrainian (e.g. `АКЦІЯ` instead of `SALE`, `НОВИНКА` instead of `NEW`, `НЕ В НАЯВНОСТІ` instead of `OUT OF STOCK` [no badge is rendered for in-stock items], and `АРТИКУЛ` instead of `SKU`).
- **Card Dimensions:** Default cards should have a compact height (`min-h-[380px]`) and a constrained width (`max-w-[340px] mx-auto`).
- **Card Hover:** Expandable card hovers should use `absolute` container positioning to float over items below, preventing the grid cells from pushing adjacent layout elements.
- **B2C View Restrictions:** Do not show Grid/List layout toggle switches for B2C retail customers (only available for B2B wholesale catalog).
- **Grid Layout Density:** Use up to 4 columns on desktop layouts (`xl:grid-cols-4`) to fit compact cards beautifully.
