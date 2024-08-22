'use client';
import Icon from '@/app/ui/assets/Icon';
import Link from 'next/link';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
const socialArray = [
  {
    name: 'telegram',
    url: 'https://t.me/+IePpWvT99J02NTJi',
  },
  {
    name: 'viber',
    url: 'https://invite.viber.com/?g=KiAyrPV8FlMrhU2pjsAWT-r7V3jGwmv6',
  },
];
const Page = () => {
  const isDesktop = useMediaQuery({ query: '(min-width: 1280px)' });
  return isDesktop ? (
    <section id="contacts" className="mx-auto w-[1280px] px-[30px] pb-20 pt-20">
      <h1 className="mb-5 text-center text-4xl">Контакти</h1>

      <ul className="min-h-36 mx-auto mb-5 w-fit rounded-2xl bg-[#f6f6f663] p-4 text-xl text-blue-600 shadow">
        <li>
          <Link className=" hover:text-orangeLight" href="tel:+380988392107">
            +380 98-83-92-107
          </Link>
        </li>
        <li>
          <Link className=" hover:text-orangeLight" href="tel:+380964123628">
            +380 96-41-23-628
          </Link>
        </li>
        <li>
          <Link
            href="mailto:ingco-service@ukr.net"
            className=" hover:text-orangeLight"
          >
            ingco-service@ukr.net
          </Link>
        </li>
        <li className="order-last col-span-2 mt-2 justify-self-center lg:order-none lg:col-span-1">
          <div className="flex justify-center gap-2">
            {socialArray.map((social) => (
              <Link
                href={social.url}
                key={social.name}
                target="_blank noopener noreferrer"
              >
                <Icon
                  icon={social.name}
                  className="stroke h-8 w-8 transform border-white transition-all duration-300 hover:scale-[1.5] hover:stroke-slate-300"
                />
              </Link>
            ))}
          </div>
        </li>
      </ul>
      <h2 className="mb-5 text-center text-3xl">
        Фізичні відділення для самовивозу
      </h2>
      <ul>
        <li className="mb-20 flex flex-col gap-5">
          <h3 className="text-center text-2xl font-medium">
            Вижницьке відділення
          </h3>
          <div className="flex justify-center gap-8">
            <div className="text-lg">
              <h4 className=" font-medium">Адреса:</h4>
              <p className=" mb-4 w-[260px]">
                м. Вижниця, Чернівецька обл. Вул. Українська 100/2
              </p>
              <h4 className="  font-medium">Графік роботи:</h4>
              <p>Пн - Пт : 08:00-18:00</p>
              <p className=" mb-4">Cб - Нд : 09:00-15:00</p>
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1116.994512468906!2d25.19615325692938!3d48.25137099752174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4736bf9f6f5625a5%3A0xec669a8aaba990f7!2sINGCO!5e0!3m2!1suk!2sua!4v1707399697985!5m2!1suk!2sua"
              width="750"
              height="450"
              style={{ border: 0, borderRadius: '10px' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </li>
        <li className="flex flex-col gap-5">
          <h3 className="text-center text-2xl font-medium">
            Герцаївське відділення
          </h3>
          <div className="flex justify-center gap-8">
            <div className="text-lg">
              <h4 className=" font-medium">Адреса:</h4>
              <p className=" mb-4 w-[250px]">
                м. Герца, Чернівецька обл. Вул. Штефана Великого 12
              </p>
              <h4 className="  font-medium">Графік роботи:</h4>
              <p>Пн - Пт : 08:00-18:00</p>
              <p className=" mb-4">Cб - Нд : 09:00-15:00</p>
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2661.983445242985!2d26.259705065174927!3d48.14912438354212!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473470fde4487dad%3A0x867d96e0ac92f7fa!2z0LLRg9C70LjRhtGPINCo0YLQtdGE0LDQvdCwINCS0LXQu9C40LrQvtCz0L4sIDEyLCDQk9C10YDRhtCwLCDQp9C10YDQvdGW0LLQtdGG0YzQutCwINC-0LHQu9Cw0YHRgtGMLCA2MDUwMA!5e0!3m2!1suk!2sua!4v1707399912138!5m2!1suk!2sua"
              width="750"
              height="450"
              style={{ border: 0, borderRadius: '10px' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </li>
      </ul>
    </section>
  ) : (
    <section id="contacts" className="container mx-auto mt-5 px-5 pb-5">
      <h1 className="mb-5 text-center text-3xl">Контакти</h1>

      <ul className="min-h-36 mx-auto mb-5 w-fit rounded-2xl bg-[#f6f6f663] p-4 text-xl text-blue-600 shadow">
        <li>
          <Link className=" hover:text-orangeLight" href="tel:+380988392107">
            +380 98-83-92-107
          </Link>
        </li>
        <li>
          <Link className=" hover:text-orangeLight" href="tel:+380964123628">
            +380 96-41-23-628
          </Link>
        </li>
        <li>
          <Link
            href="mailto:ingco-service@ukr.net"
            className=" hover:text-orangeLight"
          >
            ingco-service@ukr.net
          </Link>
        </li>
        <li className="order-last col-span-2 mt-2 justify-self-center lg:order-none lg:col-span-1">
          <div className="flex justify-center gap-2">
            {socialArray.map((social) => (
              <Link
                href={social.url}
                key={social.name}
                target="_blank noopener noreferrer"
              >
                <Icon
                  icon={social.name}
                  className="stroke h-8 w-8 transform border-white transition-all duration-300 hover:scale-[1.5] hover:stroke-slate-300"
                />
              </Link>
            ))}
          </div>
        </li>
      </ul>
      <h2 className="mb-5 text-center text-3xl">
        Фізичні відділення для самовивозу
      </h2>
      <ul>
        <li className="mb-5 flex flex-col gap-5">
          <h3 className="text-center text-lg font-medium">
            Вижницьке відділення
          </h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7514.468614024328!2d25.189777230029815!3d48.24963453112661!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4736bf9f6f5625a5%3A0xec669a8aaba990f7!2sINGCO!5e0!3m2!1suk!2sua!4v1707914989505!5m2!1suk!2sua"
            width="100%"
            className="h-[250px] rounded-xl border-0 sm:h-[300px] md:h-[350px] lg:h-[400px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          <div className="flex flex-wrap gap-16 gap-y-2">
            <div className="text-sm">
              <h4 className="text-base font-medium">Адрес:</h4>
              <p className=" mb-4 w-[150px]">
                м. Вижниця, Чернівецька обл. Вул. Українська 100/2
              </p>
            </div>
            <div className="text-sm">
              <h4 className="text-base  font-medium">Графік роботи:</h4>
              <p>Пн - Пт : 08:00-18:00</p>
              <p className=" mb-4">Cб - Нд : 09:00-15:00</p>
            </div>
          </div>
        </li>
        <li className="flex flex-col gap-5">
          <h3 className="text-center text-lg font-medium">
            Герцаївське відділення
          </h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2661.9275638890117!2d26.259819168978858!3d48.15020170227361!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473470fde4487dad%3A0x867d96e0ac92f7fa!2z0LLRg9C70LjRhtGPINCo0YLQtdGE0LDQvdCwINCS0LXQu9C40LrQvtCz0L4sIDEyLCDQk9C10YDRhtCwLCDQp9C10YDQvdGW0LLQtdGG0YzQutCwINC-0LHQu9Cw0YHRgtGMLCA2MDUwMA!5e0!3m2!1suk!2sua!4v1707915188970!5m2!1suk!2sua"
            width="100%"
            className="h-[250px] rounded-xl border-0 sm:h-[300px] md:h-[350px] lg:h-[400px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          <div className="flex flex-wrap gap-16 gap-y-2 ">
            <div className="text-sm">
              <h4 className="text-base font-medium">Адрес:</h4>
              <p className=" mb-4 w-[150px]">
                м. Герца, Чернівецька обл. Вул. Штефана Великого 12
              </p>
            </div>
            <div className="text-sm">
              <h4 className="text-base font-medium">Графік роботи:</h4>
              <p>Пн - Пт : 08:00-18:00</p>
              <p className=" mb-4">Cб - Нд : 09:00-15:00</p>
            </div>
          </div>
        </li>
      </ul>
    </section>
  );
};

export default Page;
