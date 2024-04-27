import Image from 'next/image';

const Hero = () => {
  // TODO button register logic, slider logic + responsive
  return (
    <section className="flex flex-col-reverse px-5 py-5">
      <div className="">
        <h1 className="mb-4 mr-auto text-start text-2xl">
          Оптові Постачання для Бізнесу: будівельні та домашні інструменти
        </h1>
        <p className="ml-auto flex w-[200px] flex-wrap text-end text-xl">
          <span className="mr mr-1 font-medium">Офіційний імпортер</span>
          продукції в Україні
        </p>
        <button className="ml-auto block w-[200px] rounded-lg bg-[#f59e0b] py-2 text-lg text-white">
          Зареєструватися
        </button>
      </div>
      <ul>
        <li>
          <Image
            src={'/homeSlider/sliderImg1.png'}
            width={450}
            height={250}
            alt="test"
            className="mx-auto mb-4"
          />
        </li>
      </ul>
    </section>
  );
};

export default Hero;
