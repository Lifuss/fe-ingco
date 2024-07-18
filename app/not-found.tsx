import Link from 'next/link';
import Header from './ui/home/Header';
import Footer from './ui/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex items-start justify-center py-10 md:min-h-[70vh]">
        <div className="relative mx-auto flex w-full max-w-[450px] flex-col">
          <h1 className="mb-8 text-center text-[84px] font-bold">404</h1>
          <p className="mb-8 text-center text-3xl">Сторінку не знайдено</p>
          <Link
            className="mx-auto w-fit rounded-lg bg-orangeLight p-3 text-xl transition-colors duration-200 hover:bg-orange-400"
            href="/"
          >
            На головну
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
