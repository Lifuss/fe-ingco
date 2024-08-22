'use client';

import { useRouter } from 'next/navigation';
import { Button } from './buttons/button';

const ToBackButton = () => {
  const router = useRouter();
  return (
    <div className="absolute left-10 top-10">
      <Button className="text-white" onClick={() => router.back()}>
        Назад
      </Button>
    </div>
  );
};

export default ToBackButton;
