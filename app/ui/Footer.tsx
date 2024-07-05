import Image from 'next/image';
import Link from 'next/link';
import Icon from './assets/Icon';

const Footer = () => {
  const socialArray = [
    {
      name: 'telegram',
      url: 'https://t.me/+IePpWvT99J02NTJi',
    },
    {
      name: 'tiktok',
      url: 'https://www.tiktok.com/@free107w?_t=8nY92g7z3Rd&_r=1',
    },
    {
      name: 'facebook',
      url: 'https://www.facebook.com/people/INGCO/61556075234289/',
    },
    {
      name: 'viber',
      url: 'https://invite.viber.com/?g=KiAyrPV8FlMrhU2pjsAWT-r7V3jGwmv6',
    },
  ];
  return (
    <footer className="relative flex flex-col items-center bg-orangeLight pb-14 pt-[18px] text-lg lg:flex-row lg:px-[60px] 2xl:text-xl">
      <Image
        src={'/logo.png'}
        width={200}
        height={50}
        alt="Лого компанії INGCO"
        className="mb-4 lg:mb-0"
      />
      <ul className="mx-auto grid grid-cols-2 gap-y-2 md:gap-x-48 lg:flex lg:gap-20 xl:gap-32 xl:pr-[115px] ">
        <li className="flex flex-col lg:order-none">
          <p className="font-medium">Клієнтам</p>
          <Link
            className="transition-colors hover:text-white"
            href="/home/#about"
          >
            Про нас
          </Link>
          <Link className="transition-colors hover:text-white" href="#">
            Підтримка
          </Link>
        </li>
        <li className="order-last col-span-2 justify-self-center lg:order-none lg:col-span-1">
          <p className="mb-1 font-medium ">Соціальні мережі</p>
          <div className="flex justify-center gap-2">
            {socialArray.map((social) => (
              <Link
                href={social.url}
                key={social.name}
                target="_blank noopener noreferrer"
              >
                <Icon
                  icon={social.name}
                  className="stroke h-8 w-8 transform border-white transition-all duration-300 hover:scale-[1.5] hover:stroke-slate-300"
                />
              </Link>
            ))}
          </div>
        </li>
        <li className="lg:order-none">
          <p className="font-medium">Контакти</p>
          <div className="flex flex-col">
            <a
              className="text-blue-600 hover:text-white"
              href="tel:+380988392107"
            >
              +380 98-83-92-107
            </a>
            <a
              className="text-blue-600 hover:text-white"
              href="tel:+380964123628"
            >
              +380 96-41-23-628
            </a>
            <a
              href="mailto:ingco-service@ukr.net"
              className="text-blue-600 hover:text-white"
            >
              ingco-service@ukr.net
            </a>
          </div>
        </li>
      </ul>
      <p className="absolute bottom-2 left-1/2 -translate-x-1/2 transform text-sm">
        © 2024 INGCO. Всі права захищені.
      </p>
    </footer>
  );
};

export default Footer;
