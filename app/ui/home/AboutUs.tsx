import Image from 'next/image';
// TODO: пропрацювати блок адресу
const AboutUs = () => {
  return (
    <section className="mb-10 px-5 md:px-[60px]" id="aboutUs">
      <h2 className="mb-4 text-center text-2xl md:mb-10 md:text-3xl lg:md:text-4xl">
        Про нас
      </h2>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-5">
        <Image
          src={'/aboutUsImg.png'}
          alt="man and women in building suits present company logo"
          width={489}
          height={364}
          className="mx-auto rounded-lg"
        />

        <div className="flex flex-col gap-2 text-sm lg:text-base">
          <p>
            Ми є одним із найпопулярніших та надійних магазинів будівельних та
            домашніх інструментів у нашому регіоні. Наша компанія вже багато
            років забезпечує клієнтів найкращою якістю продукції та високим
            рівнем обслуговування. Ми офіційний імпортер продукції в Україні.
          </p>
          <p>
            У нашому асортименті ви знайдете широкий вибір інструментів для
            будівництва, ремонту та побутового використання. Від професійного
            обладнання для будівельних підприємств до зручних та надійних
            інструментів для домашнього майстра — у нас є все необхідне для
            ваших потреб.
          </p>
          <p className="font-medium">Можливий самовивіз із:</p>
          <address className="mb-2 not-italic">
            <div>
              <span className="font-medium">Адреса:</span>
              <p>м. Вижниця, Чернівецька обл. Вул. Українська 100/2</p>
            </div>
            <div>
              <span className="font-medium">Адреса:</span>
              <p> м. Герца, Чернівецька обл. Вул. Штефана Великого 12</p>
            </div>
          </address>
          <div className="flex justify-between">
            <div>
              <p className="font-medium">Графік роботи:</p>
              <p>Пн - Пт : 08:00-18:00</p>
              <p>Cб - Нд : 09:00-15:00</p>
            </div>
            <div>
              <p className="font-medium">Email:</p>
              <a
                href="mailto:example@gmail.com"
                className="text-blue-400 hover:text-orangeLight"
              >
                example@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
