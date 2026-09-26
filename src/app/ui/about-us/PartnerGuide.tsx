import React from 'react';
import Link from 'next/link';

const guideContent = [
  {
    step: 1,
    title: 'Заповнити заявку',
    text: 'У формі нового партнера вкажіть свої контактні дані та ключову інформацію про компанію',
    button: (
      <Link
        href="/auth/register?isB2B=true"
        className="mt-auto block rounded-lg border border-amber-400 bg-amber-50 p-2 text-center text-xs font-semibold text-amber-900 transition-all hover:bg-amber-500 hover:text-neutral-900 focus:bg-amber-500 focus:text-neutral-900 sm:text-sm"
      >
        Зареєструвати акаунт партнера
      </Link>
    ),
  },
  {
    step: 2,
    title: 'Отримати комерційну пропозицію',
    text: 'Наші спеціалісти підготують індивідуальні умови співпраці, враховуючи особливості вашого бізнесу',
  },
  {
    step: 3,
    title: 'Підібрати асортимент',
    text: 'Допоможемо обрати найкращий асортимент, який задовольнить потреби вашої цільової аудиторії',
  },
  {
    step: 4,
    title: 'Перша поставка',
    text: 'Отримайте статус офіційного партнера, швидку відвантажку та повний пакет бухгалтерських документів',
    button: (
      <Link
        href="/about-us/contacts"
        className="mt-auto block rounded-lg border border-amber-400 bg-amber-50 p-2 text-center text-xs font-semibold text-amber-900 transition-all hover:bg-amber-500 hover:text-neutral-900 focus:bg-amber-500 focus:text-neutral-900 sm:text-sm"
      >
        Отримати консультацію
      </Link>
    ),
  },
];

const PartnerGuide = () => {
  return (
    <section className="mb-8 px-5 md:mb-16 md:px-[60px]" aria-labelledby="partner-guide-heading">
      <h2
        id="partner-guide-heading"
        className="mb-6 text-center text-2xl font-bold tracking-tight text-neutral-900 md:mb-12 md:text-3xl lg:text-4xl"
      >
        Як розпочати співпрацю
      </h2>
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {guideContent.map(({ step, button, text, title }) => (
          <div
            key={step}
            className="flex min-h-[220px] flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md md:p-6"
          >
            <span className="mb-2 text-xs font-bold tracking-wider text-amber-700 uppercase">
              {step} крок
            </span>
            <h3 className="mb-2 text-base font-bold text-neutral-900 md:text-lg">{title}</h3>
            <p className="mb-4 text-xs leading-relaxed text-neutral-600 sm:text-sm">{text}</p>
            {button}
          </div>
        ))}
      </div>
    </section>
  );
};

export default PartnerGuide;
