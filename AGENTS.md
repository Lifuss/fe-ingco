# AGENTS.md — INGCO Ukraine E-Commerce Frontend

This file serves as the single centralized source of truth for AI instructions, conventions, and developer guidelines for the INGCO Frontend project.

---

## Project Overview

E-commerce platform for INGCO Ukraine (official tool importer). Supports three user segments:
* **B2C Retail** (guest + registered) - consumer product catalog at `/` and `/retail`
* **B2B Wholesale** (verified businesses) - wholesale catalog at `/shop` with table views and bulk export
* **Admin Dashboard** - full CRM at `/dashboard` (product/order/user/category management, analytics)

* **Live Site:** https://ingco-service.win
* **Backend API:** https://api-ingco-service.win/api (NestJS + PostgreSQL)
* **UI Language:** Ukrainian (all UI text, badges, and alerts are hardcoded in Ukrainian; no i18n library)
* **Currency:** UAH (Ukrainian Hryvnia)

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
app/                          # Next.js App Router
  (retail-catalog)/           # Retail catalog (B2C) - root level
    [productSlug]/            # Product detail pages
    cart/                     # Shopping cart
    favorites/                # Favorite products
    history/                  # Order history
    page.tsx                  # Main catalog page (root /)
  api/                        # API routes (Server Actions)
  auth/                       # Authentication pages (login, register)
  dashboard/                  # Admin dashboard CRM
  home/                       # Public home / marketing pages
  retail/                     # Legacy retail routes (redirects to root)
  ui/                         # Shared UI components
  service/                    # StoreProvider, PrivateRouting/withAuth HOC
  page.tsx                    # Root page - retail catalog
lib/                          # Shared utilities and logic
  appState/                   # Redux store, slices, operations
  fonts/                      # Custom fonts
  types.ts                    # TypeScript type definitions
  definitions.ts              # Type definitions
  validationSchema.ts         # Zod schemas
  constants.ts                # App constants
  utils.ts                    # Utility functions
  novaPoshta.ts               # Nova Poshta API integration
