# Changelog — INGCO Ukraine Frontend

Усі суттєві зміни у фронтенд-застосунку документуються в цьому файлі.
Формат базується на [Keep a Changelog](https://keepachangelog.com/uk/1.1.0/), версіонування — [SemVer](https://semver.org/).

## [2.12.1] — 2026-10-15

### [Security] Dynamic Monomarket Whitelist & Shop-in-Shop Guidance (`/dashboard/integrations`)

- **Видалення захардкоджених IP-адрес із публічного репозиторію (`MonomarketCard.tsx`)**: видалено константу `MONO_WHITELIST_IPS`. Тепер список довірених IP-адрес для вайтлістингу на сервері підвантажується динамічно через захищений бекенд-ендпоінт `GET /api/feeds/status` лише авторизованим адміністраторам.
- **RTK Query інтеграція (`dashboardApi.ts`, `dashboardApi.types.ts`, `baseApi.ts`)**: додано тип `FeedsStatusOverview`, тег кешу `FeedsStatus` та хук `useGetFeedsStatusQuery`.
- **Інструкції щодо Shop-in-Shop шерингу та 429 (`MonomarketCard.tsx`)**: додано роз'яснення щодо переваг шерингу лінків із брендової вітрини у monobank та рекомендації щодо вайтлістингу IP на рівні Nginx / Fail2ban.

---

## [2.12.0] — 2026-10-12

### [Changed] Registration Role Selection UX Redesign & Optional Patronymic (`/auth/register`)

- **Інтерактивні картки вибору типу акаунту (`SwitchRegisterForms.tsx`)**: замінено малопомітні текстові вкладки `Клієнт | Партнер` на дві великі контрастні картки з іконками (`ShoppingBag` для роздрібного клієнта та `Briefcase` для B2B-партнера), індикатором обраного стану (`CheckCircle2`) та мікро-описом для кожного сегмента.
- **Контекстний інфо-банер (`SwitchRegisterForms.tsx`)**: додано динамічний пояснювальний банер під картками вибору ролі зі швидкою кнопкою перемикання на вкладку «Партнер (B2B)» для оптових покупців.
- **Компактна двоколонкова сітка форм (`RegisterClient-form.tsx`, `RegisterPartner-form.tsx`, `register/page.tsx`)**: поля `Прізвище` та `Ім'я` об'єднано в один адаптивний рядок (`grid-cols-1 sm:grid-cols-2`), уніфіковано висоту інпутів (`py-[16px]`) та розширено контейнер сторінки реєстрації до `max-w-[500px]`.
- **Необов'язкове поле «По батькові» (`validationSchema.ts`, `RegisterClient-form.tsx`, `RegisterPartner-form.tsx`, `UserForm.tsx`, `utils.ts`)**: зроблено `surName` опціональним при реєстрації клієнта, B2B-партнера та створенні користувача в адмін-панелі; додано безпечний фолбек `surName` у `normalizeUser`.

### [Changed] Contact Information Centralization & Legal Pages Refactoring

- **Централізація контактів (`constants.ts`, `AboutUs.tsx`, `ContactsClient.tsx`, `partnership/page.tsx`, `layout.tsx`)**: оновлено робочу адресу електронної пошти на `service@ingcoua.com.ua`, замінено плейсхолдерний телефон `+380800000000` на сторінці партнерства, прив'язано телефони офлайн-магазинів та мікророзмітку JSON-LD Schema до єдиного джерела істини `CONTACTS` (`PHONES`, `EMAIL`) та `SOCIAL_LINKS`.
- **Спільний компонент `LegalContactSection` (`src/app/ui/legal/LegalContactSection.tsx`)**: усунено дублювання контактного блоку на 6 юридичних сторінках (`offer`, `terms`, `shipping`, `returns`, `privacy`, `cookies`).
- **Рефакторинг сторінки контактів (`ContactsClient.tsx`)**: видалено бібліотеку `useMediaQuery` та дубльовану розмітку десктоп/мобайл, переведено верстку на чистий адаптивний CSS (Tailwind), усунуто ризики гідратаційного розходження (SSR hydration mismatch).

---

## [2.11.3] — 2026-09-26

### [Changed] About Us Page Conceptual & Visual Redesign (`/about-us`)

- **Концептуальний редизайн «Офіційний імпортер» (`AboutUs.tsx`, `Hero.tsx`)**: сторінку адаптовано під позиціювання генерального імпортера INGCO в Україні замість копіювання партнерського гайду. Додано блок Hero з семантичним `<h1>`, бейджами довіри (180+ країн, 2000+ найменувань, 100% оригінал) та вітриною системи 20V P20S.
- **Відмова від важкого слайдера (`Hero.tsx`)**: замінено бібліотеку `react-slick` на статичний адаптивний Next.js `Image`, що прискорило LCP та усунуло зсуви макета (CLS).
- **Оновлені картки переваг (`Features.tsx`)**: реалізовано 4 сучасні картки з іконками `lucide-react` (`ShieldCheck`, `BatteryCharging`, `Globe2`, `Wrench`), що замінили застарілу верстку та вилучили невикористовуваний масив `featuresContentArray` з [`constants.ts`](file:///f:/code/repos/fe-ingco/src/lib/constants.ts).
- **Порівняння серій інструментів (`AboutBrand.tsx`)**: оновлено візуальний блок лінійок `INDUSTRIAL` (темна картка) та `STANDARD` (світла картка з виразною рамкою фірмового кольору `border-2 border-amber-500` для кращого візуального контрасту на білому фоні).
- **Інтерактивні офлайн-представництва (`AboutUs.tsx`)**: картки фірмових магазинів (Вижниця та Герца) з прямими Google Maps посиланнями (включно з точкою на карті для Вижниці), робочим графіком та прямими посиланнями `tel:`.
- **Розмежування з B2B-партнерством (`B2BCallout.tsx`)**: додано компактний банер-виклик з переходом на спеціалізовану сторінку [`/about-us/partnership`](file:///f:/code/repos/fe-ingco/src/app/about-us/partnership), усунувши дублювання B2B-інформації на сторінці «Про нас».

### [Fixed] SEO Metadata, Heading Hierarchy & A11y Violations

- **Виправлення копіпаст-помилки в SEO-тайтлі (`page.tsx`)**: замінено некоректний заголовок `'INGCO - Головна сторінка'` на `'Про компанію INGCO Україна | Офіційний імпортер інструменту'` з релевантним OpenGraph описом.
- **Нормалізація ієрархії заголовків (H1 -> H2 -> H3)**: сторінка починається з єдиного видимого `<h1>` у Hero, всі підрозділи використовують `<h2>`, а картки переваг та філій — `<h3>`.
- **Контрастність за стандартом WCAG AA (`PartnerGuide.tsx`)**: замінено низькоконтрастний колір `text-orange-light` на білому фоні на семантичні контрастні відтінки бурштинового (`text-amber-800`, `text-amber-600`).
- **Типографіка та орфографія**: виправлено помилки в термінах («СТАНДАРТНА» замість «СТАНДАРТНАТА», коректне кириличне «Сб» у графіку роботи, узгоджено форму «акаунт»).

---

## [2.11.2] — 2026-09-26

### [Fixed] Product Page SEO, Heading Hierarchy & Schema.org Optimization

- **Єдиний валідний H1 (`ProductPageClient.tsx`)**: усунено приховування `<h1>` на десктопі (`lg:hidden`) та поділ назви товару на `<h1>`/`<h2>`. Назва товару уніфікована в єдиний видимий на всіх пристроях `<h1>`, розміщений на початку секції продукту.
- **Нормалізація каскадності заголовків H1–H6**:
  - `CatalogSidebar.tsx`: заголовки «Категорії» та «Характеристики» понижено з `<h2>` до `<h3>`, завдяки чому `<h1>` товару є першим заголовком сторінки в DOM.
  - `ProductCard.tsx`: назви товарів у блоці «Купують разом» понижено з `<h2>` до `<h3>`.
  - `ProductReviewsSection.tsx`: плейсхолдер порожнього стану замінено з `<h3>` на семантичний `<p>`.
- **Консолідація мікророзмітки Schema.org (`layout.tsx`, `metadata.ts`)**:
  - Усунено дублювання схеми `@type: "Product"` шляхом видалення клієнтського тегу та централізації єдиного серверного JSON-LD скрипта з підтримкою масиву фотографій, рейтингу, посилання на офер та XSS-екранування `\u003c`.
  - `Breadcrumbs.tsx`: виправлено подвоєння пункту «Головна» на позиціях 1 і 2 у Schema.org `BreadcrumbList`.
  - `metadata.ts`: очищено артикул від хвостових пробілів (`sku.trim()`), оптимізовано мета-опис до 155–160 символів, розширено поля OpenGraph товарними даними (`product:price:amount`, `product:price:currency`, `product:availability`).
- **Доступність (A11y) та LCP зображень**:
  - `ProductPageClient.tsx`: додано `aria-label` для кнопок лічильника кількості (`+`, `-`) та інпуту, оновлено `alt` мініатюр галереї.
  - `ProductImageMagnifier.tsx` та `ProductCard.tsx`: додано оптимізовані брейкпоінти атрибута `sizes` для запобігання надмірному запиту 4K-зображень.

---

## [2.11.1] — 2026-09-25

### [Added] B2B Wholesale Price ($) Support in Spreadsheet Quick Editor

- **Перемикач видимості оптових цін (`b2b=1`)**: додано кнопку-перемикач «Показати опт ($)» над таблицею, стан якого зберігається в URL-параметрах дешборду. За замовчуванням колонка схована для чистоти роздрібного інтерфейсу.
- **Контрастне візуальне позначення інпуту**: колонка оформлена в насичених смарагдових тонах із символом `$` всередині поля вводу.
- **Автоматичний перерахунок у гривні**: під кожним інпутом у реальному часі відображається орієнтовна сума в гривнях (`≈ X XXX ₴`) на основі живого курсу Monobank (`useGetCurrencyRatesQuery`).
- **Захист від плутанини валют (Sanity Check)**: впроваджено обов'язкову валідацію як для одиничного збереження, так і для пакетного (`handleBatchSave`), яка блокує збереження, якщо оптова ціна в $ перевищує РРЦ у грн (`price > priceRetailRecommendation`), запобігаючи випадковому введенню гривень у доларове поле.

---

## [2.11.0] — 2026-09-24

### [Added] Spreadsheet Quick Editor (`/dashboard/product/sheets`)

- **Швидкий табличний редактор товарів**: створено спеціалізовану сторінку для адміністраторів та менеджерів для швидкого редагування назви, цін (РРЦ, Акція) та залишків без відкриття модальних форм.
- **Живий контроль довжини назви (monoмаркет)**: додано динамічний індикатор довжини символів `[ XX / 100 ]` з кольоровим маркуванням (зелений $\le 80$, помаранчевий $81..100$, червоний $> 100$) та автоматичне блокування збереження при перевищенні ліміту.
- **Стан локальних чернеток (Draft Store)**: збереження всіх відредагованих значень у клієнтському стані без втрати даних під час перемикання фільтрів, пошуку та пагінації.
- **Підсвічування змінених рядків**: рядки з незбереженими даними м'яко виділяються кольором для миттєвої орієнтації.
- **Пакетне та поодиноке збереження**: підтримка збереження як окремого рядка (по `Enter` або кліку на галочку), так і всіх змінених товарів однією дією «Зберегти всі зміни (N)» (`Ctrl+S`).
- **Захист від випадкової втрати даних**: інтегровано `window.beforeunload` при наявності незбережених правок.
- **Фільтри та сортування**: швидкі таби «Всі товари», «Назва > 100 симв.», «Змінені», «Немає на складі», пошук за артикулом/назвою та фільтрація за категоріями.
- **Навігація**: додано пункт «Швидкий редактор» з іконкою `TableProperties` у сайдбар адмінпанелі [`Sidebar.tsx`](file:///F:/code/repos/fe-ingco/src/app/dashboard/Sidebar.tsx).

### [Changed] Dashboard Navigation & Analytics Cleanup

- **Вимкнення сторінки статистики (`Sidebar.tsx`, `statistics/page.tsx`)**: вилучено розділ «Статистика» з бічної панелі навігації дешборду та налаштовано миттєвий редирект із `/dashboard/statistics` на `/dashboard`.
- **Деактивація трекінгу кліків (`ProductBlockList.tsx`, `ShopTable.tsx`, `hooks.tsx`, `operations.ts`)**: відключено фонову відправку мережевих запитів (`trackProductClickThunk`) при кліках на товари в каталозі та B2B-таблиці, усунувши зайвий мережевий оверхед.

---

## [2.10.0] — 2026-09-20

### [Added] Product Image Magnifier & Fullscreen Lightbox Gallery

- **Внутрішній магніфаєр (`ProductImageMagnifier.tsx`)**: плавне 2.2x збільшення при наведенні курсору миші на десктопі з фокусуванням на точці під курсором (`transform-origin: X% Y%`) без виходу за межі картки.
- **Повноекранний лайтбокс (`ProductLightboxModal.tsx`)**: модальна галерея високої роздільної здатності при кліку на зображення, з кнопками навігації, лічильником фотографій («1 з 2»), смугою мініатюр і кнопкою зуму 2.5x.
- **Мобільна адаптивність та ергономіка**: підтримка свайпів вліво/вправо для перемикання ракурсів, свайпу донизу для закриття, double-tap для швидкого зуму, панорамування при наближенні та підтримка Safe Area (iOS).
- **Клавіатурна доступність**: керування стрілками `←` / `→` для гортання та `Escape` для швидкого закриття, блокування скролу фонової сторінки під час перегляду.

### [Fixed] Product Page Layout Alignment

- **Синхронізація меж хедера та сторінки (`ProductPageClient.tsx`)**: уніфіковано структуру контейнерів хлібних крихт, табів навігації та блоку товару під єдиний стандарт сайту `max-w-[1680px] mx-auto px-4 md:px-8 xl:px-[60px]`, усунувши вихід контенту за межі хедера на десктопних і широкоформатних екранах.
- **Стан завантаження (`ProductSkeleton`)**: додано центроване обмеження `max-w-[1680px]` та адаптивні відступи.

### [Changed] Golden-Mean Hero Gallery & Buy Box Sizing

- **Балансування сітки**: перерозподілено співвідношення колонок із `7 / 5` на симетричне `6 / 6` (`lg:col-span-6`), що надало картці замовлення достатній простір і запобігло надмірному розтягуванню фото.
- **Верхній ліміт контейнера (`max-w-[580px] mx-auto`)**: обмежено максимальну ширину картки фотографії, щоб зображення низької роздільної здатності (400–500px) не розмивалися від надмірного збільшення.

---

## [2.9.0] — 2026-09-15

### [Added] Google Ads & GA4 E-Commerce Conversion Tracking

- **Модуль аналітики (`src/lib/analytics.ts`)**: централізований трекінг конверсій Google Ads (`AW-6418216331`) та GA4 `purchase` події.
- **Enhanced Conversions**: передача хешованого/нормалізованого номера телефону та email покупця для точного обліку в iOS/Safari.
- **Root Layout (`src/app/layout.tsx`)**: інтеграція Google Tag `gtag.js` через `<Script strategy="afterInteractive" />`.
- **Захист від дублікатів**: дедуплікація повторних фіксацій транзакції через `sessionStorage`.

### [Changed] Cart UI/UX Redesign & Responsiveness

- **Мобільна адаптивність (`CartItemsTable.tsx`)**: окремий картковий макет для екранів `< 768px`, що повністю ліквідував горизонтальний скрол та зробив кнопки видалення і степери легкодоступними.
- **Числовий ввід кількості (`CartQuantityControl.tsx`, `useCart.ts`, `slice.ts`)**: підтримка прямого набору цифр з клавіатури з фіксацією на `Enter` або `onBlur` та синхронізацією зі стейтом.
- **2-колонковий Desktop макет (`CartView.tsx`)**: 65% робоча зона списку та форм + 35% фіксована картка «Разом до сплати» з бейджами гарантії, повернення 14 днів та фірмовою кнопкою INGCO Amber.
- **Спрощення оформлення (`RetailCheckoutForm.tsx`, `ordersApi.types.ts`, `validationSchema.ts`)**: 2×2 сітка контактів, необов'язкове поле «По батькові» без зірочки, чистий блоковий дизайн.
- **Порожній кошик (`CartView.tsx`)**: інтерактивний екран із закликом до дії та кнопкою «Перейти до каталогу».

### [Refactored] Categories Filter API & Anti-Pattern Cleanup

- **RTK Query інтеграція (`categoriesApi.ts`, `CatalogSidebar.tsx`, `CategoryForm.tsx`)**: додано ендпоінт `getCategoryFilters`, замінено прямі виклики `fetch` у компонентах на декларативний хук `useGetCategoryFiltersQuery`, забезпечивши автоматичне кешування та дотримання єдиного джерела правди.

---

## [2.8.0] — 2026-09-14

### [Added] Integration Sync Logs & Audit History UI

- **Модальне вікно історії запусків (`SyncHistoryModal.tsx`)**:
  - Розроблено модальне вікно перегляду історії синхронізацій із деталізацією: статус виконання (кольоровий бейдж), дата й точний час, тривалість у секундах, ініціатор запуску (користувач або система), лічильники позицій (всього, успішно, з помилкою) та блок помилки.
  - Додано кнопку «Історія запусків» у шапку `GoogleMerchantCard`.
- **RTK Query Endpoints & Caching (`dashboardApi.ts`, `baseApi.ts`)**:
  - Додано нові теги `SyncLog` та `SystemSetting` у `baseApi`.
  - Реалізовано хуки `useGetSyncLogsQuery`, `useGetSystemSettingsQuery`, `useUpdateSystemSettingMutation`.
  - Налаштовано автоматичну інвалідацію тегу `SyncLog` при виконанні мутації `syncGmcProductsMutation`.
- **Типізація (`dashboardApi.types.ts`)**:
  - Додано суворі інтерфейси `SyncLogItem`, `SyncLogUser`, `SyncServiceType`, `SyncStatus`, `SystemSettingItem`, `GetSyncLogsParams` без `any`.

---

## [2.7.0] — 2026-09-14

### [Added] Integrations Hub & Monomarket Feeds

- **Хаб інтеграцій (`/dashboard/integrations`)**:
  - Створено централізовану сторінку для керування всіма зовнішніми фідами та каналами збуту.
  - Додано пункт «Інтеграції» в головне меню `Sidebar.tsx`.
  - Перенесено віджет синхронізації `GoogleMerchantSyncCard` з головної сторінки товарів (`/dashboard`) у хаб інтеграцій, очистивши інтерфейс керування продуктами.
  - Реалізовано компонент `FeedCopyLink` із копіюванням посилань у буфер обміну в один клік, зворотним зв'язком («Скопійовано!») та кнопкою тестування у новій вкладці (відповідає правилу 11.3 через `useSyncExternalStore`).
- **Картка monoмаркет (`MonomarketCard`)**:
  - Інтегровано посилання на контентний XML-фід та динамічний JSON-фід цін.
  - Додано пам'ятку для менеджерів та перелік IP Whitelist (`13.53.52.37`, `16.16.42.238`, `13.50.222.109`, `16.171.78.185`, `13.48.150.45`).
- **Картка Prom.ua (`PromUaCard`)**:
  - Розміщено посилання на автоматичний XML-фід та кнопки швидкого експорту файлів XLSX.
- **Проксі-роути для маркетплейсів (`/api/feed/monomarket`, `/api/feed/monomarket/prices`, `/api/feed/prom`)**:
  - Створено надшвидкі роути в Next.js App Router, що проксують відповіді від оптимізованого NestJS бекенду.
  - Повністю оптимізовано Prom.ua фід: замінено важкий клієнтський цикл з 25 HTTP-запитів на миттєвий проксі до бекенду.
  - Налаштовано кешування на 180 хвилин (3 години / 10 800 секунд) з HTTP-заголовком `Cache-Control: public, s-maxage=10800, stale-while-revalidate=1800`.
- **Типізація**:
  - Додано суворі інтерфейси `MonomarketPriceFeedResponse`, `IntegrationFeedLink`, `IntegrationCardConfig` у `src/lib/types/integrations.types.ts` без слабких типів чи `any`.

---

## [2.6.0] — 2026-09-09

### [Added] Payment Gateway & Monobank Acquiring Integration

- **Вибір способів оплати**: у роздрібному кошику (`RetailCartTable.tsx`) та оптовому кошику (`CartTable.tsx`) додано інтерактивний вибір:
  - `CARD` — оплата карткою онлайн (Monobank / Visa / Mastercard).
  - `CASH` — оплата при отриманні (післяплата у відділенні).
  - `ENTERPRISE` — оплата за реквізитами (IBAN для юридичних осіб та ФОП).
- **Автоматичний перехід на оплату**: при виборі онлайн-оплати користувач безпосередньо після оформлення перенаправляється на платіжну сторінку банку (`data.paymentUrl`).
- **Обробка результатів оплати**: реалізовано показ тостів стану оплати при поверненні на `/cart?payment=status` з автоматичним безшовним очищенням адресного рядка через `window.history.replaceState`.
- **Оновлена типізація**: розширено типи `Order`, `PaymentMethod`, payload замовлень новими платіжними полями (`paymentMethod`, `paymentStatus`, `paymentUrl`, `paymentInvoiceId`).

### [Refactor] / [UX] Cart Architecture & Guest Migration

- **Композиційна уніфікація кошика (`src/app/ui/cart/`)**: ліквідовано монолітні дубльовані файли `CartTable.tsx` та `RetailCartTable.tsx`. Створено модульні компоненти `CartView`, `CartItemsTable`, `CartQuantityControl`, `PaymentMethodSelector`, `NovaPoshtaDelivery`. Форми чекауту переведено на React Hook Form + Zod згідно зі стандартами проєкту.
- **Уніфікований хук `useCart` (`src/lib/useCart.ts`)**: ліквідовано дублювання логіки між роздрібним та оптовим кошиками; уніфіковано роботу з товарами, синхронізацію кількостей та розрахунок підсумкових сум.
- **Батч-синхронізація гостьового кошика**: у `user/operation.ts` впроваджено автоматичну міграцію товарів з `localStorageCart` до бази даних при вході користувача через нові ендпоінти `POST /api/users/cart/retail/sync` та `POST /api/users/cart/sync`.
- **Усунення блокуючих викликів**: замінено виклики `window.confirm()` у `OrderTable.tsx` на кастомний доступний модальний компонент `ConfirmModal`.

## [2.5.0] — 2026-09-03

### [Refactor] RTK Query Full Architecture Migration — Phase 5 (Final Cleanup & Audit)

- **Остаточна ліквідація мертвого коду**:
  - Повністю видалено директорію [`src/lib/appState/dashboard/`](file:///f:/code/repos/fe-ingco/src/lib/appState/dashboard/) (`operations.ts`, `statsOperations.ts`, `slice.ts`).
  - З [`store.ts`](file:///f:/code/repos/fe-ingco/src/lib/appState/store.ts) вилучено імпорт та монтування `dashboardSlice`.
  - Зведено `mainSlice` до єдиного стану інтерфейсу `shopView: 'table' | 'list'`.
  - Перевірено відсутність невикористовуваних санок та побічних ефектів у редукторах.
  - Оновлено документацію та правила проєкту в [`AGENTS.md`](file:///f:/code/repos/fe-ingco/AGENTS.md) та архітектурному плані [`docs/plans/rtk-query-migration-plan.md`](file:///f:/code/repos/fe-ingco/docs/plans/rtk-query-migration-plan.md).

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
