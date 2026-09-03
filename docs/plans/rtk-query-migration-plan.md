# RTK Query Migration Plan & Server State Architecture

> **Project:** INGCO Ukraine Frontend (`fe-ingco`)  
> **Stack:** Next.js 16.2.3 · React 19 · Redux Toolkit 2.11 · TypeScript 5 (strict)  
> **Target Directory for API:** `src/lib/appState/api/`  
> **Last Updated:** 2026-09-02 (v2 — refined after code review)

---

## 1. Executive Summary & Architectural Philosophy

Цей документ є офіційним планом та технічним стандартом для поетапної міграції серверного стану додатку з рукописних `createAsyncThunk` + `createSlice` на **RTK Query (`createApi`)**.

### Головний принцип розподілу відповідальності (Redux Style Guide):

1. **Server State (Серверний стан) $\rightarrow$ `RTK Query` (`createApi`)**:
   - Всі дані, що надходять з бекенду (товари, категорії, замовлення, користувачі, тікети, курси валют, обране, серверний кошик).
   - Автоматизує життєвий цикл запитів, кешування, дедуплікацію, інвалідацію через теги (`providesTags` / `invalidatesTags`), пагінацію та оптимістичні оновлення.
   - **Автоматичний `AbortController`**: RTK Query автоматично скасовує активні запити при розмонтуванні компонента. Це усуває потребу в ручній передачі `signal` та складній логіці обробки скасування (як у поточних `fetchCurrencyRatesThunk` та `fetchMainTableDataThunk`).
2. **Client / UI State (Клієнтський стан) $\rightarrow$ `createSlice`**:
   - Дані, які існують виключно в контексті браузера користувача:
     - `localStorageCart` — локальний кошик неавторизованого гостя.
     - `shopView` — налаштування вигляду каталогу (таблиця / сітка).
     - `authSlice` (сесія, токени, збереження в Cookies, прапорці `isAuthenticated` та `isB2b`).
     - Відкриті модальні вікна, черги тостів, активні фільтри без прив'язки до URL.

---

## 2. Скоуп міграції (Оцінка пріоритетів та доцільності)

| Модуль / Санка                                       |  Оцінка   | Цільовий RTK Query модуль                                     | Обґрунтування міграції                                                                                               |
| :--------------------------------------------------- | :-------: | :------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------- |
| **`fetchMainTableDataThunk`**                        | **10/10** | `productsApi.getProducts`                                     | Усуває перезатирання спільного масиву `products`, кешує сторінки/фільтри, прибирає `useEffect` на 8 залежностей.     |
| **`createProductThunk` / `updateProductThunk`**      | **10/10** | `productsApi` (`createProduct`, `updateProduct`)              | FormData-мутації з авто-інвалідацією списку товарів. Усуває ручний `findIndex` + splice у `mainSlice`.               |
| **`deleteProductThunk`**                             | **10/10** | `productsApi.deleteProduct`                                   | Усуває ручний `filter()` у `mainSlice`, замінює на декларативний `invalidatesTags: ['Product']`.                     |
| **`fetchUsersThunk` + CRUD**                         | **10/10** | `dashboardApi` (`getUsers`, `createUser`, `updateUser`, etc.) | Замінює ручний пошук індексів і `filter()` у CRM на декларативну інвалідацію тегів `User`.                           |
| **`fetchOrdersThunk` + `updateOrderThunk`**          | **10/10** | `dashboardApi` (`getOrders`, `updateOrder`)                   | Синхронізує таблицю замовлень та лічильники `orderStats` без ручного коду.                                           |
| **`fetchCategoriesThunk` + CRUD**                    | **9/10**  | `categoriesApi`                                               | Усуває ручний `condition`, дає 100% дедуплікацію та авто-оновлення меню при редагуванні в адмінці.                   |
| **`fetchSupportTicketsThunk`**                       | **9/10**  | `dashboardApi` (`getTickets`, `updateTicket`)                 | Автоматизує видалення оброблених тікетів зі списку.                                                                  |
| **`getProductBySlugThunk` / `ById`**                 | **8/10**  | `productsApi.getProductBySlug`                                | Кешує переглянуті картки товарів, миттєвий перехід "Назад" без повторного спінера.                                   |
| **`fetchHistoryThunk`**                              | **8/10**  | `ordersApi.getOrderHistory`                                   | Окремий незалежний кеш — виправляє баг спільного `page`/`totalPages` з `mainSlice` (див. Секцію 4.3).                |
| **`fetchUsersStatsThunk` / Analytics**               | **8/10**  | `dashboardApi` (Stats endpoints)                              | Авто-завантаження графіків при монтуванні та авто-очищення пам'яті (garbage collection).                             |
| **`getProductClicksThunk` / `getUserActivityThunk`** | **8/10**  | `dashboardApi` (`getProductClicks`, `getUserActivity`)        | Кешування статистики з авто-інвалідацією замість ручних `addCase` у `dashboardSlice`.                                |
| **`createOrderThunk` / `createRetailOrderThunk`**    | **7/10**  | `ordersApi` (`createOrder`, `createRetailOrder`)              | Серверні мутації з побічними ефектами (очищення кошика через `onQueryStarted`). Див. Секцію 4.3.                     |
| **`getUserCartThunk` + Cart CRUD**                   | **7/10**  | `cartApi` (`getCart`, `addToCart`, `removeFromCart`)          | Синхронізація лічильника хедера та сторінки кошика без спільних редукторів.                                          |
| **`addFavoriteProduct` / `deleteFavorite`**          | **7/10**  | `favoritesApi`                                                | Оптимістичне перемикання "сердечка" з авто-відкатом (`onQueryStarted`).                                              |
| **`fetchCurrencyRatesThunk`**                        | **6/10**  | `currencyApi.getRates`                                        | Заміна ручного `condition` (30 хв) на нативний `keepUnusedDataFor: 1800`. **⚠️ Потребує окремого `fetchBaseQuery`.** |
| **`fetchGmcStatus` / `syncGmcProducts`**             | **5/10**  | `dashboardApi` (GMC endpoints)                                | Декларативний стан тривалої синхронізації `isLoading`.                                                               |

