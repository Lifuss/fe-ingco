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
              <CatalogMobileButton />
            </div>

            {/* Mobile/Tablet Action Icons */}
            <MobileActions />
          </div>

          {/* Catalog & Search Block */}
          <div className="flex-grow flex items-center gap-4 w-full lg:max-w-3xl xl:max-w-5xl 2xl:max-w-6xl">
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
