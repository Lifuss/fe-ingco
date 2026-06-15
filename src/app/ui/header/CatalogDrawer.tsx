'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchCategoriesThunk } from '@/lib/appState/main/operations';
import {
  Wrench,
  Zap,
  Leaf,
  Ruler,
  Cog,
  Shield,
  ChevronRight,
  ArrowRight,
  X,
  Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Category } from '@/lib/types';
import { CATEGORY_IDS } from '@/lib/constants';

interface CatalogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

interface CategoryNode extends Category {
  children: CategoryNode[];
}

export default function CatalogDrawer({
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: CatalogDrawerProps) {
  const dispatch = useAppDispatch();
  const rawCategories = useAppSelector((state) => state.persistedMainReducer.categories);

  // Build tree from flat category array
  const categoryTree = React.useMemo(() => {
    const categories = rawCategories || [];
    const menuCategories = categories.filter((c) => c.showInMenu !== false);
    const map = new Map<number, CategoryNode>();
    menuCategories.forEach((c) => {
      map.set(c.id, { ...c, children: [] });
    });

    const roots: CategoryNode[] = [];
    menuCategories.forEach((c) => {
      const node = map.get(c.id)!;
      if (c.parentId) {
        const parent = map.get(c.parentId);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    // Sort roots and child branches by renderSort
    const sortNodes = (nodes: CategoryNode[]) => {
      nodes.sort((a, b) => a.renderSort - b.renderSort);
      nodes.forEach((n) => sortNodes(n.children));
    };
    sortNodes(roots);

    return { roots, map };
  }, [rawCategories]);

  const rootCategories = categoryTree.roots;

  const [activeCategoryId, setActiveCategoryId] = useState<number | ''>('');
  const [mobileExpandedCatId, setMobileExpandedCatId] = useState<number | ''>('');

  React.useEffect(() => {
    if (rawCategories.length === 0) {
      dispatch(fetchCategoriesThunk(''));
    }
  }, [dispatch, rawCategories.length]);

  React.useEffect(() => {
    if (rootCategories.length > 0 && !activeCategoryId) {
      setActiveCategoryId(rootCategories[0].id);
    }
  }, [rootCategories, activeCategoryId]);

  if (!isOpen) return null;

  const baseUrl = '/';

  // Helper to generate search link URLs
  const getSearchUrl = (categoryId: string) => {
    const params = new URLSearchParams();
    params.set('page', '1');
    if (categoryId) params.set('category', categoryId);
    return `${baseUrl}?${params.toString()}`;
  };

  // Maps category names to premium icons
  const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('електро') || lower.includes('акумул')) {
      return <Zap size={18} className="shrink-0 text-amber-500" />;
    }
    if (lower.includes('ручн')) {
      return <Wrench size={18} className="shrink-0 text-neutral-600" />;
    }
    if (lower.includes('сад')) {
      return <Leaf size={18} className="shrink-0 text-green-600" />;
    }
    if (lower.includes('вимір') || lower.includes('прилад') || lower.includes('лазер')) {
      return <Ruler size={18} className="shrink-0 text-blue-500" />;
    }
    if (lower.includes('оснащ') || lower.includes('аксесу') || lower.includes('розхід')) {
      return <Cog size={18} className="shrink-0 text-neutral-500" />;
    }
    if (lower.includes('захис') || lower.includes('екіп') || lower.includes('одяг')) {
      return <Shield size={18} className="shrink-0 text-teal-600" />;
    }
    return <Wrench size={18} className="shrink-0 text-neutral-600" />;
  };

  const activeCategory = categoryTree.map.get(Number(activeCategoryId));
  const activeSubgroups = activeCategory ? activeCategory.children : [];

  return (
    <>
      {/* MOBILE SIDE DRAWER (visible on < lg) */}
      <div
        className={cn(
          'fixed inset-0 z-50 flex select-none lg:hidden',
          isOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
      >
        {/* Backdrop overlay */}
        <div
          className={cn(
            'absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300',
            isOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={onClose}
        />

        {/* Slide-in menu container */}
        <div
          className={cn(
            'relative z-50 flex h-full w-[300px] max-w-[85vw] flex-col border-r border-[#E5E3DD] bg-[#FFFDFB] shadow-2xl transition-transform duration-300 ease-out',
            isOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-[#E5E3DD] p-4">
            <span className="font-display text-base font-bold text-neutral-900">
              Каталог товарів
            </span>
            <button
              onClick={onClose}
              className="cursor-pointer rounded-full p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
            >
              <X size={20} />
            </button>
          </div>

          {/* Categories Accordion */}
          <div className="flex flex-grow flex-col gap-2 overflow-y-auto p-3">
            {rootCategories.map((cat) => {
              const isExpanded = cat.id === mobileExpandedCatId;
              const subGroups = categoryTree.map.get(cat.id)?.children || [];
              return (
                <div key={cat.id} className="border-b border-[#E5E3DD]/40 pb-2">
                  <button
                    onClick={() => setMobileExpandedCatId(isExpanded ? '' : cat.id)}
                    className={cn(
                      'font-display flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-bold text-neutral-700 transition-colors',
                      isExpanded && 'text-primary-500 bg-[#FFF2EB]',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(cat.name)}
                      <span>{cat.name}</span>
                    </div>
                    <ChevronRight
                      size={15}
                      className={cn(
                        'transition-transform duration-200',
                        isExpanded ? 'text-primary-500 rotate-90' : 'text-neutral-400',
                      )}
                    />
                  </button>

                  {isExpanded && (
                    <div className="flex flex-col gap-4 pt-2 pr-2 pb-1 pl-9">
                      <Link
                        href={getSearchUrl(String(cat.id))}
                        onClick={onClose}
                        className="text-primary-500 flex cursor-pointer items-center gap-1 text-xs font-bold hover:underline"
                      >
                        Переглянути все <ArrowRight size={12} />
                      </Link>

                      {subGroups.map((group) => (
                        <div key={group.id} className="flex flex-col gap-1.5">
                          <Link
                            href={getSearchUrl(String(group.id))}
                            onClick={onClose}
                            className="hover:text-primary-500 text-[10px] font-extrabold tracking-wider text-neutral-800 uppercase"
                          >
                            {group.name}
                          </Link>
                          <ul className="flex flex-col gap-1.5 pl-1">
                            {group.children.map((item) => (
                              <li key={item.id}>
                                <Link
                                  href={getSearchUrl(String(item.id))}
                                  onClick={onClose}
                                  className="hover:text-primary-500 block cursor-pointer py-0.5 text-xs font-semibold text-neutral-600"
                                >
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Special Promo Item */}
            <Link
              href={getSearchUrl(CATEGORY_IDS.PROMO)}
              onClick={onClose}
              className="text-primary-600 font-display mt-4 flex cursor-pointer items-center gap-3 rounded-lg border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-bold tracking-wider uppercase"
            >
              <Flame size={18} className="text-primary-500 animate-pulse" />
              <span>Акції та знижки</span>
            </Link>
          </div>
        </div>
      </div>

      {/* DESKTOP DROPDOWN MEGA-MENU (visible on lg) */}
      <div className="hidden lg:block">
        {/* Background click-outside overlay back-drop */}
        <div
          className="animate-fade-in fixed inset-0 top-[100px] z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />

        {/* Main Drawer Container */}
        <div
          className="animate-slide-down absolute top-[100px] right-0 left-0 z-50 flex w-full flex-col items-center border-b border-[#E5E3DD] bg-[#FFFDFB] shadow-xl select-none"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave || onClose}
        >
          <div className="grid min-h-[480px] w-full max-w-[1440px] grid-cols-12 items-stretch gap-8 px-6 py-8">
            {/* 1. Left Sidebar: Categories Navigation */}
            <div className="col-span-3 flex flex-col justify-between border-r border-[#E5E3DD]/70 pr-4">
              <ul className="flex flex-col gap-1.5">
                {rootCategories.map((cat) => {
                  const isActive = cat.id === activeCategoryId;
                  return (
                    <li key={cat.id}>
                      <Link
                        href={getSearchUrl(String(cat.id))}
                        onMouseEnter={() => setActiveCategoryId(cat.id)}
                        onClick={onClose}
                        className={cn(
                          'font-display flex w-full cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-bold tracking-wide transition-all duration-200',
                          isActive
                            ? 'text-primary-500 border-primary-500 border-l-4 bg-[#FFF2EB] shadow-sm'
                            : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900',
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {getCategoryIcon(cat.name)}
                          <span>{cat.name}</span>
                        </div>
                        <ChevronRight
                          size={14}
                          className={cn(
                            'transition-transform duration-200',
                            isActive ? 'text-primary-500 translate-x-0.5' : 'text-neutral-400',
                          )}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Bottom Special: Hot Deals / Offers */}
              <Link
                href={getSearchUrl(CATEGORY_IDS.PROMO)}
                onClick={onClose}
                className="text-primary-600 font-display mt-6 flex cursor-pointer items-center gap-3 rounded-lg border border-orange-200/50 bg-orange-50 px-4 py-3.5 text-sm font-bold tracking-wider uppercase shadow-sm shadow-orange-500/5 transition-all duration-200 hover:bg-orange-100"
              >
                <Flame size={18} className="text-primary-500 animate-pulse" />
                <span>Акції та знижки</span>
              </Link>
            </div>

            {/* 2. Right Panel: Dynamic Subcategories & Banner Grid */}
            <div className="col-span-9 flex flex-col justify-between pl-4">
              {/* Title & Columns Grid */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-[#E5E3DD]/45 pb-3">
                  <h2 className="font-display text-2xl font-bold text-neutral-900">
                    {activeCategory?.name}
                  </h2>
                  {activeCategory && (
                    <Link
                      href={getSearchUrl(String(activeCategory.id))}
                      onClick={onClose}
                      className="text-primary-500 flex cursor-pointer items-center gap-1 text-xs font-bold hover:underline"
                    >
                      Переглянути всі товари категорії <ArrowRight size={12} />
                    </Link>
                  )}
                </div>

                <div className="grid max-h-[350px] grid-cols-3 gap-6 overflow-y-auto pr-2">
                  {activeSubgroups.map((group) => (
                    <div key={group.id} className="flex flex-col gap-3">
                      <Link
                        href={getSearchUrl(String(group.id))}
                        onClick={onClose}
                        className="font-display hover:text-primary-500 text-xs font-bold tracking-wider text-neutral-800 uppercase transition-colors select-none"
                      >
                        {group.name}
                      </Link>
                      <ul className="flex flex-col gap-2 font-sans text-[13px]">
                        {group.children.map((item) => (
                          <li key={item.id}>
                            <Link
                              href={getSearchUrl(String(item.id))}
                              onClick={onClose}
                              className="hover:text-primary-500 cursor-pointer font-medium text-neutral-600 transition-colors"
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {activeSubgroups.length === 0 && (
                    <span className="text-sm text-neutral-400">Підкатегорії відсутні</span>
                  )}
                </div>
              </div>

              {/* Bottom Row Area (Promo Banner card at the bottom right) */}
              <div className="mt-6 flex justify-end">
                {/* Promo Banner Card */}
                <Link
                  href="/?query=P20S"
                  onClick={onClose}
                  className="group relative flex w-full max-w-xl cursor-pointer items-center justify-between overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-r from-neutral-900 to-neutral-950 p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  {/* Glow effects */}
                  <div className="bg-primary-500/10 pointer-events-none absolute top-[-30%] left-[-20%] h-[200px] w-[200px] rounded-full blur-[80px] select-none" />

                  {/* Banner Content */}
                  <div className="relative z-10 flex max-w-sm flex-col gap-2.5 text-left">
                    <span className="w-fit rounded bg-amber-500 px-2 py-0.5 font-sans text-[9px] font-bold text-neutral-950 uppercase select-none">
                      НОВИНКА
                    </span>
                    <h3 className="font-display text-lg leading-snug font-bold text-white">
                      Акумуляторна лінійка P20S
                    </h3>
                    <p className="font-sans text-xs leading-normal text-neutral-400">
                      Один акумулятор для понад 150 інструментів. Професійна потужність без дротів.
                    </p>
                    <span className="font-display mt-2 flex items-center gap-1 text-xs font-bold text-amber-500 transition-colors group-hover:text-amber-400">
                      Дізнатися більше{' '}
                      <ArrowRight
                        size={12}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>

                  {/* Banner Image */}
                  <div className="pointer-events-none relative h-[110px] w-[180px] shrink-0 overflow-hidden rounded-lg select-none">
                    <Image
                      src="/hero/tools_bg.png"
                      alt="Лінійка P20S"
                      fill
                      sizes="180px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
