import '@/app/ui/global.css';
import { Metadata } from 'next';
import StoreProvider from './service/StoreProvider';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: {
    template: '%s | INGCO',
    default: 'INGCO - Професійні інструменти в Україні гуртом та в роздріб',
  },

  description:
    'INGCO – професійні інструменти для будівництва та ремонту. Купуйте якісні електроінструменти гуртом та в роздріб в Україні. Доставка по всій країні!',
  openGraph: {
    siteName: 'Імпортер професійних інструментів ingco-service',
    title: 'INGCO - Інструмент для всього світу',
    description:
      'INGCO - топовий виробник електроінструментів для будівництва та ремонту. Доставка по Україні!',
    url: 'https://ingco-service.win/home',
    images: [
      {
        url: '/site-card.webp',
        alt: 'Site Card',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'INGCO - Інструмент для всього світу',
    description:
      'Замовляйте інструменти INGCO гуртом і в роздріб. Офіційний імпортер в Україні!',
    images: [
      {
        url: '/site-card.webp',
        alt: 'Site Card',
      },
    ],
  },
  alternates: {
    canonical: 'https://ingco-service.win',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://ingco-service.win/#organization',
    name: 'INGCO Ukraine',
    alternateName: 'INGCO',
    url: 'https://ingco-service.win',
    logo: {
      '@type': 'ImageObject',
      url: 'https://ingco-service.win/logo.png',
      width: 200,
      height: 60,
    },
    image: 'https://ingco-service.win/logo.png',
    telephone: '+380988392107',
    email: 'info@ingco-service.win',
    priceRange: '$$',
    paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer'],
    currenciesAccepted: 'UAH',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+380988392107',
        contactType: 'customer service',
        areaServed: 'UA',
        availableLanguage: ['Ukrainian', 'English'],
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '18:00',
        },
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Вул. Українська 100/2',
      addressLocality: 'Вижниця',
      addressRegion: 'Чернівецька обл.',
      postalCode: '59200',
      addressCountry: 'UA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '48.251556',
      longitude: '25.194722',
    },
    openingHours: 'Mo-Fr 08:00-18:00, Sa-Su 09:00-15:00',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'INGCO Tools Catalog',
      itemListElement: [],
    },
    sameAs: [
      'https://www.facebook.com/people/INGCO/61556075234289/',
      'https://t.me/+IePpWvT99J02NTJi',
      'https://www.tiktok.com/@free107w?_t=8nY92g7z3Rd&_r=1',
      'https://invite.viber.com/?g=KiAyrPV8FlMrhU2pjsAWT-r7V3jGwmv6',
    ],
    areaServed: {
      '@type': 'Country',
      name: 'Ukraine',
    },
    serviceArea: {
      '@type': 'Country',
      name: 'Ukraine',
    },
    description:
      'Офіційний імпортер професійних інструментів INGCO в Україні. Електроінструменти для будівництва та ремонту.',
    knowsAbout: [
      'Електроінструменти',
      'Інструменти для будівництва',
      'Професійні інструменти',
      'INGCO',
    ],
    makesOffer: {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Product',
        name: 'Професійні інструменти INGCO',
        category: 'Електроінструменти',
      },
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://ingco-service.win/#website',
    url: 'https://ingco-service.win',
    name: 'INGCO Ukraine',
    description:
      'Офіційний сайт імпортера професійних інструментів INGCO в Україні',
    publisher: {
      '@id': 'https://ingco-service.win/#organization',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate:
          'https://ingco-service.win/retail?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="uk">
      <head>
        <link
          rel="sitemap"
          type="application/xml"
          href="https://ingco-service.win/sitemap.xml"
        ></link>
        <meta
          name="google-site-verification"
          content="yd6FgNFGbN9s2OJB1udZrzSxHIqSYY8f5JZ_r0-qLLI"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaData, null, 2),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema, null, 2),
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <h1 className="hidden">
          INGCO – професійні інструменти для будівництва та ремонту. Купуйте
          якісні електроінструменти гуртом та в роздріб в Україні. Доставка по
          всій країні!
        </h1>
        <StoreProvider>
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
          <SpeedInsights />
          <Analytics />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
