import CatalogSidebar from '~/ui/catalog/CatalogSidebar';
import ProductList from '~/ui/product/ProductList';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';
import { notFound } from 'next/navigation';

async function getCategoryBySlug(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/categories/slug/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: 'Категорія не знайдена | INGCO',
      description: 'Категорію не знайдено',
    };
  }

  const seoKeywords = category.seoKeywords
    ? category.seoKeywords
    : `${category.name}, купити ${category.name}, ${category.name} інгко, ${category.name} ingco, інструменти ingco, купити в Україні`;

  return generatePageMetadata({
    title: `${category.name} INGCO | Купити в офіційному інтернет-магазині в Україні`,
    description: `Купити ${category.name} INGCO в офіційному інтернет-магазині в Україні. Гарантія якості, широкий асортимент та швидка доставка по всій країні (Київ, Харків, Одеса, Дніпро, Львів та інші міста). Замовляйте за вигідною ціною!`,
    path: `/categories/${categorySlug}`,
    keywords: seoKeywords,
  });
}

type PageProps = {
  params: Promise<{
    categorySlug: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  return (
    <main className="flex flex-col gap-4 bg-white px-[60px] pt-8 xl:flex-row 2xl:gap-14">
      <CatalogSidebar />
      <div className="min-h-[550px] w-full">
        <ProductList />
      </div>
    </main>
  );
}
