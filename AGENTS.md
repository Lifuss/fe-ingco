# AGENTS.md — INGCO Ukraine E-Commerce Frontend

> **Stack**: Next.js 16.2.3 · React 19 · Redux Toolkit 2.11 · Tailwind CSS 4 · shadcn v4 · TypeScript 5  
> **Deploy target**: Vercel  
> **Language**: TypeScript (strict)

---

## 1. Project Overview

E-commerce platform for INGCO Ukraine (official tool importer). Supports three user segments:

- **B2C Retail** (guest + registered) — consumer product catalog at `/` and `/retail`
- **B2B Wholesale** (verified businesses) — wholesale catalog at `/` (for authenticated B2B users) with table views and bulk export
- **Admin Dashboard** — full CRM at `/dashboard` (product/order/user/category management, analytics)

| Resource        | URL                                                                                     |
| --------------- | --------------------------------------------------------------------------------------- |
| **Live Site**   | https://ingcoua.com.ua                                                                  |
| **Backend API** | https://api-ingco-service.win/api (NestJS + PostgreSQL)                                 |
| **UI Language** | Ukrainian (all UI text, badges, and alerts are hardcoded in Ukrainian; no i18n library) |
| **Currency**    | UAH (Ukrainian Hryvnia)                                                                 |

---

## 2. Quick Commands

```bash
npm run dev          # Start development server
npm run build        # Create production build
npm run postbuild    # Generate sitemap (runs automatically after build)
npm run start        # Run production server
npm run lint         # Run ESLint check
npm run prettier     # Format all files
npm run prettier:check # Verify formatting
```

---

## 3. Project Structure

```
src/
  app/                          # Next.js App Router
    (retail-catalog)/           # B2C retail catalog route group (root /)
      [productSlug]/            # Dynamic product detail pages
      cart/                     # Shopping cart page
      export/                   # B2B product export page
      favorites/                # Favorite products page
      history/                  # Order history page
      layout.tsx                # Shared catalog layout
      page.tsx                  # Main catalog page (root /)
    about-us/                   # About us pages (contacts, partnership, support)
    api/                        # Next.js API routes (currency, feed)
    auth/                       # Authentication pages (login, register, forgot)
    dashboard/                  # Admin dashboard CRM
      tables/                   # Data table views (ProductTable, CategoryTable, etc.)
      Sidebar.tsx               # Dashboard navigation sidebar
      layout.tsx                # Dashboard layout with sidebar
    legal/                      # Legal pages (cookies, offer, privacy, returns, shipping, terms)
    service/                    # StoreProvider, PrivateRouting/withAuth HOC
    ui/                         # Shared UI components (NOT for pages)
      buttons/                  # Button components
      catalog/                  # Catalog-specific components (CatalogSidebar, FiltersBlock)
      dashboard/                # Dashboard-specific components
      forms/                    # Form components (AdminProductForm, CategoryForm, etc.)
      header/                   # Header components
      home/                     # Marketing/home section UI components (Hero, FAQ, etc.)
      modals/                   # Modal dialog components
      product/                  # Product display components (ProductCard, CartTable, etc.)
      skeletons/                # Loading skeleton components
    globals.css                 # Global styles (Tailwind + custom CSS variables)
    layout.tsx                  # Root layout with providers, SEO, JSON-LD schemas
  lib/                          # Shared utilities and logic
    appState/                   # Redux store, slices, operations
      store.ts                  # Redux store configuration
      main/                     # Main slice (products, categories, currency rates)
      dashboard/                # Dashboard slice (orders, users, stats, support)
      user/                     # User/auth slice (auth, cart, favorites)
    types.ts                    # TypeScript type definitions
    definitions.ts              # Additional type definitions
    validationSchema.ts         # Zod validation schemas
    constants.ts                # App-wide constants (contacts, config)
    utils.ts                    # Utility functions
    hooks.tsx                   # Custom React hooks
    metadata.ts                 # Next.js metadata helpers (SITE_URL, SITE_NAME)
    novaPoshta.ts               # Nova Poshta delivery API integration
  proxy.ts                      # Next.js middleware — route protection (see section 8)
```

---

## 4. Tech Stack

