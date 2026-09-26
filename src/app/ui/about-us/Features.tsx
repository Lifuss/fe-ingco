import React from 'react';
import { ShieldCheck, BatteryCharging, Globe2, Wrench } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Офіційний імпортер в Україні',
    description:
      'Прямі поставки від заводу-виробника. 100% оригінальна продукція, офіційна сертифікація та повний документальний супровід.',
  },
  {
    icon: BatteryCharging,
    title: 'Екосистема 20V Max Share',
    description:
      'Понад 580+ електроінструментів, що працюють від одного акумулятора. Зручно комбінувати та економити на кожній покупці.',
  },
  {
    icon: Globe2,
    title: 'Довіра в понад 50 країнах',
    description:
      'INGCO — один із лідерів світового ринку ручного та електроінструменту за кількістю власних патентів і передових технологій.',
  },
  {
    icon: Wrench,
    title: 'Сервісне обслуговування',
    description:
      'Власний сервісний центр, швидка діагностика, постійна наявність оригінальних комплектуючих та гарантійна підтримка.',
  },
];

const Features = () => {
  return (
    <section className="mb-14 px-5 md:mb-20 md:px-[60px]" aria-labelledby="features-heading">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-8 text-center md:mb-12">
          <span className="text-xs font-bold tracking-wider text-amber-800 uppercase">
            Наші переваги
          </span>
          <h2
            id="features-heading"
            className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl lg:text-4xl"
          >
            Чому майстри обирають INGCO?
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-neutral-600 md:text-base">
            Поєднуємо високу функціональність професійного обладнання та чесну вартість
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: IconComponent, title, description }) => (
            <div
              key={title}
              className="flex flex-col rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-amber-300 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <IconComponent size={24} />
              </div>
              <h3 className="mb-2 text-base font-bold text-neutral-900 md:text-lg">{title}</h3>
              <p className="text-sm leading-relaxed text-neutral-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
