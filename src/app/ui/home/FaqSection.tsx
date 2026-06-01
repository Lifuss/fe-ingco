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
      answer: 'Кожен інструмент постачається з офіційним гарантійним талоном. Термін гарантії становить 24 місяці (2 роки) на професійну серію Industrial та 12 місяців (1 рік) на серію Standart. Обслуговування та ремонт проводяться у нашому власному авторизованому сервісному центрі із використанням виключно оригінальних запчастин.',
    },
    {
      id: 2,
      question: 'Що таке лінійка P20S та яка сумісність акумуляторів?',
      answer: 'P20S — це універсальна акумуляторна система INGCO 20V. Один акумулятор (ємністю 2.0 Аг, 4.0 Аг або 6.0 Аг) повністю сумісний з понад 150 інструментами (шурупокрути, перфоратори, болгарки, лобзики, повітродувки та навіть газонокосарки). Купуючи один раз стартовий комплект з батареєю, надалі ви можете купувати версії SOLO (без АКБ та зарядки) та економити до 50% вартості.',
    },
    {
      id: 3,
      question: 'Де можна протестувати та забрати інструмент самовивозом?',
      answer: 'Ви можете завітати до нашої мережі фірмових магазинів-партнерів у великих містах України (Київ, Львів, Одеса тощо). Там ви зможете особисто потримати інструмент в руках, протестувати його під навантаженням на спеціальних стендах, отримати фахову консультацію та одразу ж забрати покупку.',
    },
    {
      id: 4,
      question: 'Які терміни відправки та умови доставки?',
      answer: 'Всі замовлення, оформлені до 15:00, ми відправляємо у той самий день. Доставка здійснюється Новою Поштою по всій території України (у відділення, поштомати або кур’єром). Ви можете скористатися післяплатою (оплата після огляду та перевірки у відділенні) або сплатити карткою на сайті.',
    },
  ];

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="w-full px-5 md:px-[60px] pb-16 flex flex-col gap-8">
      {/* Header Block */}
      <div className="flex flex-col gap-1 border-b border-[#E5E3DD] pb-4">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-neutral-900 leading-tight">
          ЧАСТІ ЗАПИТАННЯ
        </h2>
        <p className="font-sans text-neutral-500 text-sm">
          Відповіді на запитання про гарантію, сумісність інструментів та умови доставки
        </p>
      </div>

      {/* Accordion container */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {faqData.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="bg-white border border-[#E5E3DD] rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:border-amber-500/20"
            >
              {/* Accordion Trigger Header */}
              <button
                onClick={() => toggleFaq(item.id)}
                className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 font-display font-semibold text-neutral-800 text-sm md:text-base cursor-pointer focus:outline-none select-none transition-colors hover:text-primary-500"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle size={20} className="text-amber-500 shrink-0" />
                  <span>{item.question}</span>
                </div>
                <div
                  className={`w-8 h-8 rounded-full border border-neutral-100 flex items-center justify-center text-neutral-500 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-primary-50 border-primary-200 text-primary-500' : 'bg-neutral-50'
                  }`}
                >
                  <ChevronDown size={16} />
                </div>
              </button>

              {/* Accordion Content Panel */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? 'max-h-[500px] border-t border-neutral-50 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 font-sans text-neutral-600 text-xs md:text-sm leading-relaxed bg-[#FFFDFB]">
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
