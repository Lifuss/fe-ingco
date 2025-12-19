import { generatePageMetadata } from '@/lib/metadata';
import { SITE_URL } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: 'Політика конфіденційності',
  description: 'Політика конфіденційності та захисту персональних даних INGCO',
  path: '/legal/privacy',
});

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-5 py-10">
      <h1 className="mb-6 text-3xl font-bold">Політика конфіденційності</h1>
      <p className="mb-4 text-sm text-gray-600">
        Дата останнього оновлення: {new Date().toLocaleDateString('uk-UA')}
      </p>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">1. Загальні положення</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Ця Політика конфіденційності (далі – «Політика») визначає порядок
          обробки та захисту персональних даних користувачів інтернет-магазину{' '}
          <a href={SITE_URL} className="text-orange-600 hover:underline">
            {SITE_URL}
          </a>{' '}
          (далі – «Сайт»), який належить ТОВ «INGCO Ukraine» (далі –
          «Адміністрація»).
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Використовуючи Сайт, Ви погоджуєтеся з умовами цієї Політики. Якщо Ви
          не згодні з умовами Політики, будь ласка, не використовуйте Сайт.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          2. Персональні дані, які ми збираємо
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          Адміністрація може збирати та обробляти наступні персональні дані:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6 text-lg leading-relaxed">
          <li>Ім&apos;я та прізвище</li>
          <li>Номер телефону</li>
          <li>Електронна адреса</li>
          <li>Адреса доставки</li>
          <li>Інформація про замовлення</li>
          <li>IP-адреса та дані про пристрій</li>
          <li>Файли cookie та аналогічні технології</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          3. Мета обробки персональних даних
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          Адміністрація обробляє персональні дані для наступних цілей:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6 text-lg leading-relaxed">
          <li>Обробка та виконання замовлень</li>
          <li>Зв&apos;язок з користувачами щодо замовлень</li>
          <li>Доставка товарів</li>
          <li>Надання технічної підтримки</li>
          <li>Покращення якості обслуговування</li>
          <li>Відправка маркетингових повідомлень (за згодою користувача)</li>
          <li>Дотримання вимог законодавства</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          4. Правові підстави обробки
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          Обробка персональних даних здійснюється на підставі:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6 text-lg leading-relaxed">
          <li>Згоди суб&apos;єкта персональних даних</li>
          <li>Виконання договору, стороною якого є суб&apos;єкт персональних даних</li>
          <li>Вимог законодавства України</li>
          <li>Законних інтересів Адміністрації</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          5. Передача персональних даних третім особам
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          Адміністрація може передавати персональні дані третім особам у таких
          випадках:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6 text-lg leading-relaxed">
          <li>
            Службам доставки (Нова Пошта та інші) для виконання замовлень
          </li>
          <li>
            Платежним системам для обробки платежів (з дотриманням вимог
            безпеки)
          </li>
          <li>За вимогою законодавства або судових рішень</li>
          <li>
            Постачальникам послуг, які допомагають у роботі Сайту (хостинг,
            аналітика)
          </li>
        </ul>
        <p className="mb-4 text-lg leading-relaxed">
          Адміністрація не продає та не передає персональні дані третім особам
          для маркетингових цілей без згоди користувача.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          6. Зберігання персональних даних
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          Персональні дані зберігаються протягом терміну, необхідного для
          досягнення мети обробки, або протягом терміну, встановленого
          законодавством України.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Після закінчення терміну зберігання персональні дані підлягають
          знищенню або анонімізації.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          7. Захист персональних даних
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          Адміністрація вживає технічних та організаційних заходів для захисту
          персональних даних від несанкціонованого доступу, знищення, зміни,
          блокування, копіювання, надання, поширення.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          8. Права суб&apos;єкта персональних даних
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          Згідно з Законом України «Про захист персональних даних», Ви маєте
          право:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6 text-lg leading-relaxed">
          <li>Знати про джерела збирання та місцезнаходження своїх даних</li>
          <li>Отримувати інформацію про умови надання доступу до даних</li>
          <li>Отримувати інформацію про третіх осіб, яким передаються дані</li>
          <li>Отримувати доступ до своїх персональних даних</li>
          <li>Вносити застереження щодо обробки даних</li>
          <li>Вимогати припинення обробки даних</li>
          <li>Вимогати зміни або знищення даних</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">9. Файли Cookie</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Сайт використовує файли cookie для покращення роботи та аналізу
          використання. Детальна інформація про використання cookie наведена в
          Політиці використання cookies.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          10. Зміни до Політики конфіденційності
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          Адміністрація має право вносити зміни до цієї Політики. Нова редакція
          набуває чинності з моменту її розміщення на Сайті.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">11. Контакти</h2>
        <p className="mb-4 text-lg leading-relaxed">
          З усіх питань щодо обробки персональних даних звертайтеся:
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Електронна адреса:{' '}
          <a
            href="mailto:ingco-service@ukr.net"
            className="text-orange-600 hover:underline"
          >
            ingco-service@ukr.net
          </a>
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Телефони:{' '}
          <a
            href="tel:+380988392107"
            className="text-orange-600 hover:underline"
          >
            +380 98-83-92-107
          </a>
          ,{' '}
          <a
            href="tel:+380964123628"
            className="text-orange-600 hover:underline"
          >
            +380 96-41-23-628
          </a>
        </p>
      </section>
    </div>
  );
}

