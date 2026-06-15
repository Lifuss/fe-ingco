import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Percent } from 'lucide-react';

export default function RetailHero() {
  return (
    <section className="relative w-full px-5 pt-1 pb-0 md:px-[60px] md:pt-2">
      <div className="relative flex h-[420px] w-full items-start overflow-hidden rounded-2xl pt-6 shadow-2xl md:h-[420px] md:pt-8 lg:h-[474px] lg:pt-10">
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
        <div className="relative z-10 flex w-full max-w-4xl flex-col gap-5 pr-6 pl-6 text-white md:pl-12 lg:pl-16">
          {/* Promo Badge */}
          <div className="flex w-fit items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/20 px-3 py-1 text-xs font-semibold tracking-wider text-amber-400 uppercase select-none">
            <span className="animate-pulse">🔥</span> Офіційний представник
          </div>

          {/* Heading */}
          <h1 className="font-display text-3xl leading-tight font-bold tracking-tight select-none md:text-5xl lg:text-6xl">
            INGCO Україна — <br className="hidden md:block" />
            <span className="text-amber-500 drop-shadow-[0_2px_10px_rgba(245,158,11,0.3)]">
              Офіційний Імпортер
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl font-sans text-sm leading-relaxed font-light text-neutral-300 md:text-lg lg:text-xl">
            15 років світового визнання та офіційна гарантія виробника. Професійні інструменти для
            справжніх майстрів.
          </p>

          {/* CTAs */}
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <Link
              href="/?catalog=true"
              className="group bg-primary-500 hover:bg-primary-600 active:bg-primary-700 focus:ring-primary-500 inline-flex cursor-pointer items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:outline-none md:text-base"
              aria-label="Перейти до роздрібного каталогу"
            >
              Перейти до каталогу
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/?catalog=true&promo=true"
              className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-900 focus:outline-none active:bg-white/30 md:text-base"
              aria-label="Дивитися акції"
            >
              <Percent size={18} className="shrink-0 text-white" />
              Дивитися акції
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
