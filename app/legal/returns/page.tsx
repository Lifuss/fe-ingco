import { generatePageMetadata } from '@/lib/metadata';
import { SITE_URL } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: 'Політика повернення та обміну',
  description: 'Умови повернення та обміну товарів в інтернет-магазині INGCO',
  path: '/legal/returns',
});

export default function ReturnsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-5 py-10">
      <h1 className="mb-6 text-3xl font-bold">
        Політика повернення та обміну
      </h1>
      <p className="mb-4 text-sm text-gray-600">
        Дата останнього оновлення: {new Date().toLocaleDateString('uk-UA')}
      </p>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">1. Загальні положення</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Ця Політика повернення та обміну (далі – «Політика») регулює умови
          повернення та обміну товарів, придбаних в інтернет-магазині{' '}
          <a href={SITE_URL} className="text-orange-600 hover:underline">
            {SITE_URL}
          </a>{' '}
          (далі – «Інтернет-магазин»), який належить ТОВ «INGCO Ukraine» (далі –
          «Продавець»).
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Політика розроблена відповідно до Закону України «Про захист прав
          споживачів» та інших нормативно-правових актів України.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          2. Право на повернення товару належної якості
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          Згідно зі статтею 9 Закону України «Про захист прав споживачів»,
          споживач має право обміняти непродовольчий товар належної якості на
          аналогічний у продавця, у якого він був придбаний, якщо товар не
          підійшов за формою, габаритами, фасоном, кольором, розміром або з інших
          причин не може бути використаний за призначенням.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Обмін товару належної якості проводиться, якщо він не був у
          вживанні, збережені його споживчі властивості, пломби, ярлики, а
          також є розрахунковий документ, виданий споживачеві разом з проданим
          товаром.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          <strong>Термін для обміну:</strong> 14 днів з дня покупки (не рахуючи
          дня покупки).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          3. Товари, які не підлягають обміну та поверненню
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          Відповідно до Постанови Кабінету Міністрів України від 19.03.1994 №
          172, не підлягають обміну та поверненню такі товари:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6 text-lg leading-relaxed">
          <li>Електроінструменти та техніка, якщо вони були в експлуатації</li>
          <li>Товари, які мають індивідуально визначені властивості</li>
          <li>Товари, які швидко псуються</li>
        </ul>
        <p className="mb-4 text-lg leading-relaxed">
          Детальний перелік товарів, які не підлягають обміну, зазначений у
          зазначеній Постанові.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          4. Повернення товару неналежної якості
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          У разі виявлення протягом встановленого гарантійного терміну
          недоліків товару споживач має право:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6 text-lg leading-relaxed">
          <li>Вимогти безоплатного усунення недоліків</li>
          <li>Вимогти заміни товару на аналогічний або інший з відповідним перерахунком</li>
          <li>Вимогти повернення сплачених коштів</li>
          <li>Вимогти відшкодування збитків</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          5. Порядок повернення товару
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          Для повернення товару необхідно:
        </p>
        <ol className="mb-4 list-decimal space-y-2 pl-6 text-lg leading-relaxed">
          <li>
            Зв'язатися з Продавцем за телефоном або електронною поштою не
            пізніше 14 днів з моменту отримання товару
          </li>
          <li>
            Надати інформацію про номер замовлення та причину повернення
          </li>
          <li>
            Підготувати товар до повернення: зберегти оригінальну упаковку,
            всі аксесуари, документи
          </li>
          <li>
            Відправити товар за адресою, вказаною Продавцем, або доставити до
            пункту самовивозу
          </li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          6. Повернення коштів
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          Кошти за повернений товар належної якості повертаються Покупцю
          протягом 7 робочих днів з моменту отримання товару Продавцем та
          підтвердження відповідності товару умовам повернення.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Повернення коштів здійснюється тим самим способом, яким була здійснена
          оплата, або іншим способом за згодою сторін.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          7. Вартість доставки при поверненні
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          У разі повернення товару належної якості через те, що він не підійшов
          за формою, габаритами, фасоном, кольором, розміром, вартість доставки
          товару до Продавця оплачує Покупець.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          У разі повернення товару неналежної якості або якщо Продавець передав
          товар, що не відповідає замовленню, вартість доставки компенсує
          Продавець.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          8. Гарантійне обслуговування
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          Гарантійний термін на товари встановлюється виробником та зазначений у
          гарантійному талоні або технічній документації.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          У разі виявлення недоліків під час гарантійного терміну звертайтеся до
          Продавця або авторизованих сервісних центрів.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">9. Контакти</h2>
        <p className="mb-4 text-lg leading-relaxed">
          З усіх питань щодо повернення та обміну товарів звертайтеся:
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
        <p className="mb-4 text-lg leading-relaxed">
          Адреса для повернення товарів: м. Вижниця, Чернівецька обл., вул.
          Українська 100/2
        </p>
      </section>
    </div>
  );
}

