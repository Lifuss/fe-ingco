import { generatePageMetadata } from '@/lib/metadata';
import { SITE_URL } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: 'Політика доставки',
  description: 'Умови та способи доставки товарів інтернет-магазину INGCO',
  path: '/legal/shipping',
});

export default function ShippingPage() {
  return (
    <div className="container mx-auto max-w-4xl px-5 py-10">
      <h1 className="mb-6 text-3xl font-bold">Політика доставки</h1>
      <p className="mb-4 text-sm text-gray-600">
        Дата останнього оновлення: {new Date().toLocaleDateString('uk-UA')}
      </p>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">1. Загальні положення</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Ця Політика доставки (далі – «Політика») визначає умови та способи
          доставки товарів, замовлених в інтернет-магазині{' '}
          <a href={SITE_URL} className="text-orange-600 hover:underline">
            {SITE_URL}
          </a>{' '}
          (далі – «Інтернет-магазин»), який належить ТОВ «INGCO Ukraine» (далі –
          «Продавець»).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">2. Способи доставки</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Продавець здійснює доставку товарів такими способами:
        </p>

        <div className="mb-6">
          <h3 className="mb-3 text-xl font-semibold">
            2.1. Доставка службою «Нова Пошта»
          </h3>
          <p className="mb-4 text-lg leading-relaxed">
            Доставка здійснюється до відділень або кур'єром служби «Нова Пошта»
            по всій території України.
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-lg leading-relaxed">
            <li>
              Вартість доставки розраховується автоматично при оформленні
              замовлення
            </li>
            <li>
              Терміни доставки: 1-3 робочих дні (залежить від віддаленості
              населеного пункту)
            </li>
            <li>
              Отримання товару здійснюється за пред'явленням документа, що
              посвідчує особу
            </li>
            <li>
              Товар зберігається на відділенні протягом 5 робочих днів
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="mb-3 text-xl font-semibold">2.2. Самовивіз</h3>
          <p className="mb-4 text-lg leading-relaxed">
            Можливий самовивіз товару з фізичних відділень Продавця:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-lg leading-relaxed">
            <li>
              <strong>Вижницьке відділення:</strong> м. Вижниця, Чернівецька
              обл., вул. Українська 100/2
            </li>
            <li>
              <strong>Герцаївське відділення:</strong> м. Герца, Чернівецька
              обл., вул. Штефана Великого 12
            </li>
            <li>
              <strong>Графік роботи:</strong> Пн-Пт: 08:00-18:00, Сб-Нд:
              09:00-15:00
            </li>
            <li>Самовивіз безкоштовний</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="mb-3 text-xl font-semibold">
            2.3. Кур'єрська доставка
          </h3>
          <p className="mb-4 text-lg leading-relaxed">
            Доставка кур'єром можлива в межах міст Вижниця та Герца та
            прилеглих населених пунктів.
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-lg leading-relaxed">
            <li>Вартість та терміни доставки узгоджуються індивідуально</li>
            <li>Доставка здійснюється в робочі дні</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">3. Терміни доставки</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Терміни доставки залежать від способу доставки та місцезнаходження
          Покупця:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6 text-lg leading-relaxed">
          <li>
            <strong>Самовивіз:</strong> товар готовий до отримання протягом 1-2
            робочих днів після підтвердження замовлення
          </li>
          <li>
            <strong>Нова Пошта:</strong> 1-3 робочих дні (залежить від
            віддаленості)
          </li>
          <li>
            <strong>Кур'єрська доставка:</strong> узгоджується індивідуально
          </li>
        </ul>
        <p className="mb-4 text-lg leading-relaxed">
          Терміни доставки можуть збільшитися у випадку:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6 text-lg leading-relaxed">
          <li>Відсутності товару на складі (потребує додаткового часу на замовлення)</li>
          <li>Святкових днів</li>
          <li>Непередбачених обставин (стихійні лиха, воєнний стан тощо)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">4. Вартість доставки</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Вартість доставки залежить від:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6 text-lg leading-relaxed">
          <li>Способу доставки</li>
          <li>Вага та габарити товару</li>
          <li>Відстані до місця доставки</li>
          <li>Тарифів служби доставки</li>
        </ul>
        <p className="mb-4 text-lg leading-relaxed">
          Точна вартість доставки розраховується автоматично при оформленні
          замовлення та відображається перед підтвердженням.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          <strong>Безкоштовна доставка</strong> може надаватися при замовленні
          на суму від певної мінімальної суми (умови вказані на сайті).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">5. Оформлення замовлення</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Для оформлення замовлення необхідно:
        </p>
        <ol className="mb-4 list-decimal space-y-2 pl-6 text-lg leading-relaxed">
          <li>Вибрати товари та додати їх до кошика</li>
          <li>Обрати спосіб доставки</li>
          <li>Вказати адресу доставки або відділення «Нова Пошта»</li>
          <li>Вказати контактні дані (ім'я, телефон, email)</li>
          <li>Обрати спосіб оплати</li>
          <li>Підтвердити замовлення</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">6. Отримання товару</h2>
        <p className="mb-4 text-lg leading-relaxed">
          При отриманні товару необхідно:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6 text-lg leading-relaxed">
          <li>
            Перевірити цілісність упаковки та відсутність механічних пошкоджень
          </li>
          <li>
            Перевірити комплектність товару (наявність всіх компонентів,
            аксесуарів, документації)
          </li>
          <li>
            У разі виявлення пошкоджень або невідповідності товару замовленню –
            відразу повідомити Продавця та службу доставки
          </li>
          <li>
            При отриманні на відділенні «Нова Пошта» мати при собі документ, що
            посвідчує особу
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          7. Відповідальність за доставку
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          Продавець несе відповідальність за товар до моменту його передачі
          Покупцю або службі доставки.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Після передачі товару службі доставки відповідальність за збереження
          та доставку несе служба доставки відповідно до її правил.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">8. Контакти</h2>
        <p className="mb-4 text-lg leading-relaxed">
          З усіх питань щодо доставки звертайтеся:
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

