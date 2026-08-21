import ProductList from '@/app/ui/product/ProductList';
import CatalogSidebar from '~/ui/catalog/CatalogSidebar';
import { getShowcaseProducts } from '@/lib/serverData';

// B2C Landing Page Components
import RetailHero from '~/ui/home/RetailHero';
import TrustRibbon from '~/ui/home/TrustRibbon';
import SeriesComparison from '~/ui/home/SeriesComparison';
import CategoryGrid from '~/ui/home/CategoryGrid';
import HotOffers from '~/ui/home/HotOffers';
import Testimonials from '~/ui/home/Testimonials';
import FaqSection from '~/ui/home/FaqSection';
import ConsultationCTA from '~/ui/home/ConsultationCTA';
import CatalogDynamicLanding from './CatalogDynamicLanding';

type PageProps = {
  searchParams: Promise<{
    category?: string;
    query?: string;
    page?: string;
    catalog?: string;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const { category = '', query = '', page = '', catalog = '' } = await searchParams;

  const showCatalog = Boolean(category || query || page || catalog === 'true');

  if (showCatalog) {
    return (
      <main className="flex flex-col gap-4 bg-white px-[60px] pt-8 xl:flex-row 2xl:gap-14">
        <CatalogSidebar />
        <div className="min-h-[550px] w-full">
          <ProductList />
        </div>
      </main>
    );
  }

  const products = await getShowcaseProducts(100);

  return (
    <CatalogDynamicLanding>
      <RetailHero />
      <TrustRibbon />
      <HotOffers products={products} />
      <CategoryGrid />
      <SeriesComparison products={products} />
      <Testimonials />
      <FaqSection />
      <ConsultationCTA />
    </CatalogDynamicLanding>
  );
}
