import SwitchAuthButtons from '@/app/ui/buttons/SwitchAuthButtons';
import SwitchRegisterForms from '@/app/ui/buttons/SwitchRegisterForms';

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
