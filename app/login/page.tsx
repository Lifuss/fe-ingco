import LoginForm from '@/app/ui/login-form';
import SwitchAuthButtons from '../ui/switchAuthButtons';

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