---

## 3. Базова архітектура: `baseApi` та налаштування Store

### 3.1 Структура файлів (Code-Splitting via `injectEndpoints`)

Щоб уникнути створення одного монолітного файлу на 2000 рядків, використовується рекомендований RTK-патерн **Code-Splitting**:

```
src/lib/appState/
  ├── api/
  │   ├── baseApi.ts             # Головний createApi з axiosBaseQuery та спільними tagTypes
  │   ├── currencyApi.ts         # Окремий createApi з fetchBaseQuery для Next.js API routes
  │   ├── productsApi.ts         # injectEndpoints: товари, пошук, фільтри, деталі, CRUD
  │   ├── categoriesApi.ts       # injectEndpoints: дерево категорій, CRUD
  │   ├── ordersApi.ts           # injectEndpoints: створення замовлень B2B/B2C, історія
  │   ├── cartApi.ts             # injectEndpoints: серверний кошик
  │   ├── favoritesApi.ts        # injectEndpoints: обрані товари
  │   └── dashboardApi.ts        # injectEndpoints: CRM користувачі, замовлення, статистика, тікети, GMC
  ├── main/                      # Тільки UI/Client стейт: shopView
  ├── user/                      # Тільки Auth стейт: token, localStorageCart, user session
  └── store.ts                   # Додавання baseApi.reducer, currencyApi.reducer та middleware обох
```

### 3.2 Реалізація `baseApi.ts` (Кастомний `axiosBaseQuery` з підтримкою токенів та рефрешу)

Оскільки наш бекенд працює з наявним екземпляром `apiIngco` (перехоплювачі токенів у Cookies/localStorage та автоматичний 401 retry), найбезпечніший і найнадійніший варіант `baseQuery` — **Axios Bridge**:

```typescript
// src/lib/appState/api/baseApi.ts
import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { AxiosRequestConfig, AxiosError } from 'axios';
import { apiIngco, serializeAxiosError } from '../user/operation';

export const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestConfig['headers'];
      responseType?: AxiosRequestConfig['responseType'];
    },
    unknown,
    unknown
  > =>
  async ({ url, method = 'GET', data, params, headers, responseType }) => {
    try {
      const result = await apiIngco({
        url,
        method,
        data,
        params,
        headers,
        responseType,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: serializeAxiosError(err),
      };
    }
  };

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    'Product',
    'Category',
    'Order',
    'User',
    'SupportTicket',
    'Cart',
    'Favorite',
    'Currency',
    'GmcStatus',
    'DashboardStats',
  ],
  endpoints: () => ({}), // Ендпоінти додаються через injectEndpoints в окремих файлах
});
```

### 3.3 Реалізація `currencyApi.ts` (Окремий `createApi` з `fetchBaseQuery`)

**⚠️ Чому окремий `createApi`:** Поточна санка `fetchCurrencyRatesThunk` використовує **raw `axios`** (не `apiIngco`!), тому що ендпоінт `/api/currency` — це внутрішній Next.js API route, а не бекенд API. Маршрутизація через `apiIngco` додає помилковий `Authorization` header та `baseURL` (`NEXT_PUBLIC_API`), що призводить до хибного запиту.

```typescript
// src/lib/appState/api/currencyApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface CurrencyRatesResponse {
  USD: number;
  EUR: number;
}

interface CurrencyRates {
  lastUpdate: string;
  USD: number;
  EUR: number;
}

const FALLBACK_RATES: CurrencyRates = {
  lastUpdate: new Date().toISOString(),
  USD: 44.0,
  EUR: 52.0,
};

export const currencyApi = createApi({
  reducerPath: 'currencyApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }), // Same-origin для Next.js API routes
  tagTypes: ['Currency'],
  endpoints: (build) => ({
    getCurrencyRates: build.query<CurrencyRates, void>({
      query: () => ({
        url: 'api/currency',
        headers: { 'Cache-Control': 'no-cache' },
        timeout: 8000,
      }),
      transformResponse: (response: CurrencyRatesResponse) => {
        // Валідація — зберігаємо логіку з поточної санки
        if (!response?.USD || !response?.EUR) {
          return FALLBACK_RATES;
        }

        const USD = parseFloat(Number(response.USD).toFixed(1));
        const EUR = parseFloat(Number(response.EUR).toFixed(1));

        if (!USD || !EUR || isNaN(USD) || isNaN(EUR)) {
          return FALLBACK_RATES;
        }

        return {
          lastUpdate: new Date().toISOString(),
          USD,
          EUR,
        };
      },
      transformErrorResponse: (response) => {
        // 404 fallback — зберігаємо поведінку поточної санки (dev route recompile)
        if (response.status === 404) {
          return FALLBACK_RATES;
        }
        return response;
      },
      keepUnusedDataFor: 1800, // Автоматичне кешування на 30 хвилин (замість ручного condition)
      providesTags: ['Currency'],
    }),
  }),
});

export const { useGetCurrencyRatesQuery } = currencyApi;
```

### 3.4 Оновлення `store.ts`

```typescript
// src/lib/appState/store.ts
import { baseApi } from './api/baseApi';
import { currencyApi } from './api/currencyApi';

export const makeStore = () =>
  configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      [currencyApi.reducerPath]: currencyApi.reducer,
      persistedMainReducer,
      persistedAuthReducer,
      dashboardSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(baseApi.middleware, currencyApi.middleware),
  });
```

---

## 4. Поетапний детальний план міграції сутностей

---

### 🟢 ЕТАП 1: Категорії та Курси валют (`categoriesApi` & `currencyApi`)

_Рівень ризику: НИЗЬКИЙ · Оцінка користі: 9/10_

#### 1.1 `categoriesApi`

