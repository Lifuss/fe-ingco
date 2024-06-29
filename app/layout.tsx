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
    'роздрібна торгівля',
    'гуртом',
    'hardware tools',
    'інструменти для будівництва',
    'інструменти для ремонту',
    'електроінтрументи',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className={`flex min-h-screen flex-col antialiased`}>
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
