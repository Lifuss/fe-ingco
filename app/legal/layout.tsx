import { generatePageMetadata } from '@/lib/metadata';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'Юридичні документи',
  description: 'Публічна оферта, політика конфіденційності та інші юридичні документи INGCO',
  path: '/legal',
});

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const legalPages = [
    { href: '/legal/offer', title: 'Публічна оферта' },
    { href: '/legal/privacy', title: 'Політика конфіденційності' },
    { href: '/legal/terms', title: 'Умови використання' },
    { href: '/legal/returns', title: 'Повернення та обмін' },
    { href: '/legal/shipping', title: 'Політика доставки' },
    { href: '/legal/cookies', title: 'Політика cookies' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="container mx-auto px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/"
              className="text-xl font-semibold text-orange-600 hover:text-orange-700"
            >
              ← На головну
            </Link>
            <div className="flex flex-wrap gap-4 text-sm">
              {legalPages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="text-gray-600 transition-colors hover:text-orange-600"
                >
                  {page.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <main className="bg-white">{children}</main>
    </div>
  );
}

