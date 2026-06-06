'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Heart, ShoppingBasket } from 'lucide-react';
import { useAppSelector } from '@/lib/hooks';
import { cn } from '@/lib/utils';

import CurrencyRate from '../CurrencyRate';
import Search from '../search';
import UserModal from '../modals/UserModal';
import Icon from '../assets/Icon';
import CatalogDrawer from './CatalogDrawer';
import Logo from '../Logo';

const SubHeader = () => {
  const pathname = usePathname();
  const { isB2b } = useAppSelector((state) => state.persistedAuthReducer);

  const isStoreActive = pathname === '/' || pathname === '/shop';
  const isTermsActive = pathname.startsWith('/legal');
  const isAboutActive = pathname.startsWith('/about-us') && !pathname.includes('contacts');

  return (
    <nav className="hidden md:flex items-center justify-between border-b border-[#E5E3DD] bg-[#FDFDFD] py-1 px-5 md:px-[60px] select-none">
      <ul className="flex items-center gap-6 font-sans text-xs font-semibold text-neutral-500">
        <li className="relative py-1">
          <Link
            href={isB2b ? '/shop' : '/'}
            className={cn(
              'transition-colors hover:text-primary-500 cursor-pointer block',
              isStoreActive && 'text-primary-500 after:absolute after:bottom-[-5px] after:left-0 after:h-[2px] after:w-full after:bg-primary-500'
            )}
          >
            Магазин
          </Link>
        </li>
        <li className="relative py-1">
          <Link
            href="/legal/terms"
            className={cn(
              'transition-colors hover:text-primary-500 cursor-pointer block',
              isTermsActive && 'text-primary-500 after:absolute after:bottom-[-5px] after:left-0 after:h-[2px] after:w-full after:bg-primary-500'
            )}
          >
            Умови і правила
          </Link>
        </li>
        <li className="relative py-1">
          <Link
            href="/about-us"
            className={cn(
              'transition-colors hover:text-primary-500 cursor-pointer block',
              isAboutActive && 'text-primary-500 after:absolute after:bottom-[-5px] after:left-0 after:h-[2px] after:w-full after:bg-primary-500'
            )}
          >
            Про нас
          </Link>
        </li>
      </ul>

      <ul className="flex items-center gap-8 font-sans text-xs font-semibold">
        <li>
          <Link href="/about-us/contacts" className="text-neutral-500 hover:text-primary-500 transition-colors cursor-pointer">
            Зв&apos;язок
          </Link>
        </li>
        <li>
          <CurrencyRate />
        </li>
      </ul>
    </nav>
  );
};

