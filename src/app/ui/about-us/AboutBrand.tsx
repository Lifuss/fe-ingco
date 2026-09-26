import React from 'react';
import Image from 'next/image';
import { Hammer, Sparkles, Check } from 'lucide-react';

const AboutBrand = () => {
  return (
    <section
      className="mb-14 px-5 md:mb-20 md:px-[60px]"
      id="aboutBrand"
      aria-labelledby="brand-heading"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="mb-8 text-center md:mb-12">
          <span className="text-xs font-bold tracking-wider text-amber-800 uppercase">
            Філософія бренду
          </span>
          <h2
            id="brand-heading"
            className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl lg:text-4xl"
          >
            Бренд INGCO — Професійна якість, доступна кожному
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-neutral-600 md:text-base">
            Інструмент, розроблений інженерами для забезпечення максимальної продуктивності без
            переплат за марку
          </p>
        </div>

        {/* Brand Story with Image */}
        <div className="mb-10 flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
          <div className="relative w-full max-w-[480px] shrink-0 overflow-hidden rounded-2xl border border-neutral-200 shadow-md lg:w-1/2">
            <Image
              src="/brandImg.png"
              alt="Фахівці демонструють інструменти INGCO"
              width={489}
              height={364}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="flex flex-1 flex-col gap-4 text-sm leading-relaxed text-neutral-700 md:text-base">
            <p>
              Компанія <strong>INGCO</strong> — це глобальний виробник інструментів, який уже понад
              15 років доводить: якісний професійний інструмент не обов&apos;язково має коштувати
              надхмарно. Компанія володіє сотнями власних патентів, дослідницькими лабораторіями та
              автоматизованими виробничими лініями.
            </p>
            <p>
              Головний принцип бренду — фокус на надійності матеріалів, ресурсі двигунів та
              зручності майстра, а не на багатомільйонних витратах на рекламу. Завдяки цьому покупці
              в Україні отримують техніку промислового рівня за справедливою ціною.
            </p>
          </div>
        </div>

        {/* Two Tool Lines: INDUSTRIAL vs STANDARD */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* INDUSTRIAL Line */}
          <div className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-white shadow-lg md:p-8">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-lg bg-amber-500 px-3 py-1 text-xs font-extrabold tracking-wider text-neutral-950 uppercase">
                Серія INDUSTRIAL
              </span>
              <Hammer className="text-amber-400" size={24} />
            </div>
            <h3 className="mb-2 text-xl font-bold md:text-2xl">Для щоденних важких навантажень</h3>
            <p className="mb-6 text-sm text-neutral-300">
              Створено для професійних будівельних бригад, монтажників, автосервісів та промислових
              цехів.
            </p>
            <ul className="mt-auto flex flex-col gap-2.5 text-xs text-neutral-300 sm:text-sm">
              <li className="flex items-center gap-2">
                <Check size={16} className="shrink-0 text-amber-400" />
                <span>Посилені металеві редуктори та підшипники підвищеної міцності</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="shrink-0 text-amber-400" />
                <span>Безщіткові мотори (Brushless) із продовженим ресурсом роботи</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="shrink-0 text-amber-400" />
                <span>Стійкість до перегріву та пилозахисна герметизація</span>
              </li>
            </ul>
          </div>

          {/* STANDARD Line */}
          <div className="flex flex-col rounded-2xl border-2 border-amber-500 bg-white p-6 shadow-md transition-all duration-200 hover:shadow-lg md:p-8">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold tracking-wider text-amber-800 uppercase">
                Серія STANDARD
              </span>
              <Sparkles className="text-amber-500" size={24} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-neutral-900 md:text-2xl">
              Для майстерні, ремонту та дому
            </h3>
            <p className="mb-6 text-sm text-neutral-600">
              Оптимальний вибір для періодичних будівельних робіт, догляду за авто, саду та домашніх
              проєктів.
            </p>
            <ul className="mt-auto flex flex-col gap-2.5 text-xs text-neutral-600 sm:text-sm">
              <li className="flex items-center gap-2">
                <Check size={16} className="shrink-0 text-amber-600" />
                <span>Ергономічний дизайн та збалансований легкий корпус</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="shrink-0 text-amber-600" />
                <span>Сумісність з єдиною акумуляторною лінійкою P20S</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="shrink-0 text-amber-600" />
                <span>Чесна гарантійна підтримка та доступні запчастини</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutBrand;
