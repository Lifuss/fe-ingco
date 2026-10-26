import Icon from '@/app/ui/assets/Icon';
import Link from 'next/link';
import React from 'react';
import { CONTACTS, SOCIAL_LINKS } from '@/lib/constants';

interface BranchLocation {
  id: string;
  title: string;
  address: string;
  schedule: string[];
  mapSrc: string;
}

const socialChannels = [
  {
    name: 'telegram',
    url: SOCIAL_LINKS.TELEGRAM,
  },
  {
    name: 'viber',
    url: SOCIAL_LINKS.VIBER,
  },
];

const BRANCHES: BranchLocation[] = [
  {
    id: 'vyzhnytsia',
    title: 'Вижницьке відділення',
    address: 'м. Вижниця, Чернівецька обл. Вул. Українська 100/2',
    schedule: CONTACTS.WORKING_HOURS,
    mapSrc:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1116.994512468906!2d25.19615325692938!3d48.25137099752174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4736bf9f6f5625a5%3A0xec669a8aaba990f7!2sINGCO!5e0!3m2!1suk!2sua!4v1707399697985!5m2!1suk!2sua',
  },
  {
    id: 'hertsa',
    title: 'Герцаївське відділення',
    address: 'м. Герца, Чернівецька обл. Вул. Штефана Великого 12',
    schedule: CONTACTS.WORKING_HOURS,
    mapSrc:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2661.983445242985!2d26.259705065174927!3d48.14912438354212!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473470fde4487dad%3A0x867d96e0ac92f7fa!2z0LLRg9C70LjRhtGPINCo0YLQtdGE0LDQvdCwINCS0LXQu9C40LrQvtCz0L4sIDEyLCDQk9C10YDRhtCwLCDQp9C10YDQvdGW0LLQtdGG0YzQutCwINC-0LHQu9Cw0YHRgtGMLCA2MDUwMA!5e0!3m2!1suk!2sua!4v1707399912138!5m2!1suk!2sua',
  },
];

const ContactsClient = () => {
  return (
    <section
      id="contacts"
      className="mx-auto w-full max-w-[1280px] px-5 pt-8 pb-12 sm:px-8 sm:pt-12 sm:pb-16 md:px-[30px] md:pt-20 md:pb-20"
    >
      <h1 className="mb-5 text-center text-3xl md:text-4xl">Контакти</h1>

      <ul className="bg-card-tint mx-auto mb-8 min-h-36 w-fit rounded-2xl p-4 text-xl text-blue-600 shadow">
        {CONTACTS.PHONES.map((phone) => (
          <li key={phone.href}>
            <Link className="hover:text-orange-light" href={phone.href}>
              {phone.label}
            </Link>
          </li>
        ))}
        <li>
          <Link href={`mailto:${CONTACTS.EMAIL}`} className="hover:text-orange-light">
            {CONTACTS.EMAIL}
          </Link>
        </li>
        <li className="order-last col-span-2 mt-2 justify-self-center lg:order-none lg:col-span-1">
          <div className="flex justify-center gap-2">
            {socialChannels.map((social) => (
              <Link href={social.url} key={social.name} target="_blank" rel="noopener noreferrer">
                <Icon
                  icon={social.name}
                  className="stroke h-8 w-8 transform border-white transition-all duration-300 hover:scale-[1.5] hover:stroke-slate-300"
                />
              </Link>
            ))}
          </div>
        </li>
      </ul>

      <h2 className="mb-8 text-center text-2xl md:text-3xl">Фізичні відділення для самовивозу</h2>
      <ul className="flex flex-col gap-12 md:gap-16">
        {BRANCHES.map((branch) => (
          <li key={branch.id} className="flex flex-col gap-5">
            <h3 className="text-center text-xl font-medium md:text-2xl">{branch.title}</h3>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-center lg:gap-8">
              <div className="text-base sm:text-lg lg:w-[260px] lg:shrink-0">
                <h4 className="font-medium">Адреса:</h4>
                <p className="mb-4">{branch.address}</p>
                <h4 className="font-medium">Графік роботи:</h4>
                {branch.schedule.map((hours) => (
                  <p key={hours}>{hours}</p>
                ))}
              </div>
              <iframe
                src={branch.mapSrc}
                title={branch.title}
                className="h-[250px] w-full rounded-xl border-0 sm:h-[320px] md:h-[380px] lg:h-[450px] lg:w-[750px] lg:shrink-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ContactsClient;
