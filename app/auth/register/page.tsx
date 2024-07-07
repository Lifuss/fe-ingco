import SwitchRegisterForms from '@/app/ui/SwitchRegisterForms';
import SwitchAuthButtons from '../../ui/SwitchAuthButtons';

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
