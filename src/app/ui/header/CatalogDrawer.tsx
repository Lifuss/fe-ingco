'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchCategoriesThunk } from '@/lib/appState/main/operations';
import {
  Wrench,
  Zap,
  Leaf,
  Ruler,
  Cog,
  Shield,
  Flame,
  ChevronRight,
  ArrowRight,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CatalogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

interface SubcategoryItem {
  name: string;
  query: string;
}

interface SubcategoryGroup {
  title: string;
  items: SubcategoryItem[];
}

export default function CatalogDrawer({
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: CatalogDrawerProps) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const rawCategories = useAppSelector((state) => state.persistedMainReducer.categories);
  const productsCategories = React.useMemo(() => rawCategories || [], [rawCategories]);
  
  // Set the first category as active by default if loaded
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const [mobileExpandedCatId, setMobileExpandedCatId] = useState<string>('');

  React.useEffect(() => {
    if (productsCategories.length === 0) {
      dispatch(fetchCategoriesThunk(''));
    }
  }, [dispatch, productsCategories.length]);

  React.useEffect(() => {
    if (productsCategories.length > 0 && !activeCategoryId) {
      setActiveCategoryId(productsCategories[0]._id);
    }
  }, [productsCategories, activeCategoryId]);

  if (!isOpen) return null;

  const isShop = pathname.includes('/shop');
  const baseUrl = isShop ? '/shop' : '/';

  // Helper to generate search link URLs
  const getSearchUrl = (categoryId: string, query: string = '') => {
    const params = new URLSearchParams();
    params.set('page', '1');
    if (categoryId) params.set('category', categoryId);
    if (query) params.set('query', query);
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

  // Mocked subcategories mapper based on category name mapping
  const getSubcategoryGroups = (name: string): SubcategoryGroup[] => {
    const lower = name.toLowerCase();

    // 1. ELEKTRO / POWER TOOLS
    if (lower.includes('електро') || lower.includes('акумул')) {
      return [
        {
          title: 'Дрилі та шуруповерти',
          items: [
            { name: 'Мережеві дрилі', query: 'дриль мережев' },
            { name: 'Акумуляторні шуруповерти', query: 'шуруповерт' },
            { name: 'Ударні дрилі', query: 'дриль ударн' },
            { name: 'Гайковерти', query: 'гайковерт' },
          ],
        },
        {
          title: 'Шліфувальні машини',
          items: [
            { name: 'Кутові (Болгарки)', query: 'болгарка' },
            { name: 'Ексцентрикові', query: 'шліфмашина ексцентр' },
            { name: 'Стрічкові', query: 'шліфмашина стрічк' },
            { name: 'Прямі шліфмашини', query: 'шліфмашина прям' },
          ],
        },
        {
          title: 'Перфоратори та відбійники',
          items: [
            { name: 'SDS-Plus перфоратори', query: 'перфоратор sds' },
            { name: 'SDS-Max перфоратори', query: 'перфоратор max' },
            { name: 'Відбійні молотки', query: 'відбійн' },
          ],
        },
        {
          title: 'Пили та рубанки',
          items: [
            { name: 'Дискові пили', query: 'пила дисков' },
            { name: 'Лобзики', query: 'лобзик' },
            { name: 'Шабельні пили', query: 'пила шабельн' },
            { name: 'Електрорубанки', query: 'рубанок' },
          ],
        },
      ];
    }

    // 2. HAND TOOLS
    if (lower.includes('ручн')) {
      return [
        {
          title: 'Викрутки та ключі',
          items: [
            { name: 'Набори викруток', query: 'викрутк' },
            { name: 'Ключі ріжково-накидні', query: 'ключ' },
            { name: 'Ключі розвідні', query: 'ключ розвідн' },
            { name: 'Набори біт', query: 'біти' },
          ],
        },
        {
          title: 'Шарнірно-губцеві',
          items: [
            { name: 'Плоскогубці', query: 'плоскогубці' },
            { name: 'Бокорізи / Кусачки', query: 'кусачки' },
            { name: 'Кліщі переставні', query: 'kліщі' },
          ],
        },
        {
          title: 'Ріжучий інструмент',
          items: [
            { name: 'Ножівки по металу', query: 'ножівка' },
            { name: 'Будівельні ножі', query: 'ніж' },
            { name: 'Ножиці по металу', query: 'ножиці' },
          ],
        },
        {
          title: 'Ударний інструмент',
          items: [
            { name: 'Молотки', query: 'молоток' },
            { name: 'Кувалди', query: 'кувалда' },
            { name: 'Сокири', query: 'сокир' },
          ],
        },
      ];
    }

    // 3. GARDEN TOOLS
    if (lower.includes('сад')) {
      return [
        {
          title: 'Газонокосарки та тримери',
          items: [
            { name: 'Акумуляторні косарки', query: 'косарка' },
            { name: 'Електричні тримери', query: 'тример' },
            { name: 'Ліска для тримера', query: 'ліска' },
          ],
        },
        {
          title: 'Ланцюгові пили',
          items: [
            { name: 'Акумуляторні ланцюгові', query: 'пила ланцюг' },
            { name: 'Бензопили', query: 'бензопила' },
            { name: 'Запасні ланцюги', query: 'ланцюг' },
          ],
        },
        {
          title: 'Полив та обприскування',
          items: [
            { name: 'Обприскувачі', query: 'обприскувач' },
            { name: 'Садові шланги', query: 'шланг' },
            { name: 'Пістолети для поливу', query: 'полив' },
          ],
        },
      ];
    }

    // 4. MEASURE TOOLS
    if (lower.includes('вимір') || lower.includes('прилад') || lower.includes('лазер')) {
      return [
        {
          title: 'Лазерні прилади',
          items: [
            { name: 'Лазерні нівеліри', query: 'лазер' },
            { name: 'Далекоміри (рулетки)', query: 'далекомір' },
            { name: 'Штативи', query: 'штатив' },
          ],
        },
        {
          title: 'Класичні прилади',
          items: [
            { name: 'Рулетки будівельні', query: 'рулетка' },
            { name: 'Будівельні рівні', query: 'рівень' },
            { name: 'Штангенциркулі', query: 'штангенциркуль' },
          ],
        },
      ];
    }

    // 5. ACCESSORIES
    if (lower.includes('оснащ') || lower.includes('аксесу') || lower.includes('розхід')) {
      return [
        {
          title: 'Витратні матеріали',
          items: [
            { name: 'Свердла по металу / бетону', query: 'свердло' },
            { name: 'Бури SDS-Plus', query: 'бури' },
            { name: 'Диски відрізні', query: 'диск' },
            { name: 'Коронки свердлильні', query: 'коронка' },
          ],
        },
        {
          title: 'Акумулятори та зарядні пристрої P20S',
          items: [
            { name: 'Акумулятор P20S 2.0Аг', query: 'fbli2001' },
            { name: 'Акумулятор P20S 4.0Аг', query: 'fbli2002' },
            { name: 'Зарядні пристрої', query: 'zaryad' },
          ],
        },
      ];
    }

    // 6. PROTECTIVE GEAR
    if (lower.includes('захис') || lower.includes('екіп') || lower.includes('одяг')) {
      return [
        {
          title: 'Засоби індивідуального захисту',
          items: [
            { name: 'Робочі рукавички', query: 'рукавички' },
            { name: 'Захисні окуляри', query: 'окуляри' },
            { name: 'Маски зварювальника', query: 'маска' },
            { name: 'Навушники протишумні', query: 'навушники' },
          ],
        },
      ];
    }

    // FALLBACK
    return [
      {
        title: 'Популярні товари категорії',
        items: [
          { name: 'Переглянути весь асортимент', query: '' },
        ],
      },
    ];
  };

  const activeCategory = productsCategories.find((c) => c._id === activeCategoryId);
  const activeSubgroups = activeCategory ? getSubcategoryGroups(activeCategory.name) : [];

  return (
    <>
      {/* MOBILE SIDE DRAWER (visible on < lg) */}
      <div className={cn('lg:hidden fixed inset-0 z-50 flex select-none', isOpen ? 'pointer-events-auto' : 'pointer-events-none')}>
        {/* Backdrop overlay */}
        <div
          className={cn(
            'absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300',
            isOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={onClose}
        />
        
        {/* Slide-in menu container */}
        <div
          className={cn(
            'relative w-[300px] max-w-[85vw] h-full bg-[#FFFDFB] shadow-2xl flex flex-col transition-transform duration-300 ease-out z-50 border-r border-[#E5E3DD]',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#E5E3DD]">
            <span className="font-display font-bold text-base text-neutral-900">Каталог товарів</span>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer">
              <X size={20} />
            </button>
          </div>

          {/* Categories Accordion */}
          <div className="flex-grow overflow-y-auto p-3 flex flex-col gap-2">
            {productsCategories.map((cat) => {
              const isExpanded = cat._id === mobileExpandedCatId;
              const subGroups = getSubcategoryGroups(cat.name);
              return (
                <div key={cat._id} className="border-b border-[#E5E3DD]/40 pb-2">
                  <button
                    onClick={() => setMobileExpandedCatId(isExpanded ? '' : cat._id)}
                    className={cn(
                      'w-full flex items-center justify-between py-2 px-3 rounded-lg text-left font-display font-bold text-sm text-neutral-700 transition-colors cursor-pointer',
                      isExpanded && 'bg-[#FFF2EB] text-primary-500'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(cat.name)}
                      <span>{cat.name}</span>
                    </div>
                    <ChevronRight
                      size={15}
                      className={cn('transition-transform duration-200', isExpanded ? 'rotate-90 text-primary-500' : 'text-neutral-400')}
                    />
                  </button>

                  {isExpanded && (
                    <div className="pl-9 pr-2 pt-2 pb-1 flex flex-col gap-4">
                      <Link
                        href={getSearchUrl(cat._id, '')}
                        onClick={onClose}
                        className="text-xs font-bold text-primary-500 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Переглянути все <ArrowRight size={12} />
                      </Link>

                      {subGroups.map((group, gIdx) => (
                        <div key={gIdx} className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                            {group.title}
                          </span>
                          <ul className="flex flex-col gap-1.5 pl-1">
                            {group.items.map((item, idx) => (
                              <li key={idx}>
                                <Link
                                  href={getSearchUrl(cat._id, item.query)}
                                  onClick={onClose}
                                  className="text-neutral-600 hover:text-primary-500 text-xs font-semibold block py-0.5 cursor-pointer"
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
              href={getSearchUrl('', 'акція')}
              onClick={onClose}
              className="mt-4 flex items-center gap-3 px-4 py-3 rounded-lg bg-orange-50 text-primary-600 font-display font-bold text-sm uppercase tracking-wider border border-orange-100 cursor-pointer"
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
          className="fixed inset-0 top-[100px] z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
          onClick={onClose}
        />

        {/* Main Drawer Container */}
        <div
          className="absolute left-0 right-0 top-[100px] z-50 w-full border-b border-[#E5E3DD] bg-[#FFFDFB] shadow-xl animate-slide-down flex flex-col items-center select-none"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave || onClose}
        >
          <div className="w-full max-w-[1440px] px-6 py-8 grid grid-cols-12 gap-8 items-stretch min-h-[480px]">
            
            {/* 1. Left Sidebar: Categories Navigation */}
            <div className="col-span-3 border-r border-[#E5E3DD]/70 pr-4 flex flex-col justify-between">
              <ul className="flex flex-col gap-1.5">
                {productsCategories.map((cat) => {
                  const isActive = cat._id === activeCategoryId;
                  return (
                    <li key={cat._id}>
                      <button
                        onMouseEnter={() => setActiveCategoryId(cat._id)}
                        onClick={() => {
                          setActiveCategoryId(cat._id);
                          onClose();
                        }}
                        className={cn(
                          'w-full flex items-center justify-between px-4 py-3 rounded-lg text-left font-display font-bold text-sm tracking-wide transition-all duration-200 cursor-pointer',
                          isActive
                            ? 'bg-[#FFF2EB] text-primary-500 shadow-sm border-l-4 border-primary-500'
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
                            isActive ? 'translate-x-0.5 text-primary-500' : 'text-neutral-400',
                          )}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Bottom Special: Hot Deals / Offers */}
              <Link
                href={getSearchUrl('', 'акція')}
                onClick={onClose}
                className="mt-6 flex items-center gap-3 px-4 py-3.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-primary-600 font-display font-bold text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm shadow-orange-500/5 border border-orange-200/50"
              >
                <Flame size={18} className="text-primary-500 animate-pulse" />
                <span>Акції та знижки</span>
              </Link>
            </div>

            {/* 2. Right Panel: Dynamic Subcategories & Banner Grid */}
            <div className="col-span-9 pl-4 flex flex-col justify-between">
              
              {/* Title & Columns Grid */}
              <div className="flex flex-col gap-6">
                <h2 className="font-display font-bold text-2xl text-neutral-900 border-b border-[#E5E3DD]/45 pb-3">
                  {activeCategory?.name}
                </h2>

                <div className="grid grid-cols-3 gap-6">
                  {activeSubgroups.map((group, gIdx) => (
                    <div key={gIdx} className="flex flex-col gap-3">
                      <h3 className="font-display font-bold text-xs uppercase tracking-wider text-neutral-400 select-none">
                        {group.title}
                      </h3>
                      <ul className="flex flex-col gap-2 font-sans text-[13px]">
                        {group.items.map((item, idx) => (
                          <li key={idx}>
                            <Link
                              href={getSearchUrl(activeCategoryId, item.query)}
                              onClick={onClose}
                              className="text-neutral-600 hover:text-primary-500 font-medium transition-colors cursor-pointer"
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Row Area (Promo Banner card at the bottom right) */}
              <div className="flex justify-end mt-6">
                {/* Promo Banner Card */}
                <Link
                  href={getSearchUrl('', 'P20S')}
                  onClick={onClose}
                  className="relative w-full max-w-xl rounded-2xl overflow-hidden bg-gradient-to-r from-neutral-900 to-neutral-950 border border-neutral-800 p-6 flex justify-between items-center shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  {/* Glow effects */}
                  <div className="absolute top-[-30%] left-[-20%] w-[200px] h-[200px] bg-primary-500/10 rounded-full blur-[80px] pointer-events-none select-none" />

                  {/* Banner Content */}
                  <div className="relative z-10 flex flex-col gap-2.5 text-left max-w-sm">
                    <span className="w-fit font-sans text-[9px] font-bold bg-amber-500 text-neutral-950 px-2 py-0.5 rounded uppercase select-none">
                      НОВИНКА
                    </span>
                    <h3 className="font-display font-bold text-lg text-white leading-snug">
                      Акумуляторна лінійка P20S
                    </h3>
                    <p className="font-sans text-neutral-400 text-xs leading-normal">
                      Один акумулятор для понад 150 інструментів. Професійна потужність без дротів.
                    </p>
                    <span className="mt-2 text-amber-500 font-display font-bold text-xs flex items-center gap-1 group-hover:text-amber-400 transition-colors">
                      Дізнатися більше <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>

                  {/* Banner Image */}
                  <div className="relative w-[180px] h-[110px] shrink-0 select-none overflow-hidden rounded-lg pointer-events-none">
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
