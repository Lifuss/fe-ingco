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
      })
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
    <section className="w-full px-5 md:px-[60px] pb-16">
      <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800 shadow-[0_10px_50px_rgba(245,158,11,0.1)] py-12 px-6 md:py-16 md:px-12 flex flex-col lg:flex-row justify-between items-center gap-10">
        
        {/* Glow effect overlays for high premium visuals */}
        <div className="absolute top-[-50%] left-[-20%] w-[350px] h-[350px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none select-none" />
        <div className="absolute bottom-[-50%] right-[-25%] w-[400px] h-[400px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none select-none" />

        {/* Info/Heading area */}
        <div className="relative z-10 flex flex-col gap-4 text-left max-w-xl">
          <div className="w-fit flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 font-semibold text-xs tracking-wider uppercase select-none">
            <ShieldCheck size={14} className="stroke-[2.5]" /> Безкоштовний підбір
          </div>

          <h2 className="font-display font-bold text-2xl md:text-4xl text-white leading-tight">
            ВАЖКО ОБРАТИ ІНСТРУМЕНТ? <br />
            <span className="text-amber-500 drop-shadow-[0_2px_10px_rgba(245,158,11,0.2)]">
              МИ ДОПОМОЖЕМО!
            </span>
          </h2>
          <p className="font-sans text-neutral-300 text-sm md:text-base leading-relaxed">
            Залиште ваші контакти, і наш провідний технічний спеціаліст підбере ідеальний комплект інструментів під ваші завдання, умови використання та бюджет. Без переплат.
          </p>
        </div>

        {/* Interactive Form area */}
        <div className="relative z-10 w-full max-w-md bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl backdrop-blur-md shadow-inner">
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center text-center py-6 gap-3 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                <CheckCircle size={32} />
              </div>
              <h3 className="font-display font-bold text-xl text-white">Заявка прийнята!</h3>
              <p className="font-sans text-neutral-300 text-sm leading-relaxed max-w-xs">
                Ми зателефонуємо вам протягом 15 хвилин для консультації. Готуйте ваші запитання!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <h3 className="font-display font-bold text-lg text-white mb-2">
                Замовити дзвінок спеціаліста
              </h3>
              
              <div className="flex flex-col gap-1">
                <label htmlFor="name-input" className="font-sans text-xs text-neutral-400 font-medium ml-1">
                  Ваше ім’я
                </label>
                <input
                  id="name-input"
                  type="text"
                  placeholder="Введіть ваше ім’я"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="font-sans text-sm bg-white/10 border border-white/15 focus:border-primary-500 focus:bg-white/15 rounded-md px-4 py-3 text-white placeholder-neutral-500 outline-none transition-all focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="phone-input" className="font-sans text-xs text-neutral-400 font-medium ml-1">
                  Телефон *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-sans text-sm text-neutral-400 select-none">
                    +380
                  </span>
                  <input
                    id="phone-input"
                    type="tel"
                    placeholder="93 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                    required
                    className="w-full font-sans text-sm bg-white/10 border border-white/15 focus:border-primary-500 focus:bg-white/15 rounded-md pl-14 pr-4 py-3 text-white placeholder-neutral-500 outline-none transition-all focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group w-full font-display font-semibold text-sm md:text-base bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white rounded-md py-3.5 mt-2 transition-all duration-300 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed select-none"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Надсилання...</span>
                  </>
                ) : (
                  <>
                    <Phone size={18} fill="currentColor" />
                    <span>Передзвоніть мені</span>
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
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
