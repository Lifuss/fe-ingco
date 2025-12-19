import ProductList from '~/retail/ProductList';
import CategoriesSidebar from '~/ui/CategoriesSidebar';
import Header from '~/ui/home/Header';
import Footer from '~/ui/Footer';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Обрані товари',
  description: 'Ваші обрані інструменти INGCO',
  path: '/favorites',
  noindex: true,
  nofollow: true,
});

const Page = () => {
  return (
    <>
      <Header />
      <main className="flex flex-col gap-4 px-[60px] pt-8 xl:flex-row 2xl:gap-14">
        <CategoriesSidebar />
        <div className="min-h-[550px] w-full">
          <ProductList isFavoritePage />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Page;
