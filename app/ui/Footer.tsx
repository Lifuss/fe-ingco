import Image from 'next/image';
import Link from 'next/link';

const {
  NEXT_PUBLIC_TELEGRAM_URL = 'https://telegram.com',
  NEXT_PUBLIC_TIKTOK_URL = 'https://tiktok.com',
  NEXT_PUBLIC_FACEBOOK_URL = 'https://facebook.com',
  NEXT_PUBLIC_VIBER_URL = 'https://viber.com',
} = process.env;

const Footer = () => {
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
            <Link href={NEXT_PUBLIC_TIKTOK_URL} target="_blank">
              <svg
                fill="#000000"
                width="32"
                height="32"
                className="stroke transform border-white transition-all duration-300 hover:scale-[1.5] hover:stroke-slate-300"
                viewBox="0 0 24 24"
              >
                <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
              </svg>
            </Link>
            <Link href={NEXT_PUBLIC_FACEBOOK_URL} target="_blank">
              <svg
                width="32"
                height="32"
                className="stroke transform border-white transition-all duration-300 hover:scale-[1.5] hover:stroke-slate-300"
              >
                <g clipPath="url(#clip0_808_272)">
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
            <Link href={NEXT_PUBLIC_TELEGRAM_URL} target="_blank">
              <svg
                width="32"
                height="32"
                fill="none"
                className="stroke transform border-white transition-all duration-300 hover:scale-[1.5] hover:stroke-slate-300"
              >
                <path
                  d="M16.3333 3C8.97333 3 3 8.97333 3 16.3333C3 23.6933 8.97333 29.6667 16.3333 29.6667C23.6933 29.6667 29.6667 23.6933 29.6667 16.3333C29.6667 8.97333 23.6933 3 16.3333 3ZM22.52 12.0667C22.32 14.1733 21.4533 19.2933 21.0133 21.6533C20.8267 22.6533 20.4533 22.9867 20.1067 23.0267C19.3333 23.0933 18.7467 22.52 18 22.0267C16.8267 21.2533 16.16 20.7733 15.0267 20.0267C13.7067 19.16 14.56 18.68 15.32 17.9067C15.52 17.7067 18.9333 14.6 19 14.32C19.0093 14.2776 19.008 14.2336 18.9964 14.1917C18.9848 14.1499 18.9631 14.1116 18.9333 14.08C18.8533 14.0133 18.7467 14.04 18.6533 14.0533C18.5333 14.08 16.6667 15.32 13.0267 17.7733C12.4933 18.1333 12.0133 18.32 11.5867 18.3067C11.1067 18.2933 10.2 18.04 9.52 17.8133C8.68 17.5467 8.02667 17.4 8.08 16.9333C8.10667 16.6933 8.44 16.4533 9.06667 16.2C12.96 14.5067 15.5467 13.3867 16.84 12.8533C20.5467 11.3067 21.3067 11.04 21.8133 11.04C21.92 11.04 22.1733 11.0667 22.3333 11.2C22.4667 11.3067 22.5067 11.4533 22.52 11.56C22.5067 11.64 22.5333 11.88 22.52 12.0667Z"
                  fill="#111827"
                />
              </svg>
            </Link>
            <Link href={NEXT_PUBLIC_VIBER_URL} target="_blank">
              <svg
                width="32"
                height="32"
                fill="none"
                className="stroke transform border-white transition-all duration-300 hover:scale-[1.5] hover:stroke-slate-300"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M22.2345 3.50406C18.0396 2.56635 13.6894 2.56635 9.49451 3.50406L9.04251 3.60406C7.86253 3.86788 6.77879 4.45364 5.91167 5.29628C5.04455 6.13892 4.428 7.20545 4.13051 8.37739C3.06717 12.5674 3.06717 16.9567 4.13051 21.1467C4.41421 22.2644 4.98838 23.2872 5.79482 24.1114C6.60126 24.9357 7.61129 25.532 8.72251 25.8401L9.34251 29.5414C9.3623 29.6589 9.41324 29.769 9.49002 29.8602C9.5668 29.9513 9.66662 30.0202 9.77908 30.0597C9.89154 30.0992 10.0125 30.1078 10.1294 30.0847C10.2464 30.0615 10.3549 30.0074 10.4438 29.9281L14.0852 26.6707C16.8186 26.8375 19.562 26.6189 22.2345 26.0214L22.6878 25.9214C23.8678 25.6576 24.9516 25.0718 25.8187 24.2292C26.6858 23.3865 27.3024 22.32 27.5998 21.1481C28.6631 16.958 28.6631 12.5688 27.5998 8.37873C27.3023 7.20662 26.6855 6.13997 25.8181 5.29731C24.9508 4.45465 23.8667 3.86899 22.6865 3.60539L22.2345 3.50406ZM10.6198 8.26939C10.372 8.23333 10.1194 8.2832 9.90384 8.41073H9.88518C9.38518 8.70406 8.93451 9.07339 8.55051 9.50806C8.23051 9.87739 8.05718 10.2507 8.01184 10.6107C7.98518 10.8241 8.00384 11.0401 8.06651 11.2441L8.09051 11.2574C8.45051 12.3147 8.91984 13.3321 9.49318 14.2894C10.2324 15.634 11.1422 16.8777 12.1998 17.9894L12.2318 18.0347L12.2825 18.0721L12.3132 18.1081L12.3505 18.1401C13.4661 19.2009 14.7127 20.115 16.0598 20.8601C17.5998 21.6987 18.5345 22.0947 19.0958 22.2601V22.2681C19.2598 22.3187 19.4092 22.3414 19.5598 22.3414C20.0379 22.3061 20.4904 22.1117 20.8452 21.7894C21.2785 21.4054 21.6452 20.9534 21.9305 20.4507V20.4414C22.1985 19.9347 22.1078 19.4574 21.7212 19.1334C20.9445 18.4548 20.1047 17.852 19.2132 17.3334C18.6158 17.0094 18.0092 17.2054 17.7638 17.5334L17.2398 18.1947C16.9705 18.5227 16.4825 18.4774 16.4825 18.4774L16.4692 18.4854C12.8278 17.5561 11.8558 13.8694 11.8558 13.8694C11.8558 13.8694 11.8105 13.3681 12.1478 13.1121L12.8038 12.5841C13.1185 12.3281 13.3372 11.7227 12.9998 11.1254C12.4847 10.2331 11.8831 9.3935 11.2038 8.61873C11.0557 8.43639 10.8479 8.3122 10.6172 8.26806L10.6198 8.26939ZM16.7718 6.66673C16.595 6.66673 16.4255 6.73697 16.3004 6.86199C16.1754 6.98701 16.1052 7.15658 16.1052 7.33339C16.1052 7.5102 16.1754 7.67977 16.3004 7.8048C16.4255 7.92982 16.595 8.00006 16.7718 8.00006C18.4585 8.00006 19.8585 8.55073 20.9665 9.60673C21.5358 10.1841 21.9798 10.8681 22.2705 11.6174C22.5625 12.3681 22.6958 13.1694 22.6612 13.9721C22.6575 14.0596 22.6711 14.147 22.7012 14.2293C22.7313 14.3116 22.7773 14.3872 22.8366 14.4517C22.9564 14.5819 23.123 14.6593 23.2998 14.6667C23.4767 14.6742 23.6492 14.611 23.7794 14.4913C23.9097 14.3715 23.9871 14.2049 23.9945 14.0281C24.0359 13.0407 23.872 12.0555 23.5132 11.1347C23.1528 10.2096 22.6064 9.36822 21.9078 8.66273L21.8945 8.64939C20.5198 7.33606 18.7798 6.66673 16.7718 6.66673ZM16.7265 8.85873C16.5497 8.85873 16.3801 8.92897 16.2551 9.05399C16.1301 9.17901 16.0598 9.34858 16.0598 9.52539C16.0598 9.70221 16.1301 9.87177 16.2551 9.9968C16.3801 10.1218 16.5497 10.1921 16.7265 10.1921H16.7492C17.9652 10.2787 18.8505 10.6841 19.4705 11.3494C20.1065 12.0347 20.4358 12.8867 20.4105 13.9401C20.4064 14.1169 20.4728 14.2881 20.5949 14.416C20.7171 14.5439 20.885 14.618 21.0618 14.6221C21.2387 14.6261 21.4098 14.5598 21.5377 14.4376C21.6656 14.3155 21.7398 14.1475 21.7438 13.9707C21.7758 12.5881 21.3305 11.3947 20.4478 10.4427V10.4401C19.5452 9.47206 18.3065 8.96006 16.8158 8.86006L16.7932 8.85739L16.7265 8.85873ZM16.7012 11.0921C16.612 11.0842 16.5221 11.0944 16.4369 11.122C16.3517 11.1496 16.2729 11.1942 16.2053 11.2529C16.1377 11.3117 16.0826 11.3834 16.0434 11.4639C16.0041 11.5444 15.9815 11.632 15.9768 11.7215C15.9722 11.8109 15.9856 11.9004 16.0162 11.9845C16.0469 12.0687 16.0942 12.1458 16.1554 12.2112C16.2165 12.2767 16.2902 12.3291 16.3721 12.3655C16.4539 12.4018 16.5423 12.4213 16.6318 12.4227C17.1892 12.4521 17.5452 12.6201 17.7692 12.8454C17.9945 13.0721 18.1625 13.4361 18.1932 14.0054C18.1948 14.0949 18.2145 14.1831 18.251 14.2648C18.2875 14.3465 18.34 14.42 18.4055 14.481C18.471 14.542 18.5481 14.5891 18.6322 14.6196C18.7163 14.6502 18.8057 14.6635 18.8951 14.6587C18.9844 14.654 19.0719 14.6313 19.1523 14.592C19.2327 14.5527 19.3044 14.4977 19.3631 14.4301C19.4217 14.3626 19.4662 14.2839 19.4938 14.1988C19.5215 14.1137 19.5317 14.0239 19.5238 13.9347C19.4812 13.1347 19.2305 12.4281 18.7172 11.9081C18.2012 11.3881 17.4985 11.1347 16.7012 11.0921Z"
                  fill="#111827"
                />
              </svg>
            </Link>
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
