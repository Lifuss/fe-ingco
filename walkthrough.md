# Walkthrough — P0 & P1 Issue Resolutions

This document provides a walkthrough of the changes implemented to address all **P0 (Critical & Security)** and **P1 (High Priority — State & Indexing)** issues.

---

## Part 1: P0 Resolutions (Completed)

### 1. State Management & Logical Bugs

- **Thunk Reject Returns:** Added `return` prefix to `rejectWithValue` inside catch blocks for 23 thunks across main, user, and dashboard operations.
- **Support Tickets Filter Bug:** Assigned the filtered result of `supportTickets` to update the slice state in [dashboard/slice.ts](file:///f:/code/repos/fe-ingco/src/lib/appState/dashboard/slice.ts).
- **Index `-1` Safety Guards:** Wrapped state index updates in `if (index !== -1)` conditions to prevent corrupting state array values in both [dashboard/slice.ts](file:///f:/code/repos/fe-ingco/src/lib/appState/dashboard/slice.ts) and [main/slice.ts](file:///f:/code/repos/fe-ingco/src/lib/appState/main/slice.ts).
- **Rejected Loading State Reset:** Added a matcher in [user/slice.ts](file:///f:/code/repos/fe-ingco/src/lib/appState/user/slice.ts) to reset `state.isLoading` to `false` on thunk rejections.

### 2. XSS DOM Vulnerability Refactoring

- Refactored hover popup rendering logic in [RetailCartTable.tsx](file:///f:/code/repos/fe-ingco/src/app/retail/cart/RetailCartTable.tsx), [CartTable.tsx](file:///f:/code/repos/fe-ingco/src/app/shop/table/CartTable.tsx), and [ShopTable.tsx](file:///f:/code/repos/fe-ingco/src/app/shop/table/ShopTable.tsx).
- Replaced dangerous `innerHTML` assignments with safe DOM node creation (`document.createElement('img')`) and element replacing (`replaceChildren(imgTag)`).

### 3. SEO Integrity Adjustments

- **Fake Ratings Removal:** Removed the static rating values from the root [layout.tsx](file:///f:/code/repos/fe-ingco/src/app/layout.tsx) and B2B product [page.tsx](file:///f:/code/repos/fe-ingco/src/app/shop/[productSlug]/page.tsx).
- **Hidden Heading Clean Up:** Deleted the hidden promotional `<h1>` tag in root [layout.tsx](file:///f:/code/repos/fe-ingco/src/app/layout.tsx).

---

## Part 2: P1 Resolutions (Completed)

### 4. B2B & Admin Route Protection on Server (P1-2)

- Created [src/proxy.ts](file:///f:/code/repos/fe-ingco/src/proxy.ts) using the new **Next.js 16** server-side proxy middleware convention to protect `/dashboard` and `/shop` routes at the server level.
- Updated authentication operations in [user/operation.ts](file:///f:/code/repos/fe-ingco/src/lib/appState/user/operation.ts) to write `token` and `role` cookies to the browser when the user logs in, registers, or refreshes their token, and clear them on logout.

### 5. Private Cache-Control Headers (P1-1)

- Updated [next.config.ts](file:///f:/code/repos/fe-ingco/next.config.ts) headers configuration to set `Cache-Control: private, no-cache, no-store, must-revalidate` for user-specific routes (`/cart`, `/favorites`, `/history` for both retail and shop layouts), preventing edge CDN servers from caching personal cart or order data.

### 6. App Manifest and Sitemap Exclusions (P1-3, P1-6)

- **Manifest.json:** Created [public/manifest.json](file:///f:/code/repos/fe-ingco/public/manifest.json) to resolve Lighthouse/sitemap generation 404 errors.
- **Sitemap Cleanup:** Excluded private and auth paths (`/cart`, `/favorites`, `/history`, `/auth*`, `/retail*`) in [next-sitemap.config.js](file:///f:/code/repos/fe-ingco/next-sitemap.config.js) to avoid indexing user-specific or duplicate pages.

### 7. Try/Catch LocalStorage Protection (P1-4)

- Wrapped raw `JSON.parse(localStorage.getItem('persist:auth'))` parser calls inside `try/catch` blocks in [PrivateRouting.tsx](file:///f:/code/repos/fe-ingco/src/app/service/PrivateRouting.tsx) and [layout.tsx](file:///f:/code/repos/fe-ingco/src/app/about-us/layout.tsx) to prevent app crashes due to malformed storage content.

### 8. Whitelist State Hydration (P1-5)

- Extended the Redux Persist whitelist config in [store.ts](file:///f:/code/repos/fe-ingco/src/lib/appState/store.ts) to include `user`, `isAuthenticated`, and `isB2b`. Rehydrating auth status avoids unnecessary background refresh flashes on initial mounts.

### 9. Thunk Action Collision Renaming (P1-7)

- Renamed the Redux action type string inside `getProductBySlugThunk` in [main/operations.ts](file:///f:/code/repos/fe-ingco/src/lib/appState/main/operations.ts) to `'product/fetchBySlug'`, resolving the type name conflict with `getProductByIdThunk`.

### 10. Safeguarding Next.js Image source URLs (Guest Cart Crash Fix)

- **Problem:** When navigating to the cart page as a guest, the app crashed because some products in the local storage cart did not have the `image` attribute populated or it was undefined, leading to string concatenation: `https://api-ingco-service.winundefined`. This hostname was invalid and not whitelisted in Next.js config, causing a fatal runtime error.
- **Solution:** Added fallback checks (`product.image ? ... : '/placeholder.webp'`) to prevent Next.js image loading errors.
- **Similar Issues Resolved:** Audited and fixed all other occurrences in the codebase:
  - [RetailCartTable.tsx](file:///f:/code/repos/fe-ingco/src/app/retail/cart/RetailCartTable.tsx) (Guest cart table page)
  - [CartTable.tsx](file:///f:/code/repos/fe-ingco/src/app/shop/table/CartTable.tsx) (B2B cart table page)
  - [ShopTable.tsx](file:///f:/code/repos/fe-ingco/src/app/shop/table/ShopTable.tsx) (B2B shop catalog page)
  - [ProductCard.tsx](file:///f:/code/repos/fe-ingco/src/app/ui/product/ProductCard.tsx) (Catalog product grid cards)
  - [ProductModal.tsx](file:///f:/code/repos/fe-ingco/src/app/ui/modals/ProductModal.tsx) (Product preview popup modal)
  - [page.tsx](file:///f:/code/repos/fe-ingco/src/app/shop/[productSlug]/page.tsx) (B2B product details page)
  - [page.tsx](<file:///f:/code/repos/fe-ingco/src/app/(retail-catalog)/[productSlug]/page.tsx>) (B2C product details page)
  - [metadata.ts](file:///f:/code/repos/fe-ingco/src/lib/metadata.ts) (SEO Product metadata schema tags)
  - [route.ts](file:///f:/code/repos/fe-ingco/src/app/api/feed/prom/route.ts) (XML catalog feeds)
  - [HotOffers.tsx](file:///f:/code/repos/fe-ingco/src/app/ui/home/HotOffers.tsx) (Home slider carousel cards)

### 11. Legacy LocalStorage Cart Items Handling & Accessibility Warning Fixes

- **Problem:** Users with legacy carts in their browser's `localStorage` had items where `productId` was a simple string ID instead of a populated product object. When the app mapped over these, `.name`, `.image`, etc. evaluated to `undefined`, which:
  1. Rendered empty names/articles.
  2. Broke deletion because the item `_id` resolving from `item.productId._id` was `undefined`, causing `removeProductFromLocalStorageCart(undefined)` to do nothing.
  3. Threw accessibility warnings: `Image is missing required "alt" property` because `alt={row.original.nameCol}` received `undefined`.
- **Solution:** Restructured the selectedCart map in [RetailCartTable.tsx](file:///f:/code/repos/fe-ingco/src/app/retail/cart/RetailCartTable.tsx) and [CartTable.tsx](file:///f:/code/repos/fe-ingco/src/app/shop/table/CartTable.tsx):
  - Checks if `productId` is a string or object.
  - Automatically maps falsy properties to clean fallback indicators (`codeCol: '—'`, `nameCol: 'Невідомий товар'`).
  - Resolves `_id` dynamically to the product ID string or item ID so they can be deleted successfully.
  - Added fallback defaults to all `alt` properties (`alt={row.original.nameCol || 'Зображення товару'}`) in cart tables and catalog pages.

### 12. Axios Auth Token Initialization Interceptor (401 Logout/Clear Cart Fix)

- **Problem:** When a user refreshes the page, the Axios instance's in-memory common headers (such as `Authorization`) are lost. Unless they visit a page specifically wrapped with `withAuth` HOC (which triggers a session refresh via `refreshTokenThunk` and sets the Axios header), the header remains empty. This caused authenticated actions like clearing the cart or logging out from non-protected routes (like `/cart`) to fail with a **401 Unauthorized** error.
- **Solution:** Added a request interceptor to the Axios instance in [operation.ts](file:///f:/code/repos/fe-ingco/src/lib/appState/user/operation.ts). The interceptor dynamically reads the token from browser cookies or local storage (`persist:auth`) and injects it as `Bearer ${token}` into any outgoing request if the Authorization header is missing.

---

## Verification Results

### Build Verification

Ran `npm run build` and verified the application compiles successfully under Next.js 16 with zero errors:

```bash
✓ Compiled successfully in 5.3s
  Running TypeScript ...
  Finished TypeScript in 4.2s ...
  Collecting page data using 19 workers ...
✓ Generating static pages using 19 workers (41/41) in 479ms
  Finalizing page optimization ...
```

### ESLint Validation

Ran `npm run lint` and confirmed that all modified files are completely clean of errors:

```bash
✖ 6 problems (0 errors, 6 warnings)
```

_(All remaining warnings are located in un-modified files)._

---

## Part 3: P2 Resolutions (Completed)

### 13. Contacts & Footer Link Properties (P2-2.4)

- **Contacts:** Corrected Viber/Telegram social link target and rel syntax to separate attributes: `target="_blank" rel="noopener noreferrer"` in [contacts/page.tsx](file:///f:/code/repos/fe-ingco/src/app/about-us/contacts/page.tsx).
- **Footer:** Appended `noopener noreferrer` to existing social links' `rel` attribute in [Footer.tsx](file:///f:/code/repos/fe-ingco/src/app/ui/Footer.tsx).

### 14. Structured Schema URL Templating & Sitelinks (P2-3.2, P2-5.7)

- Replaced hardcoded `https://ingco-service.win` domains inside structured JSON-LD schemas in root [layout.tsx](file:///f:/code/repos/fe-ingco/src/app/layout.tsx) with the `SITE_URL` constant.
- Updated the sitelinks search potentialAction urlTemplate from `?search=` to `?query=` to match our actual search queries.

### 15. Single Product Loading Skeletons (P2-3.3)

- Created a gorgeous pulsing loader skeleton component [ProductSkeleton.tsx](file:///f:/code/repos/fe-ingco/src/app/ui/ProductSkeleton.tsx) that matches the layout of the product page.
- Added a `productLoading: boolean` state inside the main Redux store slice ([slice.ts](file:///f:/code/repos/fe-ingco/src/lib/appState/main/slice.ts)) and set the initial `product` to `null` to safely handle load transitions.
- Integrated the loader in B2C and B2B product pages ([page.tsx B2C](<file:///f:/code/repos/fe-ingco/src/app/(retail-catalog)/[productSlug]/page.tsx>) and [page.tsx B2B](file:///f:/code/repos/fe-ingco/src/app/shop/[productSlug]/page.tsx)), resolving layout shifts and the brief flash of the "Product not found" screen.

### 16. Hook Dependency Cleanup & Debounce Memoization (P2-9.1, P2-9.2)

- **NovaPoshta:** Wrapped `loadOptions` in `useMemo` in [NovaPoshta.tsx](file:///f:/code/repos/fe-ingco/src/app/ui/utils/NovaPoshta.tsx) so the debounced search function persists across renders, and added unmount cleanup for safety.
- **CatalogSidebar:** Memoized `updateUrlParams` via `useCallback` in [CatalogSidebar.tsx](file:///f:/code/repos/fe-ingco/src/app/ui/CatalogSidebar.tsx) and resolved ESLint dependency warnings.
- **Cart & Retail Tables:** Memoized modal and change-quantity thunk callbacks in [CartTable.tsx](file:///f:/code/repos/fe-ingco/src/app/shop/table/CartTable.tsx) and [RetailCartTable.tsx](file:///f:/code/repos/fe-ingco/src/app/retail/cart/RetailCartTable.tsx) to clean up dependency warnings.
- **Dashboard Product Create:** Added `categories.length` to dependencies in [create/page.tsx](file:///f:/code/repos/fe-ingco/src/app/dashboard/product/create/page.tsx) and removed eslint-disable comments.

### 17. Button Accessibility & Pricing Tooltips (P2-10.1, P2-10.3)

- Added descriptive `aria-label` attributes to increment, decrement, and delete buttons inside the cart tables to comply with WCAG rules.
- Created [PricingTooltip.tsx](file:///f:/code/repos/fe-ingco/src/app/ui/PricingTooltip.tsx) — a keyboard-accessible Info popover explaining how totals are computed, replacing inaccessible `title` tooltips.

### 18. Routing Error Boundaries (P2-12.3)

- Created custom Next.js error fallback components ([error.tsx Auth](file:///f:/code/repos/fe-ingco/src/app/auth/error.tsx) and [error.tsx Dashboard](file:///f:/code/repos/fe-ingco/src/app/dashboard/error.tsx)) to catch route-level runtime exceptions gracefully.

---

## Part 4: P3 Resolutions (Completed)

### 19. Removal of Duplicate B2C Retail Routes (P3-13.1)

- **Relocation:** Relocated the core B2C listing component [ProductList.tsx](file:///f:/code/repos/fe-ingco/src/app/ui/product/ProductList.tsx) and B2C cart component [RetailCartTable.tsx](file:///f:/code/repos/fe-ingco/src/app/ui/product/RetailCartTable.tsx) to `src/app/ui/product/`.
- **References:** Updated all B2C catalog import paths inside [page.tsx B2C](<file:///f:/code/repos/fe-ingco/src/app/(retail-catalog)/page.tsx>), [favorites/page.tsx](<file:///f:/code/repos/fe-ingco/src/app/(retail-catalog)/favorites/page.tsx>), and [cart/page.tsx](<file:///f:/code/repos/fe-ingco/src/app/(retail-catalog)/cart/page.tsx>).
- **Cleanup:** Completely deleted the duplicate `src/app/retail/` directory to simplify codebase maintenance. Retail redirects continue to be processed at the server level via [next.config.ts](file:///f:/code/repos/fe-ingco/next.config.ts) redirect rules.

### 20. Code Purge and Linter Warnings Resolution (P3-11.1)

- Simplified the disabled route handler [route.ts](file:///f:/code/repos/fe-ingco/src/app/api/feed/route.ts) to a single line returning 410, removing a large block of unused commented code and variables.
- Cleaned up unused `listType` and destructured `description` variables inside [ProductCard.tsx](file:///f:/code/repos/fe-ingco/src/app/ui/product/ProductCard.tsx).
- Verified linter reports zero errors and **0 warnings** across the entire project repository.

### 21. Caching Strategy Alignment (P3-13.2, P3-13.4)

- **Decisions:** Structured the server-state caching design strategy to keep interactive components (with local state and URL query debounces) on the client, while delegating static metadata, feeds, and sitemap generation to server-rendered models.
