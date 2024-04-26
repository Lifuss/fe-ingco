import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="flex flex-col items-center">
      <Image
        src={'/logo.png'}
        width={200}
        height={50}
        alt="Ingco company logo"
      />
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <li className="flex flex-col lg:order-none">
          <a href="#">Клієнтам</a>
          <a href="#">Про нас</a>
          <a href="#">Підтримка</a>
        </li>
        <li className="order-last col-span-2 justify-self-center lg:order-none lg:col-span-1">
          <p>Соціальні мережі</p>
          <div className="flex justify-center gap-2">
            <Link href="https://facebook.com" target="_blank">
              <Image
                src={'/socials/facebook.svg'}
                width={32}
                height={32}
                alt="facebook logo"
              />
            </Link>
            <Link href="https://telegram.org" target="_blank">
              <Image
                src={'/socials/telegram.svg'}
                width={32}
                height={32}
                alt="telegram logo"
              />
            </Link>
            <Link href="https://viber.com" target="_blank">
              <Image
                src={'/socials/viber.svg'}
                width={32}
                height={32}
                alt="viber logo"
              />
            </Link>
          </div>
        </li>
        <li className="lg:order-none">30</li>
      </ul>
    </footer>
  );
};

export default Footer;