- **Framework:** Next.js 16.2.3 (App Router), React 19, TypeScript 5
- **State:** Redux Toolkit 2.11 + Redux Persist 6.0 + Redux Thunk 3.1
- **Styling:** Tailwind CSS 4 with custom theme; `prettier-plugin-tailwindcss` **auto-sorts Tailwind class order** on every format run
- **UI Components:** shadcn v4 (Radix UI primitives); `class-variance-authority` for component variants
- **Tables:** `@tanstack/react-table` v8 — used in all admin dashboard tables (always wrap with `'use no memo'` directive)
- **Charts:** `recharts` v3 — used in dashboard analytics/diagrams
- **Forms:** React Hook Form 7.72 + Zod 4.3 (with `@hookform/resolvers` 5.2)
- **HTTP Client:** Axios 1.15 (custom `apiIngco` instance in `src/lib/appState/user/operation.ts` with auth + refresh interceptors)
- **Database:** `@vercel/postgres` (PostgreSQL for Nova Poshta city/branch data)
- **Icons:** `lucide-react`
- **Carousel/Slider:** `react-slick` + `slick-carousel`
- **Select:** `react-select` (used in category and product selectors)
- **Modals:** `react-modal`
- **Notifications:** `react-toastify` (always use for user-facing errors and success messages)
- **Utilities:** `lodash`, `clsx`, `tailwind-merge`, `use-debounce`
- **Barcodes:** `jsbarcode` (used in export/B2B features)

---

## 5. Next.js 16 — Directives & Best Practices

### Server vs Client Components

- **Default is Server Component.** Every `.tsx` file under `src/app/` is a Server Component unless explicitly marked.
- Add `'use client'` **only** when the component requires React hooks, browser APIs, or event handlers.
- **Keep `'use client'` at the leaf level.** Push it down to the smallest component that needs interactivity.

### Async Dynamic APIs (CRITICAL)

In Next.js 16, the following APIs return **Promises** and **must be awaited**:

```tsx
// ✅ Correct — params are async
export default async function ProductPage({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) {
  const { productSlug } = await params;
}

// ✅ Correct — searchParams are async
export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string; category?: string }>;
}) {
  const { query, page, category } = await searchParams;
}
```

This also applies to: `cookies()`, `headers()`, `draftMode()`.

### Metadata & SEO

- Export `metadata` from `layout.tsx` or `page.tsx` using the `Metadata` type from `next`.
- Never set `<title>` or `<meta>` tags manually in JSX.
- JSON-LD structured data (LocalBusiness, WebSite, Product) is implemented in `layout.tsx` via `dangerouslySetInnerHTML`.
- Use helpers from `lib/metadata.ts` (`SITE_URL`, `SITE_NAME`) for consistency.

### Image Handling

- Use Next.js `Image` component — WebP and AVIF formats are configured in `next.config.ts`.
- Remote patterns are configured for `localhost:8080` and `api-ingco-service.win`.
- Use `next/dynamic` for code splitting when loading heavy client components.

---

## 6. Coding Style & Conventions

### TypeScript & Naming

- Use strict mode for TypeScript (configured in `tsconfig.json`).
- Shared types must be defined in `lib/types.ts`. Use interfaces for object shapes and types for unions/intersections.
- **Component Names:** PascalCase (e.g., `ProductCard.tsx`).
- **Helper/Utility Names:** camelCase (e.g., `utils.ts`, `novaPoshta.ts`).
- **Pages & Layouts:** Next.js conventions (e.g., `page.tsx`, `layout.tsx`).
- **Comments & JSDoc Language:** All code comments and JSDoc documentation must be written in English. Illustrative examples in quotes (e.g., Ukrainian search terms like `'акумулятор'`) may remain in Ukrainian.

### Path Aliases

- `@/*` maps to the project root (e.g., `@/lib/utils`, `@/public/images`).
- `~/*` maps to the `app/` directory (e.g., `~/ui/buttons/Button`, `~/ui/product/ShopTable`).
- Prefer `~/` when importing from `app/` in route groups like `(retail-catalog)`.

### Component Structure

- Use functional components with TypeScript.
- Prefer `'use client'` directive at the top of client-interactive components.
- Use `'use server'` for Server Actions.
- Export default for page components, and named exports for reusable UI components.
- Keep components small and focused. Extract business logic into custom hooks (`lib/hooks.tsx`) or Redux slices.

---

## 7. Styling Guidelines

### Tailwind CSS & Colors

- Use Tailwind CSS utility classes. Avoid inline styles.
- **Theme Colors:**
  - `primary`: `#f59e0b` (Orange/Gold theme)
  - `secondary`: `#9ca3af`
  - `nonActive`: `#667085`
  - Custom blue shades: `blue-400` (`#2589FE`), `blue-500` (`#0070F3`), `blue-600` (`#2F6FEB`)
  - `orangeLight`: `#fbbf24`
