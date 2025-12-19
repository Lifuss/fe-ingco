import { generatePageMetadata, SITE_URL } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: 'Політика використання cookies',
  description: 'Політика використання файлів cookie на сайті INGCO',
  path: '/legal/cookies',
});

export default function CookiesPage() {
  return (
    <div className="container mx-auto max-w-4xl px-5 py-10">
      <h1 className="mb-6 text-3xl font-bold">
        Політика використання cookies
      </h1>
      <p className="mb-4 text-sm text-gray-600">
        Дата останнього оновлення: {new Date().toLocaleDateString('uk-UA')}
      </p>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">1. Що таке cookies</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Файли cookie (далі – «cookies») – це невеликі текстові файли, які
          зберігаються на Вашому пристрої (комп&apos;ютері, планшеті, смартфоні)
          під час відвідування веб-сайту{' '}
          <a href={SITE_URL} className="text-orange-600 hover:underline">
            {SITE_URL}
          </a>{' '}
          (далі – «Сайт»).
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Cookies дозволяють Сайту запам&apos;ятовувати Ваші дії та налаштування
          протягом певного періоду часу, тому Вам не потрібно вводити їх щоразу
          при поверненні на Сайт або переході з однієї сторінки на іншу.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          2. Як ми використовуємо cookies та схожі технології
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          ТОВ «INGCO Ukraine» (далі – «Ми», «Нас») використовує cookies та
          схожі технології (localStorage, sessionStorage) для:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6 text-lg leading-relaxed">
          <li>
            Забезпечення функціональності Сайту (збереження товарів у кошику,
            авторизація, токени доступу)
          </li>
          <li>
            Збереження Ваших налаштувань та уподобань (курси валют, вигляд
            каталогу)
          </li>
          <li>
            Аналізу використання Сайту для покращення його роботи та
            продуктивності
          </li>
          <li>
            Забезпечення безпеки та запобігання шахрайству
          </li>
        </ul>
        <p className="mb-4 text-lg leading-relaxed">
          <strong>Примітка:</strong> Основний механізм зберігання даних на
          Сайті – це localStorage браузера, який використовується для збереження
          стану додатку (кошик, авторизація, налаштування). Це схожа на cookies
          технологія, але дані зберігаються локально у браузері користувача.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">3. Типи cookies, які ми використовуємо</h2>

        <div className="mb-6">
          <h3 className="mb-3 text-xl font-semibold">3.1. Необхідні cookies та localStorage</h3>
          <p className="mb-4 text-lg leading-relaxed">
            Ці технології необхідні для роботи Сайту та не можуть бути вимкнені.
            Ми використовуємо localStorage для збереження:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-lg leading-relaxed">
            <li>Токенів авторизації для доступу до особистого кабінету</li>
            <li>Товарів у кошику для неавторизованих користувачів</li>
            <li>Курсів валют для відображення цін</li>
            <li>Налаштувань відображення каталогу</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="mb-3 text-xl font-semibold">3.2. Функціональні cookies</h3>
          <p className="mb-4 text-lg leading-relaxed">
            Ці cookies можуть встановлюватися сторонніми постачальниками послуг
            (наприклад, Spefix) для забезпечення функціональності пошуку та
            інших інтегрованих сервісів.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="mb-3 text-xl font-semibold">3.3. Аналітичні cookies</h3>
          <p className="mb-4 text-lg leading-relaxed">
            Ці cookies встановлюються сервісами Vercel Analytics та Vercel Speed
            Insights для збору анонімної статистики про використання Сайту,
            швидкість завантаження сторінок та джерела трафіку. Це допомагає нам
            покращувати продуктивність та користувацький досвід.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="mb-3 text-xl font-semibold">3.4. Маркетингові cookies</h3>
          <p className="mb-4 text-lg leading-relaxed">
            Наразі ми не використовуємо маркетингові cookies для показу
            персоналізованої реклами. Якщо це зміниться, ми оновимо цю
            Політику та запросимо Вашу згоду перед використанням таких cookies.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">4. Сторонні cookies</h2>
        <p className="mb-4 text-lg leading-relaxed">
          На Сайті використовуються cookies від третіх осіб, таких як:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6 text-lg leading-relaxed">
          <li>
            <strong>Vercel Analytics</strong> – для аналізу використання Сайту
            та моніторингу продуктивності (може встановлювати cookies для
            відстеження відвідувань)
          </li>
          <li>
            <strong>Vercel Speed Insights</strong> – для моніторингу швидкості
            завантаження сторінок (може використовувати cookies)
          </li>
          <li>
            <strong>Spefix</strong> – пошукова система, інтегрована на Сайті
            (може встановлювати cookies для збереження налаштувань пошуку)
          </li>
        </ul>
        <p className="mb-4 text-lg leading-relaxed">
          Ці сторонні постачальники можуть використовувати cookies для збору
          інформації про Вашу діяльність на Сайті. Ми не контролюємо
          використання cookies третіми особами та рекомендуємо ознайомитися з
          їх політиками конфіденційності.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">5. Термін зберігання cookies</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Cookies можуть бути:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6 text-lg leading-relaxed">
          <li>
            <strong>Сесійні</strong> – видаляються після закриття браузера
          </li>
          <li>
            <strong>Постійні</strong> – зберігаються на Вашому пристрої протягом
            певного періоду часу або до їх ручного видалення
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">6. Управління cookies</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Ви можете контролювати та/або видаляти cookies за бажанням. Ви можете
          видалити всі cookies, які вже знаходяться на Вашому комп&apos;ютері, та
          можете встановити більшість браузерів так, щоб вони не дозволяли їх
          розміщення.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Якщо Ви видалите або заблокуєте cookies, деякі функції Сайту можуть
          працювати неправильно або стати недоступними.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Інструкції з управління cookies для популярних браузерів:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6 text-lg leading-relaxed">
          <li>
            <a
              href="https://support.google.com/chrome/answer/95647"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline"
            >
              Google Chrome
            </a>
          </li>
          <li>
            <a
              href="https://support.mozilla.org/uk/kb/cookies"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline"
            >
              Mozilla Firefox
            </a>
          </li>
          <li>
            <a
              href="https://support.apple.com/uk-ua/guide/safari/sfri11471/mac"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline"
            >
              Safari
            </a>
          </li>
          <li>
            <a
              href="https://support.microsoft.com/uk-ua/help/17442/windows-internet-explorer-delete-manage-cookies"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline"
            >
              Microsoft Edge
            </a>
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">7. Зміни до Політики</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Ми можемо періодично оновлювати цю Політику. Рекомендуємо періодично
          переглядати цю сторінку, щоб бути в курсі будь-яких змін.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">8. Контакти</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Якщо у Вас є питання щодо використання cookies, звертайтеся:
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

