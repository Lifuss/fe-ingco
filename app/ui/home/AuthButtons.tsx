import Link from 'next/link';

const AuthButtons = () => {
  return (
    <div className="text-sm lg:flex lg:items-center lg:gap-3 lg:text-[20px] lg:tracking-tight 2xl:gap-5 2xl:text-2xl">
      <Link
        href={'/login'}
        className="relative block text-center transition-colors ease-out hover:text-white"
      >
        Вхід
        <div className="absolute bottom-0 h-[2px]  w-full bg-black max-sm:left-0 lg:right-[-8px] lg:top-0 lg:h-[1rem] lg:w-[2px] lg:translate-y-[10%] 2xl:right-[-10px] 2xl:translate-y-[36%]"></div>
      </Link>
      <Link
        href={'/registration'}
        className="text-center transition-colors ease-out hover:text-white"
      >
        Реєстрація
      </Link>
    </div>
  );
};

export default AuthButtons;
