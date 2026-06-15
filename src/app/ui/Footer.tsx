import Link from 'next/link';
import Icon from './assets/Icon';
import { SOCIAL_LINKS, CONTACTS } from '@/lib/constants';
import Logo from './Logo';

interface FooterProps {
  isShop?: boolean;
}

const Footer = ({ isShop: _isShop = false }: FooterProps) => {
  const baseUrl = '/';

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
    <footer className="flex w-full flex-col gap-10 border-t border-[#E5E3DD] bg-[#FFFDFB] px-6 py-12 select-none md:px-[60px]">
      {/* Footer Top Grid */}
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-start gap-8 md:grid-cols-12">
        {/* Column 1: Logo & Badge */}
        <div className="col-span-12 flex flex-col gap-4 lg:col-span-3">
          <Logo />
        </div>

        {/* Column 2: Clients links */}
        <div className="col-span-6 flex flex-col gap-4 text-left md:col-span-2 lg:col-span-2">
          <h3 className="font-display text-primary-600 text-sm font-bold tracking-wider">
            Клієнтам
          </h3>
          <ul className="flex flex-col gap-2.5 font-sans text-xs font-semibold text-neutral-500">
            <li>
              <Link
                href={`${baseUrl}?catalog=true`}
                className="hover:text-primary-500 cursor-pointer transition-colors"
              >
                Каталог
              </Link>
            </li>
            <li>
              <Link
                href={`${baseUrl}?query=акція`}
                className="hover:text-primary-500 cursor-pointer transition-colors"
              >
                Акції
              </Link>
            </li>
            <li>
              <Link
                href="/about-us/support"
                className="hover:text-primary-500 cursor-pointer transition-colors"
              >
                Підтримка
              </Link>
            </li>
            <li>
              <Link
                href="/about-us/partnership"
                className="hover:text-primary-500 cursor-pointer transition-colors"
              >
                Оптовий каталог
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Social Medias */}
        <div className="col-span-12 flex flex-col gap-4 text-left md:col-span-4 lg:col-span-3">
          <h3 className="font-display text-primary-600 text-sm font-bold tracking-wider">
            Соціальні мережі
          </h3>
          <div className="mt-1 flex items-center gap-3">
            {socialArray.map((social) => (
              <Link
                href={social.url}
                key={social.name}
                rel="nofollow noopener noreferrer"
                target="_blank"
                aria-label={social.label}
                className="hover:bg-primary-500 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-neutral-800 text-white shadow-sm transition-all hover:scale-105 active:scale-95"
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
        <div className="col-span-6 flex flex-col gap-4 text-left md:col-span-3 lg:col-span-2">
          <h3 className="font-display text-primary-600 text-sm font-bold tracking-wider">
            Інформація
          </h3>
          <ul className="flex flex-col gap-2.5 font-sans text-xs font-semibold text-neutral-500">
            <li>
              <Link
                href="/about-us"
                className="hover:text-primary-500 cursor-pointer transition-colors"
              >
                Про нас
              </Link>
            </li>
            <li>
              <Link
                href="/legal/terms"
                className="hover:text-primary-500 cursor-pointer transition-colors"
              >
                Умови та правила
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 5: Contacts */}
        <div className="col-span-12 flex flex-col gap-4 text-left md:col-span-3 lg:col-span-2">
          <h3 className="font-display text-primary-600 text-sm font-bold tracking-wider">
            Контакти
          </h3>
          <ul className="flex flex-col gap-2 font-sans text-xs font-semibold text-neutral-500">
            <li>
              <Link
                href="/about-us/contacts"
                className="hover:text-primary-500 cursor-pointer font-bold text-neutral-900 transition-colors"
              >
                Фізичні магазини
              </Link>
            </li>
            <li className="mt-1 flex flex-col gap-1 font-bold text-blue-500 select-text">
              {CONTACTS.PHONES.map((phone) => (
                <a
                  href={phone.href}
                  key={phone.href}
                  className="underline transition-colors hover:text-blue-600"
                >
                  {phone.label}
                </a>
              ))}
            </li>
            <li className="mt-1 flex flex-col gap-0.5 text-[10px] font-medium text-neutral-400">
              {CONTACTS.WORKING_HOURS.map((hours) => (
                <span key={hours}>{hours}</span>
              ))}
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom copyright area */}
      <div className="mx-auto w-full max-w-[1440px] border-t border-[#E5E3DD]/45 pt-6 text-center">
        <p className="font-sans text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
          © 2026 INGCO. Всі права захищені.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
