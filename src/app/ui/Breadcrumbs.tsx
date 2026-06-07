'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useSearchParams, usePathname } from 'next/navigation';
import { SITE_URL } from '@/lib/metadata';

interface BreadcrumbItem {
  label: string;
  href?: string;
  preserveQuery?: boolean;
  queryKeys?: string[];
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const buildHref = (item: BreadcrumbItem) => {
    if (!item.href) return undefined;
    if (!item.preserveQuery) return item.href;

    const params = new URLSearchParams();

    if (item.queryKeys && item.queryKeys.length > 0) {
      item.queryKeys.forEach((key) => {
        const value = searchParams.get(key);
        if (value !== null) params.set(key, value);
      });
    } else {
      searchParams.forEach((value, key) => {
        params.set(key, value);
      });
    }

    const qs = params.toString();
    return qs ? `${item.href}?${qs}` : item.href;
  };

  const itemsWithHref = items.map((item) => ({
    ...item,
    href: buildHref(item),
  }));

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Головна',
        item: SITE_URL,
      },
      ...itemsWithHref.map((item, index) => {
        const itemUrl = item.href
          ? `${SITE_URL}${item.href}`
          : index === itemsWithHref.length - 1
            ? `${SITE_URL}${pathname}`
            : undefined;

        return {
          '@type': 'ListItem',
          position: index + 2,
          name: item.label,
          item: itemUrl,
        };
      }),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData, null, 2),
        }}
      />
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          {/* <li>
            <Link
              href="/"
              className="flex items-center transition-colors hover:text-orange-500"
              aria-label="Головна сторінка"
            >
              <Home size={16} />
            </Link>
          </li> */}
          {itemsWithHref.map((item, index) => (
            <li key={index} className="flex items-center">
              {item.href ? (
                <Link href={item.href} className="transition-colors hover:text-orange-500">
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-gray-900">{item.label}</span>
              )}
              {index !== itemsWithHref.length - 1 && <ChevronRight size={16} className="mx-1" />}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
