import React from 'react';
import PartnerGuide from '@/app/ui/about-us/PartnerGuide';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';
import { Handshake, Award, Truck, Briefcase } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'Співпраця та Партнерство | INGCO Україна',
  description:
    'Дізнайтеся про переваги співпраці з INGCO Україна: оптові закупівлі, дропшипінг, дилерська мережа, експортні прайси та підтримка.',
  path: '/about-us/partnership',
});

const PartnershipPage = () => {
  return (
    <main className="min-h-[550px] bg-neutral-50 pb-20 font-sans">
      {/* Hero Banner Section */}
      <section className="to-primary-900 relative overflow-hidden bg-gradient-to-r from-neutral-900 via-neutral-800 px-6 py-16 text-center text-white select-none md:px-[60px]">
        <div className="bg-primary-500/10 pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full blur-3xl" />
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4">
          <span className="bg-primary-500 rounded-full px-3 py-1 text-xs font-bold tracking-wider text-white uppercase">
            Офіційний дистриб&apos;ютор
          </span>
          <h1 className="font-display text-3xl leading-tight font-extrabold md:text-5xl">
            Станьте партнером INGCO Україна
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-300 md:text-lg">
            Розвивайте свій бізнес разом з нами. Оптові поставки, гнучкі умови для дропшипінгу та
            офіційна дилерська підтримка по всій країні.
          </p>
        </div>
      </section>

      {/* Benefits Grid Section */}
      <section className="mx-auto flex max-w-[1440px] flex-col gap-10 px-6 py-16 md:px-[60px]">
        <h2 className="font-display text-center text-2xl font-bold text-neutral-900 md:text-4xl">
          Напрямки співпраці
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Wholesale purchasing Card */}
          <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="bg-primary-100 text-primary-600 border-primary-200 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border">
              <Briefcase size={24} />
            </div>
            <h3 className="font-display text-xl font-bold text-neutral-900">Оптовим покупцям</h3>
            <p className="text-sm leading-relaxed text-neutral-600">
              Отримайте доступ до повного асортименту продукції INGCO зі спеціальними оптовими
              знижками. Прямі поставки, оперативне відвантаження та супровідні документи.
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 text-xs text-neutral-500">
              <li className="flex items-center gap-2">
                ✓ Доступ до дилерського кабінету та прайсів
              </li>
              <li className="flex items-center gap-2">
                ✓ Спеціальний менеджер для супроводу замовлень
              </li>
              <li className="flex items-center gap-2">
                ✓ Персональні кредитні ліміти для постійних клієнтів
              </li>
            </ul>
          </div>

          {/* Dropshipping Card */}
          <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-100 text-blue-600">
              <Truck size={24} />
            </div>
            <h3 className="font-display text-xl font-bold text-neutral-900">Дропшипінг</h3>
            <p className="text-sm leading-relaxed text-neutral-600">
              Продавайте інструмент без витрат на склад та логістику. Ми відправимо товар
              безпосередньо вашому клієнту без жодних рекламних матеріалів чи чеків з нашого боку.
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 text-xs text-neutral-500">
              <li className="flex items-center gap-2">
                ✓ Відправка товару в день замовлення Новою Поштою
              </li>
              <li className="flex items-center gap-2">
                ✓ Автоматична вигрузка XML-фідів для Prom.ua та сайтів
              </li>
              <li className="flex items-center gap-2">
                ✓ Швидкі виплати вашої комісії після отримання посилки
              </li>
            </ul>
          </div>

          {/* Partner Program Card */}
          <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-teal-200 bg-teal-100 text-teal-600">
              <Award size={24} />
            </div>
            <h3 className="font-display text-xl font-bold text-neutral-900">
              Корпоративним клієнтам
            </h3>
            <p className="text-sm leading-relaxed text-neutral-600">
              Комплексне забезпечення будівельних компаній, виробництв та майстерень якісним
              професійним інструментом з офіційною гарантією до 24 місяців.
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 text-xs text-neutral-500">
              <li className="flex items-center gap-2">✓ Повний безготівковий розрахунок з ПДВ</li>
              <li className="flex items-center gap-2">
                ✓ Індивідуальні комерційні пропозиції під специфікації
              </li>
              <li className="flex items-center gap-2">
                ✓ Власний авторизований сервісний центр в Україні
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Step Guide Section */}
      <div className="border-y border-neutral-200 bg-white py-16">
        <PartnerGuide />
      </div>

      {/* Bottom Banner Callout */}
      <section className="mx-auto max-w-[1440px] px-6 pt-16 text-center select-none md:px-[60px]">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-8 shadow-sm md:p-12">
          <Handshake className="text-primary-500 stroke-[2]" size={40} />
          <h3 className="font-display text-2xl font-bold text-neutral-900">
            Маєте додаткові запитання?
          </h3>
          <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
            Напишіть нам або замовте зворотний дзвінок. Наші спеціалісти з оптових продажів
            зв&apos;яжуться з вами протягом робочого дня.
          </p>
          <div className="mt-2 flex gap-4">
            <a
              href="tel:+380800000000"
              className="bg-primary-500 hover:bg-primary-600 rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all"
            >
              Зателефонувати
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PartnershipPage;