- Use `clsx` or `tailwind-merge` for conditional classes.
- Use Lucide icons (`lucide-react`).
- Class order is auto-sorted by `prettier-plugin-tailwindcss` — do not manually reorder.

### Redesign & UI Constraints

- **Language & Localization:** Hardcode all UI and badge labels in Ukrainian (e.g., `АКЦІЯ` instead of `SALE`, `НОВИНКА` instead of `NEW`, `НЕ В НАЯВНОСТІ` instead of `OUT OF STOCK`, and `АРТИКУЛ` instead of `SKU`).
- **Card Dimensions:** Default cards should have a compact height (`min-h-[380px]`) and a constrained width (`max-w-[340px] mx-auto`).
- **Card Hover:** Expandable card hovers should use `absolute` container positioning to float over items below, preventing the grid cells from pushing adjacent layout elements.
- **B2C View Restrictions:** Do not show Grid/List layout toggle switches for B2C retail customers (only available for B2B wholesale catalog).
- **Grid Layout Density:** Use up to 4 columns on desktop layouts (`xl:grid-cols-4`) to fit compact cards beautifully.

---

## 8. Architecture Patterns

### Route Protection — `proxy.ts` Middleware

The file `src/proxy.ts` is a Next.js middleware that:

1. **Protects `/dashboard`** — redirects to `/` if no `token` cookie or `role` cookie is not `admin`.
2. **Protects `/export`** — redirects to `/auth/login` if no `token` cookie (authenticated users only).
3. **Matcher**: Only runs for `/dashboard/:path*` and `/export/:path*`.

### Next.js App Router

- Use `page.tsx` for route pages, `layout.tsx` for shared layouts, `error.tsx` for error boundaries, and `not-found.tsx` for 404 pages.
- Use route groups `(retail-catalog)` to organize B2C routes without affecting URL structure.
- Use Next.js Metadata API for page metadata and SEO.
- Implement structured data (JSON-LD) in layouts for search engine optimization.

### Redux State Management

- **Store location:** `lib/appState/store.ts`.
- **Slices:** `lib/appState/{feature}/slice.ts`.
- **Async operations:** `lib/appState/{feature}/operations.ts` using `createAsyncThunk`.
- **Redux Persist Configuration:**
  - Main slice persists: `currencyRates`, `shopView`.
  - Auth slice persists: `token`, `localStorageCart`, `user`, `isAuthenticated`, `isB2b`.
- **Thunk Pattern:** Always use `serializeAxiosError()` in `rejectWithValue` to avoid Redux non-serializable value warnings.

  ```typescript
  import { serializeAxiosError } from '@/lib/appState/user/operation';

  export const fetchDataThunk = createAsyncThunk(
    'feature/fetchData',
    async (params, { rejectWithValue }) => {
      try {
        const response = await apiIngco.get('/endpoint', { params });
        return response.data;
      } catch (error) {
        return rejectWithValue(serializeAxiosError(error));
      }
    },
  );
  ```

### API Communication

- All backend calls go through Redux async thunks using the `apiIngco` Axios instance.
- Base URL from `NEXT_PUBLIC_API` environment variable.
- Token management: Use `setToken()` and `clearToken()` helper functions to manage the Bearer token in the Axios default headers.
- Use Server Actions for sensitive database operations and form submissions.

### Form Handling

- Use React Hook Form with Zod validation.
- Define schemas in `lib/validationSchema.ts` for reuse.
- Provide user-friendly validation error messages in Ukrainian.

  ```typescript
  import { useForm } from 'react-hook-form';
  import { zodResolver } from '@hookform/resolvers/zod';
  import { z } from 'zod';

  const schema = z.object({
    /* ... */
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  ```

---

## 9. Environment Variables

| Variable                   | Required | Exposed to Client | Description                                          |
| -------------------------- | -------- | ----------------- | ---------------------------------------------------- |
| `NEXT_PUBLIC_API`          | ✅       | ✅                | Backend API base URL (e.g., `http://localhost:8080`) |
| `NEXT_PUBLIC_VIBER_URL`    | ❌       | ✅                | Viber community link                                 |
| `NEXT_PUBLIC_TIKTOK_URL`   | ❌       | ✅                | TikTok profile link                                  |
| `NEXT_PUBLIC_TELEGRAM_URL` | ❌       | ✅                | Telegram group link                                  |
| `NEXT_PUBLIC_FACEBOOK_URL` | ❌       | ✅                | Facebook page link                                   |
| `NP_API_URL`               | ❌       | ❌                | Nova Poshta API endpoint                             |
| `NP_API_KEY`               | ❌       | ❌                | Nova Poshta API key                                  |
| `POSTGRES_URL`             | ❌       | ❌                | Vercel Postgres URL (for Nova Poshta data)           |

