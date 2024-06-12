import clsx from 'clsx';

const TextPlaceholder = ({
  title,
  text,
  titleSize = '2xl',
  textSize = 'base',
}: {
  title: string;
  text: string;
  titleSize?: string;
  textSize?: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 border border-orangeLight p-10">
      <h2 className={clsx(`text-2xl`, titleSize && `text-${titleSize}`)}>
        {title}
      </h2>
      <p className={clsx(`text-base`, titleSize && `text-${textSize}`)}>
        {text}
      </p>
    </div>
  );
};

export default TextPlaceholder;
