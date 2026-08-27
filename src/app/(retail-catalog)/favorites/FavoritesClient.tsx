'use client';
import CatalogClientView from '~/ui/catalog/CatalogClientView';

const FavoritesClient = () => {
  return (
    <main className="mx-auto min-h-[550px] w-full max-w-[1680px] bg-white px-4 pt-8 md:px-8 lg:px-[60px]">
      <CatalogClientView isFavoritePage={true} />
    </main>
  );
};

export default FavoritesClient;
