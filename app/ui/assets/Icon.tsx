import clsx from 'clsx';

const Icon = ({
  icon,
  className,
}: {
  icon: string;
  className?: string | (() => void);
}) => {
  return (
    <svg className={clsx(className)} fill="currentColor" aria-hidden="false">
      <use href={`/icons/sprite.svg#${icon}`}></use>
    </svg>
  );
};

export default Icon;
