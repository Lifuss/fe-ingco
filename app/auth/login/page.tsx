import SwitchAuthButtons from '@/app/ui/buttons/SwitchAuthButtons';
import LoginForm from '@/app/ui/forms/login-form';

function LoginPage() {
  return (
    <main className="flex items-start justify-center py-10 md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[450px] flex-col">
        <SwitchAuthButtons />
        <LoginForm />
      </div>
    </main>
  );
}

export default LoginPage;
