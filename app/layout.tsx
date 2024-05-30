import '@/app/ui/global.css';
import { Metadata } from 'next';
import StoreProvider from './service/StoreProvider';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
