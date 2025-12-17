import HistoryTable from '~/shop/table/HistoryTable';
import CategoriesSidebar from '~/ui/CategoriesSidebar';
import Header from '~/ui/home/Header';
import Footer from '~/ui/Footer';

const Page = () => {
  return (
    <>
      <Header />
      <main className="flex flex-col gap-4 px-[60px] pt-8 xl:flex-row 2xl:gap-14">
        <CategoriesSidebar />
        <div className="min-h-[550px] w-full">
          <HistoryTable isRetail />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Page;
