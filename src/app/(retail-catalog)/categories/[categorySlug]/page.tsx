import CatalogSidebar from '~/ui/catalog/CatalogSidebar';
import CatalogClientView from '~/ui/catalog/CatalogClientView';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';
import { getCategoryBySlug, getCategoryProducts } from '@/lib/serverData';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{
    categorySlug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: 'Категорія не знайдена',
      description: 'Категорію не знайдено',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const seoKeywords = category.seoKeywords
    ? category.seoKeywords
    : `${category.name}, купити ${category.name}, ${category.name} інгко, ${category.name} ingco, інструменти ingco, купити в Україні`;

  return generatePageMetadata({
    title: `${category.name} INGCO — купити в Україні`,
    description: `Купити ${category.name} INGCO в офіційному інтернет-магазині в Україні. Гарантія якості, широкий асортимент та швидка доставка по всій країні (Київ, Харків, Одеса, Дніпро, Львів та інші міста). Замовляйте за вигідною ціною!`,
    path: `/categories/${categorySlug}`,
    keywords: seoKeywords,
  });
}

export default async function Page({ params }: PageProps) {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const initialCatalogData = await getCategoryProducts(category.id, 20);

  return (
    <main className="mx-auto flex w-full max-w-[1680px] flex-col gap-4 bg-white px-4 pt-8 md:px-8 xl:flex-row 2xl:gap-10">
      <CatalogSidebar />
      <div className="min-h-[550px] w-full">
        <CatalogClientView initialCategory={category} initialCatalogData={initialCatalogData} />
      </div>
    </main>
  );
}
