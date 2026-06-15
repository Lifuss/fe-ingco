'use client';

import { refreshTokenThunk } from '@/lib/appState/user/operation';
import { clearAuthState } from '@/lib/appState/user/slice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { redirect, usePathname, useRouter } from 'next/navigation';
import { ComponentType, FC, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function withAuth<T extends object>(Component: ComponentType<T>) {
  const AuthComponent: FC<T> = (props) => {
    const dispatch = useAppDispatch();
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, user, _persist } = useAppSelector(
      (state: any) => state.persistedAuthReducer,
    );
    const rehydrated = _persist?.rehydrated;

    if (typeof window !== 'undefined') {
      const debugInfo = {
        isAuthenticated,
        role: user?.role,
        isVerified: user?.isVerified,
        rehydrated,
        pathname,
        timestamp: new Date().toISOString(),
      };
      const logs = JSON.parse(sessionStorage.getItem('auth_logs') || '[]');
      logs.push(debugInfo);
      sessionStorage.setItem('auth_logs', JSON.stringify(logs));
    }

    useEffect(() => {
      if (!rehydrated) return;

      if (!isAuthenticated) {
        let token: string | null = null;
        try {
          const savedUserString = localStorage.getItem('persist:auth');
          if (savedUserString) {
            const savedUser = JSON.parse(savedUserString);
            if (savedUser?.token) {
              try {
                token = JSON.parse(savedUser.token);
              } catch {
                token = savedUser.token; // Fallback if token is already a plain string
              }
            }
          }
        } catch (e) {
          console.error('Error parsing auth from local storage:', e);
        }

        const logRedirect = (reason: string, extra: any = {}) => {
          if (typeof window !== 'undefined') {
            const logs = JSON.parse(sessionStorage.getItem('auth_logs') || '[]');
            logs.push({
              type: 'REDIRECT_TRIGGER',
              reason,
              pathname,
              timestamp: new Date().toISOString(),
              role: user?.role,
              isAuthenticated,
              isVerified: user?.isVerified,
              ...extra,
            });
            sessionStorage.setItem('auth_logs', JSON.stringify(logs));
          }
        };

        if (token) {
          dispatch(refreshTokenThunk())
            .unwrap()
            .catch(() => {
              logRedirect('refresh_failed');
              dispatch(clearAuthState());
              toast.error('Сесія закінчилися. Будь ласка, увійдіть знову.');
              router.replace('/auth/login');
            });
        } else if (pathname !== '/auth/login' && pathname !== '/auth/register') {
          logRedirect('no_token_redirect_login');
          router.replace('/auth/login');
        }
      }
    }, [dispatch, pathname, router, isAuthenticated, rehydrated]);

    if (!rehydrated) {
      return null;
    }

    if (!isAuthenticated && pathname !== '/auth/login' && pathname !== '/auth/register') {
      return null;
    }

    if (user?.isVerified === false && pathname !== '/auth/login' && pathname !== '/auth/register') {
      if (typeof window !== 'undefined') {
        const logs = JSON.parse(sessionStorage.getItem('auth_logs') || '[]');
        logs.push({
          type: 'REDIRECT_TRIGGER',
          reason: 'is_verified_false',
          pathname,
          timestamp: new Date().toISOString(),
          role: user?.role,
          isAuthenticated,
          isVerified: user?.isVerified,
        });
        sessionStorage.setItem('auth_logs', JSON.stringify(logs));
      }
      toast.info('Ваш статус верифікації, не підтверджений');
      router.replace('/');
      return null;
    }

    // Admin routing
    if (pathname.includes('/dashboard') && user?.role !== 'admin') {
      if (typeof window !== 'undefined') {
        const logs = JSON.parse(sessionStorage.getItem('auth_logs') || '[]');
        logs.push({
          type: 'REDIRECT_TRIGGER',
          reason: 'role_not_admin',
          pathname,
          timestamp: new Date().toISOString(),
          role: user?.role,
          isAuthenticated,
          isVerified: user?.isVerified,
        });
        sessionStorage.setItem('auth_logs', JSON.stringify(logs));
      }
      router.replace('/');
      return null;
    }

    return <Component {...props} />;
  };
  return AuthComponent;
}
