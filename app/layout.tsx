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
    name: 'INGCO',
    url: 'https://ingco-service.win',
    logo: 'https://ingco-service.win/logo.png',
    telephone: '+380988392107',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+380988392107',
        contactType: 'customer service',
        areaServed: 'UA',
        availableLanguage: 'Ukrainian',
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
    sameAs: [
      'https://www.facebook.com/people/INGCO/61556075234289/',
      'https://t.me/+IePpWvT99J02NTJi',
      'https://www.tiktok.com/@free107w?_t=8nY92g7z3Rd&_r=1',
      'https://invite.viber.com/?g=KiAyrPV8FlMrhU2pjsAWT-r7V3jGwmv6',
    ],
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