---

## 10. Anti-Patterns — What NOT To Do

### ❌ Next.js Anti-Patterns

| Anti-Pattern                                                             | Why It's Wrong                                                                         | Do This Instead                                                                 |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Forgetting `await` on `params`, `searchParams`, `cookies()`, `headers()` | Next.js 16 made these async — unawaited access returns a Promise object, not the value | Always `const { slug } = await params`                                          |
| Putting `'use client'` on layout or page that only fetches data          | Disables server rendering, inflates client bundle                                      | Keep layouts/pages as Server Components; push `'use client'` to leaf components |
| Using the `pages/` router                                                | This project uses App Router exclusively — Pages Router APIs don't exist               | Use `page.tsx`, `layout.tsx`, `route.ts` under `app/`                           |
| Creating pages inside `app/ui/`                                          | `ui/` is for reusable components only — Next.js will treat files there as routes       | Put pages in their proper route directories                                     |

### ❌ React / Redux Anti-Patterns

| Anti-Pattern                                                     | Why It's Wrong                                                    | Do This Instead                                                        |
| ---------------------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Calling the backend API directly in components                   | Bypasses token interceptors, breaks consistency                   | Always dispatch a Redux thunk using the `apiIngco` instance            |
| Using raw `error.response?.data?.message` in `rejectWithValue`   | Non-serializable values cause Redux warnings and break DevTools   | Use `serializeAxiosError(error)`                                       |
| Adding new state management solutions                            | Multiple state libs create sync bugs and confusion                | Use Redux Toolkit only                                                 |
| Removing the `'use no memo'` directive from TanStack Table files | React Compiler memoization breaks TanStack Table's internal state | Keep `'use no memo'` at the top of files using `@tanstack/react-table` |
| Using `index` as `key` for dynamic lists with mutations          | Causes incorrect DOM diffing, ghost elements, state leaking       | Use a stable unique ID (`item.id`, `item.article`)                     |

### ❌ Styling Anti-Patterns

| Anti-Pattern                      | Why It's Wrong                                                  | Do This Instead                              |
| --------------------------------- | --------------------------------------------------------------- | -------------------------------------------- |
| Using inline styles               | Not cacheable, hard to override, no hover/media support         | Use Tailwind CSS utility classes             |
| Manually sorting Tailwind classes | `prettier-plugin-tailwindcss` handles class order automatically | Let Prettier auto-sort on `npm run prettier` |
| Translating UI text to English    | All labels, badges, toasts, and messages must be in Ukrainian   | Hardcode Ukrainian strings everywhere        |

---

## 11. Project-Scoped Rules & Patterns

### 11.1 TypeScript & Type Safety — Type Narrowing for Disjoint User Types
When extracting customer details from orders or accounts, always distinguish between `UserWithoutAuth` and `UserWithAuth` explicitly:
- Use `'userId' in user` to narrow to `UserWithAuth` (where profile fields are under `user.userId`).
- Use `'firstName' in user` to narrow to `UserWithoutAuth` (where profile fields are flat on the root).

```typescript
// ✅ Correct Type-safe pattern
if (order.user) {
  if ('userId' in order.user && order.user.userId) {
    const profile = order.user.userId;
    name = `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
  } else if ('firstName' in order.user) {
    const profile = order.user;
    name = `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
  } else {
    name = order.user.login;
  }
}
```

### 11.2 UI/UX & Routing Patterns — URL-Bound CRM Filter State
All table filters (tabs, status selects, search strings, page offsets) in the admin dashboard CRM must be stored in the URL search parameters (`searchParams`):
- Read filter values directly from the URL using `searchParams.get()`.
- Update filters by pushing new parameters to the router via `router.push()`.
- Reset the active `page` offset back to `1` whenever other filters change.
- Do not store transient filters in Redux/React local state unless they are completely non-shareable.

---

## 12. AI Browser Testing Credentials

Use the following credentials when running browser-based tests, automated flows, or navigating secure parts of the site:

- **Login/Username:** `arsen`
- **Password:** `123456A`
