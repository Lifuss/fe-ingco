import { generatePageMetadata } from '@/lib/metadata';
import { SITE_URL } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: 'Публічна оферта',
  description: 'Публічна оферта про надання послуг інтернет-магазину INGCO',
  path: '/legal/offer',
});

export default function OfferPage() {
  return (
    <div className="container mx-auto max-w-4xl px-5 py-10">
      <h1 className="mb-6 text-3xl font-bold">Публічна оферта</h1>
      <p className="mb-4 text-sm text-gray-600">
        Дата останнього оновлення: {new Date().toLocaleDateString('uk-UA')}
      </p>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">1. Загальні положення</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Цей документ є публічною офертою (далі – «Оферта») про надання послуг
          з продажу товарів через інтернет-магазин{' '}
          <a href={SITE_URL} className="text-orange-600 hover:underline">
            {SITE_URL}
          </a>{' '}
          (далі – «Інтернет-магазин»), яку надає ТОВ «INGCO Ukraine» (далі –
          «Продавець»).
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Згідно зі статтею 633 Цивільного кодексу України, якщо умови, викладені
          нижче, прийнятні для Вас, і Ви не бажаєте звертатися до Продавця для
          укладення письмового договору, то Ваше заповнення форми замовлення на
          сайті є акцептом, і договір купівлі-продажу вважається укладеним на
          умовах, викладених нижче.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">2. Визначення термінів</h2>
        <ul className="mb-4 list-disc space-y-2 pl-6 text-lg leading-relaxed">
          <li>
            <strong>Продавець</strong> – ТОВ «INGCO Ukraine», юридична особа,
            зареєстрована відповідно до законодавства України.
          </li>
          <li>
            <strong>Покупець</strong> – будь-яка фізична або юридична особа,
            яка прийняла умови цієї Оферти.
          </li>
          <li>
            <strong>Товар</strong> – продукція, представлена на сайті
            Інтернет-магазину.
          </li>
          <li>
            <strong>Замовлення</strong> – прийняте Продавцем рішення Покупця
            придбати Товар, оформлене через Інтернет-магазин.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          3. Предмет договору
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          Продавець зобов'язується передати у власність Покупцю Товар, а
          Покупець зобов'язується прийняти Товар і сплатити за нього вказану
          ціну на умовах цієї Оферти.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">4. Ціна та оплата</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Ціна Товару вказана на сайті Інтернет-магазину в гривнях (UAH).
          Продавець має право змінювати ціни на Товар в будь-який час без
          попереднього повідомлення.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Оплата здійснюється способами, зазначеними на сайті
          Інтернет-магазину. Моментом оплати вважається надходження коштів на
          рахунок Продавця.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">5. Доставка</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Доставка Товару здійснюється способами, зазначеними на сайті
          Інтернет-магазину. Вартість доставки вказується при оформленні
          замовлення.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Терміни доставки зазначені на сайті та можуть змінюватися залежно від
          обставин, що не залежать від Продавця.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          6. Права та обов'язки сторін
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          Продавець зобов'язується передати Покупцю Товар належної якості, що
          відповідає опису на сайті.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Покупець зобов'язується своєчасно оплатити та прийняти Товар,
          оформлений у вигляді Замовлення.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          7. Відповідальність сторін
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          Продавець не несе відповідальності за шкоду, заподіяну Покупцю в
          результаті неналежного використання Товару, придбаного в
          Інтернет-магазині.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Продавець не несе відповідальності за зміни цін, зроблені третіми
          особами, та за інформацію, надану Покупцем в неточній формі.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          8. Повернення та обмін товару
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          Повернення та обмін Товару здійснюється відповідно до законодавства
          України та Політики повернення, розміщеної на сайті
          Інтернет-магазину.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          9. Захист персональних даних
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          Обробка персональних даних Покупця здійснюється відповідно до
          законодавства України та Політики конфіденційності, розміщеної на
          сайті Інтернет-магазину.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          10. Зміни та доповнення
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          Продавець має право вносити зміни до цієї Оферти в будь-який час без
          попереднього повідомлення. Нова редакція Оферти набуває чинності з
          моменту її розміщення на сайті.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">11. Контактна інформація</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Усі питання щодо умов цієї Оферти можна надіслати на електронну адресу:{' '}
          <a
            href="mailto:ingco-service@ukr.net"
            className="text-orange-600 hover:underline"
          >
            ingco-service@ukr.net
          </a>
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Телефони для зв'язку:{' '}
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

