import Image from 'next/image';
import { featuresContentArray } from '@/lib/constants';

const Features = () => {
  return (
    <section className="mb-5 px-5 md:mb-16 md:px-[60px] lg:mb-24">
      <h2 className="mb-4 text-center text-2xl md:mb-10 md:text-3xl lg:text-4xl xl:text-5xl">
        Чому ми?
      </h2>
      <ul className="flex flex-col items-center gap-4 md:grid md:grid-cols-2 md:place-items-center md:text-lg lg:text-xl xl:place-items-start xl:justify-center 2xl:text-2xl">
        {featuresContentArray.map((feature, index) => (
          <li
            key={`feature-${index}`}
            className="flex items-center gap-2 md:gap-3 xl:mx-auto xl:w-3/4"
          >
            <div className="relative h-12 w-12 shrink-0 md:h-[58px] md:w-[58px] xl:h-[78px] xl:w-[78px]">
              <Image
                src={feature.img}
                alt={`Картинка про ${feature.text}`}
                fill
                sizes="(max-width: 768px) 48px, (max-width: 1280px) 58px, 78px"
                className="object-contain"
                loading="lazy"
              />
            </div>
            <p>{feature.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Features;
