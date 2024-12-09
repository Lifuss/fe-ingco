'use client';

import CategoriesSidebar from '../ui/CategoriesSidebar';
import { redirect, usePathname, useSearchParams } from 'next/navigation';
import Header from '../ui/home/Header';
import Footer from '../ui/Footer';
import { ReactNode, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { clearAuthState } from '@/lib/appState/user/slice';
import { refreshTokenThunk } from '@/lib/appState/user/operation';
import { toast } from 'react-toastify';

const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const params = useSearchParams();
  const { isAuthenticated } = useAppSelector(
    (state) => state.persistedAuthReducer,
  );
  const productsCategories = useAppSelector(
    (state) => state.persistedMainReducer.categories,
  );

  const dispatch = useAppDispatch();
  let title = '';
  switch (pathname) {
    case '/retail/cart':
      title = 'Кошик';
      break;
    case '/retail/favorites':
      title = 'Обране';
      break;
    case '/retail/history':
      title = 'Історія замовлень';
      break;
    case '/retail':
      title = 'Каталог';
      const categoryId: string | null = params.get('category');
      if (categoryId) {
        console.log(categoryId);
        title = productsCategories.find((val) => val._id === categoryId)
          ?.name as string;
      }
      break;
    default:
      pathname;
  }

  useEffect(() => {
    if (!isAuthenticated) {
      const savedUser = JSON.parse(
        localStorage.getItem('persist:auth') as string,
      );
      const token = JSON.parse(savedUser?.token);

      if (token) {
        dispatch(refreshTokenThunk())
          .unwrap()
          .catch((err) => {
            dispatch(clearAuthState());
            toast.info(
              'Сесія закінчилася. Для взаємодії з акаунтом будь ласка, увійдіть знову.',
            );
          });
      }
    }
  }, [dispatch, isAuthenticated]);

  return (
    <>
      <Header />
      <main className="flex flex-col gap-4 px-[60px] pt-8 xl:flex-row 2xl:gap-14">
        <CategoriesSidebar />
        {pathname !== '/shop' ? (
          <div className="grid w-full grid-cols-3">
            <h2 className="col-span-3 mb-2 text-center text-3xl">{title}</h2>
            <div className="col-span-3 min-h-[550px]">{children}</div>
          </div>
        ) : (
          children
        )}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
