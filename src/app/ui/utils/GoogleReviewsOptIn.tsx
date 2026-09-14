'use client';

import { useEffect, useRef } from 'react';

interface ProductGtin {
  gtin?: string | null;
}

interface GoogleReviewsOptInProps {
  orderId: string | number;
  email: string;
  deliveryCountry?: string;
  estimatedDeliveryDays?: number;
  products?: ProductGtin[];
}

declare global {
  interface Window {
    renderOptIn?: () => void;
    gapi?: {
      load: (api: string, callback: () => void) => void;
      surveyoptin?: {
        render: (config: {
          merchant_id: number;
          order_id: string;
          email: string;
          delivery_country: string;
          estimated_delivery_date: string;
          opt_in_style?: string;
          products?: Array<{ gtin: string }>;
        }) => void;
      };
    };
  }
}

const DEFAULT_MERCHANT_ID = 662417805;
const SCRIPT_ID = 'google-customer-reviews-script';

export default function GoogleReviewsOptIn({
  orderId,
  email,
  deliveryCountry = 'UA',
  estimatedDeliveryDays = 4,
  products = [],
}: GoogleReviewsOptInProps) {
  const renderedRef = useRef(false);

  useEffect(() => {
    if (renderedRef.current) return;
    if (!email || !orderId) return;

    renderedRef.current = true;

    // Calculate delivery date (+4 calendar days buffer)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + estimatedDeliveryDays);
    const yyyy = targetDate.getFullYear();
    const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
    const dd = String(targetDate.getDate()).padStart(2, '0');
    const estimatedDeliveryDate = `${yyyy}-${mm}-${dd}`;

    const merchantId = Number(process.env.NEXT_PUBLIC_GOOGLE_MERCHANT_ID) || DEFAULT_MERCHANT_ID;

    // Filter valid GTINs/barcodes
    const validGtins: Array<{ gtin: string }> = products
      .map((p) => p.gtin?.trim())
      .filter((gtin): gtin is string => Boolean(gtin && gtin.length > 0))
      .map((gtin) => ({ gtin }));

    const triggerRender = () => {
      if (!window.gapi) return;
      window.gapi.load('surveyoptin', () => {
        try {
          window.gapi?.surveyoptin?.render({
            merchant_id: merchantId,
            order_id: String(orderId),
            email,
            delivery_country: deliveryCountry,
            estimated_delivery_date: estimatedDeliveryDate,
            opt_in_style: 'CENTER_DIALOG',
            ...(validGtins.length > 0 ? { products: validGtins } : {}),
          });
        } catch (err) {
          console.error('[GoogleReviewsOptIn] Render error:', err);
        }
      });
    };

    // If script already loaded and gapi ready
    if (window.gapi) {
      triggerRender();
      return;
    }

    // Set callback for Google platform script
    window.renderOptIn = () => {
      triggerRender();
    };

    // Load platform.js if not yet present
    let scriptEl = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = SCRIPT_ID;
      scriptEl.src = 'https://apis.google.com/js/platform.js?onload=renderOptIn';
      scriptEl.async = true;
      scriptEl.defer = true;
      document.body.appendChild(scriptEl);
    }
  }, [orderId, email, deliveryCountry, estimatedDeliveryDays, products]);

  return null;
}