```

---

## Tech Stack

* **Framework:** Next.js 14 (App Router), React 18, TypeScript 5.2
* **State:** Redux Toolkit 2.2 + Redux Persist 6.0 + Redux Thunk 3.1
* **Styling:** Tailwind CSS 3.3 with custom theme
* **Forms:** React Hook Form 7.53 + Zod 3.23 (with `@hookform/resolvers` 3.9)
* **HTTP Client:** Axios 1.6
* **Database Client:** `@vercel/postgres` (PostgreSQL)

---

## Coding Style & Conventions

### TypeScript & Naming
* Use strict mode for TypeScript (configured in `tsconfig.json`).
* Shared types must be defined in `lib/types.ts`. Use interfaces for object shapes and types for unions/intersections.
* **Component Names:** PascalCase (e.g., `ProductCard.tsx`).
* **Helper/Utility Names:** camelCase (e.g., `utils.ts`, `novaPoshta.ts`).
* **Pages & Layouts:** Next.js conventions (e.g., `page.tsx`, `layout.tsx`).

### Component Structure
* Use functional components with TypeScript.
* Prefer `'use client'` directive at the top of client-interactive components.
* Use `'use server'` for Server Actions.
* Export default for page components, and named exports for reusable UI components.
* Keep components small and focused. Extract business logic into custom hooks (`lib/hooks.tsx`) or Redux slices.

### Path Aliases
* `@/*` maps to the project root (e.g., `@/lib/utils`, `@/public/images`).
* `~/*` maps to the `app/` directory (e.g., `~/ui/Button`, `~/shop/ProductTable`).
* Prefer `~/` when importing from `app/` in route groups like `(retail-catalog)`.

---

## Styling Guidelines

### Tailwind CSS & Colors
* Use Tailwind CSS utility classes. Avoid inline styles.
* Use `@tailwindcss/forms` for form styling.
* **Theme Colors:**
  * `primary`: `#f59e0b` (Orange/Gold theme)
  * `secondary`: `#9ca3af`
  * `nonActive`: `#667085`
  * Custom blue shades: `blue-400` (`#2589FE`), `blue-500` (`#0070F3`), `blue-600` (`#2F6FEB`)
  * `orangeLight`: `#fbbf24`
* Use `clsx` or `tailwind-merge` for conditional classes.
* Use Lucide icons (`lucide-react`).

### Redesign & UI Constraints
* **Language & Localization:** Hardcode all UI and badge labels in Ukrainian (e.g., `АКЦІЯ` instead of `SALE`, `НОВИНКА` instead of `NEW`, `НЕ В НАЯВНОСТІ` instead of `OUT OF STOCK`, and `АРТИКУЛ` instead of `SKU`).
* **Card Dimensions:** Default cards should have a compact height (`min-h-[380px]`) and a constrained width (`max-w-[340px] mx-auto`).
* **Card Hover:** Expandable card hovers should use `absolute` container positioning to float over items below, preventing the grid cells from pushing adjacent layout elements.
* **B2C View Restrictions:** Do not show Grid/List layout toggle switches for B2C retail customers (only available for B2B wholesale catalog).
* **Grid Layout Density:** Use up to 4 columns on desktop layouts (`xl:grid-cols-4`) to fit compact cards beautifully.

---

## Architecture Patterns

### Next.js 14 App Router
* Use `page.tsx` for route pages, `layout.tsx` for shared layouts, `error.tsx` for error boundaries, and `not-found.tsx` for 404 pages.
* Use route groups `(retail-catalog)` to organize B2C routes without affecting URL structure.
* Use Next.js Metadata API for page metadata and SEO.
* Implement structured data (JSON-LD) in layouts for search engine optimization.

### Redux State Management
* **Store location:** `lib/appState/store.ts`.
* **Slices:** `lib/appState/{feature}/slice.ts`.
* **Async operations:** `lib/appState/{feature}/operations.ts` using `createAsyncThunk`.
* **Redux Persist Configuration:**
  * Main slice persists: `currencyRates`, `shopView`.
  * Auth slice persists: `token`, `localStorageCart`.
* **Thunk Pattern:** Always handle API errors in Redux thunks using `rejectWithValue(error)`.
  ```typescript
  export const fetchDataThunk = createAsyncThunk(
    'feature/fetchData',
    async (params, { rejectWithValue }) => {
      try {
        const response = await apiIngco.get('/endpoint', { params });
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Error');
      }
    }
  );
  ```

### API Communication
* All backend calls go through Redux async thunks using the `apiIngco` Axios instance.
* Base URL from `NEXT_PUBLIC_API` environment variable.
* Token management: Use `setToken()` and `clearToken()` helper functions to manage the Bearer token in the Axios default headers.
* Use Server Actions for sensitive database operations and form submissions.

### Form Handling
* Use React Hook Form with Zod validation.
* Define schemas in `lib/validationSchema.ts` for reuse.
* Provide user-friendly validation error messages in Ukrainian.
  ```typescript
  import { useForm } from 'react-hook-form';
  import { zodResolver } from '@hookform/resolvers/zod';
  import { z } from 'zod';

  const schema = z.object({ /* ... */ });
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  ```

---

## Best Practices

* **Performance:**
  * Use Next.js `Image` component (handles lazy loading, sizing, and formats by default).
  * WebP and AVIF formats are preferred.
  * Use `next/dynamic` for code splitting when loading heavy client components.
* **Security:**
  * Never expose sensitive API keys or credentials in client components.
  * Use environment variables for secrets.
* **Error Handling:**
  * Always use try-catch block around asynchronous operations.
  * Inform users of errors using toast notifications via `react-toastify`.

---

## AI Browser Testing Credentials

Use the following credentials when running browser-based tests, automated flows, or navigating secure parts of the site:
* **Login/Username:** `arsen`
* **Password:** `123456A`
