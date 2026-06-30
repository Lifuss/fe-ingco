import Link from 'next/link';
import Header from './ui/header/Header';
import Footer from './ui/Footer';
import { Home, Compass, PhoneCall, Wrench } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex items-center justify-center bg-radial from-orange-50/30 via-transparent to-transparent py-16 px-4 md:min-h-[75vh]">
        <div className="relative mx-auto flex w-full max-w-[550px] flex-col items-center rounded-3xl border border-neutral-100 bg-white p-8 text-center shadow-xl md:p-12">
          {/* Decorative background glow */}
          <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-primary-100/50 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-amber-100/40 blur-3xl pointer-events-none" />

          {/* Interactive Wrench Illustration */}
          <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary-50 text-primary-500 ring-8 ring-primary-50/50">
            <Wrench className="h-12 w-12 animate-pulse" />
            <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white shadow-md">
              404
            </span>
          </div>

          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-neutral-900 md:text-4xl">
            Сторінку не знайдено
          </h1>
          
          <p className="mb-8 max-w-md text-base leading-relaxed text-neutral-500">
            Можливо, адреса сторінки введена з помилкою, або цей товар тимчасово відсутній. Спробуйте розпочати з головної сторінки або перейдіть до каталогу товарів.
          </p>

          {/* Navigation Options */}
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 py-3.5 text-base font-semibold text-white shadow-sm shadow-primary-500/25 transition-all hover:bg-primary-600 active:scale-[0.98]"
              href="/"
            >
              <Home size={18} />
              На головну
            </Link>
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-3.5 text-base font-semibold text-neutral-700 transition-all hover:bg-neutral-50 hover:text-neutral-900 active:scale-[0.98]"
              href="/?catalog=true"
            >
              <Compass size={18} />
              В каталог
            </Link>
          </div>

          <div className="mt-8 border-t border-neutral-100 pt-6 w-full">
            <p className="text-sm text-neutral-400">
              Потрібна допомога?{' '}
              <Link href="/about-us/support" className="inline-flex items-center gap-1 font-semibold text-primary-500 hover:text-primary-600 transition-colors">
                <PhoneCall size={12} />
                Зв’язатися з підтримкою
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

