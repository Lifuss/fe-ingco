'use client';

import { useEffect, useRef } from 'react';

interface TurnstileWidgetProps {
  action?: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (error?: string) => void;
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact' | 'flexible';
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        params: {
          sitekey: string;
          action?: string;
          callback?: (token: string) => void;
          'error-callback'?: (error?: string) => void;
          'expired-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact' | 'flexible';
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

const SCRIPT_ID = 'cf-turnstile-script';
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAAEdmvHaNrmb_VnGB';

export default function TurnstileWidget({
  action,
  onVerify,
  onExpire,
  onError,
  className = 'my-2',
  theme = 'light',
  size = 'normal',
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Keep latest callback references without triggering re-render/re-mount of the widget
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onVerifyRef.current = onVerify;
    onExpireRef.current = onExpire;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    let isMounted = true;
    let widgetId: string | null = null;

    const renderWidget = () => {
      if (!containerRef.current || !window.turnstile || !isMounted) return;

      try {
        widgetId = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          action,
          theme,
          size,
          callback: (token: string) => {
            if (isMounted) onVerifyRef.current(token);
          },
          'expired-callback': () => {
            if (isMounted && onExpireRef.current) onExpireRef.current();
          },
          'error-callback': (error?: string) => {
            if (isMounted && onErrorRef.current) onErrorRef.current(error);
          },
        });
      } catch (err) {
        console.error('Failed to render Turnstile widget:', err);
      }
    };

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (window.turnstile) {
      renderWidget();
    } else if (script) {
      script.addEventListener('load', renderWidget);
    } else {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    }

    return () => {
      isMounted = false;
      if (script) {
        script.removeEventListener('load', renderWidget);
      }
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch {
          // ignore
        }
      }
    };
  }, [action, theme, size]);

  return <div ref={containerRef} className={className} />;
}
