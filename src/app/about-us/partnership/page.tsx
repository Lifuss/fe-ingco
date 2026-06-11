import React from 'react';
import PartnerGuide from '@/app/ui/about-us/PartnerGuide';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';
import { Handshake, Award, Truck, Briefcase } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'Співпраця та Партнерство | INGCO Україна',
  description: 'Дізнайтеся про переваги співпраці з INGCO Україна: оптові закупівлі, дропшипінг, дилерська мережа, експортні прайси та підтримка.',
  path: '/about-us/partnership',
});

const PartnershipPage = () => {
  return (
      <main className="min-h-[550px] bg-neutral-50 pb-20 font-sans">
        {/* Hero Banner Section */}
        <section className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-primary-900 text-white py-16 px-6 md:px-[60px] text-center relative overflow-hidden select-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
            <span className="bg-primary-500 text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Офіційний дистриб&apos;ютор
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold font-display leading-tight">
              Станьте партнером INGCO Україна
            </h1>
            <p className="text-neutral-300 text-sm md:text-lg max-w-2xl leading-relaxed">
              Розвивайте свій бізнес разом з нами. Оптові поставки, гнучкі умови для дропшипінгу та офіційна дилерська підтримка по всій країні.
            </p>
          </div>
        </section>

        {/* Benefits Grid Section */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-[60px] py-16 flex flex-col gap-10">
          <h2 className="text-2xl md:text-4xl font-bold font-display text-neutral-900 text-center">
            Напрямки співпраці
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Wholesale purchasing Card */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 border border-primary-200 shrink-0">
                <Briefcase size={24} />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 font-display">
                Оптовим покупцям
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Отримайте доступ до повного асортименту продукції INGCO зі спеціальними оптовими знижками. Прямі поставки, оперативне відвантаження та супровідні документи.
              </p>
              <ul className="text-xs text-neutral-500 flex flex-col gap-1.5 mt-2">
                <li className="flex items-center gap-2">✓ Доступ до дилерського кабінету та прайсів</li>
                <li className="flex items-center gap-2">✓ Спеціальний менеджер для супроводу замовлень</li>
                <li className="flex items-center gap-2">✓ Персональні кредитні ліміти для постійних клієнтів</li>
              </ul>
            </div>

            {/* Dropshipping Card */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200 shrink-0">
                <Truck size={24} />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 font-display">
                Дропшипінг
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Продавайте інструмент без витрат на склад та логістику. Ми відправимо товар безпосередньо вашому клієнту без жодних рекламних матеріалів чи чеків з нашого боку.
              </p>
              <ul className="text-xs text-neutral-500 flex flex-col gap-1.5 mt-2">
                <li className="flex items-center gap-2">✓ Відправка товару в день замовлення Новою Поштою</li>
                <li className="flex items-center gap-2">✓ Автоматична вигрузка XML-фідів для Prom.ua та сайтів</li>
                <li className="flex items-center gap-2">✓ Швидкі виплати вашої комісії після отримання посилки</li>
              </ul>
            </div>

            {/* Partner Program Card */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 border border-teal-200 shrink-0">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 font-display">
                Корпоративним клієнтам
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Комплексне забезпечення будівельних компаній, виробництв та майстерень якісним професійним інструментом з офіційною гарантією до 24 місяців.
              </p>
              <ul className="text-xs text-neutral-500 flex flex-col gap-1.5 mt-2">
                <li className="flex items-center gap-2">✓ Повний безготівковий розрахунок з ПДВ</li>
                <li className="flex items-center gap-2">✓ Індивідуальні комерційні пропозиції під специфікації</li>
                <li className="flex items-center gap-2">✓ Власний авторизований сервісний центр в Україні</li>
              </ul>
            </div>

          </div>
        </section>

        {/* Step Guide Section */}
        <div className="bg-white border-y border-neutral-200 py-16">
          <PartnerGuide />
        </div>

        {/* Bottom Banner Callout */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-[60px] pt-16 text-center select-none">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-8 md:p-12 flex flex-col items-center gap-4 max-w-3xl mx-auto shadow-sm">
            <Handshake className="text-primary-500 stroke-[2]" size={40} />
            <h3 className="text-2xl font-bold text-neutral-900 font-display">
              Маєте додаткові запитання?
            </h3>
            <p className="text-neutral-600 text-sm md:text-base leading-relaxed">
              Напишіть нам або замовте зворотний дзвінок. Наші спеціалісти з оптових продажів зв&apos;яжуться з вами протягом робочого дня.
            </p>
            <div className="flex gap-4 mt-2">
              <a 
                href="tel:+380800000000" 
                className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2.5 px-6 rounded-xl transition-all text-sm shadow-sm"
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
