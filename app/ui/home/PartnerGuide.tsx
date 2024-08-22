import React from 'react';
import Link from 'next/link';

const LiClassName =
  'flex h-[240px] w-[150px] 2xl:w-[300px] md:h-[225px] lg:h-[240px] md:w-[250px] md:p-4 flex-col gap-2 rounded-lg bg-[#f6f6f663] p-2 shadow-sm';

const guideContent = [
  {
    step: 1,
    title: 'Заповнити заявку',
    text: 'В формі нового партнера вкажіть свої контактні дані та ключову інформацію про компанію',
    isButton: true,
    button: (
      <Link
        href={'/auth/register?isB2B=true'}
        className="mt-auto rounded-lg border border-orangeLight bg-inherit p-1 text-center text-xs text-orangeLight transition-all hover:bg-orange-500 hover:text-white focus:bg-orange-500 focus:text-white md:p-2 2xl:text-base"
      >
        Зареєструвати акаунт партнера
      </Link>
    ),
  },
  {
    step: 2,
    title: 'Отримати комерційну пропозицію',
    text: 'Наші спеціалісти підготують індивідуальні умови співпраці, враховуючи особливості вашого бізнесу',
    isButton: false,
  },
  {
    step: 3,
    title: 'Підібрати товар',
    text: 'Допоможемо обрати найкращий асортимент, який задовольнить потреби вашої цільової аудиторії та сприятиме процвітанню компанії',
    isButton: false,
  },
  {
    step: 4,
    title: 'Перша поставка',
    text: 'Ви стали партнером компанії Ingco-service. Очікуйте доставку високоякісних інструментів для будівництва та домашніх цілей',
    isButton: true,
    button: (
      <Link
        href={'/home/contacts'}
        className="mt-auto rounded-lg border border-orangeLight bg-inherit p-1 text-center text-xs text-orangeLight transition-all hover:bg-orange-500 hover:text-white focus:bg-orange-500 focus:text-white md:p-2 2xl:text-base"
      >
        Отримати консультацію
      </Link>
    ),
  },
];
const PartnerGuide = () => {
  return (
    <section className="mb-5 px-5 md:mb-16 md:px-[60px] lg:mb-24">
      <h2 className="mb-4 text-center text-2xl md:mb-10 md:text-3xl lg:md:text-4xl xl:text-5xl">
        Як розпочати співпрацю
      </h2>
      <ul className="flex flex-wrap justify-center gap-4 md:gap-10 lg:gap-x-24 xl:gap-x-4 2xl:gap-x-24">
        {guideContent.map(({ step, button, isButton, text, title }) => (
          <li key={step} className={LiClassName}>
            <sub className="text-xs text-orangeLight md:text-sm 2xl:text-base">
              {step} крок
            </sub>
            <h4 className="text-sm font-medium md:text-base 2xl:text-lg">
              {title}
            </h4>
            <p className="text-xs text-gray-500 md:text-sm 2xl:text-base">
              {text}
            </p>
            {isButton && button}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PartnerGuide;
