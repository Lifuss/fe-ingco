'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from './assets/Icon';
import { SOCIAL_LINKS, CONTACTS } from '@/lib/constants';

const Footer = () => {
  const pathname = usePathname();

  const isShop = pathname.includes('/shop');
  const baseUrl = isShop ? '/shop' : '/';

  const socialArray: { name: string; url: string; label: string }[] = [
    {
      name: 'facebook',
      url: SOCIAL_LINKS.FACEBOOK,
      label: 'Перехід до сторінки ingco в facebook',
    },
    {
      name: 'viber',
      url: SOCIAL_LINKS.VIBER,
      label: 'Перехід до контакту ingco у viber',
    },
    {
      name: 'telegram',
      url: SOCIAL_LINKS.TELEGRAM,
      label: 'Перехід на telegram групу ingco',
    },
    {
      name: 'tiktok',
      url: SOCIAL_LINKS.TIKTOK,
      label: 'Перехід до сторінки ingco в tiktok',
    },
  ];

  return (
    <footer className="w-full bg-[#FFFDFB] border-t border-[#E5E3DD] py-12 px-6 md:px-[60px] flex flex-col gap-10 select-none">
      
      {/* Footer Top Grid */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Column 1: Logo & Badge */}
        <div className="col-span-1 md:col-span-3 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Link href={baseUrl} className="shrink-0">
              <Image
                src="/logo.png"
                width={150}
                height={38}
                alt="Лого компанії INGCO"
                className="h-9 w-auto object-contain"
              />
            </Link>
            {/* Ukraine Pill Badge */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-[10px] font-bold text-neutral-900 border border-amber-500/10 shadow-sm shrink-0">
              <span>Україна</span>
              <span className="text-[11px]">🇺🇦</span>
            </div>
          </div>
        </div>

        {/* Column 2: Clients links */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-4 text-left">
          <h3 className="font-display font-bold text-sm text-neutral-900 uppercase tracking-wider">
            Клієнтам
          </h3>
          <ul className="flex flex-col gap-2.5 font-sans text-xs font-semibold text-neutral-500">
            <li>
              <Link href={`${baseUrl}?catalog=true`} className="hover:text-primary-500 transition-colors cursor-pointer">
                Каталог
              </Link>
            </li>
            <li>
              <Link href={`${baseUrl}?query=акція`} className="hover:text-primary-500 transition-colors cursor-pointer">
                Акції
              </Link>
            </li>
            <li>
              <Link href="/about-us/support" className="hover:text-primary-500 transition-colors cursor-pointer">
                Підтримка
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-primary-500 transition-colors cursor-pointer">
                Оптовий каталог
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Social Medias */}
        <div className="col-span-1 md:col-span-3 flex flex-col gap-4 text-left">
          <h3 className="font-display font-bold text-sm text-neutral-900 uppercase tracking-wider">
            Соціальні мережі
          </h3>
          <div className="flex items-center gap-3 mt-1">
            {socialArray.map((social) => (
              <Link
                href={social.url}
                key={social.name}
                rel="nofollow"
                target="_blank"
                aria-label={social.label}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-800 text-white hover:bg-primary-500 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                <Icon
                  icon={social.name}
                  className="h-5 w-5 fill-current text-white transition-transform"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Column 4: Information */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-4 text-left">
          <h3 className="font-display font-bold text-sm text-neutral-900 uppercase tracking-wider">
            Інформація
          </h3>
          <ul className="flex flex-col gap-2.5 font-sans text-xs font-semibold text-neutral-500">
            <li>
              <Link href="/about-us" className="hover:text-primary-500 transition-colors cursor-pointer">
                Про нас
              </Link>
            </li>
            <li>
              <Link href="/legal/terms" className="hover:text-primary-500 transition-colors cursor-pointer">
                Умови та правила
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 5: Contacts */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-4 text-left">
          <h3 className="font-display font-bold text-sm text-neutral-900 uppercase tracking-wider">
            Контакти
          </h3>
          <ul className="flex flex-col gap-2 font-sans text-xs font-semibold text-neutral-500">
            <li>
              <Link href="/about-us/contacts" className="text-neutral-900 hover:text-primary-500 transition-colors font-bold cursor-pointer">
                Фізичні магазини
              </Link>
            </li>
            <li className="mt-1 flex flex-col gap-1 text-primary-600 font-bold select-text">
              {CONTACTS.PHONES.map((phone) => (
                <a href={phone.href} key={phone.href} className="hover:text-primary-700 transition-colors">
                  {phone.label}
                </a>
              ))}
            </li>
            <li className="mt-1 flex flex-col gap-0.5 text-[10px] text-neutral-400 font-medium">
              {CONTACTS.WORKING_HOURS.map((hours) => (
                <span key={hours}>{hours}</span>
              ))}
            </li>
          </ul>
        </div>

      </div>

      {/* Footer Bottom copyright area */}
      <div className="w-full max-w-7xl mx-auto border-t border-[#E5E3DD]/45 pt-6 text-center">
        <p className="font-sans text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
          © 2026 INGCO. Всі права захищені.
        </p>
      </div>

    </footer>
  );
};

export default Footer;
