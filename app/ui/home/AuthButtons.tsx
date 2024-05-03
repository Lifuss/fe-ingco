import Link from 'next/link';

const AuthButtons = () => {
  return (
    <div className="text-sm lg:flex lg:items-center lg:gap-2 lg:text-[20px] lg:tracking-tight">
      <Link
        href={'/login'}
        className="relative block text-center transition-colors ease-out hover:text-white"
      >
        Вхід
        <div className="absolute bottom-0 h-[2px]  w-full bg-black max-sm:left-0 lg:right-[-5px] lg:top-0 lg:h-[1rem] lg:w-[2px] lg:translate-y-[10%]"></div>
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
