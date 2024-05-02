import Image from 'next/image';

const Features = () => {
  return (
    <section className="mb-5 px-5">
      <h2 className="mb-4 text-center text-2xl">Чому ми?</h2>
      <ul className="flex flex-col items-center gap-4">
        <li className="flex items-center gap-2 ">
          <Image
            src={'/features/featuresIcon_1.png'}
            height={48}
            width={48}
            alt=""
            className="shrink-0"
          />
          <p className="text-base">
            Партнерські відносини та індивідуальний підхід
          </p>
        </li>
        <li className="flex items-center gap-2">
          <Image
            src={'/features/featuresIcon_2.png'}
            height={48}
            width={48}
            alt=""
            className="shrink-0"
          />
          <p className="text-base">
            Супровід та допомогу в подальшому використанні
          </p>
        </li>
        <li className="flex items-center gap-2">
          <Image
            src={'/features/featuresIcon_3.png'}
            height={48}
            width={48}
            alt=""
            className="shrink-0"
          />
          <p className="text-base">
            Продукція нашої компанії завоювала довіру клієнтів в понад 50
            країнах світу
          </p>
        </li>
        <li className="flex items-center gap-2">
          <Image
            src={'/features/featuresIcon_4.png'}
            height={48}
            width={48}
            alt=""
            className="shrink-0"
          />
          <p className="text-base">
            Понад 360+ електроінструментів, що працюють від єдиного акумулятора
          </p>
        </li>
      </ul>
    </section>
  );
};

export default Features;
