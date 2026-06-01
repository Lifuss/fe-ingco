import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Percent } from 'lucide-react';

export default function RetailHero() {
  return (
    <section className="relative w-full px-5 md:px-[60px] pt-1 md:pt-2 pb-0">
      <div className="relative w-full h-[420px] md:h-[420px] lg:h-[474px] rounded-2xl overflow-hidden shadow-2xl flex items-start pt-6 md:pt-8 lg:pt-10">
        {/* Background Image with dark overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero/main-hero.png"
            alt="Широкий асортимент жовтих інструментів INGCO"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-4xl pl-6 pr-6 md:pl-12 lg:pl-16 text-white flex flex-col gap-5">
          {/* Promo Badge */}
          <div className="w-fit flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 font-semibold text-xs tracking-wider uppercase select-none">
            <span className="animate-pulse">🔥</span> Офіційний представник
          </div>

          {/* Heading */}
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight select-none">
            INGCO Україна — <br className="hidden md:block" />
            <span className="text-amber-500 drop-shadow-[0_2px_10px_rgba(245,158,11,0.3)]">
              Офіційний Імпортер
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-sm md:text-lg lg:text-xl text-neutral-300 max-w-2xl font-light leading-relaxed">
            15 років світового визнання та офіційна гарантія виробника. Професійні інструменти для справжніх майстрів.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <Link
              href="/?catalog=true"
              className="group inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-semibold px-6 py-3 rounded-md transition-all duration-300 shadow-lg shadow-orange-500/20 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-900 text-sm md:text-base cursor-pointer"
              aria-label="Перейти до роздрібного каталогу"
            >
              Перейти до каталогу
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/?catalog=true&promo=true"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-medium border border-white/20 px-6 py-3 rounded-md transition-all duration-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-900 text-sm md:text-base cursor-pointer"
              aria-label="Дивитися акції"
            >
              <Percent size={18} className="text-white shrink-0" />
              Дивитися акції
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
