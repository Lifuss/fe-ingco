# INGCO Frontend — Full Issue Registry

> Generated 2026-04-03. Total issues: **60+**

---

## Table of Contents

- [1. Critical Bugs](#1-critical-bugs)
- [2. SEO — Critical](#2-seo--critical)
- [3. SEO — High Priority](#3-seo--high-priority)
- [4. SEO — Medium Priority](#4-seo--medium-priority)
- [5. SEO — Opportunities](#5-seo--opportunities)
- [6. Redux / State Management](#6-redux--state-management)
- [7. Auth & Security](#7-auth--security)
- [8. Type Safety](#8-type-safety)
- [9. Performance](#9-performance)
- [10. Accessibility](#10-accessibility)
- [11. Code Quality / Smells](#11-code-quality--smells)
- [12. Configuration & Tooling](#12-configuration--tooling)
- [13. Architecture Debt](#13-architecture-debt)

---

## 1. Critical Bugs

### 1.1 Missing `return` on `rejectWithValue()` — 24 instances

Calling `rejectWithValue(error)` without `return` causes the thunk to resolve with `undefined` instead of rejecting. The `.rejected` extraReducers never fire, errors are silently swallowed, and the UI never shows error states.

**Affected thunks:**

| #   | File                                   | Thunk                              | Line  |
| --- | -------------------------------------- | ---------------------------------- | ----- |
| 1   | `lib/appState/main/operations.ts`      | `fetchMainTableDataThunk`          | ~92   |
| 2   |                                        | `getProductByIdThunk`              | ~104  |
| 3   |                                        | `getProductBySlugThunk`            | ~116  |
| 4   |                                        | `fetchCategoriesThunk`             | ~129  |
| 5   |                                        | `fetchHistoryThunk`                | ~151  |
| 6   |                                        | `deleteProductThunk`               | ~163  |
| 7   |                                        | `deleteCategoryThunk`              | ~211  |
| 8   |                                        | `fetchExcelFileThunk`              | ~233  |
| 9   | `lib/appState/user/operation.ts`       | `getUserCartThunk`                 | ~233  |
| 10  |                                        | `getUserRetailCartThunk`           | ~245  |
| 11  |                                        | `addProductToCartThunk`            | ~263  |
| 12  |                                        | `deleteProductFromCartThunk`       | ~298  |
| 13  |                                        | `deleteProductFromRetailCartThunk` | ~315  |
| 14  |                                        | `createOrderThunk`                 | ~340  |
| 15  |                                        | `createRetailOrderThunk`           | ~370  |
| 16  |                                        | `forgotPasswordThunk`              | ~381  |
| 17  | `lib/appState/dashboard/operations.ts` | `createProductThunk`               | ~17   |
| 18  |                                        | `updateProductThunk`               | ~36   |
| 19  |                                        | `fetchUsersThunk`                  | ~70   |
| 20  |                                        | `fetchOrdersThunk`                 | ~191  |
| 21  |                                        | `updateOrderThunk`                 | ~206  |
| 22  |                                        | `updateRetailOrderThunk`           | ~224  |
| 23  |                                        | `fetchUsersStatsThunk`             | ~236  |
| 24  |                                        | `updateSupportTicketThunk`         | check |

**Impact:** Order creation, cart operations, and product fetches can fail without the user ever knowing.

---

### 1.2 Duplicate Redux action type `'product/fetch'`

`lib/appState/main/operations.ts:98` — `getProductByIdThunk` and `getProductBySlugThunk` both register as `'product/fetch'`. Redux only keeps one, so one thunk's lifecycle actions overwrite the other.

---

### 1.3 `.filter()` result not assigned in dashboard slice

`lib/appState/dashboard/slice.ts:~104-108`:

```typescript
state.supportTickets.filter((ticket) => ticket.ticketNumber !== payload);
// Result is discarded — supportTickets never changes
```

**Fix:** `state.supportTickets = state.supportTickets.filter(...)`.

---

### 1.4 Array index `-1` writes in Redux slices

When `findIndex()` returns `-1`, writing to `state.array[-1]` corrupts state silently.

| File                              | Reducer case                   | Line |
| --------------------------------- | ------------------------------ | ---- |
| `lib/appState/main/slice.ts`      | `updateProductThunk.fulfilled` | ~126 |
| `lib/appState/dashboard/slice.ts` | `updateOrderThunk.fulfilled`   | ~82  |
| `lib/appState/dashboard/slice.ts` | `updateUserThunk.fulfilled`    | ~89  |

---

### 1.5 Unsafe `JSON.parse` without try/catch

Will throw and crash the app if localStorage data is corrupted:

| File                             | Line  |
| -------------------------------- | ----- |
| `app/service/PrivateRouting.tsx` | 26–29 |
| `app/(retail-catalog)/page.tsx`  | 30–34 |
| `app/home/layout.tsx`            | 19–23 |

---

## 2. SEO — Critical

### 2.1 `manifest.json` missing (404 on every page load)

`app/layout.tsx:44` references `manifest: '/manifest.json'` but the file does not exist in `/public/`. Every page load produces a 404 request — wastes bandwidth and appears as an error in Lighthouse.

**Fix:** Create `/public/manifest.json`:

```json
{
  "name": "INGCO Ukraine — Професійні інструменти",
  "short_name": "INGCO",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#f97316",
  "background_color": "#ffffff",
  "icons": [{ "src": "/favicon.ico", "sizes": "64x64", "type": "image/x-icon" }]
}
```

---

### 2.2 Hardcoded fake review ratings — Google penalty risk

`app/(retail-catalog)/[productSlug]/page.tsx` and `app/shop/[productSlug]/page.tsx` both embed:

```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.8",
  "reviewCount": "150"
}
```

This is identical on **every** product. Google's Rich Results guidelines explicitly warn against fabricated structured data. Penalty: loss of rich snippets site-wide, or manual action.

**Fix:** Remove `aggregateRating` entirely until real review data exists, or implement actual reviews and pull dynamic values.

---

### 2.3 Auth/user pages included in sitemap

`next-sitemap.config.js` excludes `/dashboard*` and `/api*` but **not**:

| Route             | Should be excluded             |
| ----------------- | ------------------------------ |
| `/auth/login`     | Yes                            |
| `/auth/register`  | Yes                            |
| `/auth/forgot/*`  | Yes                            |
| `/cart`           | Yes                            |
| `/favorites`      | Yes                            |
| `/history`        | Yes                            |
| `/shop/cart`      | Yes                            |
| `/shop/favorites` | Yes                            |
| `/shop/history`   | Yes                            |
| `/shop/export`    | Yes                            |
| `/retail/*`       | Yes (duplicate of root routes) |

These pages have `noindex` in metadata, but including them in the sitemap contradicts the signal and wastes crawl budget.

---

### 2.4 Broken `target` / `rel` attributes on external links

Multiple files use this pattern:

```jsx
target = '_blank noopener noreferrer';
```

This sets `target` to the literal string `"_blank noopener noreferrer"` — the `noopener`/`noreferrer` are **not** applied as `rel` attributes. Links open in a new window without security protection.

| File                         | Lines                |
| ---------------------------- | -------------------- |
| `app/home/contacts/page.tsx` | ~47, ~141            |
| `app/ui/home/Header.tsx`     | social links section |
| `app/ui/Footer.tsx`          | ~62                  |

**Fix:** `target="_blank" rel="noopener noreferrer"` (separate attributes).

---

### 2.5 Multiple H1 tags on every page

`app/layout.tsx:229-233` renders a hidden `<h1>` on every page. Individual pages (product, catalog, etc.) also render their own `<h1>`. Result: 2+ H1 elements per page.

Google recommends a single H1 per page. Multiple H1s dilute heading signals and can confuse crawlers about the page's primary topic.

**Fix:** Remove the hidden H1 from root layout. Each page's own H1 is sufficient.

---

### 2.6 Duplicate breadcrumb schema on product pages

Product pages generate breadcrumb JSON-LD in **two** places:

1. Inside the page component itself (product page schema)
2. Inside the `Breadcrumbs.tsx` UI component

This produces duplicate `BreadcrumbList` schemas — Google may flag this in Search Console as a structured data warning.

---

## 3. SEO — High Priority

### 3.1 Third-party script loaded without `next/script`

`app/layout.tsx:252-254`:

```html
<script async src="https://smartsearch.spefix.com/spefix.js?token=...&lang=uk" />
```

This raw `<script>` tag bypasses Next.js optimizations. Using `next/script` with `strategy="lazyOnload"` defers loading until after the page is interactive, improving LCP and TBT.

---

### 3.2 Hardcoded URLs in Schema.org markup

`app/layout.tsx` schema data hardcodes `https://ingco-service.win` ~15 times instead of using the `SITE_URL` constant from `lib/metadata.ts`. If the domain ever changes, the schema will be wrong.

---

### 3.3 No loading skeletons on product pages — CLS impact

Product pages show `<div>Loading...</div>` or `null` while data loads. This causes **Cumulative Layout Shift (CLS)** when content replaces the placeholder. CLS is a Core Web Vital that directly affects search ranking.

**Fix:** Add skeleton screens matching the final layout dimensions for product detail pages, product lists, and cart tables.

---

### 3.4 `/retail/layout.tsx` has no metadata export

`app/retail/layout.tsx` is a plain client component with no `metadata` or `generateMetadata`. If anyone lands on `/retail/*` routes before redirect, the page has no SEO metadata.

---

### 3.5 `images.domains` deprecated in Next.js 14

`next.config.js:7` uses the deprecated `domains` array. This still works but will be removed in a future version.

**Fix:** Migrate to `remotePatterns`:

```js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'api-ingco-service.win' },
    { protocol: 'https', hostname: 'be-ingco.store' },
    { protocol: 'http', hostname: 'localhost' },
  ],
}
```

---

### 3.6 Hidden H1 is an SEO anti-pattern

`app/layout.tsx:229` — `<h1 className="hidden">`. Google's documentation explicitly warns against hidden text intended to manipulate rankings. While `display:none` / `visibility:hidden` / `sr-only` for accessibility is acceptable, a promotional H1 hidden from users is risky.

---

## 4. SEO — Medium Priority

### 4.1 No `hreflang` tags

The site is Ukrainian-only (`lang="uk"`), but there's no `hreflang` tag confirming this. Adding `<link rel="alternate" hreflang="uk" href="..." />` tells Google definitively which language/region this site targets, preventing it from being shown to wrong-language queries.

---

### 4.2 Opening hours inconsistency

Schema.org markup says `Mo-Fr 08:00-18:00, Sa-Su 09:00-15:00`, but check if the contacts page shows different hours. Inconsistent hours across structured data confuse Google's knowledge panel.

---

### 4.3 No `rel="canonical"` on paginated catalog pages

Product listing pages with `?page=2`, `?page=3` etc. don't set canonical URLs. Google may treat each paginated page as duplicate content.

**Fix:** Set `canonical` to the base URL (without page param) or implement `rel="next"` / `rel="prev"`.

---

### 4.4 No dynamic `lastmod` on static sitemap entries

Static pages (legal, contacts, support) get the build-time `lastmod`. If content changes without a rebuild, Google sees stale dates.

---

### 4.5 Product schema generated in client components

Product JSON-LD is built inside `'use client'` components. While it still renders in HTML (React hydration), generating it in server components or `generateMetadata()` / `layout.tsx` is more reliable for crawlers and avoids hydration mismatches.

---

### 4.6 No structured data for category/listing pages

Category listing pages (`/`, `/shop`) have no `ItemList` or `CollectionPage` schema. Adding `ItemList` schema with product entries enables rich results for category pages.

---

### 4.7 `Cache-Control: public` on user-specific pages

`next.config.js` sets `public, max-age=3600` on `/cart`, `/favorites`, `/history`. These are user-specific pages — caching them publicly can serve stale or wrong user data from CDN edge nodes.

**Fix:** These should be `private, no-cache` or removed from the public cache rules.

---

## 5. SEO — Opportunities

### 5.1 No FAQ schema

If product pages or the support page contain Q&A content, `FAQPage` schema would enable FAQ rich results in Google — significantly increasing SERP real estate.

---

### 5.2 No `Organization` schema (separate from `LocalBusiness`)

Adding a standalone `Organization` schema with logo, social profiles, and contact info helps Google build a knowledge panel for the brand.

---

### 5.3 No `Product` rich snippet for Google Shopping

Product pages have basic `Product` schema but are missing:

- `gtin` / `ean` (barcode field exists but not in schema)
- `sku` (article field exists but not always in schema)
- `brand.name` as structured `Brand` type
- `review` array for individual reviews
- `shippingDetails` for delivery info
- `returnPolicy` for return conditions

Adding these fields unlocks Google Shopping free listings and richer product snippets.

---

### 5.4 No breadcrumb data in Google Search results

While BreadcrumbList schema exists on product pages, verify it's rendering in Google Search Console's Rich Results report. Breadcrumbs in SERPs improve CTR by ~10-30%.

---

### 5.5 No internal linking strategy visible

Category pages don't appear to cross-link related categories. Product pages don't show "related products" or "also viewed" sections. Internal linking is one of the most underused SEO levers for e-commerce.

---

### 5.6 No Open Graph images per product

Products use `product.image` from the backend for OG images, but these may not be optimized for social sharing (1200x630 recommended). Consider generating OG images with product name + price overlay.

---

### 5.7 No `SearchAction` in Google Sitelinks

The `WebSite` schema includes `SearchAction` but verify it produces sitelinks search box in SERPs. The URL template must exactly match the site's search functionality.

---

## 6. Redux / State Management

### 6.1 Redundant `redux-thunk` middleware

`lib/appState/store.ts:43` — `.concat(thunk)` adds thunk middleware manually, but `@reduxjs/toolkit`'s `configureStore` already includes it by default. The thunk runs twice on every async action.

---

### 6.2 Incomplete persist whitelist

`lib/appState/store.ts:25` — Only `token` and `localStorageCart` are persisted for auth. After page refresh, `isAuthenticated`, `user`, and `isB2b` are lost, forcing an unnecessary API call to `refreshTokenThunk` on every page load.

---

### 6.3 Missing `.rejected` handlers in slices

Many thunks have no `.addCase(thunk.rejected, ...)` handler in extraReducers. Even after fixing the missing `return` bug, errors won't update UI state (loading spinners stuck, no error messages).

**Affected:** Check all slices for missing `.rejected` cases, especially for `createOrderThunk`, `createRetailOrderThunk`, `addProductToCartThunk`.

---

## 7. Auth & Security

### 7.1 Client-only route protection

`app/service/PrivateRouting.tsx` — Auth checks run entirely client-side via `useEffect`. Protected pages briefly render `null` or flash before redirect. No Next.js Middleware intercepts unauthorized requests at the edge.

**Risk:** Admin dashboard HTML is shipped to the browser before the client-side check redirects. A user could inspect the response.

**Fix:** Add `middleware.ts` at the project root to check auth tokens server-side.

---

### 7.2 Race condition in `withAuth` HOC

The `useEffect` dispatches `refreshTokenThunk()` (async), but the synchronous checks below it (`if (!isAuthenticated) return null`) run immediately before the thunk resolves. This causes:

- Flash of empty content
- Toast messages that fire before redirect completes (unmounted immediately)
- Potential redirect loops if Redux state updates trigger re-renders

---

### 7.3 Direct DOM manipulation with `innerHTML` — XSS vector

`app/retail/cart/RetailCartTable.tsx:~130-141`:

```typescript
img.innerHTML = `<img src="${imageUrl}" />`;
```

If `imageUrl` contains user-controlled data (e.g., product image URL from backend), this is an XSS vulnerability. Use React state + JSX rendering instead.

---

### 7.4 Token stored in localStorage

Bearer tokens in localStorage are vulnerable to XSS attacks. Any injected script can read `localStorage.getItem('persist:auth')` and exfiltrate the token.

**Mitigation:** Consider `httpOnly` cookies for token storage (requires backend changes).

---

## 8. Type Safety

### 8.1 `any` type usage (selected instances)

| File                                      | Location                         | Issue                            |
| ----------------------------------------- | -------------------------------- | -------------------------------- |
| `app/service/PrivateRouting.tsx:11`       | `[key: string]: any`             | Overly permissive interface      |
| `app/ui/Table.tsx:19`                     | `rowFunction?: (row: any)`       | Untyped callback                 |
| `app/ui/utils/NovaPoshta.tsx:10-48`       | `useState<any[]>`, `(city: any)` | All state and callbacks untyped  |
| `app/shop/table/CartTable.tsx:73`         | `({ row }: any)`                 | Untyped cell renderer            |
| `app/retail/cart/RetailCartTable.tsx:106` | `({ row }: { row: any })`        | Untyped row                      |
| All thunk catch blocks                    | `error: any`                     | Lose TS safety in error handling |

---

### 8.2 `@ts-ignore` usage

| File                                   | Line | Why it's there                      |
| -------------------------------------- | ---- | ----------------------------------- |
| `app/ui/forms/RegisterClient-form.tsx` | ~51  | `registerResponse.error` check      |
| `app/ui/Table.tsx`                     | ~69  | `row.original?.availableCol` access |

These suppress real type errors that should be fixed.

---

### 8.3 MongoDB-style `_id` after PostgreSQL migration

All interfaces in `lib/types.ts` use `_id: string`. If the backend now returns `id: number` (PostgreSQL convention), every type is wrong and TypeScript provides false safety.

---

## 9. Performance

### 9.1 `debounce` recreated every render

`app/ui/utils/NovaPoshta.tsx:25` — `debounce(...)` is called inside the component body without `useCallback`/`useMemo`. A new debounce instance is created on every render, defeating debouncing.

---

### 9.2 Incomplete `useEffect` dependency arrays

Multiple components disable `react-hooks/exhaustive-deps` eslint rule:

| File                                  | Line    |
| ------------------------------------- | ------- |
| `app/service/PrivateRouting.tsx`      | ~46     |
| `app/retail/cart/RetailCartTable.tsx` | ~214    |
| `app/retail/ProductList.tsx`          | (check) |

This causes stale closures where callbacks reference outdated state.

---

### 9.3 Large monolithic components

| Component              | Lines | Should be split into                             |
| ---------------------- | ----- | ------------------------------------------------ |
| `RetailCartTable.tsx`  | ~409  | CartRow, CartSummary, QuantityControl            |
| `CartTable.tsx` (shop) | ~360  | Similar split                                    |
| `AdminOrderModal.tsx`  | ~374  | OrderDetails, StatusForm, ProductList            |
| `AdminProductForm.tsx` | ~346  | FormSections, ImageUpload, CharacteristicsEditor |

---

### 9.4 No Suspense boundaries

No `loading.tsx` files found for route segments (except possibly retail/shop). Next.js App Router uses these for streaming SSR. Without them, the entire page blocks on data loading.

---

### 9.5 No dynamic imports for heavy libraries

`recharts`, `react-slick`, `jsbarcode`, `react-datepicker` are likely bundled into main chunks. These should use `next/dynamic` with `ssr: false` since they're only needed on specific pages.

---

## 10. Accessibility

### 10.1 Buttons without `aria-label`

Cart quantity buttons (`+`, `-`) and delete buttons have no accessible names. Screen readers announce them as blank buttons.

**Locations:** `RetailCartTable.tsx:156-177`, `RetailCartTable.tsx:192`.

---

### 10.2 Missing button `type` attribute

Multiple `<button>` elements lack `type="button"`, defaulting to `type="submit"`. Inside forms, this causes accidental form submissions.

---

### 10.3 `title` attribute used for complex information

`RetailCartTable.tsx:189` uses `title="Сума = кількість * ціна | ..."` for pricing explanation. `title` is not keyboard-accessible and not announced by many screen readers.

---

### 10.4 Sort/filter controls lack focus indication

`app/ui/FiltersBlock.tsx` — Sort buttons don't have visible focus outlines for keyboard navigation.

---

## 11. Code Quality / Smells

### 11.1 Unused imports

| File                                   | Import                                  |
| -------------------------------------- | --------------------------------------- |
| `app/ui/forms/RegisterClient-form.tsx` | `useFormStatus` from `react-dom`        |
| `app/ui/utils/NovaPoshta.tsx`          | `use` from `react`, `set` from `lodash` |

---

### 11.2 Duplicate value in union type

`app/ui/FiltersBlock.tsx:19`:

```typescript
export type sortValueType = 'default' | 'popular' | 'cheep' | 'expensive' | 'popular' | 'name';
//                                                                          ^^^^^^^^^ duplicate
```

Also `'cheep'` is likely a typo for `'cheap'`.

---

### 11.3 Massive thunk boilerplate

Every thunk repeats the same 15-line try/catch/axios-error-check pattern. A single wrapper function would eliminate ~300 lines:

```typescript
const createApiThunk = <T, A>(name: string, apiCall: (arg: A) => Promise<T>) =>
  createAsyncThunk(name, async (arg: A, { rejectWithValue }) => {
    try {
      return await apiCall(arg);
    } catch (error) {
      return rejectWithValue(
        axios.isAxiosError(error)
          ? { message: error.message, code: error.code }
          : { message: String(error) },
      );
    }
  });
```

---

### 11.4 Inconsistent error handling pattern

Some thunks use detailed `errorInfo` objects (`loginThunk`, `registerThunk`), others pass raw errors, and others have no return. There's no unified error shape for the UI to consume.

---

## 12. Configuration & Tooling

### 12.1 Minimal ESLint config

`.eslintrc.json` only extends `next/core-web-vitals`. Missing:

- `@typescript-eslint/no-explicit-any`
- `@typescript-eslint/no-unused-vars`
- `react-hooks/exhaustive-deps` as error (not warning)
- `jsx-a11y/*` accessibility rules
- `no-console` for production builds

---

### 12.2 No testing framework

Zero test files, no Jest/Vitest/Playwright/Cypress configured. For a production e-commerce site handling orders and payments, this is a significant risk.

---

### 12.3 Missing error boundaries

Only `app/retail/error.tsx` and `app/shop/error.tsx` exist. Missing:

- `app/error.tsx` (global fallback)
- `app/dashboard/error.tsx`
- `app/auth/error.tsx`

Unhandled errors in these routes crash the entire page with a white screen.

---

### 12.4 No `robots.txt` source in public/

The robots.txt is generated by `next-sitemap` at build time. If the build fails or is skipped, no robots.txt exists.

---

## 13. Architecture Debt

### 13.1 Duplicate retail routes

Both `app/(retail-catalog)/` and `app/retail/` serve near-identical B2C catalog functionality. `retail/*` routes redirect to root equivalents, but the code is duplicated and maintained separately.

---

### 13.2 Redux for server-state caching

~80% of Redux state (products, categories, orders, users) is server data that's fetched, cached, and refetched manually. This is exactly what TanStack Query (React Query) handles automatically — with caching, background refetching, stale-while-revalidate, and optimistic updates.

Migrating server data to TanStack Query would:

- Eliminate 20+ thunks and their boilerplate
- Fix all `rejectWithValue` bugs by design
- Add automatic retry, refetching, and cache invalidation
- Reduce Redux to only true client state (cart, shopView, UI preferences)

---

### 13.3 Next.js 14 → 15 migration opportunity

Next.js 15 offers:

- Stable Server Actions (replace API routes for mutations)
- Turbopack (10x faster dev builds)
- Partial prerendering (combine static shells with dynamic content)
- Improved caching semantics
- `after()` API for post-response work (analytics, logging)

---

### 13.4 No Server Components for data fetching

Product listings, category sidebars, legal pages, and the product feed are all client components that fetch data via Redux thunks. These could be React Server Components that fetch data directly, eliminating client-side loading states and reducing JavaScript bundle size.

---

_End of issue registry._
