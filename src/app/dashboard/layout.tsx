'use client';

import { ReactNode, useState, useEffect, useSyncExternalStore } from 'react';
import withAuth from '../service/PrivateRouting';
import Sidebar from './Sidebar';
import Link from 'next/link';
import { Menu, Store } from 'lucide-react';

const emptySubscribe = () => () => {};

const Layout = ({ children }: { children: ReactNode }) => {
  const _isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ingco_sidebar_collapsed');
      if (saved !== null) {
        return saved === 'true';
      }
      return window.innerWidth < 1280;
    }
    return false;
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('ingco_sidebar_collapsed', String(next));
      }
      return next;
    });
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-dashboard-bg flex min-h-screen flex-col font-sans text-neutral-900 md:flex-row">
      {/* Mobile Top Header */}
      <header className="bg-sidebar-dark sticky top-0 z-30 flex items-center justify-between border-b border-white/10 px-4 py-3 text-white shadow-md md:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="hover:bg-sidebar-hover rounded-lg p-2 text-neutral-200 transition-colors focus:outline-none"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-wider text-white">INGCO</span>
            <span className="rounded border border-amber-500/30 bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold tracking-widest text-amber-400 uppercase">
              CRM
            </span>
          </Link>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition-colors hover:bg-white/20 hover:text-white"
        >
          <Store size={15} />
          <span>На сайт</span>
        </Link>
      </header>

      {/* Mobile Drawer (Off-Canvas Overlay) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMobileOpen(false)}
          />
          {/* Drawer Container */}
          <div className="bg-sidebar-dark relative z-50 h-full w-72 max-w-[85vw] shadow-2xl transition-transform duration-300 ease-out">
            <Sidebar
              isCollapsed={false}
              onToggleCollapse={toggleCollapse}
              isMobileOpen={isMobileOpen}
              onMobileClose={() => setIsMobileOpen(false)}
              isMobileDrawer
            />
          </div>
        </div>
      )}

      {/* Desktop & Tablet Sidebar Container */}
      <div className="sticky top-0 z-20 hidden h-screen shrink-0 md:block">
        <Sidebar isCollapsed={isCollapsed} onToggleCollapse={toggleCollapse} />
      </div>

      {/* Main Content Area */}
      <main className="w-full min-w-0 flex-1 overflow-x-hidden px-4 py-6 sm:px-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
        {children}
      </main>
    </div>
  );
};

export default withAuth(Layout);
