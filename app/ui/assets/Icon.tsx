import clsx from 'clsx';

const Icon = ({
  icon,
  className,
}: {
  icon: string;
  className?: string | (() => void);
}) => {
  return (
    <svg className={clsx(className)}>
      <use href={`/icons/sprite.svg#${icon}`}></use>
    </svg>
  );
};

export default Icon;
