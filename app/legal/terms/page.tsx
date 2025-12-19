import { generatePageMetadata } from '@/lib/metadata';
import { SITE_URL } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: 'Умови використання',
  description: 'Умови використання інтернет-магазину INGCO',
  path: '/legal/terms',
});

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-5 py-10">
      <h1 className="mb-6 text-3xl font-bold">Умови використання</h1>
      <p className="mb-4 text-sm text-gray-600">
        Дата останнього оновлення: {new Date().toLocaleDateString('uk-UA')}
      </p>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">1. Загальні положення</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Ці Умови використання (далі – «Умови») регулюють відносини між ТОВ
          «INGCO Ukraine» (далі – «Адміністрація») та користувачами інтернет-магазину{' '}
          <a href={SITE_URL} className="text-orange-600 hover:underline">
            {SITE_URL}
          </a>{' '}
          (далі – «Сайт»).
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Використовуючи Сайт, Ви приймаєте ці Умови та зобов&apos;язуєтеся їх
          дотримуватися. Якщо Ви не згодні з цими Умовами, будь ласка, не
          використовуйте Сайт.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">2. Використання Сайту</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Користувач має право використовувати Сайт виключно в законних цілях
          та відповідно до призначення Сайту.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Забороняється:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6 text-lg leading-relaxed">
          <li>Використовувати Сайт для незаконних цілей</li>
          <li>Намагатися отримати несанкціонований доступ до системи</li>
          <li>Поширювати шкідливий програмний код</li>
          <li>Копіювати, модифікувати або розповсюджувати контент Сайту</li>
          <li>Використовувати автоматизовані системи для збору даних</li>
          <li>Створювати облікові записи від імені інших осіб</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">3. Інтелектуальна власність</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Весь контент Сайту, включаючи тексти, зображення, логотипи, дизайн,
          є власністю Адміністрації або її ліцензіарів і захищений законодавством
          про інтелектуальну власність.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Будь-яке використання контенту без дозволу Адміністрації заборонено.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">4. Облікові записи</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Для оформлення замовлень та використання певних функцій Сайту
          користувач може створити обліковий запис.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Користувач зобов&apos;язується:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6 text-lg leading-relaxed">
          <li>Надавати точну та актуальну інформацію</li>
          <li>Зберігати конфіденційність облікових даних</li>
          <li>Нести відповідальність за всі дії під своїм обліковим записом</li>
          <li>Незабаром повідомляти про несанкціонований доступ</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">5. Товари та послуги</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Адміністрація намагається забезпечити точність інформації про товари,
          однак не гарантує повної відповідності описів та зображень реальним
          товарам.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Адміністрація має право змінювати ціни, описи товарів та наявність
          товарів без попереднього повідомлення.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">6. Обмеження відповідальності</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Адміністрація не несе відповідальності за:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6 text-lg leading-relaxed">
          <li>Тимчасові перерви в роботі Сайту</li>
          <li>Втрату даних через технічні збої</li>
          <li>Дії третіх осіб</li>
          <li>Непрямі збитки користувачів</li>
          <li>Використання Сайту способами, не передбаченими цими Умовами</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">7. Посилання на сторонні сайти</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Сайт може містити посилання на сторонні веб-сайти. Адміністрація не
          несе відповідальності за контент, політику конфіденційності та практики
          сторонніх сайтів.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">8. Зміни до Умов</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Адміністрація має право в будь-який час змінювати ці Умови. Нова
          редакція набуває чинності з моменту її розміщення на Сайті.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Продовжуючи використовувати Сайт після внесення змін, Ви приймаєте
          нові Умови.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">9. Припинення доступу</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Адміністрація має право припинити або обмежити доступ користувача до
          Сайту у разі порушення цих Умов без попереднього повідомлення.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">10. Застосоване право</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Ці Умови регулюються законодавством України. Усі спори підлягають
          вирішенню відповідно до законодавства України.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">11. Контакти</h2>
        <p className="mb-4 text-lg leading-relaxed">
          З питань щодо цих Умов звертайтеся:
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

