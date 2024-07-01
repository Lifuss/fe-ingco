import SwitchAuthButtons from '../../ui/switchAuthButtons';
import B2BRegisterForm from '../../ui/forms/register-form';

export default function LoginPage() {
  return (
    <main className="flex items-start justify-center py-10 md:min-h-screen">
      <div className="relative mx-auto flex w-full max-w-[450px] flex-col ">
        <SwitchAuthButtons />
        <B2BRegisterForm />
      </div>
    </main>
  );
}
