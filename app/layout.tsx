import '@/app/ui/global.css';
import { Metadata } from 'next';
import StoreProvider from './service/StoreProvider';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: {
    template: '%s | INGCO',
    default: 'INGCO',
  },
  description: 'INGCO бренд професійних та напівпрофесійних інструментів.',
  keywords: [
    'INGCO',
    'магазин',
    'оптова торгівля',
    'гуртова торгівля',
    'дропшипінг',
    'роздрібна торгівля',
    'гуртом',
    'hardware tools',
    'професійні інструменти',
    'ремонтні інструменти',
    'будівельне обладнання',
    'інструменти для будівництва',
    'інструменти для ремонту',
    'електроінструменти',
  ],
  openGraph: {
    siteName: 'Імпортер професійних інструментів ingco-service',
    title: 'INGCO - Професійні інструменти',
    description: 'INGCO бренд професійних та напівпрофесійних інструментів.',
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
    title: 'INGCO - Професійні інструменти',
    description: 'INGCO бренд професійних та напівпрофесійних інструментів.',
    images: [
      {
        url: '/site-card.webp',
        alt: 'Site Card',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <head>
        <meta
          name="google-site-verification"
          content="yd6FgNFGbN9s2OJB1udZrzSxHIqSYY8f5JZ_r0-qLLI"
        />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
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
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