const Header = () => {
  const pathname = usePathname();
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const { isAuthenticated, user, localStorageCart } = useAppSelector(
    (state) => state.persistedAuthReducer,
  );

  const isShop = pathname.includes('shop');
  
  // Calculate items in cart based on auth status and current catalog view (B2B vs B2C)
  const itemsInCart = isShop 
    ? user?.cart?.length || 0 
    : isAuthenticated 
      ? user?.retailCart?.length || 0 
      : localStorageCart?.length || 0;

  return (
    <>
      <header className="w-full bg-[#FFFDFB] border-b border-[#E5E3DD] flex flex-col z-50">
        {/* Top bar SubHeader */}
        <SubHeader />

        {/* Main Header bar */}
        <div className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6 py-3 lg:py-4 px-4 md:px-8 lg:px-10 xl:px-[60px]">
          
          {/* Mobile Top Row / Desktop Row Items */}
          <div className="flex items-center justify-between w-full lg:w-auto gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <Logo />

              {/* Hamburger Button for mobile/tablet Catalog */}
              <button
                onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                className={cn(
                  "lg:hidden flex items-center gap-1.5 px-2 py-1.5 min-[426px]:px-3 min-[426px]:py-2 rounded-lg min-[426px]:text-white min-[426px]:bg-primary-500 focus:outline-none transition-colors border cursor-pointer select-none font-display font-bold text-sm tracking-wide shadow-sm",
                  isCatalogOpen
                    ? "bg-primary-600 text-white border-transparent shadow-inner"
                    : "bg-white text-primary-600 border-primary-100 hover:bg-primary-50"
                )}
                aria-label="Toggle Catalog"
              >
                <LayoutGrid size={26} className="stroke-[2.5] shrink-0" />
                <span className="hidden min-[426px]:inline">Каталог</span>
              </button>
            </div>

            {/* Mobile/Tablet Action Icons */}
            <div className="flex lg:hidden items-center gap-2">
              <Link
                href={isShop ? '/shop/favorites' : '/favorites'}
                className="flex items-center justify-center p-2 rounded-lg text-primary-600 hover:bg-primary-50 hover:text-primary-800 transition-colors cursor-pointer"
                aria-label="Favorites"
              >
                <Heart size={22} className="stroke-current stroke-[2.3] fill-none" />
              </Link>
              
              <Link
                href={isShop ? '/shop/cart' : '/cart'}
                className="relative flex items-center justify-center p-2 rounded-lg text-primary-600 hover:bg-primary-50 hover:text-primary-800 transition-colors cursor-pointer"
                aria-label="Cart"
              >
                <div className="relative">
                  <ShoppingBasket size={22} className="stroke-current stroke-[2.3] fill-none" />
                  {itemsInCart > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-primary-800 text-white text-[9px] font-extrabold rounded-full w-4.5 h-4.5 flex items-center justify-center border border-white shadow-sm">
                      {itemsInCart}
                    </span>
                  )}
                </div>
              </Link>

              {isAuthenticated ? (
                <UserModal showLabel={false} />
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center justify-center p-2 rounded-lg text-primary-600 hover:bg-primary-50 hover:text-primary-800 transition-colors cursor-pointer"
                  aria-label="Profile"
                >
                  <Icon
                    icon="user"
                    className="h-[22px] w-[22px] fill-none stroke-current stroke-[2.3]"
                  />
                </Link>
              )}
            </div>
          </div>

          {/* Catalog & Search Block */}
          <div className="flex-grow flex items-center gap-4 w-full lg:max-w-3xl xl:max-w-5xl 2xl:max-w-6xl">
            {/* Catalog Trigger Button - Desktop only */}
            <button
              onClick={() => setIsCatalogOpen(!isCatalogOpen)}
              className={cn(
                'hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-lg font-display font-bold text-sm tracking-wide transition-all cursor-pointer select-none shadow-sm shadow-orange-500/5 border border-transparent shrink-0',
                isCatalogOpen
                  ? 'bg-primary-600 text-white shadow-inner'
                  : 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700'
              )}
            >
              <LayoutGrid size={16} className="stroke-[2.5]" />
              <span>Каталог</span>
            </button>

            {/* Premium Rounded Search input */}
            <Search placeholder="Пошук інструменту за назвою або артикулом..." variant="header" />
          </div>

          {/* Right Action Icons grouped block - Desktop only */}
          <div className="hidden lg:flex items-center gap-6 shrink-0">
            {/* 1. Favorites Action */}
            <Link
              href={isShop ? '/shop/favorites' : '/favorites'}
              className="flex flex-col items-center justify-center gap-1 font-sans text-[11px] font-bold text-primary-600 hover:text-primary-800 transition-colors cursor-pointer select-none"
            >
              <Heart size={22} className="stroke-current stroke-[2.3] fill-none" />
              <span>Обране</span>
            </Link>

            {/* 2. Cart Action */}
            <Link
              href={isShop ? '/shop/cart' : '/cart'}
              className="relative flex flex-col items-center justify-center gap-1 font-sans text-[11px] font-bold text-primary-600 hover:text-primary-800 transition-colors cursor-pointer select-none"
            >
              <div className="relative">
                <ShoppingBasket size={22} className="stroke-current stroke-[2.3] fill-none" />
                {itemsInCart > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-primary-800 text-white text-[9px] font-extrabold rounded-full w-4.5 h-4.5 flex items-center justify-center border border-white shadow-sm">
                    {itemsInCart}
                  </span>
                )}
              </div>
              <span>Кошик</span>
            </Link>

            {/* 3. Profile / Auth Action */}
            {isAuthenticated ? (
              <UserModal showLabel={true} />
            ) : (
              <Link
                href="/auth/login"
                className="flex flex-col items-center justify-center gap-1 font-sans text-[11px] font-bold text-primary-600 hover:text-primary-800 transition-colors cursor-pointer select-none"
              >
                <Icon
                  icon="user"
                  className="h-[22px] w-[22px] fill-none stroke-current stroke-[2.3] transition-colors"
                />
                <span>Профіль</span>
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* Catalog Drawer Mega-Menu Dropdown overlay */}
      <CatalogDrawer isOpen={isCatalogOpen} onClose={() => setIsCatalogOpen(false)} />
    </>
  );
};

export default Header;
