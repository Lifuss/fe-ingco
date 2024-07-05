'use client';
import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Link from 'next/link';
import { ReactElement } from 'react';

var settings = {
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
      <ul className="flex justify-center"> {dots} </ul>
    </div>
  ),
  customPaging: () => <div className="h-2 w-2 rounded-xl bg-[#9ca3af]"></div>,
};

let slides = Array.from({ length: 4 }, (_, i) => i + 1);

const Hero = () => {
  return (
    <section className="mb-10 flex flex-col-reverse gap-10 px-5 pt-3 md:mb-16 md:flex-row md:px-[60px] md:pt-8 lg:mb-24">
      <div className="md:flex md:flex-col md:justify-evenly">
        <h1 className="mb-4 mr-auto text-start text-2xl tracking-normal md:mb-0 md:text-3xl lg:w-[81%] lg:text-4xl xl:w-[74%] xl:text-5xl 2xl:w-[81%] 2xl:text-7xl">
          Оптові Постачання для Бізнесу: будівельні та домашні інструменти
        </h1>
        <p className="mb-6 mr-auto flex w-[270px] flex-wrap text-lg font-medium md:w-full md:text-left md:text-lg lg:w-[79%] xl:w-[71%] xl:text-2xl 2xl:text-4xl 2xl:font-normal">
          Офіційний імпортер продукції в Україні
        </p>
        <Link
          href={'/auth/register'}
          className="mx-auto flex w-[230px] justify-center rounded-lg bg-[#f59e0b] py-3 text-lg text-white transition-colors ease-out hover:bg-orange-400 md:mx-0 md:w-[300px] xl:w-[421px] xl:py-[17px] xl:text-2xl 2xl:w-[600px] 2xl:py-[25px] 2xl:text-2xl"
        >
          Зареєструватися
        </Link>
      </div>
      <div className="md:w-1/2">
        <Slider {...settings}>
          {slides.map((slide) => (
            <Image
              key={slide}
              src={`/homeSlider/sliderImg${slide}.png`}
              width={450}
              height={250}
              alt="Презентаційні інструменти INGCO"
              className="mx-auto mb-4 md:mb-2"
            />
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Hero;
