import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import Footer from './ui/Footer';
import StoreProvider from './StoreProvider';

export const metadata: Metadata = {
  title: {
    template: '%s | INGCO',
    default: 'INGCO',
  },
  description: 'INGCO is a leading brand in the hardware tools industry.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <html lang="en">
        <body className={`flex min-h-screen flex-col antialiased`}>
          {children}
          <Footer />
        </body>
      </html>
    </StoreProvider>
  );
}
