'use client';
import Image from 'next/image';
import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Link from 'next/link';
import { Handshake, ShoppingBasket } from 'lucide-react';
import { ReactElement } from 'react';

const slides = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  src: `/homeSlider/hero${index + 1}.webp`,
}));

const Hero = () => {
  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    adaptiveHeight: false,
    centerPadding: '0',
    appendDots: (dots: ReactElement) => (
      <div>
        <ul className="flex justify-center gap-2">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="h-2 w-2 rounded-full bg-secondary"></div>
    ),
  };

  return (
    <section className="mb-10 flex flex-col-reverse gap-10 px-5 pt-3 md:mb-16 md:items-center md:pt-8 lg:mb-24 lg:flex-row lg:px-[60px]">
      <div className="h-full w-full md:flex md:flex-col md:items-center md:justify-evenly lg:items-start 2xl:justify-normal 2xl:gap-9">
        <h1 className="mb-4 mr-auto text-2xl tracking-normal md:mx-auto md:mb-2 md:text-center md:text-3xl lg:mx-0 lg:text-left xl:text-4xl 2xl:w-[81%] 2xl:text-[4rem] 2xl:leading-none">
          Оптові Постачання для Бізнесу
          <span className="block lg:mt-2">
            Будівельні та домашні інструменти
          </span>
        </h1>
        <p className="mb-6 text-lg font-medium md:w-full md:text-center md:text-lg lg:text-left xl:text-2xl 2xl:text-3xl 2xl:font-normal">
          Офіційний імпортер продукції в Україні
        </p>
        <div className="flex items-baseline gap-4 lg:flex-col">
          <HeroButton
            href="/retail"
            icon={<ShoppingBasket size={20} className="shrink-0" />}
            label="Оглянути роздріб"
            ariaLabel="Перейти до роздрібного каталогу продуктів"
          />
          <HeroButton
            href="/auth/register?isB2B=true"
            icon={<Handshake size={20} className="shrink-0" />}
            label="Стати партнером"
            ariaLabel="Перейти до реєстрації партнера компанії"
          />
        </div>
      </div>
      <div className="md:my-auto md:w-full lg:w-1/2">
        <Slider {...settings} className="rounded-lg">
          {slides.map(({ id, src }) => (
            <Image
              key={id}
              src={src}
              width={450}
              height={250}
              alt={`Слайд ${id}`}
              className="mx-auto h-full w-full object-cover"
              priority={id === 1}
            />
          ))}
        </Slider>
      </div>
    </section>
  );
};

type ButtonProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  ariaLabel: string;
};

function HeroButton({ href, icon, label, ariaLabel }: ButtonProps) {
  return (
    <Link
      href={href}
      className="flex w-fit items-center justify-center gap-3 rounded-lg bg-orangeLight px-2 py-2 font-medium text-[#2E2E2E] shadow-md transition-all ease-out hover:scale-105 hover:bg-orange-500 hover:text-gray-200 hover:shadow-lg focus:bg-orange-500 focus:text-gray-200 md:px-5 md:py-4 md:text-lg lg:px-10 lg:py-3 xl:py-4 xl:text-xl"
      aria-label={ariaLabel}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export default Hero;