- **Поточні санки:** `fetchCategoriesThunk`, `createCategoryThunk`, `updateCategoryThunk`, `reorderCategoryThunk`, `deleteCategoryThunk`.
- **Файли під заміну:** `src/lib/appState/main/operations.ts:L140-163`, `L203-317`.
- **Специфікація RTK Query:**
  ```typescript
  export const categoriesApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
      getCategories: build.query<Category[], string | void>({
        query: (q = '') => ({ url: '/categories', params: { q } }),
        providesTags: (result) =>
          result
            ? [
                ...result.map(({ id }) => ({ type: 'Category' as const, id })),
                { type: 'Category', id: 'LIST' },
              ]
            : [{ type: 'Category', id: 'LIST' }],
      }),
      createCategory: build.mutation<
        Category,
        {
          name: string;
          renderSort?: number;
          parentId?: number | null;
          showInMenu?: boolean;
          slug?: string;
          seoKeywords?: string;
          attributeIds?: number[];
        }
      >({
        query: ({ attributeIds: _ids, ...body }) => ({
          url: '/categories',
          method: 'POST',
          data: body,
        }),
        invalidatesTags: [{ type: 'Category', id: 'LIST' }],
        // Окремий виклик для attributeIds після створення категорії
        async onQueryStarted({ attributeIds }, { dispatch, queryFulfilled }) {
          try {
            const { data: newCategory } = await queryFulfilled;
            if (attributeIds && attributeIds.length > 0) {
              await apiIngco.post(`/categories/${newCategory.id}/attributes`, {
                attributeIds,
              });
            }
          } catch {
            // Інвалідація вже відбувається через invalidatesTags
          }
        },
      }),
      updateCategory: build.mutation<
        Category,
        {
          id: number;
          name?: string;
          renderSort?: number;
          parentId?: number | null;
          showInMenu?: boolean;
          slug?: string;
          seoKeywords?: string;
          attributeIds?: number[];
        }
      >({
        query: ({ id, attributeIds: _ids, ...data }) => ({
          url: `/categories/${id}`,
          method: 'PUT',
          data,
        }),
        invalidatesTags: (_res, _err, { id }) => [
          { type: 'Category', id },
          { type: 'Category', id: 'LIST' },
        ],
        async onQueryStarted({ id, attributeIds }, { queryFulfilled }) {
          try {
            await queryFulfilled;
            if (attributeIds !== undefined) {
              await apiIngco.post(`/categories/${id}/attributes`, {
                attributeIds,
              });
            }
          } catch {
            // Інвалідація вже відбувається через invalidatesTags
          }
        },
      }),
      reorderCategories: build.mutation<
        Category[],
        { id: number; parentId: number | null; targetIndex: number }
      >({
        query: (data) => ({ url: '/categories/reorder', method: 'POST', data }),
        invalidatesTags: [{ type: 'Category', id: 'LIST' }],
      }),
      deleteCategory: build.mutation<number, number>({
        query: (categoryId) => ({
          url: `/categories/${categoryId}`,
          method: 'DELETE',
        }),
        invalidatesTags: [{ type: 'Category', id: 'LIST' }],
      }),
    }),
  });
  ```
