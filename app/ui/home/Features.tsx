'use client';

import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';
import { featuresContentArray } from '@/lib/constants';

const Features = () => {
  const isTablet = useMediaQuery({ query: '(min-width: 768px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1280px)' });
  return (
    <section className="mb-5 px-5 md:mb-16 md:px-[60px] lg:mb-24">
      <h2 className="mb-4 text-center text-2xl md:mb-10 md:text-3xl lg:md:text-4xl xl:text-5xl">
        Чому ми?
      </h2>
      <ul className="flex flex-col items-center gap-4 md:grid md:grid-cols-2 md:place-items-center md:text-lg lg:text-xl xl:place-items-start xl:justify-center 2xl:text-2xl">
        {featuresContentArray.map((feature, index) => {
          let height, width;
          if (isDesktop) {
            height = 78;
            width = 78;
          } else if (isTablet) {
            height = 58;
            width = 58;
          } else {
            height = 48;
            width = 48;
          }
          return (
            <li
              key={`feature-${index}`}
              className="flex items-center gap-2 md:gap-3 xl:mx-auto xl:w-3/4"
            >
              <Image
                src={feature.img}
                height={height}
                width={width}
                alt=""
                className="shrink-0"
                loading="lazy"
              />
              <p>{feature.text}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Features;
