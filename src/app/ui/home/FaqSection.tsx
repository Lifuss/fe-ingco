'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export default function FaqSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  const faqData: FaqItem[] = [
    {
      id: 1,
      question: 'Як діє офіційна гарантія на інструменти INGCO?',
      answer:
        'Кожен інструмент постачається з офіційним гарантійним талоном. Термін гарантії становить 24 місяці (2 роки) на професійну серію Industrial та 12 місяців (1 рік) на серію Standart. Обслуговування та ремонт проводяться у нашому власному авторизованому сервісному центрі із використанням виключно оригінальних запчастин.',
    },
    {
      id: 2,
      question: 'Що таке лінійка P20S та яка сумісність акумуляторів?',
      answer:
        'P20S — це універсальна акумуляторна система INGCO 20V. Один акумулятор (ємністю 2.0 Аг, 4.0 Аг або 6.0 Аг) повністю сумісний з понад 150 інструментами (шурупокрути, перфоратори, болгарки, лобзики, повітродувки та навіть газонокосарки). Купуючи один раз стартовий комплект з батареєю, надалі ви можете купувати версії SOLO (без АКБ та зарядки) та економити до 50% вартості.',
    },
    {
      id: 3,
      question: 'Де можна протестувати та забрати інструмент самовивозом?',
      answer:
        'Ви можете завітати до нашої мережі фірмових магазинів-партнерів у великих містах України (Київ, Львів, Одеса тощо). Там ви зможете особисто потримати інструмент в руках, протестувати його під навантаженням на спеціальних стендах, отримати фахову консультацію та одразу ж забрати покупку.',
    },
    {
      id: 4,
      question: 'Які терміни відправки та умови доставки?',
      answer:
        'Всі замовлення, оформлені до 15:00, ми відправляємо у той самий день. Доставка здійснюється Новою Поштою по всій території України (у відділення, поштомати або кур’єром). Ви можете скористатися післяплатою (оплата після огляду та перевірки у відділенні) або сплатити карткою на сайті.',
    },
  ];

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section className="flex w-full flex-col gap-8 px-5 pb-16 md:px-[60px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema, null, 2),
        }}
      />
      {/* Header Block */}
      <div className="flex flex-col gap-1 border-b border-[#E5E3DD] pb-4">
        <h2 className="font-display text-2xl leading-tight font-bold text-neutral-900 md:text-3xl">
          ЧАСТІ ЗАПИТАННЯ
        </h2>
        <p className="font-sans text-sm text-neutral-500">
          Відповіді на запитання про гарантію, сумісність інструментів та умови доставки
        </p>
      </div>

      {/* Accordion container */}
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-4 md:grid-cols-2">
        {faqData.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-[#E5E3DD] bg-white shadow-sm transition-all duration-300 hover:border-amber-500/20 hover:shadow-md"
            >
              {/* Accordion Trigger Header */}
              <button
                onClick={() => toggleFaq(item.id)}
                className="font-display hover:text-primary-500 flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left text-sm font-semibold text-neutral-800 transition-colors select-none focus:outline-none md:text-base"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle size={20} className="shrink-0 text-amber-500" />
                  <span>{item.question}</span>
                </div>
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-100 text-neutral-500 transition-transform duration-300 ${
                    isOpen
                      ? 'bg-primary-50 border-primary-200 text-primary-500 rotate-180'
                      : 'bg-neutral-50'
                  }`}
                >
                  <ChevronDown size={16} />
                </div>
              </button>

              {/* Accordion Content Panel */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen
                    ? 'max-h-[500px] border-t border-neutral-50 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="bg-[#FFFDFB] p-6 font-sans text-xs leading-relaxed text-neutral-600 md:text-sm">
                  {item.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
