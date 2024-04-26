import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-orangeLight relative flex flex-col items-center pb-14 pt-[18px] text-lg lg:flex-row lg:px-[60px]">
      <Image
        src={'/logo.png'}
        width={200}
        height={50}
        alt="Ingco company logo"
        className="mb-4 lg:mb-0"
      />
      <ul className="mx-auto grid grid-cols-2 gap-y-2 lg:flex lg:gap-20 2xl:gap-32">
        <li className="flex flex-col lg:order-none">
          <a className="transition-colors hover:text-white" href="#">
            Клієнтам
          </a>
          <a className="transition-colors hover:text-white" href="#">
            Про нас
          </a>
          <a className="transition-colors hover:text-white" href="#">
            Підтримка
          </a>
        </li>
        <li className="order-last col-span-2 justify-self-center lg:order-none lg:col-span-1">
          <p className="mb-1">Соціальні мережі</p>
          <div className="flex justify-center gap-2">
            <Link href="https://facebook.com" target="_blank">
              <svg
                width="32"
                height="32"
                className="stroke transform border-white transition-all hover:scale-110 hover:fill-white hover:stroke-white"
              >
                <g clip-path="url(#clip0_808_272)">
                  <g filter="url(#filter0_d_808_272)">
                    <path
                      d="M29.3332 16.0001C29.3332 8.64008 23.3598 2.66675 15.9998 2.66675C8.63984 2.66675 2.6665 8.64008 2.6665 16.0001C2.6665 22.4534 7.25317 27.8267 13.3332 29.0667V20.0001H10.6665V16.0001H13.3332V12.6667C13.3332 10.0934 15.4265 8.00008 17.9998 8.00008H21.3332V12.0001H18.6665C17.9332 12.0001 17.3332 12.6001 17.3332 13.3334V16.0001H21.3332V20.0001H17.3332V29.2667C24.0665 28.6001 29.3332 22.9201 29.3332 16.0001Z"
                      fill="#111827"
                    />
                    <path
                      d="M10.1665 20.0001V20.5001H10.6665H12.8332V28.4394C7.28155 27.0254 3.1665 21.9963 3.1665 16.0001C3.1665 8.91622 8.91598 3.16675 15.9998 3.16675C23.0837 3.16675 28.8332 8.91622 28.8332 16.0001C28.8332 22.471 24.0483 27.8157 17.8332 28.7028V20.5001H21.3332H21.8332V20.0001V16.0001V15.5001H21.3332H17.8332V13.3334C17.8332 12.8762 18.2093 12.5001 18.6665 12.5001H21.3332H21.8332V12.0001V8.00008V7.50008H21.3332H17.9998C15.1504 7.50008 12.8332 9.81727 12.8332 12.6667V15.5001H10.6665H10.1665V16.0001V20.0001Z"
                      stroke="black"
                    />
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_808_272">
                    <rect width="32" height="32" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </Link>
            <Link href="https://telegram.org" target="_blank">
              <svg
                width="32"
                height="32"
                fill="none"
                className="stroke transform border-white transition-all hover:scale-110 hover:fill-white hover:stroke-white"
              >
                <path
                  d="M16.3333 3C8.97333 3 3 8.97333 3 16.3333C3 23.6933 8.97333 29.6667 16.3333 29.6667C23.6933 29.6667 29.6667 23.6933 29.6667 16.3333C29.6667 8.97333 23.6933 3 16.3333 3ZM22.52 12.0667C22.32 14.1733 21.4533 19.2933 21.0133 21.6533C20.8267 22.6533 20.4533 22.9867 20.1067 23.0267C19.3333 23.0933 18.7467 22.52 18 22.0267C16.8267 21.2533 16.16 20.7733 15.0267 20.0267C13.7067 19.16 14.56 18.68 15.32 17.9067C15.52 17.7067 18.9333 14.6 19 14.32C19.0093 14.2776 19.008 14.2336 18.9964 14.1917C18.9848 14.1499 18.9631 14.1116 18.9333 14.08C18.8533 14.0133 18.7467 14.04 18.6533 14.0533C18.5333 14.08 16.6667 15.32 13.0267 17.7733C12.4933 18.1333 12.0133 18.32 11.5867 18.3067C11.1067 18.2933 10.2 18.04 9.52 17.8133C8.68 17.5467 8.02667 17.4 8.08 16.9333C8.10667 16.6933 8.44 16.4533 9.06667 16.2C12.96 14.5067 15.5467 13.3867 16.84 12.8533C20.5467 11.3067 21.3067 11.04 21.8133 11.04C21.92 11.04 22.1733 11.0667 22.3333 11.2C22.4667 11.3067 22.5067 11.4533 22.52 11.56C22.5067 11.64 22.5333 11.88 22.52 12.0667Z"
                  fill="#111827"
                />
              </svg>
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
        <li className="lg:order-none">
          Контакти
          <div className="flex flex-col">
            <a href="tel:+380988392107">+380 98-83-92-107</a>
            <a href="tel:+380964123628">+380 96-41-23-628</a>
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
