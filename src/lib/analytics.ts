'use client';

export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-6418216331';
export const GOOGLE_ADS_CONVERSION_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || '';
export const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_ID || '';

export interface AnalyticsItem {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
  article?: string;
  category?: string;
}

export interface TrackPurchaseParams {
  orderCode: string | number;
  totalPrice: number;
  currency?: string;
  items?: AnalyticsItem[];
  email?: string;
  phone?: string;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Format and normalize Ukrainian or international phone number according to E.164 standard for Google
 */
function normalizePhoneNumber(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, '');
  if (!digits) return '';
  return digits.length === 10 && digits.startsWith('0') ? `+38${digits}` : `+${digits}`;
}

/**
 * Standardize product item format for Google Analytics 4
 */
function toGoogleItem(item: AnalyticsItem) {
  return {
    item_id: String(item.article || item.id),
    item_name: item.name,
    price: Number(item.price),
    quantity: Number(item.quantity) || 1,
    ...(item.category ? { item_category: item.category } : {}),
  };
}

/**
 * Track Google Ads Conversion and GA4 E-commerce Purchase
 */
export function trackPurchase({
  orderCode,
  totalPrice,
  currency = 'UAH',
  items = [],
  email,
  phone,
}: TrackPurchaseParams): void {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  // 1. Enhanced Conversions: send user_data if available
  if (email || phone) {
    const userData: Record<string, string> = {};
    if (email?.trim()) {
      userData.email = email.trim().toLowerCase();
    }
    if (phone?.trim()) {
      const normalized = normalizePhoneNumber(phone.trim());
      if (normalized) userData.phone_number = normalized;
    }
    if (Object.keys(userData).length > 0) {
      window.gtag('set', 'user_data', userData);
    }
  }

  // 2. Google Ads Conversion Event
  const sendTo = GOOGLE_ADS_CONVERSION_LABEL
    ? `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`
    : GOOGLE_ADS_ID;

  window.gtag('event', 'conversion', {
    send_to: sendTo,
    value: Number(totalPrice),
    currency,
    transaction_id: String(orderCode),
  });

  // 3. GA4 E-commerce Purchase Event
  window.gtag('event', 'purchase', {
    transaction_id: String(orderCode),
    value: Number(totalPrice),
    currency,
    items: items.map(toGoogleItem),
  });
}

/**
 * Track Add to Cart event for Google Analytics 4
 */
export function trackAddToCart(item: AnalyticsItem, currency = 'UAH'): void {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', 'add_to_cart', {
    currency,
    value: Number(item.price) * (Number(item.quantity) || 1),
    items: [toGoogleItem(item)],
  });
}
