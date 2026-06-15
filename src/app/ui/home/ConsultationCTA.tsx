'use client';

import React, { useState } from 'react';
import { Phone, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/lib/hooks';
import { supportTicketThunk } from '@/lib/appState/main/operations';

export default function ConsultationCTA() {
  const dispatch = useAppDispatch();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone || phone.trim().length < 9) {
      toast.error('Будь ласка, введіть коректний номер телефону (мінімум 9 цифр)');
      return;
    }

    setIsSubmitting(true);

    dispatch(
      supportTicketThunk({
        name: name.trim() || 'Клієнт',
        email: 'consultation@ingco.ua',
        message: 'Заявка на консультацію з головної сторінки (блок "Важко обрати інструмент?")',
        phone: `+380${phone}`,
      }),
    )
      .unwrap()
      .then(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        toast.success('Дякуємо! Наш спеціаліст зв’яжеться з вами найближчим часом.');

        // Reset form after a delay
        setTimeout(() => {
          setPhone('');
          setName('');
          setIsSubmitted(false);
        }, 5000);
      })
      .catch(() => {
        setIsSubmitting(false);
        toast.error('Виникла помилка. Спробуйте пізніше або зв’яжіться з нами по телефону.');
      });
  };

  return (
    <section className="w-full px-5 pb-16 md:px-[60px]">
      <div className="relative flex w-full flex-col items-center justify-between gap-10 overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 px-6 py-12 shadow-[0_10px_50px_rgba(245,158,11,0.1)] md:px-12 md:py-16 lg:flex-row">
        {/* Glow effect overlays for high premium visuals */}
        <div className="bg-primary-500/10 pointer-events-none absolute top-[-50%] left-[-20%] h-[350px] w-[350px] rounded-full blur-[120px] select-none" />
        <div className="pointer-events-none absolute right-[-25%] bottom-[-50%] h-[400px] w-[400px] rounded-full bg-amber-500/15 blur-[140px] select-none" />

        {/* Info/Heading area */}
        <div className="relative z-10 flex max-w-xl flex-col gap-4 text-left">
          <div className="flex w-fit items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-amber-400 uppercase select-none">
            <ShieldCheck size={14} className="stroke-[2.5]" /> Безкоштовний підбір
          </div>

          <h2 className="font-display text-2xl leading-tight font-bold text-white md:text-4xl">
            ВАЖКО ОБРАТИ ІНСТРУМЕНТ? <br />
            <span className="text-amber-500 drop-shadow-[0_2px_10px_rgba(245,158,11,0.2)]">
              МИ ДОПОМОЖЕМО!
            </span>
          </h2>
          <p className="font-sans text-sm leading-relaxed text-neutral-300 md:text-base">
            Залиште ваші контакти, і наш провідний технічний спеціаліст підбере ідеальний комплект
            інструментів під ваші завдання, умови використання та бюджет. Без переплат.
          </p>
        </div>

        {/* Interactive Form area */}
        <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-inner backdrop-blur-md md:p-8">
          {isSubmitted ? (
            <div className="animate-fade-in flex flex-col items-center justify-center gap-3 py-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10 text-green-400">
                <CheckCircle size={32} />
              </div>
              <h3 className="font-display text-xl font-bold text-white">Заявка прийнята!</h3>
              <p className="max-w-xs font-sans text-sm leading-relaxed text-neutral-300">
                Ми зателефонуємо вам протягом 15 хвилин для консультації. Готуйте ваші запитання!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <h3 className="font-display mb-2 text-lg font-bold text-white">
                Замовити дзвінок спеціаліста
              </h3>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="name-input"
                  className="ml-1 font-sans text-xs font-medium text-neutral-400"
                >
                  Ваше ім’я
                </label>
                <input
                  id="name-input"
                  type="text"
                  placeholder="Введіть ваше ім’я"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="focus:border-primary-500 focus:ring-primary-500 rounded-md border border-white/15 bg-white/10 px-4 py-3 font-sans text-sm text-white placeholder-neutral-500 transition-all outline-none focus:bg-white/15 focus:ring-1"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="phone-input"
                  className="ml-1 font-sans text-xs font-medium text-neutral-400"
                >
                  Телефон *
                </label>
                <div className="relative">
                  <span className="absolute top-1/2 left-4 -translate-y-1/2 font-sans text-sm text-neutral-400 select-none">
                    +380
                  </span>
                  <input
                    id="phone-input"
                    type="tel"
                    placeholder="93 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                    required
                    className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-md border border-white/15 bg-white/10 py-3 pr-4 pl-14 font-sans text-sm text-white placeholder-neutral-500 transition-all outline-none focus:bg-white/15 focus:ring-1"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group font-display bg-primary-500 hover:bg-primary-600 active:bg-primary-700 mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/10 transition-all duration-300 select-none hover:shadow-orange-500/20 disabled:cursor-not-allowed disabled:opacity-55 md:text-base"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Надсилання...</span>
                  </>
                ) : (
                  <>
                    <Phone size={18} fill="currentColor" />
                    <span>Передзвоніть мені</span>
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
