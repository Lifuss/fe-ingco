import Logo from '~/ui/Logo';
import Search from '~/ui/search';
import SubHeader from './SubHeader';
import HeaderActions from './HeaderActions';
import MobileActions from './MobileActions';
import {
  CatalogProvider,
  CatalogMobileButton,
  CatalogDesktopButton,
  CatalogDrawerWrapper,
} from './CatalogController';

export default function Header() {
  return (
    <CatalogProvider>
      <header className="z-50 flex w-full flex-col border-b border-[#E5E3DD] bg-[#FFFDFB]">
        {/* Top bar SubHeader */}
        <SubHeader />

        {/* Main Header bar */}
        <div className="flex w-full flex-col justify-between gap-4 px-4 py-3 md:px-8 lg:flex-row lg:items-center lg:gap-6 lg:px-10 lg:py-4 xl:px-[60px]">
          {/* Mobile Top Row / Desktop Row Items */}
          <div className="flex w-full shrink-0 items-center justify-between gap-4 lg:w-auto">
            <div className="flex items-center gap-3">
              <Logo />

              {/* Hamburger Button for mobile/tablet Catalog */}
              <CatalogMobileButton />
            </div>

            {/* Mobile/Tablet Action Icons */}
            <MobileActions />
          </div>

          {/* Catalog & Search Block */}
          <div className="flex w-full flex-grow items-center gap-4 lg:max-w-3xl xl:max-w-5xl 2xl:max-w-6xl">
            {/* Desktop Catalog Split Button */}
            <CatalogDesktopButton />

            {/* Premium Rounded Search input */}
            <Search placeholder="Пошук інструменту за назвою або артикулом..." variant="header" />
          </div>

          {/* Desktop Right Action Icons */}
          <HeaderActions />
        </div>
      </header>

      {/* Catalog Drawer Mega-Menu Dropdown overlay */}
      <CatalogDrawerWrapper />
    </CatalogProvider>
  );
}