- **⚠️ Підводні камені (Gotchas):**
  - При створенні/оновленні категорії, виклик `/categories/:id/attributes` виконується в `onQueryStarted` після успішного створення/оновлення.
  - У хуку [`useActiveCategory`](file:///f:/code/repos/fe-ingco/src/lib/hooks.tsx#L104) замінити читання `state.persistedMainReducer.categories` на виклик `categoriesApi.useGetCategoriesQuery('')`.
  - Помилка видалення категорії з прив'язаними товарами — тост `toast.error(...)` переноситься в компонент (див. Секцію 5).

#### 1.2 `currencyApi`

- **Поточна санка:** `fetchCurrencyRatesThunk`.
- **Специфікація:** Повна реалізація наведена в Секції 3.3 (окремий `createApi` з `fetchBaseQuery`).
- **⚠️ Підводні камені (Gotchas):**
  - Прибрати `currencyRates` з `whitelist` у `persistMainConfig` ([`store.ts:L35`](file:///f:/code/repos/fe-ingco/src/lib/appState/store.ts#L35)), щоб не зберігати застарілий кеш між сесіями — RTK Query `keepUnusedDataFor` замінює persist.
  - Логіка 404 fallback та валідація перенесена в `transformResponse` / `transformErrorResponse` (Секція 3.3).
  - Ручна обробка `signal`, `silent_cancel` та `429 rate limit` — RTK Query обробляє abort автоматично.

---

### 🟡 ЕТАП 2: CRM та Адмін-панель (`dashboardApi`)

_Рівень ризику: СЕРЕДНІЙ · Оцінка користі: 10/10_

#### 2.1 Користувачі CRM (`Users`)

- **Поточні санки:** `fetchUsersThunk`, `createUserThunk`, `updateUserThunk`, `deleteUserThunk`, `restoreUserThunk`.
- **Специфікація RTK Query:**
  ```typescript
  getUsers: build.query<
    { users: User[]; totalPages: number; total: number },
    { page: number; q?: string; role?: string; isB2b?: boolean; isUserVerified?: boolean; isDeleted?: string; limit?: number }
  >({
    query: ({ role, ...params }) => ({
      url: '/users',
      params: {
        ...params,
        role: role === 'all' ? undefined : role?.toUpperCase(),
      },
    }),
    transformResponse: (response: { users: unknown[]; totalPages: number; total: number }) => ({
      ...response,
      users: response.users.map(normalizeUser),
    }),
    providesTags: (result) =>
      result
        ? [...result.users.map(({ id }) => ({ type: 'User' as const, id })), { type: 'User', id: 'LIST' }]
        : [{ type: 'User', id: 'LIST' }],
  }),
  createUser: build.mutation<User, CreateUserPayload>({
    query: (credentials) => ({
      url: '/users',
      method: 'POST',
      data: {
        ...credentials,
        role: credentials.role?.toUpperCase(),
        isB2b: credentials.isB2B === 'true',
      },
    }),
    transformResponse: (res: unknown) => normalizeUser(res),
    invalidatesTags: [{ type: 'User', id: 'LIST' }, 'DashboardStats'],
  }),
  updateUser: build.mutation<User, Omit<User, 'token' | 'createdAt' | 'updatedAt'> & { password?: string; about?: string }>({
    query: ({ id, ...data }) => ({
      url: `/users/${id}`,
      method: 'PUT',
      data: {
        ...data,
        role: data.role?.toUpperCase(),
      },
    }),
    transformResponse: (res: unknown) => normalizeUser(res),
    invalidatesTags: (_res, _err, { id }) => [{ type: 'User', id }, { type: 'User', id: 'LIST' }, 'DashboardStats'],
  }),
  deleteUser: build.mutation<void, number>({
    query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
    invalidatesTags: [{ type: 'User', id: 'LIST' }, 'DashboardStats'],
  }),
  restoreUser: build.mutation<void, number>({
    query: (userId) => ({ url: `/users/restore/${userId}`, method: 'POST' }),
    invalidatesTags: [{ type: 'User', id: 'LIST' }, 'DashboardStats'],
  }),
  ```
- **⚠️ Підводні камені (Gotchas):**
  - **`normalizeUser` обов'язковий** у `transformResponse` для всіх ендпоінтів — без нього зламається маппінг `isB2B`, форматування дат.
  - Оновлення або видалення користувача повинно автоматично інвалідувати тег `'DashboardStats'` для синхронізації лічильників B2B/B2C користувачів.
  - Повністю видалити ручний код `state.users[index] = payload` та `state.users.filter(...)` із [`dashboard/slice.ts`](file:///f:/code/repos/fe-ingco/src/lib/appState/dashboard/slice.ts).
  - Тости `toast.success('Користувач успішно змінений')` з редукторів переносяться в компоненти (див. Секцію 5).

#### 2.2 Замовлення CRM (`Orders`)

- **Поточні санки:** `fetchOrdersThunk`, `updateOrderThunk`.
- **Специфікація RTK Query:**
  ```typescript
  getDashboardOrders: build.query<
    { orders: Order[]; totalPages: number; stats: OrderStats },
    { page?: number; q?: string; limit?: number; isRetail?: boolean; status?: string }
  >({
    query: (params) => ({ url: '/orders/all', params }), // ⚠️ /orders/all, НЕ /orders/admin!
    transformResponse: (response: { orders: unknown[]; totalPages: number; stats: OrderStats }) => ({
      ...response,
      orders: response.orders.map(normalizeOrder),
    }),
    providesTags: (result) =>
      result
        ? [...result.orders.map(({ orderCode }) => ({ type: 'Order' as const, id: orderCode })), { type: 'Order', id: 'LIST' }]
        : [{ type: 'Order', id: 'LIST' }],
  }),
  updateDashboardOrder: build.mutation<
    Order,
    { orderId: number; data: Partial<Order>; isRetail?: boolean }
  >({
    query: ({ orderId, data, isRetail = false }) => ({
      // ⚠️ Зберігаємо розгалуження URL для retail/non-retail замовлень
      url: isRetail ? `/orders/retail/${orderId}` : `/orders/${orderId}`,
      method: 'PUT',
      data,
    }),
    transformResponse: (res: unknown) => normalizeOrder(res),
    invalidatesTags: (_res, _err, { orderId }) => [
      { type: 'Order', id: String(orderId) },
      { type: 'Order', id: 'LIST' },
    ],
  }),
  ```
- **⚠️ Підводні камені (Gotchas):**
  - **URL ендпоінту — `/orders/all`**, а не `/orders/admin`. Перевірити актуальний бекенд роут.
  - **`isRetail` розгалуження** — `updateDashboardOrder` повинен маршрутизувати на `/orders/retail/${id}` або `/orders/${id}` залежно від типу замовлення.
  - Обов'язкова нормалізація через `normalizeOrder` у `transformResponse` через збереження цін Prisma Decimal.
  - Тост `toast.success('Замовлення успішно змінено')` переноситься в компонент (див. Секцію 5).

#### 2.3 Тікети підтримки (`SupportTickets`)

- **Санки:** `fetchSupportTicketsThunk`, `updateSupportTicketThunk`.
- **Специфікація:**
  ```typescript
  getSupportTickets: build.query<
    { tickets: SupportTicket[]; totalPages: number },
    { q?: string; page?: number; limit?: number; isAnswered?: boolean }
  >({
    query: (params) => ({ url: '/users/support', params }),
    providesTags: (result) =>
      result
        ? [
            ...result.tickets.map(({ id }) => ({ type: 'SupportTicket' as const, id })),
            { type: 'SupportTicket', id: 'LIST' },
          ]
        : [{ type: 'SupportTicket', id: 'LIST' }],
  }),
  updateSupportTicket: build.mutation<void, { ticketId: number; isAnswered: boolean }>({
    query: ({ ticketId, isAnswered }) => ({
      url: `/users/support/${ticketId}`,
      method: 'PATCH',
      data: { isAnswered },
    }),
    invalidatesTags: [{ type: 'SupportTicket', id: 'LIST' }],
  }),
  ```

#### 2.4 Аналітика та Статистика

- **Санки:** `fetchUsersStatsThunk`, `getProductClicksThunk`, `getUserActivityThunk`.
- **Специфікація:**
  ```typescript
  getUsersStats: build.query<
    { total: number; b2b: number; b2c: number; notVerified: number },
    void
  >({
    query: () => ({ url: '/users/stats' }),
    providesTags: ['DashboardStats'],
  }),
  getProductClicks: build.query<
    { productClicks: object[] },
    { page?: number; limit?: number; startDate?: string; endDate?: string }
  >({
    query: (params) => ({ url: '/stats/products/clicks', params }),
    providesTags: ['DashboardStats'],
  }),
  getUserActivity: build.query<
    { users: User[] },
    { page?: number; limit?: number; startDate?: string; endDate?: string }
  >({
    query: (params) => ({ url: '/stats/users/activity', params }),
    transformResponse: (response: { users: unknown[] }) => ({
      users: response.users.map(normalizeUser),
    }),
    providesTags: ['DashboardStats'],
  }),
  ```

#### 2.5 Google Merchant Center (GMC)

- **Санки:** `fetchGmcStatusThunk`, `syncGmcProductsThunk`.
- **Специфікація:**
  ```typescript
  getGmcStatus: build.query<GmcStatusType, void>({
    query: () => ({ url: '/google-merchant/status' }),
    providesTags: ['GmcStatus'],
  }),
  syncGmcProducts: build.mutation<{ success: boolean; count: number; error?: string }, void>({
    query: () => ({ url: '/google-merchant/sync', method: 'POST' }),
    invalidatesTags: ['GmcStatus'],
  }),
  ```

---

### 🔴 ЕТАП 3: Каталог товарів (`productsApi`)

_Рівень ризику: ВИСОКИЙ (головна сторінка сайту) · Оцінка користі: 10/10_

#### 3.1 Список товарів каталогу (`getProducts`)

- **Поточна санка:** `fetchMainTableDataThunk` ([`main/operations.ts:L82-114`](file:///f:/code/repos/fe-ingco/src/lib/appState/main/operations.ts#L82-L114)).
- **Специфікація RTK Query:**

  ```typescript
  export interface GetProductsParams {
    page: number;
    query?: string;
    category?: string;
    limit?: number;
    sortValue?: string;
    isRetail?: boolean;
    filters?: string;
  }

  getProducts: build.query<{ products: Product[]; total: number; totalPages: number; page: number; limit: number }, GetProductsParams>({
    query: ({ page, query, category, limit = 30, sortValue, isRetail = true, filters }) => ({
      url: '/products',
      params: { page, q: query, limit, category, sortValue, isRetail, filters },
    }),
    transformResponse: (response: { products: unknown[]; total: number; totalPages: number; page: number; limit: number }) => ({
      ...response,
      products: response.products.map(normalizeProduct),
    }),
    providesTags: (result) =>
      result
        ? [...result.products.map(({ id }) => ({ type: 'Product' as const, id })), { type: 'Product', id: 'LIST' }]
        : [{ type: 'Product', id: 'LIST' }],
  }),
  ```

- **⚠️ Підводні камені та Gotchas:**
  1. **Міграція компонентів:** У [`ProductList.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/product/ProductList.tsx), [`ShopTable.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/product/ShopTable.tsx), [`ProductTable.tsx`](file:///f:/code/repos/fe-ingco/src/app/dashboard/tables/ProductTable.tsx) повністю **видалити `useEffect`** з `dispatch(fetchMainTableDataThunk(...))`.
  2. Замість цього викликати:
     ```typescript
     const { data, isLoading, isFetching } = useGetProductsQuery({
       page,
       query,
       category,
       limit,
       sortValue,
       isRetail: !isB2B,
       filters,
     });
     const products = data?.products || [];
     ```
  3. Прапорці `tableLoading` та `productLoading` у `mainSlice` стають повністю застарілими і видаляються.

#### 3.2 Деталі товару (`getProductBySlug` / `getProductById`)

- **Поточні санки:** `getProductBySlugThunk`, `getProductByIdThunk`.
- **Специфікація:**
  ```typescript
  getProductBySlug: build.query<Product, string>({
    query: (slug) => ({ url: `/products/${slug}` }),
    transformResponse: (res: unknown) => normalizeProduct(res),
    // ⚠️ Використовуємо числовий id після нормалізації для узгодженості тегів
    providesTags: (result) =>
      result ? [{ type: 'Product', id: result.id }] : [],
  }),
  getProductById: build.query<Product, string>({
    query: (productId) => ({ url: `/products/id/${productId}` }),
    transformResponse: (res: unknown) => normalizeProduct(res),
    providesTags: (result) =>
      result ? [{ type: 'Product', id: result.id }] : [],
  }),
  ```
- **⚠️ Gotchas:**
  - **Уніфікація тегів:** Обидва ендпоінти використовують числовий `result.id` як ідентифікатор тегу (а не slug-рядок). Це гарантує, що інвалідація через `invalidatesTags: [{ type: 'Product', id: 123 }]` з мутацій CRUD коректно оновить кеш деталей товару.
  - Не потрібно більше вручну обнуляти `state.product = null` при зміні сторінки — RTK Query показує свіжий кеш або `isLoading`.

#### 3.3 CRUD Товарів (`createProduct`, `updateProduct`, `deleteProduct`)

- **Поточні санки:** [`createProductThunk`](file:///f:/code/repos/fe-ingco/src/lib/appState/dashboard/operations.ts#L7-L21), [`updateProductThunk`](file:///f:/code/repos/fe-ingco/src/lib/appState/dashboard/operations.ts#L23-L40), [`deleteProductThunk`](file:///f:/code/repos/fe-ingco/src/lib/appState/main/operations.ts#L191-L201).
- **Специфікація RTK Query:**
  ```typescript
  createProduct: build.mutation<Product, FormData>({
    query: (formData) => ({
      url: '/products',
      method: 'POST',
      data: formData,
      // ⚠️ FormData: Axios автоматично встановить Content-Type: multipart/form-data
      // НЕ встановлювати headers вручну — Axios додає boundary автоматично
    }),
    invalidatesTags: [{ type: 'Product', id: 'LIST' }],
  }),
  updateProduct: build.mutation<Product, { formData: FormData; productId: string }>({
    query: ({ formData, productId }) => ({
      url: `/products/${productId}`,
      method: 'PUT',
      data: formData,
    }),
    transformResponse: (res: unknown) => normalizeProduct(res),
    invalidatesTags: (result) =>
      result
        ? [{ type: 'Product', id: result.id }, { type: 'Product', id: 'LIST' }]
        : [{ type: 'Product', id: 'LIST' }],
  }),
  deleteProduct: build.mutation<number, number>({
    query: (productId) => ({ url: `/products/${productId}`, method: 'DELETE' }),
    invalidatesTags: [{ type: 'Product', id: 'LIST' }],
  }),
  ```
- **⚠️ Gotchas:**
  - **FormData та `Content-Type`:** `axiosBaseQuery` передає `data` напряму в Axios, який для `FormData` автоматично додає `Content-Type: multipart/form-data` з правильним boundary. **НЕ** встановлювати заголовок вручну в `headers`.
  - Після `updateProduct` інвалідуємо конкретний `{ type: 'Product', id }`, щоб оновити закешовану сторінку деталей товару.

---

### 🟠 ЕТАП 4: Кошик, Обране, Замовлення та Історія (`cartApi`, `favoritesApi`, `ordersApi`)

_Рівень ризику: СЕРЕДНІЙ · Оцінка користі: 8/10_

#### 4.1 Серверний кошик (`cartApi`)

- **Поточні санки:** `getUserCartThunk`, `addProductToCartThunk`, `deleteProductFromCartThunk`.
- **Специфікація:**
  ```typescript
  getCart: build.query<CartItem[], { isRetail?: boolean }>({
    query: ({ isRetail = false } = {}) => ({ url: isRetail ? '/users/cart/retail' : '/users/cart' }),
    transformResponse: (res: { cart: CartItem[] }) => res.cart,
    providesTags: ['Cart'],
  }),
  addToCart: build.mutation<CartItem[], { productId: number; quantity: number; isRetail?: boolean }>({
    query: ({ productId, quantity, isRetail = false }) => ({
      url: isRetail ? '/users/cart/retail' : '/users/cart',
      method: 'POST',
      data: { productId, quantity },
    }),
    transformResponse: (res: { cart: CartItem[] }) => res.cart,
    invalidatesTags: ['Cart'],
  }),
  deleteFromCart: build.mutation<CartItem[], { productId: number; quantity?: number; isRetail?: boolean }>({
    query: ({ productId, quantity = 1, isRetail = false }) => ({
      url: isRetail ? '/users/cart/retail' : '/users/cart',
      method: 'DELETE',
      data: { productId, quantity },
    }),
    transformResponse: (res: { cart: CartItem[] }) => res.cart,
    invalidatesTags: ['Cart'],
  }),
  ```
- **⚠️ Gotchas:**
  - Логіка гостьового кошика (`localStorageCart`) залишається в `createSlice`! У компонентах викликається комбінований хук або перевірка `if (isAuth) { addToCartMutation() } else { dispatch(addProductToLocalStorageCart()) }`.

#### 4.2 Обране з оптимістичним оновленням (`favoritesApi`)

- **Поточні санки:** `addFavoriteProductThunk`, `deleteFavoriteProductThunk`.
- **Специфікація з Optimistic Updates:**
  ```typescript
  getFavorites: build.query<Product[], void>({
    query: () => ({ url: '/users/favorites' }),
    providesTags: ['Favorite'],
  }),
  addFavorite: build.mutation<Product[], number>({
    query: (productId) => ({ url: `/users/favorites/${productId}`, method: 'POST' }),
    invalidatesTags: ['Favorite'],
    async onQueryStarted(productId, { dispatch, queryFulfilled }) {
      // Оптимістичне оновлення кешу до відповіді сервера
      const patchResult = dispatch(
        favoritesApi.util.updateQueryData('getFavorites', undefined, (draft) => {
          // Швидке додавання id в локальний список
        })
      );
      try {
        await queryFulfilled;
      } catch {
        patchResult.undo(); // Відкат при помилці мережі
        toast.error('Не вдалося додати до обраного');
      }
    },
  }),
  deleteFavorite: build.mutation<Product[], number>({
    query: (productId) => ({ url: `/users/favorites/${productId}`, method: 'DELETE' }),
    invalidatesTags: ['Favorite'],
    async onQueryStarted(productId, { dispatch, queryFulfilled }) {
      const patchResult = dispatch(
        favoritesApi.util.updateQueryData('getFavorites', undefined, (draft) => {
          const index = draft.findIndex((p) => p.id === productId);
          if (index !== -1) draft.splice(index, 1);
        })
      );
      try {
        await queryFulfilled;
      } catch {
        patchResult.undo();
        toast.error('Не вдалося видалити з обраного');
      }
    },
  }),
  ```

#### 4.3 Створення замовлень та Історія (`ordersApi`)

- **Поточні санки:** [`createOrderThunk`](file:///f:/code/repos/fe-ingco/src/lib/appState/user/operation.ts#L340-L373), [`createRetailOrderThunk`](file:///f:/code/repos/fe-ingco/src/lib/appState/user/operation.ts#L375-L418), [`fetchHistoryThunk`](file:///f:/code/repos/fe-ingco/src/lib/appState/main/operations.ts#L165-L189).
- **Специфікація RTK Query:**

  ```typescript
  export const ordersApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
      createOrder: build.mutation<Order, CreateOrderPayload>({
        query: (order) => ({
          url: '/orders',
          method: 'POST',
          data: {
            items: order.products.map((p) => ({
              productId: p.productId,
              quantity: p.quantity,
            })),
            shippingAddress: order.shippingAddress,
            comment: order.comment,
            usdRate: order.usdRate,
          },
        }),
        transformResponse: (res: unknown) => normalizeOrder(res),
        invalidatesTags: ['Cart', 'Order'],
        // Побічний ефект: очищення серверного кошика після успішного замовлення
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            // Примусово інвалідувати кеш кошика
            dispatch(cartApi.util.invalidateTags(['Cart']));
          } catch {
            // Помилка обробляється в компоненті через .unwrap()
          }
        },
      }),

      createRetailOrder: build.mutation<Order, CreateRetailOrderPayload>({
        query: (order) => ({
          url: '/orders/retail',
          method: 'POST',
          data: {
            items: order.products.map((p) => ({
              productId: p.productId,
              quantity: p.quantity,
            })),
            shippingAddress: order.shippingAddress,
            comment: order.comment,
            firstName: order.firstName,
            lastName: order.lastName,
            surName: order.surName,
            phone: order.phone,
            email: order.email,
            turnstileToken: order.turnstileToken,
          },
        }),
        transformResponse: (res: unknown) => normalizeOrder(res),
        invalidatesTags: ['Cart'],
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            // Очистити локальний гостьовий кошик
            dispatch(clearLocalStorageCart());
          } catch {
            // Помилка обробляється в компоненті через .unwrap()
          }
        },
      }),

      getOrderHistory: build.query<
        { orders: Order[]; page: number; totalPages: number },
        { page?: number; q?: string; limit?: number; isRetail: boolean }
      >({
        query: ({ page = 1, q = '', limit = 15, isRetail }) => ({
          url: '/orders',
          params: { page, q, limit, isRetail },
        }),
        transformResponse: (response: { orders: unknown[]; page: number; totalPages: number }) => ({
          ...response,
          orders: (response.orders || []).map(normalizeOrder),
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.orders.map(({ orderCode }) => ({
                  type: 'Order' as const,
                  id: orderCode,
                })),
                { type: 'Order', id: 'HISTORY' },
              ]
            : [{ type: 'Order', id: 'HISTORY' }],
      }),
    }),
  });
  ```

- **⚠️ Gotchas:**
  - **Виправлення бага спільного `page`/`totalPages`:** У поточній [`mainSlice`](file:///f:/code/repos/fe-ingco/src/lib/appState/main/slice.ts#L100-L104), `fetchHistoryThunk.fulfilled` перезаписує `state.page` та `state.totalPages`, які спільні з `fetchMainTableDataThunk`. RTK Query усуває цей баг, оскільки кожен query має **власний ізольований кеш**.
  - `createRetailOrder` — після успішного замовлення потрібно очистити `localStorageCart` в `authSlice` через dispatch `clearLocalStorageCart` (новий синхронний action, якщо ще не існує, або використати наявний `removeProductFromLocalStorageCart` для кожного елементу). Альтернатива — додати `clearLocalStorageCart` action в `authSlice`.
  - Для B2B `createOrder` — серверний кошик інвалідується через `invalidatesTags: ['Cart']`.
  - Тег `'HISTORY'` використовується для кешу історії, щоб відрізнити від CRM `'LIST'` тегу.

---

## 5. Стратегія міграції Toast-повідомлень

### Проблема

У поточній кодовій базі `toast.success(...)` та `toast.error(...)` викликаються **всередині `extraReducers`** у slice-файлах. Це є **побічним ефектом у редукторі** — порушення принципу чистоти редукторів Redux.

### Поточні тости в редукторах (що потрібно винести)

| Файл                                                                                                |  Рядок   | Повідомлення                         | Перенести куди                          |
| :-------------------------------------------------------------------------------------------------- | :------: | :----------------------------------- | :-------------------------------------- |
| [`dashboard/slice.ts`](file:///f:/code/repos/fe-ingco/src/lib/appState/dashboard/slice.ts#L112)     |   L112   | `'Замовлення успішно змінено'`       | `OrdersTable.tsx` — після `.unwrap()`   |
| [`dashboard/slice.ts`](file:///f:/code/repos/fe-ingco/src/lib/appState/dashboard/slice.ts#L119)     |   L119   | `'Користувач успішно змінений'`      | `UserTable.tsx` — після `.unwrap()`     |
| [`dashboard/slice.ts`](file:///f:/code/repos/fe-ingco/src/lib/appState/dashboard/slice.ts#L123)     |   L123   | `'Користувач успішно видалений'`     | `UserTable.tsx` — після `.unwrap()`     |
| [`dashboard/slice.ts`](file:///f:/code/repos/fe-ingco/src/lib/appState/dashboard/slice.ts#L126)     |   L126   | `'Користувач успішно відновлений'`   | `UserTable.tsx` — після `.unwrap()`     |
| [`dashboard/slice.ts`](file:///f:/code/repos/fe-ingco/src/lib/appState/dashboard/slice.ts#L145)     |   L145   | `'Синхронізацію успішно завершено!'` | `GmcSection.tsx` — після `.unwrap()`    |
| [`dashboard/slice.ts`](file:///f:/code/repos/fe-ingco/src/lib/appState/dashboard/slice.ts#L152-157) | L152-157 | GMC error toasts                     | `GmcSection.tsx` — в `.catch()`         |
| [`main/slice.ts`](file:///f:/code/repos/fe-ingco/src/lib/appState/main/slice.ts#L82-L84)            |  L82-84  | Currency error toast                 | Видалити — RTK Query обробить `isError` |
| [`main/operations.ts`](file:///f:/code/repos/fe-ingco/src/lib/appState/main/operations.ts#L313)     |   L313   | Помилка видалення категорії          | `CategoryTable.tsx` — в `.catch()`      |

### Рекомендований паттерн

```typescript
// В компоненті — після RTK Query мутації
const [updateUser] = useUpdateUserMutation();

const handleUpdate = async (userData: User) => {
  try {
    await updateUser(userData).unwrap();
    toast.success('Користувач успішно змінений');
  } catch (error) {
    toast.error(
      typeof error === 'object' && error && 'message' in error
        ? (error as { message: string }).message
        : 'Помилка оновлення користувача',
    );
  }
};
```

---

## 6. Сутності, які ЗАЛИШАЮТЬСЯ в `createSlice` / чистих утилітах

Наступні модулі **суворо заборонено переносити в RTK Query**, оскільки вони становлять основу безпеки, сесії або локального UI:

```typescript
// 1. src/lib/appState/user/slice.ts
- localStorageCart: []                     // Гостьовий кошик (Redux Persist)
- token: string                            // JWT токен
- isAuthenticated: boolean                 // Прапорець авторизації
- isB2b: boolean                           // Прапорець гуртового користувача
- user: AuthUserState                      // Профіль поточного авторизованого користувача
- clearAuthState()                         // Синхронне очищення при логауті

// 2. src/lib/appState/main/slice.ts
- shopView: 'table' | 'list'               // UI режим відображення каталогу

// 3. Службові санки та утиліти:
- loginThunk / registerThunk / registerClientThunk   // Аутентифікація — побічні ефекти з cookies/tokens
- logoutThunk                              // Очищення сесії та cookies
- refreshTokenThunk & Axios Interceptors   // Перехоплювач 401 та оновлення токенів
- forgotPasswordThunk / resetPasswordThunk // Одноразові форми скидання паролю
- fetchExcelFileThunk                      // Завантаження бінарних Blob файлів
- trackProductClickThunk                   // Разова аналітика (fire-and-forget)
- supportTicketThunk (публічна форма)       // Fire-and-forget, не потребує кешування
```

---

## 7. Чеклист виконання міграції (Phase-by-Phase Roadmap)

- [ ] **Фаза 0: Фундамент (Infrastructure)**
  - [ ] Створити `src/lib/appState/api/baseApi.ts` з `axiosBaseQuery` та типами тегів.
  - [ ] Створити `src/lib/appState/api/currencyApi.ts` з окремим `createApi` + `fetchBaseQuery`.
  - [ ] Підключити `baseApi.reducer`, `currencyApi.reducer` та обидва `middleware` у `src/lib/appState/store.ts`.
  - [ ] Перевірити білд (`npm run build`).

- [ ] **Фаза 1: Категорії та Валюти**
  - [ ] Створити `categoriesApi.ts` з `injectEndpoints` (включаючи `onQueryStarted` для `attributeIds`).
  - [ ] Перевести `useActiveCategory` та селектори на нові хуки.
  - [ ] Оновити `AdminProductForm`, `CategoryForm`, `CategoryTable`.
  - [ ] Видалити `currencyRates` з `redux-persist` whitelist.
  - [ ] Перенести тост помилки видалення категорії в `CategoryTable.tsx`.
  - [ ] Перевірити білд (`npm run build`).

- [x] **Фаза 2: Адмін-панель (CRM)**
  - [x] Створити `dashboardApi.ts` (Users з `normalizeUser` в `transformResponse`, Orders з `/orders/all`, Support, Analytics, GMC).
  - [x] Оновити `UserTable.tsx`, `OrdersTable.tsx`, `SupportTable.tsx`, `AnalyticsDiagrams.tsx`.
  - [x] Перенести всі `toast.success(...)` з `dashboardSlice` → компоненти (`.unwrap()` + toast).
  - [x] Очистити `dashboardSlice` від дублюючих серверних масивів (`users`, `orders`, `supportTickets`, `usersStats`, `orderStats`, `stats`, `gmcStatus`).
  - [x] Перевірити білд (`npm run build`).

- [ ] **Фаза 3: Каталог товарів**
  - [ ] Створити `productsApi.ts` з `getProducts`, `getProductBySlug`, `getProductById`, `createProduct` (FormData), `updateProduct` (FormData), `deleteProduct`.
  - [ ] Уніфікувати теги: всі Product ендпоінти використовують числовий `id`, а не slug.
  - [ ] Оновити `ProductList.tsx`, `ShopTable.tsx`, `ProductCard.tsx`, сторінку `[productSlug]/page.tsx`.
  - [ ] Оновити `AdminProductForm.tsx` для використання `createProduct`/`updateProduct` мутацій.
  - [ ] Видалити `fetchMainTableDataThunk`, `deleteProductThunk` та очистити `mainSlice` від `products`, `product`, `tableLoading`, `productLoading`, `page`, `totalPages`, `total`, `history`.
  - [ ] Перевірити білд (`npm run build`).

- [ ] **Фаза 4: Кошик, Обране та Замовлення**
  - [ ] Створити `cartApi.ts` та `favoritesApi.ts`.
  - [ ] Створити `ordersApi.ts` з `createOrder`, `createRetailOrder`, `getOrderHistory`.
  - [ ] Додати `clearLocalStorageCart` action в `authSlice` (якщо ще не існує).
  - [ ] Налаштувати оптимістичні оновлення для обраного.
  - [ ] Перевірити взаємодію B2B та B2C кошиків.
  - [ ] Перевірити, що `createRetailOrder` коректно очищує `localStorageCart`.
  - [ ] Перевірити білд (`npm run build`).

- [ ] **Фаза 5: Фінальне очищення та аудит**
  - [ ] Видалити застарілі `operations.ts` файли або невикористовувані санки.
  - [ ] Видалити `dashboard/statsOperations.ts` (перенесено в `dashboardApi`).
  - [ ] Очистити `mainSlice` — залишити тільки `shopView`.
  - [ ] Очистити `authSlice` від `extraReducers` для cart/favorites (тепер в RTK Query).
  - [ ] Запустити тести, лінтер та перевірку форматування (`npm run lint`, `npm run prettier:check`).
  - [ ] Оновити `CHANGELOG.md` та `AGENTS.md`.

---

## 8. Пам'ятка розробнику (Шаблони коду)

### Створення нового ендпоінту:

```typescript
import { baseApi } from './baseApi';

export const customApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCustomData: build.query<ResponseType, RequestParams>({
      query: (params) => ({ url: '/endpoint', params }),
      providesTags: ['TagType'],
    }),
  }),
  overrideExisting: false, // Безпечний default — запобігає випадковому перезапису ендпоінтів
});

export const { useGetCustomDataQuery } = customApi;
```

### Використання в компоненті Next.js (Client Component):

```tsx
'use client';

import { useGetCustomDataQuery } from '@/lib/appState/api/customApi';

export function CustomWidget() {
  const { data, isLoading, isError } = useGetCustomDataQuery({ limit: 10 });

  if (isLoading) return <SkeletonLoader />;
  if (isError || !data) return <div>Помилка завантаження даних</div>;

  return <div>{/* Рендер даних */}</div>;
}
```

### Мутація з toast-повідомленням (рекомендований паттерн):

```tsx
'use client';

import { useDeleteProductMutation } from '@/lib/appState/api/productsApi';
import { toast } from 'react-toastify';

export function DeleteButton({ productId }: { productId: number }) {
  const [deleteProduct, { isLoading }] = useDeleteProductMutation();

  const handleDelete = async () => {
    try {
      await deleteProduct(productId).unwrap();
      toast.success('Товар успішно видалено');
    } catch (error) {
      toast.error('Помилка видалення товару');
    }
  };

  return (
    <button onClick={handleDelete} disabled={isLoading}>
      Видалити
    </button>
  );
}
```

### FormData мутація (для товарів з зображеннями):

```tsx
const [createProduct, { isLoading }] = useCreateProductMutation();

const handleSubmit = async (formData: FormData) => {
  try {
    await createProduct(formData).unwrap();
    toast.success('Товар успішно створено');
  } catch (error) {
    toast.error('Помилка створення товару');
  }
};
```
