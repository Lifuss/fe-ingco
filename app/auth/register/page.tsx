import SwitchAuthButtons from '@/app/ui/buttons/SwitchAuthButtons';
import SwitchRegisterForms from '@/app/ui/buttons/SwitchRegisterForms';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Реєстрація',
  description:
    'Створіть акаунт INGCO для доступу до каталогу інструментів та замовлень',
  path: '/auth/register',
  noindex: true,
  nofollow: true,
});

export default function LoginPage() {
  return (
    <main className="flex items-start justify-center py-10 md:min-h-screen">
      <div className="relative mx-auto flex w-full max-w-[450px] flex-col ">
        <SwitchAuthButtons />
        <SwitchRegisterForms />
      </div>
    </main>
  );
}
