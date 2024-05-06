import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import Footer from './ui/Footer';
import StoreProvider from './StoreProvider';
import HeaderFace from './ui/home/HeaderFace';

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
    <html lang="en">
      <body className={`flex min-h-screen flex-col antialiased`}>
        <StoreProvider>
          <HeaderFace />
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
