# Changelog — INGCO Ukraine Frontend

Усі суттєві зміни у фронтенд-застосунку документуються в цьому файлі.
Формат базується на [Keep a Changelog](https://keepachangelog.com/uk/1.1.0/), версіонування — [SemVer](https://semver.org/).

---

## [Unreleased]

### [Refactor] RTK Query Migration — Phase 4 (Cart, Favorites, Orders & History)

- **Нові модулі API та виділена типізація**:
  - `cartApi.ts` та [`cartApi.types.ts`](file:///f:/code/repos/fe-ingco/src/lib/appState/api/cartApi.types.ts): реалізовано `getCart`, `addToCart`, `deleteFromCart` для B2B (`/users/cart`) та B2C (`/users/cart/retail`) з автоматичною нормалізацією цін через `normalizeProduct` та тегами `Cart`.
  - `favoritesApi.ts` та [`favoritesApi.types.ts`](file:///f:/code/repos/fe-ingco/src/lib/appState/api/favoritesApi.types.ts): реалізовано мутації `addFavorite` та `deleteFavorite` за контрактом `be-ingco-v2` (`POST/DELETE /users/favorites/:productId`) із авто-синхронізацією масиву обраного в Redux `authSlice.user.favorites` через `onQueryStarted`.
  - `ordersApi.ts` та [`ordersApi.types.ts`](file:///f:/code/repos/fe-ingco/src/lib/appState/api/ordersApi.types.ts): реалізовано `createOrder` (B2B, `/orders`), `createRetailOrder` (B2C, `/orders/retail`) з очищенням кошиків та інвалідацією тегів `['Cart', 'Order']`, а також `getOrderHistory` (`/orders`) для заміни застарілої санки `fetchHistoryThunk`.
- **Міграція компонентів користувацького інтерфейсу**:
  - [`CartTable.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/product/CartTable.tsx): переведено на `useGetCartQuery({ isRetail: false })`, `useAddToCartMutation`, `useDeleteFromCartMutation` та `useCreateOrderMutation`.
  - [`RetailCartTable.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/product/RetailCartTable.tsx): переведено на `useGetCartQuery({ isRetail: true })`, `useAddToCartMutation`, `useDeleteFromCartMutation` та `useCreateRetailOrderMutation`, додано автоматичне очищення гостьового `localStorageCart` при оформленні.
  - [`HistoryTable.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/product/HistoryTable.tsx): вилучено `useEffect` та санку `fetchHistoryThunk`; переведено на `useGetOrderHistoryQuery({ page, q, isRetail })`.
  - [`HeaderActions.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/header/HeaderActions.tsx) та [`MobileActions.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/header/MobileActions.tsx): лічильники кошика підключено до реактивного кешу `useGetCartQuery`.
  - [`ProductCard.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/product/ProductCard.tsx), [`ProductPageClient.tsx`](file:///f:/code/repos/fe-ingco/src/app/%28retail-catalog%29/%5BproductSlug%5D/ProductPageClient.tsx), [`ProductList.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/product/ProductList.tsx), [`ShopTable.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/product/ShopTable.tsx), [`ShopList.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/product/ShopList.tsx), [`HotOffers.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/home/HotOffers.tsx), [`SeriesComparison.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/home/SeriesComparison.tsx), [`ProductModal.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/modals/ProductModal.tsx): переведено всі дії додавання/видалення з кошика та обраного на мутації RTK Query.
- **Очищення Redux Slice та ліквідація санок**:
  - Додано редуктори `clearLocalStorageCart`, `setFavorites`, `setB2bCart`, `setRetailCart` у [`authSlice`](file:///f:/code/repos/fe-ingco/src/lib/appState/user/slice.ts) та вилучено застарілі `extraReducers`.
  - З [`mainSlice`](file:///f:/code/repos/fe-ingco/src/lib/appState/main/slice.ts) вилучено стан `history` та пагінацію, зведено слайс до єдиного стану UI `shopView`.
  - З [`user/operation.ts`](file:///f:/code/repos/fe-ingco/src/lib/appState/user/operation.ts) вилучено 7 санок: `getUserCartThunk`, `addProductToCartThunk`, `deleteProductFromCartThunk`, `addFavoriteProductThunk`, `deleteFavoriteProductThunk`, `createOrderThunk`, `createRetailOrderThunk`.
  - З [`main/operations.ts`](file:///f:/code/repos/fe-ingco/src/lib/appState/main/operations.ts) вилучено санку `fetchHistoryThunk`.

### [Refactor] RTK Query Migration — Phase 3 (Products Catalog & Admin Products)

- **Модуль `productsApi.ts` та типізація `productsApi.types.ts`**:
  - Реалізовано запити каталогу `getProducts` з мапінгом пошукового параметра `q`, приведенням `category` до числового типу, сортуванням, фільтрами характеристик та автоматичною гідратацією через `normalizeProduct`.
  - Реалізовано `getProductBySlug` та `getProductById` з кешуванням за числовим тегом `{ type: 'Product', id }`.
  - Реалізовано мутації `createProduct` та `updateProduct` з підтримкою `FormData` (файли зображень, JSON-масиви `characteristics`, `categoryIds`, `badgeIds`, `existingImages`), а також `deleteProduct` з інвалідацією тегів `{ type: 'Product', id }` та `LIST`.
- **Міграція компонентів каталогу та адмін-панелі**:
  - [`ProductList.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/product/ProductList.tsx) та [`ShopTable.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/product/ShopTable.tsx): вилучено `useEffect` з багатопараметричними залежностями та `fetchMainTableDataThunk`; переведено на декларативний хук `useGetProductsQuery` з прапорцем `skip: isFavoritePage`.
  - [`FiltersBlock.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/catalog/FiltersBlock.tsx): ізольовано від глобального масиву товарів, додано пропси `total` та `shownCount`.
  - [`ProductTable.tsx`](file:///f:/code/repos/fe-ingco/src/app/dashboard/tables/ProductTable.tsx): переведено на `useGetProductsQuery` та `useDeleteProductMutation` з автоматичним оновленням таблиці після видалення.
  - [`AdminProductForm.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/forms/AdminProductForm.tsx): замінено санки створення та оновлення на `useCreateProductMutation` та `useUpdateProductMutation`, додано блокування кнопок від повторних натискань.
  - [`ProductPageClient.tsx`](file:///f:/code/repos/fe-ingco/src/app/%28retail-catalog%29/%5BproductSlug%5D/ProductPageClient.tsx): замінено селектори `reduxProduct`/`products` на `useGetProductBySlugQuery` та усунуто прямий виклик `apiIngco.get('/products', ...)` для B2B рекомендацій через `useGetProductsQuery`.
  - [`[productId]/page.tsx`](file:///f:/code/repos/fe-ingco/src/app/dashboard/product/edit/%5BproductId%5D/page.tsx): переведено на `useGetProductByIdQuery(productId)`, усунуто ручний стан завантаження та `useEffect`.
- **Очищення Redux Slice та ліквідація санок**:
  - З [`mainSlice`](file:///f:/code/repos/fe-ingco/src/lib/appState/main/slice.ts) видалено поля `products`, `product`, `tableLoading`, `productLoading`, `total`.
  - З [`main/operations.ts`](file:///f:/code/repos/fe-ingco/src/lib/appState/main/operations.ts) видалено санки `fetchMainTableDataThunk`, `getProductByIdThunk`, `getProductBySlugThunk`, `deleteProductThunk`.
  - З [`dashboard/operations.ts`](file:///f:/code/repos/fe-ingco/src/lib/appState/dashboard/operations.ts) видалено санки `createProductThunk` та `updateProductThunk`.

### [Refactor] RTK Query Migration — Phase 2 (CRM & Admin Dashboard)

- **Модуль `dashboardApi.ts`**:
  - Реалізовано ендпоінти RTK Query для керування користувачами (`getUsers`, `createUser`, `updateUser`, `deleteUser`, `restoreUser`) з обов'язковою нормалізацією `normalizeUser` та тегами `User`, `LIST`, `DashboardStats`.
  - Реалізовано замовлення CRM (`getDashboardOrders` за маршрутом `/orders/all` та `updateDashboardOrder` з підтримкою роздрібного/гуртового роутингу) з тегами `Order` та `LIST`.
  - Реалізовано тікети підтримки (`getSupportTickets`, `updateSupportTicket`), аналітику (`getUsersStats`, `getProductClicks`, `getUserActivity`) та синхронізацію з Google Merchant Center (`getGmcStatus`, `syncGmcProducts`).
- **Міграція компонентів та усунення побічних ефектів**:
  - Переведено на хуки RTK Query компоненти `UserTable`, `OrderTable`, `SupportTable`, `UsersStats`, `UserActivityChart`, `PieChart`, `GoogleMerchantSyncCard`, модальні вікна `AdminUserModal`, `AdminOrderModal`, `SupportTicketModal` та сторінку `users/create`.
  - Вилучено побічні ефекти (`toast.success` та `toast.error`) з редукторів `dashboardSlice` — перенесено в компоненти через `.unwrap()`.
  - Очищено `dashboardSlice` від дублюючого серверного стану.

## [2.4.0] — 2026-08-31

### [UI/UX] SubHeader Contrast & Navigation Polish

- **Контрастність та доступність верхньої навігації**:
  - У [`SubHeader.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/header/SubHeader.tsx) підвищено контраст базового тексту (`text-neutral-800 font-semibold text-sm`) та впроваджено чітку акцентну нижню смужку для активного пункту (`after:h-[2px] after:bg-amber-500 after:rounded-full`).
  - Виділено компонент `SubHeaderLink` з повною підтримкою доступності (`aria-current="page"`, `aria-label="Додаткова навігація"`, `focus-visible`).
  - Додано візуальний вертикальний розділювач перед віджетом курсу валют та покращено контрастність тексту у [`CurrencyRate.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/header/CurrencyRate.tsx).

### [Security] / [UX] Password Strength & Visibility Components

- **Інтерактивна валідація та індикатор надійності пароля**:
  - Створено компонент [`PasswordStrengthIndicator.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/forms/PasswordStrengthIndicator.tsx) для наочного динамічного оцінювання складності пароля (довжина, великі/малі літери, цифри, спецсимволи).
  - Створено уніфіковане поле введення [`PasswordInput.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/forms/PasswordInput.tsx) із перемикачем видимості пароля (`Eye` / `EyeOff`), інтегроване у форми реєстрації роздрібних клієнтів, відновлення пароля та авторизації.

### [Changed] Admin Product Characteristics & Attribute Binding

- **Транслітерація та точна прив'язка характеристик**:
  - У [`AdminProductForm.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/forms/AdminProductForm.tsx) інтегровано `slugifyCyrillicToLatin()` для автоматичного формування валідних латинських кодів атрибутів.
  - Посилено відповідність введених характеристик довіднику `availableAttributes` за комбінацією коду та назви без урахування регістру для збереження зв'язку та підтримки множинних атрибутів (`isMultiple`).

### [Fixed] / [Pricing] B2B Related Products & Zero-Price Public Offer Protection

- **Відновлення партнерських цін у блоці «Купують разом»**:
  - У [`ProductPageClient.tsx`](file:///f:/code/repos/fe-ingco/src/app/%28retail-catalog%29/%5BproductSlug%5D/ProductPageClient.tsx) реалізовано автоматичне клієнтське дозавантаження рекомендаційного блоку з параметром `isRetail: false` для авторизованих B2B-партнерів замість використання роздрібного SSR-снапшоту з вирізаними цінами.
- **Глобальний захист від публічної оферти «0 ₴» та «$0.00 / од.»**:
  - Впроваджено статус **«Ціна за запитом»** замість відображення `0 ₴` або `$0.00 / од.` для товарів без встановлених цін по всіх картках, каталогах, слайдерах та модальних вікнах ([`ProductCard.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/product/ProductCard.tsx), [`ProductPageClient.tsx`](file:///f:/code/repos/fe-ingco/src/app/%28retail-catalog%29/%5BproductSlug%5D/ProductPageClient.tsx), [`ShopTable.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/product/ShopTable.tsx), [`ProductModal.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/modals/ProductModal.tsx), [`HotOffers.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/home/HotOffers.tsx), [`SeriesComparison.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/home/SeriesComparison.tsx)).
  - Заблоковано помилковий розрахунок маржі `100%` за відсутності оптової ціни.
  - Замінено кнопку «В кошик» для товарів із нульовою ціною на інтерактивну кнопку **«Уточнити ціну»** з відкриттям [`ConsultationModal`](file:///f:/code/repos/fe-ingco/src/app/ui/modals/ConsultationModal.tsx) та автоматичним заповненням назви й артикулу.

## [2.3.0] — 2026-08-27

### [Security] Cloudflare Turnstile Integration & Bot Protection

- Створено модульний клієнтський React-компонент [`TurnstileWidget`](file:///f:/code/repos/fe-ingco/src/app/ui/utils/TurnstileWidget.tsx) з автоматичним завантаженням скрипта Cloudflare, підтримкою темної/світлої теми, контекстних дій (`action`) та безпечним життєвим циклом (single-use token reset через declarative key-management).
- Інтегровано Turnstile віджет у всі публічні форми:
  - Форма реєстрації роздрібного клієнта (`RegisterClient-form.tsx`)
  - Форма реєстрації B2B-партнера (`RegisterPartner-form.tsx`)
  - Форма відновлення пароля (`ForgotClient.tsx`)
  - Роздрібне оформлення замовлення в кошику (`RetailCartTable.tsx`)
  - Сторінка підтримки (`SupportClient.tsx`)
  - Модальне вікно зворотного дзвінка менеджера (`CallbackModal.tsx`)
  - Модальне вікно консультації по товару (`ConsultationModal.tsx`)
  - Секція консультації на головній сторінці (`ConsultationCTA.tsx`)
- Оновлено Redux thunks (`registerClientThunk`, `registerThunk`, `forgotPasswordThunk`, `createRetailOrderThunk`, `supportTicketThunk`) для передачі `turnstileToken` на бекенд.

### [Fixed] / [Pricing] Dynamic isRetail & B2B Wholesale Catalog Unification

- **Відновлення оптових цін та уніфікація B2B/B2C каталогів**:
  - Виправлено зникнення оптових цін (`price` в USD) та відображення нульових цін для авторизованих B2B-партнерів при переході на сторінки категорій (`/categories/[categorySlug]`) та при пошуку чи пагінації.
  - Створено компонент [`CatalogClientView.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/catalog/CatalogClientView.tsx) із захистом від hydration mismatch (`useSyncExternalStore`), який динамічно відображає [`ShopTable`](file:///f:/code/repos/fe-ingco/src/app/ui/product/ShopTable.tsx) для B2B-партнерів та [`ProductList`](file:///f:/code/repos/fe-ingco/src/app/ui/product/ProductList.tsx) для роздрібних користувачів на всіх сторінках каталогу.
  - Додано уніфіковані хуки `useIsB2B()` та `useActiveCategory()` у [`src/lib/hooks.tsx`](file:///f:/code/repos/fe-ingco/src/lib/hooks.tsx) для безпечного та консистентного визначення статусу B2B та категорій.
  - Усунено захардкоджений параметр `isRetail: true` у `ProductList.tsx` для завантаження товарів та додавання в кошик.

### [Fixed] / [Feed] Prom.ua XML Feed Generation

- **Підтримка множинних характеристик та типобезпечність експорту**:
  - Виправлено фатальну помилку `TypeError (500 Internal Server Error)` у [`/api/feed/prom`](file:///f:/code/repos/fe-ingco/src/app/api/feed/prom/route.ts), яка виникала при спробі обробити масиви значень характеристик (`isMultiple: true`).
  - Додано безпечне об'єднання значень масивів через кому `, ` та посилено захист функцій `escapeXml` і `wrapCdata` для роботи з будь-якими типами даних.
  - Додано захисні значення за замовчуванням для числових та строкових полів товару (`countInStock`, `priceRetailRecommendation`, `rrcSale`, `slug`, `article`, `category`).

### [Added] / [UX] Catalog Mega Menu Redesign

- Модернізовано дизайн та UX десктопного Мега-меню каталогу ([`CatalogDrawer.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/header/CatalogDrawer.tsx)):
  - **Sentence Case типографіка**: прибрано `uppercase` для назв підкатегорій, оптимізовано читабельність технічних назв.
  - **3-зонна структура (3 + 6 + 3)**: ліве дерево категорій (25%), 2-колонкова зона підкатегорій (50%) та повнорозмірна вертикальна промо-картка лінійки P20S (25%).
  - **Ліквідація пустот**: повністю усунуто вільний простір по центру випадаючого вікна каталогу.

### [Fixed] / [Security] Auth Rehydration & Admin Dashboard Access

- **Регідрація сесії та синхронізація Cookies**:
  - Усунено проблему, коли після збереження стану авторизації в `localStorage` cookies `token` та `role` ставали недійсними або були відсутні, через що Next.js middleware блокував перехід у `/dashboard` без будь-якої візуальної реакції.
  - Впроваджено миттєву синхронізацію cookies та фонову валідацію сесії при ініціалізації додатку в [`StoreProvider.tsx`](file:///f:/code/repos/fe-ingco/src/app/service/StoreProvider.tsx).
- **Обробка переходу в адмінку з нотифікацією помилок**:
  - У [`UserModal.tsx`](file:///f:/code/repos/fe-ingco/src/app/ui/modals/UserModal.tsx) замінено пасивне посилання на інтерактивний перехід з попередньою перевіркою валідності токена та ролі (case-insensitive `ADMIN` / `admin`).
  - Додано безпечне відображення помилки через `react-toastify` (_«Не вдалося виконати перехід. Спробуйте оновити сторінку або увійти знову.»_) у разі недоступності чи невалідності сесії без розкриття захищених шляхів.

---

## [2.2.0] — 2026-08-25

### [Added] / [UX] Layout & Ultra-Wide Responsiveness

- Впроваджено єдиний адаптивний стандарт макета `max-w-[1680px] mx-auto` для великих та Ultra-Wide (2K, 4K, 2560px–3840px) екранів.
- Уніфіковано центрування та вирівнювання за спільною вертикальною віссю для Шапки (`Header`, `SubHeader`, `CatalogDrawer`), Каталогу (`page.tsx`), Лендінгу (`RetailHero`, `HotOffers`, `CategoryGrid` тощо), Сторінки товару (`ProductPageClient`), Футера (`Footer`) та сервісних сторінок.
- Оптимізовано щільність карток товарів у каталозі, усунуто надмірне розтягування та надвеликі білі проміжки між 4 колонками.

### [Fixed]

- Виправлено логіку фолбеку в `normalizeProduct`: за відсутності `priceRetailRecommendation` (РРЦ у грн) встановлюється `0` замість підміни оптовою доларовою ціною (`price` в USD).

---

## [2.1.1] — 2026-08-25

### [Fixed]

- Посилено функцію `normalizeProduct` захисними перевірками проти `NaN` при відсутності або некоректному форматі цінових полів від бекенду.

### [Pricing] Formatting

- Прибрано копійки/дробові частини з відображення цін у гривні (`Math.round`) по всьому роздрібному каталогу та картках товарів зі збереженням точного форматування для цін у доларах (`.toFixed(2)`).

---

## [2.1.0] — 2026-08-24

### [Changed] State & API Integration

- Адаптація запитів каталогу з параметром `isRetail` для розмежування B2B оптових цін та B2C РРЦ.
- Покращено обробку помилок API та лімітів запитів (HTTP 429) через `serializeAxiosError`.

### [Performance] SEO & Metadata

- Додано та оптимізовано `llms.txt` та `llms-full.txt` для індексації структури магазину та специфікацій інструментів штучним інтелектом.
- Оптимізація генерації карти сайту (`next-sitemap`).

---

## [2.0.0] — 2026-08-01

### [Added] Initial Release (V2 Frontend)

- Повний перехід на стек: Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn v4, Redux Toolkit.
- Реалізовано 3 користувацькі режими:
  - **B2C Роздріб**: споживчий каталог товарів, швидке оформлення замовлення, кошик, список бажаного.
  - **B2B Опт**: табличний каталог з гуртовими цінами, експорт у CSV/Excel, специфічні B2B-замовлення.
  - **CRM Admin Dashboard** (`/dashboard`): керування товарами, категоріями, замовленнями, користувачами та аналітика кліків.
- Впроваджено єдину систему типізації TypeScript та централізоване керування станом кошика/авторизації.
