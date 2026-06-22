import React from 'react';
import {
  Zap,
  RotateCw,
  Sparkles,
  Scale,
  Cpu,
  Battery,
  Ruler,
  Layers,
} from 'lucide-react';
import { Product } from './types';

/**
 * Dynamic specification icon resolver.
 * Determines the appropriate Lucide icon component based on the characteristic name or code.
 * 
 * @param name - The name of the specification (e.g., "Напруга", "Вага")
 * @param code - The specification code
 * @returns React node containing the Lucide icon with predefined styling classes
 */
export const getSpecIcon = (name: string, code: string): React.ReactNode => {
  const checkStr = `${name} ${code}`.toLowerCase();
  if (
    checkStr.includes('напруг') ||
    checkStr.includes('вольт') ||
    checkStr.includes('volt') ||
    checkStr.includes('v')
  ) {
    return <Zap className="text-primary-500 stroke-[2.5]" size={20} />;
  }
  if (
    checkStr.includes('оберт') ||
    checkStr.includes('обор') ||
    checkStr.includes('швидк') ||
    checkStr.includes('rpm') ||
    checkStr.includes('ход')
  ) {
    return <RotateCw className="text-primary-500 stroke-[2.5]" size={20} />;
  }
  if (
    checkStr.includes('удар') ||
    checkStr.includes('джоул') ||
    checkStr.includes('сила') ||
    checkStr.includes('енерг')
  ) {
    return <Sparkles className="text-primary-500 stroke-[2.5]" size={20} />;
  }
  if (
    checkStr.includes('ваг') ||
    checkStr.includes('важ') ||
    checkStr.includes('маса') ||
    checkStr.includes('кг') ||
    checkStr.includes('kg')
  ) {
    return <Scale className="text-primary-500 stroke-[2.5]" size={20} />;
  }
  if (
    checkStr.includes('потужн') ||
    checkStr.includes('ват') ||
    checkStr.includes('wt') ||
    checkStr.includes('w')
  ) {
    return <Cpu className="text-primary-500 stroke-[2.5]" size={20} />;
  }
  if (
    checkStr.includes('ємніст') ||
    checkStr.includes('акумул') ||
    checkStr.includes('ah') ||
    checkStr.includes('аг')
  ) {
    return <Battery className="text-primary-500 stroke-[2.5]" size={20} />;
  }
  if (
    checkStr.includes('довжин') ||
    checkStr.includes('ширин') ||
    checkStr.includes('діаметр') ||
    checkStr.includes('розмір') ||
    checkStr.includes('мм') ||
    checkStr.includes('mm')
  ) {
    return <Ruler className="text-primary-500 stroke-[2.5]" size={20} />;
  }
  return <Layers className="text-primary-500 stroke-[2.5]" size={20} />;
};

/**
 * Checks whether to display a warning message about the lack of battery/charger.
 * Returns true if the product is a cordless tool (P20S) and is supplied as a carcass (solo)
 * without a battery or charger.
 * 
 * @param prod - The product object
 * @returns Boolean flag indicating if the battery warning should be shown
 */
export const shouldShowBatteryWarning = (prod: Product): boolean => {
  const nameLower = prod.name?.toLowerCase() || '';
  const articleLower = prod.article?.toLowerCase() || '';

  const hasBatteryCategory = prod.categories?.some(
    (c) => c.name?.toLowerCase().includes('акумулятор') || c.id === 1 || c.id === 4,
  );

  const isBatteryOrChargerCategory = prod.categories?.some(
    (c) =>
      c.name?.toLowerCase().includes('акумулятори та зарядні пристрої') ||
      c.name?.toLowerCase().includes('зарядні пристрої'),
  );

  const isCordlessTool =
    (hasBatteryCategory || nameLower.includes('акумуляторн')) &&
    !isBatteryOrChargerCategory &&
    !nameLower.includes('акумулятор fbli') &&
    !nameLower.includes('акумулятор li-ion') &&
    !nameLower.includes('зарядний пристрій') &&
    !nameLower.includes('зарядна станція');

  if (!isCordlessTool) return false;

  const hasSoloKeywords =
    nameLower.includes('без акб') ||
    nameLower.includes('без акумулятор') ||
    nameLower.includes('без батаре') ||
    nameLower.includes('solo') ||
    nameLower.includes('каркас') ||
    articleLower.includes('solo') ||
    articleLower.endsWith('-s');

  const hasPackagingInfoNoBattery = prod.characteristics?.some(
    (char) =>
      char.name?.toLowerCase().includes('комплектація') &&
      (char.value?.toLowerCase().includes('без акб') ||
        char.value?.toLowerCase().includes('без акумулятор') ||
        char.value?.toLowerCase().includes('без зп') ||
        char.value?.toLowerCase().includes('каркас') ||
        char.value?.toLowerCase().includes('не входить')),
  );

  return !!(hasSoloKeywords || hasPackagingInfoNoBattery);
};

/**
 * Product description parser. Splits the text into paragraphs, wraps each in a <p> tag,
 * and highlights the "INGCO" brand name and the product article code in bold.
 * 
 * @param text - The raw product description text
 * @param article - Optional product article code to highlight in the text
 * @returns An array of paragraph React nodes or an empty string
 */
export const parseDescription = (text: string, article?: string): React.ReactNode[] | string => {
  if (!text) return '';
  const parsed = text.split('\n').map((paragraph, i) => {
    // Bold "INGCO" and article codes
    let html = paragraph;
    html = html.replace(/(ingco)/gi, '<strong>INGCO</strong>');
    if (article) {
      const regex = new RegExp(`(${article})`, 'gi');
      html = html.replace(regex, '<strong>$1</strong>');
    }
    return (
      <p
        key={i}
        className="mb-4 font-sans text-base leading-relaxed text-neutral-700"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  });
  return parsed;
};
