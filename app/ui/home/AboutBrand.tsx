import Image from 'next/image';

const AboutBrand = () => {
  return (
    <section
      className="mb-5 px-5 md:mb-16 md:px-[60px] lg:mb-24"
      id="aboutBrand"
    >
      <h2 className="mb-4 text-center text-2xl md:mb-10 md:text-3xl lg:md:text-4xl xl:text-5xl">
        Бренд INGCO
      </h2>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-5 xl:gap-16">
        <Image
          src={'/brandImg.png'}
          alt="man and women in building suits present company logo"
          width={489}
          height={364}
          className="mx-auto rounded-lg md:h-[200px] lg:h-[236px] xl:h-auto"
        />

        <div className="flex flex-col gap-2 text-sm lg:text-base xl:h-[364px] xl:justify-between xl:text-xl 2xl:text-2xl">
          <p>
            Компанія INGCO — приклад вдалого поєднання якості й ціни в області
            інструменту. Бренд протягом 15 років займає одну з провідних позицій
            у світі серед виробників електро- і ручного інструменту за кількістю
            власних патентів та прес-форм.
          </p>
          <p>
            Для задоволення потреб як професіоналів, так і аматорів, бренд
            пропонує дві лінійки інструменту:
          </p>
          <p>
            <span className="font-medium">INDUSTRIAL</span> – це професійний
            інструмент для щоденного використання з підвищеним ресурсом, який
            задовольнить найвибагливіших користувачів.
          </p>
          <p>
            <span className="font-medium">STANDART</span> - це лінія, призначена
            для побутового та напівпрофесійного використання, з підвищеним
            ресурсом та надійністю.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutBrand;
