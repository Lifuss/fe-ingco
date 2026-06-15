# AGENTS.md — INGCO Ukraine E-Commerce Frontend

This file serves as the single centralized source of truth for AI instructions, conventions, and developer guidelines for the INGCO Frontend project.

---

## Project Overview

E-commerce platform for INGCO Ukraine (official tool importer). Supports three user segments:

- **B2C Retail** (guest + registered) - consumer product catalog at `/` and `/retail`
- **B2B Wholesale** (verified businesses) - wholesale catalog at `/` (for authenticated B2B users) with table views and bulk export
- **Admin Dashboard** - full CRM at `/dashboard` (product/order/user/category management, analytics)

- **Live Site:** https://ingco-service.win
- **Backend API:** https://api-ingco-service.win/api (NestJS + PostgreSQL)
- **UI Language:** Ukrainian (all UI text, badges, and alerts are hardcoded in Ukrainian; no i18n library)
- **Currency:** UAH (Ukrainian Hryvnia)

---

## Quick Commands

Run these commands in the workspace root:

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

## Project Structure

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
    api/                        # Next.js API routes
    auth/                       # Authentication pages (login, register, forgot)
    dashboard/                  # Admin dashboard CRM
      tables/                   # Data table views (ProductTable, CategoryTable, etc.)
      Sidebar.tsx               # Dashboard navigation sidebar
      layout.tsx                # Dashboard layout with sidebar
    legal/                      # Legal pages (cookies, offer, privacy, returns, shipping, terms)
    service/                    # StoreProvider, PrivateRouting/withAuth HOC
    ui/                         # Shared UI components
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
    layout.tsx                  # Root layout with providers
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
    metadata.ts                 # Next.js metadata helpers
    novaPoshta.ts               # Nova Poshta delivery API integration
  proxy.ts                      # Next.js middleware — protects /dashboard (admin-only) and
                                # injects auth state into request headers for SSR
```

---

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript 5.x
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

## Coding Style & Conventions

### TypeScript & Naming

- Use strict mode for TypeScript (configured in `tsconfig.json`).
- Shared types must be defined in `lib/types.ts`. Use interfaces for object shapes and types for unions/intersections.
- **Component Names:** PascalCase (e.g., `ProductCard.tsx`).
- **Helper/Utility Names:** camelCase (e.g., `utils.ts`, `novaPoshta.ts`).
- **Pages & Layouts:** Next.js conventions (e.g., `page.tsx`, `layout.tsx`).

### Component Structure

- Use functional components with TypeScript.
- Prefer `'use client'` directive at the top of client-interactive components.
- Use `'use server'` for Server Actions.
- Export default for page components, and named exports for reusable UI components.
- Keep components small and focused. Extract business logic into custom hooks (`lib/hooks.tsx`) or Redux slices.

### Path Aliases

- `@/*` maps to the project root (e.g., `@/lib/utils`, `@/public/images`).
- `~/*` maps to the `app/` directory (e.g., `~/ui/buttons/Button`, `~/ui/product/ShopTable`).
- Prefer `~/` when importing from `app/` in route groups like `(retail-catalog)`.

---

## Styling Guidelines

### Tailwind CSS & Colors

- Use Tailwind CSS utility classes. Avoid inline styles.
- Use `@tailwindcss/forms` for form styling.
- **Theme Colors:**
  - `primary`: `#f59e0b` (Orange/Gold theme)
  - `secondary`: `#9ca3af`
  - `nonActive`: `#667085`
  - Custom blue shades: `blue-400` (`#2589FE`), `blue-500` (`#0070F3`), `blue-600` (`#2F6FEB`)
  - `orangeLight`: `#fbbf24`
- Use `clsx` or `tailwind-merge` for conditional classes.
- Use Lucide icons (`lucide-react`).

### Redesign & UI Constraints

- **Language & Localization:** Hardcode all UI and badge labels in Ukrainian (e.g., `АКЦІЯ` instead of `SALE`, `НОВИНКА` instead of `NEW`, `НЕ В НАЯВНОСТІ` instead of `OUT OF STOCK`, and `АРТИКУЛ` instead of `SKU`).
- **Card Dimensions:** Default cards should have a compact height (`min-h-[380px]`) and a constrained width (`max-w-[340px] mx-auto`).
- **Card Hover:** Expandable card hovers should use `absolute` container positioning to float over items below, preventing the grid cells from pushing adjacent layout elements.
- **B2C View Restrictions:** Do not show Grid/List layout toggle switches for B2C retail customers (only available for B2B wholesale catalog).
- **Grid Layout Density:** Use up to 4 columns on desktop layouts (`xl:grid-cols-4`) to fit compact cards beautifully.

---

## Architecture Patterns

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
  - Auth slice persists: `token`, `localStorageCart`.
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

## Best Practices

- **Performance:**
  - Use Next.js `Image` component (handles lazy loading, sizing, and formats by default).
  - WebP and AVIF formats are preferred.
  - Use `next/dynamic` for code splitting when loading heavy client components.
- **Security:**
  - Never expose sensitive API keys or credentials in client components.
  - Use environment variables for secrets.
- **Error Handling:**
  - Always use try-catch block around asynchronous operations.
  - Inform users of errors using toast notifications via `react-toastify`.

---

## Common Mistakes to Avoid

- **Never use inline styles** — always use Tailwind CSS utility classes.
- **Never use the `pages/` router** — this project uses App Router exclusively.
- **Never add new state management solutions** — use Redux Toolkit only.
- **Never translate UI text to English** — all labels, badges, toasts, and messages must be in Ukrainian.
- **Never call the backend API directly in components** — always dispatch a Redux thunk.
- **Never use raw `error.response?.data?.message` in `rejectWithValue`** — use `serializeAxiosError(error)` to prevent non-serializable Redux state warnings.
- **Do not remove the `'use no memo'` directive** from files using `@tanstack/react-table` — it disables React Compiler memoization which breaks TanStack Table's internal state.
- **Do not create pages inside `app/ui/`** — `ui/` is for reusable components only; pages go in their route directories.
- **Do not manually sort Tailwind classes** — `prettier-plugin-tailwindcss` handles class order automatically on every `npm run prettier` run.

---

## AI Browser Testing Credentials

Use the following credentials when running browser-based tests, automated flows, or navigating secure parts of the site:

- **Login/Username:** `arsen`
- **Password:** `123456A`
