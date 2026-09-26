import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';

const locations = [
  {
    city: 'м. Вижниця',
    region: 'Чернівецька обл.',
    address: 'вул. Українська 100/2',
    phone: '+380 98-83-92-107',
    scheduleWeekdays: '08:00 – 18:00',
    scheduleWeekend: '09:00 – 15:00',
    mapsUrl: 'https://maps.app.goo.gl/w4bZJT2iJ7X87DT96',
  },
  {
    city: 'м. Герца',
    region: 'Чернівецька обл.',
    address: 'вул. Штефана Великого 12',
    phone: '+380 96-41-23-628',
    scheduleWeekdays: '08:00 – 18:00',
    scheduleWeekend: '09:00 – 15:00',
    mapsUrl: 'https://maps.google.com/?q=Герца+вул.+Штефана+Великого+12',
  },
];

const AboutUs = () => {
  return (
    <section
      className="mb-14 px-5 md:mb-20 md:px-[60px]"
      id="aboutUs"
      aria-labelledby="locations-heading"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="mb-8 text-center md:mb-12">
          <span className="text-xs font-bold tracking-wider text-amber-800 uppercase">
            Офлайн присутність
          </span>
          <h2
            id="locations-heading"
            className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl lg:text-4xl"
          >
            Фірмові магазини та точки видачі
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-neutral-600 md:text-base">
            Завітайте до наших фізичних відділень, щоб наживо оглянути інструмент, отримати фахову
            консультацію або забрати замовлення самовивозом
          </p>
        </div>

        {/* Locations Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {locations.map((loc) => (
            <div
              key={loc.city}
              className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs transition-shadow hover:shadow-md md:p-8"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-600">
                    <MapPin size={22} className="shrink-0" />
                    <h3 className="text-xl font-bold text-neutral-900">{loc.city}</h3>
                  </div>
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                    {loc.region}
                  </span>
                </div>

                <p className="mb-6 text-base font-semibold text-neutral-800">{loc.address}</p>

                <div className="mb-6 flex flex-col gap-3 rounded-xl bg-neutral-50 p-4 text-sm">
                  <div className="flex items-start gap-2.5 text-neutral-700">
                    <Clock size={18} className="mt-0.5 shrink-0 text-neutral-400" />
                    <div>
                      <p>
                        <span className="font-medium">Пн – Пт:</span> {loc.scheduleWeekdays}
                      </p>
                      <p>
                        <span className="font-medium">Сб – Нд:</span> {loc.scheduleWeekend}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 text-neutral-700">
                    <Phone size={18} className="shrink-0 text-neutral-400" />
                    <a
                      href={`tel:${loc.phone.replace(/[^\d+]/g, '')}`}
                      className="font-medium text-neutral-900 transition-colors hover:text-amber-600"
                    >
                      {loc.phone}
                    </a>
                  </div>
                </div>
              </div>

              <a
                href={loc.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white py-2.5 text-sm font-semibold text-neutral-800 transition-all hover:border-neutral-400 hover:bg-neutral-50"
              >
                <span>Відкрити на карті</span>
                <ExternalLink size={16} />
              </a>
            </div>
          ))}
        </div>

        {/* Central Contact Banner */}
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:flex-row sm:p-8">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-neutral-900 md:text-lg">
              Маєте питання щодо замовлення чи наявності?
            </h4>
            <p className="text-sm text-neutral-600">
              Наша служба підтримки працює щодня з 08:00 до 18:00
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:ingco-service@ukr.net"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 shadow-xs hover:border-neutral-300"
            >
              <Mail size={16} className="text-amber-500" />
              <span>ingco-service@ukr.net</span>
            </a>
            <Link
              href="/about-us/contacts"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-neutral-900 shadow-xs hover:bg-amber-400"
            >
              Всі контакти
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
