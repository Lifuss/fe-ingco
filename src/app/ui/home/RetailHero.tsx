'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play, X } from 'lucide-react';
import ReactModal from 'react-modal';

export default function RetailHero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section className="relative w-full px-5 md:px-[60px] pt-1 md:pt-2 pb-0">
      <div className="relative w-full h-[400px] lg:h-[440px] rounded-2xl overflow-hidden shadow-2xl flex items-start pt-8 md:pt-12 lg:pt-16">
        {/* Background Image with dark overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero_tools_bg.png"
            alt="Широкий асортимент жовтих інструментів INGCO"
            fill
            priority
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

            <button
              onClick={() => setIsVideoOpen(true)}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-medium border border-white/20 px-6 py-3 rounded-md transition-all duration-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-900 text-sm md:text-base cursor-pointer"
              aria-label="Дивитись промо-відео"
            >
              <Play size={18} fill="currentColor" className="text-white shrink-0" />
              Дивитись відео
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <ReactModal
        isOpen={isVideoOpen}
        onRequestClose={() => setIsVideoOpen(false)}
        contentLabel="Промо-відео INGCO"
        className="relative max-w-4xl w-full mx-auto bg-neutral-950 p-1 rounded-lg overflow-hidden shadow-2xl focus:outline-none"
        overlayClassName="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
      >
        <button
          onClick={() => setIsVideoOpen(false)}
          className="absolute top-4 right-4 z-55 text-white bg-black/60 hover:bg-black/80 p-2 rounded-full transition-all border border-white/10 cursor-pointer"
          aria-label="Закрити відео"
        >
          <X size={20} />
        </button>
        <div className="aspect-video w-full">
          <iframe
            className="w-full h-full rounded"
            src="https://www.youtube.com/embed/gWdZ_458-00?autoplay=1"
            title="INGCO Tools Official Promo Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </ReactModal>
    </section>
  );
}
