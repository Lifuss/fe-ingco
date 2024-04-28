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
  // TODO rewrite login to register href + responsive
  return (
    <section className="flex flex-col-reverse px-5 py-5 pt-2">
      <div className="">
        <h1 className="mb-4 mr-auto text-start text-2xl">
          Оптові Постачання для Бізнесу: будівельні та домашні інструменти
        </h1>
        <p className="mb-4 mr-auto flex w-[200px] flex-wrap text-end text-xl">
          <span className="mr mr-1 font-medium">Офіційний імпортер</span>
          продукції в Україні
        </p>
        <Link
          href={'/login'}
          className="mr-auto flex w-[200px] justify-center rounded-lg bg-[#f59e0b] py-2 text-lg text-white"
        >
          Зареєструватися
        </Link>
      </div>
      <ul className="mb-6">
        <li>
          <Slider {...settings}>
            {slides.map((slide) => (
              <Image
                key={slide}
                src={`/homeSlider/sliderImg${slide}.png`}
                width={450}
                height={250}
                alt="test"
                className="mx-auto mb-4"
              />
            ))}
          </Slider>
        </li>
      </ul>
    </section>
  );
};

export default Hero;
