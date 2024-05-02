import Image from 'next/image';

const AboutBrand = () => {
  return (
    <section className="mb-5 px-4" id="aboutBrand">
      <h2 className="mb-4 text-center text-2xl">Бренд INGCO</h2>
      <div className="flex flex-col gap-4">
        <Image
          src={'/brandImg.png'}
          alt="man and women in building suits present company logo"
          width={489}
          height={364}
          className="mx-auto rounded-lg"
        />

        <div className="flex flex-col gap-2 text-sm">
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
