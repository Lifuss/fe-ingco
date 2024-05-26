'use client';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const listData = [
  {
    title: 'Продукт',
    link: '/dashboard',
    svg: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22 19V21H23.748C22.639 22.5498 21.1758 23.8121 19.4802 24.6818C17.7845 25.5515 15.9057 26.0035 14 26C7.383 26 2 20.617 2 14H0C0 21.72 6.28 28 14 28C18.355 28 22.374 25.999 25 22.655V24H27V19H22Z"
          fill="white"
        />
        <path
          d="M20.505 9.63701L14.516 6.13701C14.3631 6.0476 14.1892 6.00039 14.0121 6.00022C13.835 6.00004 13.6611 6.0469 13.508 6.13601L7.497 9.63601C7.34584 9.72399 7.22039 9.85007 7.13318 10.0017C7.04597 10.1533 7.00005 10.3251 7 10.5V17.5C7.00005 17.6749 7.04597 17.8467 7.13318 17.9983C7.22039 18.15 7.34584 18.276 7.497 18.364L13.508 21.864C13.6567 21.9529 13.8267 21.9999 14 22C14.174 22 14.36 21.955 14.516 21.863L20.505 18.363C20.6556 18.2749 20.7806 18.1488 20.8674 17.9974C20.9543 17.846 21 17.6745 21 17.5V10.5C21 10.3255 20.9543 10.154 20.8674 10.0026C20.7806 9.85119 20.6556 9.72515 20.505 9.63701ZM14.011 8.15701L18.018 10.5L14.011 12.842L9.988 10.5L14.011 8.15701ZM9 12.24L13 14.57V19.255L9 16.925V12.24ZM15 19.265V14.582L19 12.244V16.927L15 19.265Z"
          fill="white"
        />
        <path
          d="M14 1.3206e-05C11.881 -0.00290212 9.78909 0.476905 7.88314 1.40302C5.97719 2.32914 4.30724 3.67724 3 5.34501V4.00001H1V9.00001H6V7.00001H4.252C5.36098 5.45027 6.82422 4.18796 8.51983 3.31823C10.2154 2.44851 12.0943 1.99655 14 2.00001C20.617 2.00001 26 7.38301 26 14H28C28 6.28001 21.72 1.3206e-05 14 1.3206e-05Z"
          fill="white"
        />
      </svg>
    ),
  },
  {
    title: 'Категорії',
    link: '/dashboard/categories',
    svg: (
      <svg
        width="28"
        height="29"
        viewBox="0 0 28 29"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M25 20.141V16C25 15.4696 24.7893 14.9609 24.4142 14.5858C24.0392 14.2107 23.5304 14 23 14H15V10H17C17.5303 9.99947 18.0387 9.78859 18.4136 9.41363C18.7886 9.03867 18.9995 8.53027 19 8V2C18.9995 1.46973 18.7886 0.961329 18.4136 0.586371C18.0387 0.211413 17.5303 0.000529477 17 0H11C10.4697 0.000529477 9.96134 0.211413 9.58638 0.586371C9.21142 0.961329 9.00054 1.46973 9.00001 2V8C9.00054 8.53027 9.21142 9.03867 9.58638 9.41363C9.96134 9.78859 10.4697 9.99947 11 10H13V14H5.00001C4.46958 14 3.96087 14.2107 3.5858 14.5858C3.21072 14.9609 3.00001 15.4696 3.00001 16V20.142C2.05735 20.3854 1.23582 20.9642 0.689408 21.77C0.142996 22.5758 -0.0907835 23.5532 0.031891 24.519C0.154565 25.4848 0.625271 26.3727 1.35578 27.0163C2.08628 27.6599 3.02644 28.015 4.00001 28.015C4.97358 28.015 5.91374 27.6599 6.64424 27.0163C7.37475 26.3727 7.84545 25.4848 7.96813 24.519C8.0908 23.5532 7.85702 22.5758 7.31061 21.77C6.7642 20.9642 5.94267 20.3854 5.00001 20.142V16H13V20.142C12.0574 20.3854 11.2358 20.9642 10.6894 21.77C10.143 22.5758 9.90922 23.5532 10.0319 24.519C10.1546 25.4848 10.6253 26.3727 11.3558 27.0163C12.0863 27.6599 13.0264 28.015 14 28.015C14.9736 28.015 15.9137 27.6599 16.6442 27.0163C17.3747 26.3727 17.8455 25.4848 17.9681 24.519C18.0908 23.5532 17.857 22.5758 17.3106 21.77C16.7642 20.9642 15.9427 20.3854 15 20.142V16H23V20.141C22.0574 20.3844 21.2358 20.9632 20.6894 21.769C20.143 22.5748 19.9092 23.5522 20.0319 24.518C20.1546 25.4838 20.6253 26.3717 21.3558 27.0153C22.0863 27.6589 23.0264 28.014 24 28.014C24.9736 28.014 25.9137 27.6589 26.6442 27.0153C27.3747 26.3717 27.8455 25.4838 27.9681 24.518C28.0908 23.5522 27.857 22.5748 27.3106 21.769C26.7642 20.9632 25.9427 20.3844 25 20.141ZM11 2H17L17.001 8H11V2ZM6.00001 24C6.00001 24.3956 5.88271 24.7822 5.66295 25.1111C5.44319 25.44 5.13083 25.6964 4.76538 25.8478C4.39992 25.9991 3.99779 26.0387 3.60983 25.9616C3.22187 25.8844 2.8655 25.6939 2.5858 25.4142C2.30609 25.1345 2.11561 24.7781 2.03844 24.3902C1.96127 24.0022 2.00087 23.6001 2.15225 23.2346C2.30363 22.8692 2.55997 22.5568 2.88887 22.3371C3.21777 22.1173 3.60445 22 4.00001 22C4.53028 22.0005 5.03868 22.2114 5.41364 22.5864C5.7886 22.9613 5.99948 23.4697 6.00001 24ZM16 24C16 24.3956 15.8827 24.7822 15.6629 25.1111C15.4432 25.44 15.1308 25.6964 14.7654 25.8478C14.3999 25.9991 13.9978 26.0387 13.6098 25.9616C13.2219 25.8844 12.8655 25.6939 12.5858 25.4142C12.3061 25.1345 12.1156 24.7781 12.0384 24.3902C11.9613 24.0022 12.0009 23.6001 12.1523 23.2346C12.3036 22.8692 12.56 22.5568 12.8889 22.3371C13.2178 22.1173 13.6044 22 14 22C14.5302 22.0008 15.0384 22.2118 15.4133 22.5867C15.7882 22.9616 15.9992 23.4698 16 24ZM24 26C23.6044 26 23.2178 25.8827 22.8889 25.6629C22.56 25.4432 22.3036 25.1308 22.1523 24.7654C22.0009 24.3999 21.9613 23.9978 22.0384 23.6098C22.1156 23.2219 22.3061 22.8655 22.5858 22.5858C22.8655 22.3061 23.2219 22.1156 23.6098 22.0384C23.9978 21.9613 24.3999 22.0009 24.7654 22.1522C25.1308 22.3036 25.4432 22.56 25.6629 22.8889C25.8827 23.2178 26 23.6044 26 24C25.9995 24.5303 25.7886 25.0387 25.4136 25.4136C25.0387 25.7886 24.5303 25.9995 24 26Z"
          fill="white"
        />
      </svg>
    ),
  },
  {
    title: 'Користувачі',
    link: '/dashboard/users',
    svg: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.4 30.912V31.9787H23.4667V30.912H22.4ZM1.06667 30.912H0V31.9787H1.06667V30.912ZM30.9333 30.9333V32H32V30.9333H30.9333ZM17.0667 7.4624C17.0664 8.1625 16.9282 8.8557 16.66 9.5024C16.3919 10.1491 15.9989 10.7367 15.5037 11.2315C15.0084 11.7264 14.4206 12.1188 13.7737 12.3865C13.1267 12.6541 12.4334 12.7917 11.7333 12.7915V14.9248C15.8571 14.9248 19.2 11.584 19.2 7.4624H17.0667ZM11.7333 12.7915C11.0332 12.7917 10.3399 12.6541 9.69301 12.3865C9.04609 12.1188 8.45823 11.7264 7.96298 11.2315C7.46774 10.7367 7.07481 10.1491 6.80663 9.5024C6.53845 8.8557 6.40028 8.1625 6.4 7.4624H4.26667C4.26695 8.44266 4.4603 9.41326 4.83569 10.3188C5.21107 11.2243 5.76114 12.0471 6.45449 12.74C7.14783 13.4329 7.97087 13.9825 8.87662 14.3574C9.78236 14.7323 10.7531 14.9251 11.7333 14.9248V12.7915ZM6.4 7.4624C6.40028 6.7623 6.53845 6.06911 6.80663 5.4224C7.07481 4.7757 7.46774 4.18815 7.96298 3.6933C8.45823 3.19845 9.04609 2.80599 9.69301 2.53833C10.3399 2.27067 11.0332 2.13305 11.7333 2.13333V3.04964e-07C10.7531 -0.000279888 9.78236 0.192519 8.87662 0.567388C7.97087 0.942257 7.14783 1.49185 6.45449 2.1848C5.76114 2.87775 5.21107 3.70048 4.83569 4.60601C4.4603 5.51154 4.26695 6.48214 4.26667 7.4624H6.4ZM11.7333 2.13333C13.1471 2.13333 14.503 2.69465 15.5031 3.69392C16.5031 4.69319 17.0655 6.04865 17.0667 7.4624H19.2C19.1997 6.48214 19.0064 5.51154 18.631 4.60601C18.2556 3.70048 17.7055 2.87775 17.0122 2.1848C16.3188 1.49185 15.4958 0.942257 14.59 0.567388C13.6843 0.192519 12.7136 -0.000279888 11.7333 3.04964e-07V2.13333ZM22.4 29.8453H1.06667V31.9787H22.4V29.8453ZM2.13333 30.912V26.656H0V30.912H2.13333ZM7.46667 21.3205H16V19.1872H7.46667V21.3205ZM21.3333 26.6539V30.912H23.4667V26.6539H21.3333ZM16 21.3205C17.4145 21.3205 18.771 21.8824 19.7712 22.8826C20.7714 23.8828 21.3333 25.2394 21.3333 26.6539H23.4667C23.4667 24.6736 22.68 22.7744 21.2797 21.3741C19.8795 19.9739 17.9803 19.1872 16 19.1872V21.3205ZM2.13333 26.656C2.13333 25.2415 2.69524 23.8828 3.69543 22.8826C4.69562 21.8824 6.05218 21.3205 7.46667 21.3205V19.1872C5.48638 19.1872 3.58721 19.9739 2.18694 21.3741C0.786664 22.7744 0 24.6757 0 26.656H2.13333ZM29.8667 27.7333V30.9333H32V27.7333H29.8667ZM30.9333 29.8667H25.6V32H30.9333V29.8667ZM25.6 23.4667C26.7316 23.4667 27.8168 23.9162 28.617 24.7163C29.4171 25.5165 29.8667 26.6017 29.8667 27.7333H32C32 26.0359 31.3257 24.4081 30.1255 23.2078C28.9253 22.0076 27.2974 21.3333 25.6 21.3333V23.4667ZM24.5333 17.0667C23.6846 17.0667 22.8707 16.7295 22.2706 16.1294C21.6705 15.5293 21.3333 14.7154 21.3333 13.8667H19.2C19.2 15.2812 19.7619 16.6377 20.7621 17.6379C21.7623 18.6381 23.1188 19.2 24.5333 19.2V17.0667ZM27.7333 13.8667C27.7333 14.7154 27.3962 15.5293 26.7961 16.1294C26.196 16.7295 25.382 17.0667 24.5333 17.0667V19.2C25.9478 19.2 27.3044 18.6381 28.3046 17.6379C29.3048 16.6377 29.8667 15.2812 29.8667 13.8667H27.7333ZM24.5333 10.6667C25.382 10.6667 26.196 11.0038 26.7961 11.6039C27.3962 12.204 27.7333 13.018 27.7333 13.8667H29.8667C29.8667 12.4522 29.3048 11.0956 28.3046 10.0954C27.3044 9.09524 25.9478 8.53333 24.5333 8.53333V10.6667ZM24.5333 8.53333C23.1188 8.53333 21.7623 9.09524 20.7621 10.0954C19.7619 11.0956 19.2 12.4522 19.2 13.8667H21.3333C21.3333 13.018 21.6705 12.204 22.2706 11.6039C22.8707 11.0038 23.6846 10.6667 24.5333 10.6667V8.53333Z"
          fill="white"
        />
      </svg>
    ),
  },
  {
    title: 'Замовлення',
    link: '/dashboard/orders',
    svg: (
      <svg
        width="22"
        height="26"
        viewBox="0 0 22 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.00033 8.00004H15.0003M7.00033 13.3334H15.0003M7.00033 18.6667H12.3337M4.33366 1.33337H17.667C19.1398 1.33337 20.3337 2.52728 20.3337 4.00004V21.3334C20.3337 22.8061 19.1398 24 17.667 24H4.33366C2.8609 24 1.66699 22.8061 1.66699 21.3334V4.00004C1.66699 2.52728 2.8609 1.33337 4.33366 1.33337Z"
          stroke="white"
          strokeWidth="2.66667"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];
const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className=" h-full bg-[#10091A] pl-[40px] pr-6 pt-10">
      <Link href={'/shop'}>
        <svg
          width="91"
          height="24"
          viewBox="0 0 91 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-10"
        >
          <path
            d="M90.9997 13.495C90.9997 14.9572 90.6965 15.7748 90.1076 17.1257C89.5186 18.4765 88.6553 19.704 87.5671 20.7379C86.4788 21.7718 85.1868 22.5919 83.7649 23.1515C82.343 23.711 80.8191 23.999 79.28 23.999C77.741 23.999 76.217 23.711 74.7951 23.1515C73.3732 22.5919 72.0812 21.7718 70.993 20.7379C69.9047 19.704 69.0414 18.4765 68.4525 17.1257C67.8635 15.7748 67.5604 14.9572 67.5604 13.495L73.7649 13.495C73.7649 14.1762 73.9617 14.2204 74.2361 14.8497C74.5105 15.479 74.9126 16.0508 75.4196 16.5324C75.9265 17.0141 76.5284 17.3961 77.1908 17.6568C77.8531 17.9174 78.5631 18.0516 79.28 18.0516C79.997 18.0516 80.7069 17.9174 81.3693 17.6568C82.0317 17.3961 82.6335 17.0141 83.1405 16.5324C83.6474 16.0508 84.0496 15.479 84.3239 14.8497C84.5983 14.2204 84.5654 14.1762 84.5654 13.495L90.9997 13.495Z"
            fill="white"
          />
          <path
            d="M67.5605 11.6048C67.5605 10.1427 67.8637 8.69483 68.4527 7.34397C69.0416 5.99311 69.9049 4.7657 70.9932 3.7318C72.0815 2.69791 73.3735 1.87779 74.7954 1.31826C76.2173 0.758728 77.7413 0.470753 79.2803 0.470772C80.8194 0.470791 82.3433 0.758805 83.7652 1.31837C85.1871 1.87794 86.4791 2.69809 87.5673 3.73201C88.6556 4.76593 89.5188 5.99337 90.1078 7.34424C90.6967 8.69511 90.9998 10.143 90.9998 11.6051L84.7397 11.6051C84.7397 10.9239 84.5985 10.2494 84.3241 9.62015C84.0497 8.99086 83.6476 8.41907 83.1407 7.93742C82.6337 7.45578 82.0319 7.07372 81.3695 6.81305C80.7071 6.55238 79.9972 6.41821 79.2802 6.4182C78.5633 6.41819 77.8533 6.55234 77.191 6.813C76.5286 7.07365 75.9267 7.4557 75.4197 7.93733C74.9128 8.41896 74.5106 8.99074 74.2363 9.62003C73.9619 10.2493 73.8207 10.9238 73.8206 11.6049L67.5605 11.6048Z"
            fill="white"
          />
          <path d="M0 10.3525H6.43432V23.9993H0V10.3525Z" fill="white" />
          <path d="M0 1.8824H6.43432V8.47049H0V1.8824Z" fill="white" />
          <path
            d="M42.7422 9.8823H49.1766V16.4704H42.7422V9.8823Z"
            fill="white"
          />
          <path
            d="M8.7323 1.88262H15.1666V23.9998H8.7323V1.88262Z"
            fill="white"
          />
          <path
            d="M21.6009 1.88242C25.1545 1.88242 28.0353 4.76316 28.0353 8.31674V23.9996H21.6009V1.88242Z"
            fill="white"
          />
          <path
            d="M15.1011 8.47014L15.1084 1.88205L21.6608 1.88967L21.6535 8.47775L15.1011 8.47014Z"
            fill="white"
          />
          <path
            d="M45.7633 23.5976C45.7633 23.5976 44.8104 23.9996 43.4316 23.9996C41.1337 23.9996 38.8357 23.9987 36.7478 23.1454C34.6998 22.139 32.9901 20.4873 31.8492 18.4128C30.7083 16.3383 30.1909 13.9406 30.3668 11.5429C30.5427 9.14511 31.4034 6.86248 32.8329 5.00245C34.2625 3.14241 36.1922 1.79439 38.3621 1.13996C40.532 0.485528 42.9091 0.136156 45.0402 0.922309C45.9594 1.2878 45.9594 1.2878 45.9594 1.2878V6.94378C45.27 6.80453 44.5375 6.84964 43.4653 6.85591C42.5461 6.86128 40.9748 6.86278 39.9605 7.16869C38.9461 7.47461 38.0441 8.10474 37.3758 8.97422C36.7076 9.8437 36.3053 10.9107 36.223 12.0316C36.1408 13.1524 36.3827 14.2732 36.916 15.2429C37.4493 16.2127 38.2485 16.9848 39.2059 17.4552C40.1632 17.9257 41.4453 18.1174 42.5124 18.1174C43.5796 18.1174 44.8104 17.6985 45.7633 17.4552V23.5976Z"
            fill="white"
          />
          <path
            d="M65.9855 23.1269C65.9855 23.1269 65.0326 23.5289 63.6538 23.5289C61.3558 23.5289 59.0579 23.528 56.97 22.6747C54.922 21.6683 53.2123 20.0166 52.0714 17.9421C50.9305 15.8675 50.4131 13.4699 50.589 11.0721C50.7649 8.67439 51.6256 6.39176 53.0551 4.53173C54.4847 2.67169 56.4144 1.32367 58.5843 0.669239C60.7542 0.0148059 63.1313 -0.334567 65.2624 0.451587C66.1816 0.817078 66.1816 0.81708 66.1816 0.81708V6.47306C65.4922 6.33381 64.7597 6.37892 63.6875 6.38518C62.7683 6.39055 61.197 6.39205 60.1827 6.69797C59.1683 7.00389 58.2663 7.63402 57.598 8.5035C56.9298 9.37298 56.5275 10.44 56.4452 11.5608C56.363 12.6817 56.6049 13.8025 57.1382 14.7722C57.6715 15.7419 58.4707 16.514 59.4281 16.9845C60.3854 17.4549 61.6675 17.6467 62.7346 17.6467C63.8017 17.6467 65.0326 17.7406 65.9855 17.4973V23.1269Z"
            fill="white"
          />
        </svg>
      </Link>
      <ul className="flex flex-col gap-[10px]  text-lg text-white ">
        {listData.map((item, index) => (
          <li key={index}>
            <Link
              href={item.link}
              className={clsx('flex gap-4 rounded-md p-3 hover:bg-[#323347]', {
                'bg-[#323347]': pathname === item.link,
              })}
            >
              <div className="w-7">{item.svg}</div>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
