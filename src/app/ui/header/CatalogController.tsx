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
        'flex cursor-pointer items-center gap-1.5 rounded-lg border border-transparent px-2 py-1.5 text-sm font-semibold tracking-normal shadow-sm transition-colors select-none focus:outline-none min-[426px]:bg-neutral-900 min-[426px]:px-3 min-[426px]:py-2 min-[426px]:text-white min-[426px]:hover:bg-neutral-800 lg:hidden',
        isOpen
          ? 'border-transparent bg-neutral-950 text-white shadow-inner'
          : 'border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-100',
      )}
      aria-label="Toggle Catalog"
    >
      <LayoutGrid size={26} className="text-primary-500 shrink-0 stroke-[2.5]" />
      <span className="hidden min-[426px]:inline">Каталог</span>
    </button>
  );
}

export function CatalogDesktopButton() {
  const { isOpen, toggle, openWithDelay, closeWithDelay, closeInstant } = useCatalog();
  return (
    <div
      className="hidden shrink-0 items-stretch overflow-hidden rounded-lg shadow-sm shadow-neutral-900/10 select-none lg:inline-flex"
      onMouseEnter={openWithDelay}
      onMouseLeave={closeWithDelay}
    >
      {/* Left Part: Direct link to Catalog grid */}
      <Link
        href="/?catalog=true"
        onClick={closeInstant}
        className={cn(
          'flex cursor-pointer items-center gap-2 rounded-l-lg border border-r-0 border-transparent px-4 py-2.5 text-sm font-semibold tracking-normal text-white transition-all',
          isOpen
            ? 'bg-neutral-950 shadow-inner'
            : 'bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-950',
        )}
      >
        <LayoutGrid size={16} className="text-primary-500 stroke-[2.5]" />
        <span>Каталог</span>
      </Link>

      {/* Right Part: Dropdown toggle chevron */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
        className={cn(
          'flex cursor-pointer items-center justify-center rounded-r-lg border border-l-0 border-transparent px-2.5 py-2.5 text-white transition-all',
          isOpen
            ? 'border-l border-neutral-800 bg-neutral-950 shadow-inner'
            : 'border-l border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white active:bg-neutral-950',
        )}
        aria-label="Toggle Catalog Menu"
      >
        <ChevronDown
          size={16}
          className={cn(
            'stroke-[2.5] text-neutral-300 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
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
