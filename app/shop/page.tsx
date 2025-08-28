import ShopTable from './table/ShopTable';
import Head from 'next/head';

function Page() {
  return (
    <>
      <Head>
        <title>Каталог для партнерів | INGCO Україна</title>
        <meta
          name="description"
          content="Партнерський каталог інструментів INGCO: гуртові ціни, фільтри, швидкий пошук. Купуйте офіційно в Україні."
        />
        <meta property="og:title" content="Каталог для партнерів | INGCO" />
        <meta
          property="og:description"
          content="Гуртовий каталог інструментів INGCO. Офіційний імпортер в Україні."
        />
        <link rel="canonical" href="https://ingco-service.win/shop" />
      </Head>
      <>
        <div className="grow">
          <ShopTable />
        </div>
      </>
    </>
  );
}

export default Page;
