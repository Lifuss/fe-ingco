import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex items-start justify-center py-10 md:min-h-screen">
      <div className="relative mx-auto flex w-full max-w-[450px] flex-col">
        <h1 className="mb-8 text-center text-4xl font-bold">404</h1>
        <p className="mb-8 text-center">Сторінку не знайдено</p>
        <Link href="/">На головну</Link>
      </div>
    </main>
  );
}
