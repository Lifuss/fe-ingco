'use client';

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import Link from 'next/link';

import { LayoutGrid, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import CatalogDrawer from './CatalogDrawer';

interface CatalogContextProps {
  isOpen: boolean;
  toggle: () => void;
  openWithDelay: () => void;
  closeWithDelay: () => void;
  cancelClose: () => void;
  closeInstant: () => void;
}

const CatalogContext = createContext<CatalogContextProps | null>(null);

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const enterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  const openWithDelay = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    if (!isOpen && !enterTimeoutRef.current) {
      enterTimeoutRef.current = setTimeout(() => {
        setIsOpen(true);
        enterTimeoutRef.current = null;
      }, 150);
    }
  };

  const closeWithDelay = () => {
    if (enterTimeoutRef.current) {
      clearTimeout(enterTimeoutRef.current);
      enterTimeoutRef.current = null;
    }
    if (!leaveTimeoutRef.current) {
      leaveTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
        leaveTimeoutRef.current = null;
      }, 150);
    }
  };

  const cancelClose = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  };

  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  const closeInstant = () => {
    if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    setIsOpen(false);
  };

  return (
    <CatalogContext.Provider
      value={{
        isOpen,
        toggle,
        openWithDelay,
        closeWithDelay,
        cancelClose,
        closeInstant,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function CatalogMobileButton() {
  const { isOpen, toggle } = useCatalog();
  return (
    <button
      onClick={toggle}
      className={cn(
        'lg:hidden flex items-center gap-1.5 px-2 py-1.5 min-[426px]:px-3 min-[426px]:py-2 rounded-lg min-[426px]:text-white min-[426px]:bg-primary-500 focus:outline-none transition-colors border cursor-pointer select-none font-display font-bold text-sm tracking-wide shadow-sm',
        isOpen
          ? 'bg-primary-600 text-white border-transparent shadow-inner'
          : 'bg-white text-primary-600 border-primary-100 hover:bg-primary-50',
      )}
      aria-label="Toggle Catalog"
    >
      <LayoutGrid size={26} className="stroke-[2.5] shrink-0" />
      <span className="hidden min-[426px]:inline">Каталог</span>
    </button>
  );
}

export function CatalogDesktopButton() {
  const { isOpen, toggle, openWithDelay, closeWithDelay, closeInstant } = useCatalog();
  return (
    <div
      className="hidden lg:inline-flex items-stretch rounded-lg shadow-sm shadow-orange-500/5 shrink-0 select-none overflow-hidden"
      onMouseEnter={openWithDelay}
      onMouseLeave={closeWithDelay}
    >
      {/* Left Part: Direct link to Catalog grid */}
      <Link
        href="/?catalog=true"
        onClick={closeInstant}
        className={cn(
          'flex items-center gap-2 px-4 py-2.5 font-display font-bold text-sm tracking-wide transition-all cursor-pointer border border-transparent border-r-0 rounded-l-lg',
          isOpen
            ? 'bg-primary-600 text-white shadow-inner'
            : 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
        )}
      >
        <LayoutGrid size={16} className="stroke-[2.5]" />
        <span>Каталог</span>
      </Link>

      {/* Right Part: Dropdown toggle chevron */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
        className={cn(
          'flex items-center justify-center px-2.5 py-2.5 transition-all cursor-pointer border border-transparent border-l-0 rounded-r-lg',
          isOpen
            ? 'bg-primary-600 text-white shadow-inner border-l border-primary-700/30'
            : 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 border-l border-white/20',
        )}
        aria-label="Toggle Catalog Menu"
      >
        <ChevronDown
          size={16}
          className={cn('transition-transform duration-200 stroke-[2.5]', isOpen && 'rotate-180')}
        />
      </button>
    </div>
  );
}

export function CatalogDrawerWrapper() {
  const { isOpen, closeInstant, cancelClose, closeWithDelay } = useCatalog();
  return (
    <CatalogDrawer
      isOpen={isOpen}
      onClose={closeInstant}
      onMouseEnter={cancelClose}
      onMouseLeave={closeWithDelay}
    />
  );
}
