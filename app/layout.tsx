import '@/app/ui/global.css';
import { Metadata } from 'next';
import Footer from './ui/Footer';
import StoreProvider from './service/StoreProvider';
import Header from './ui/home/Header';

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
          <Header />
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
