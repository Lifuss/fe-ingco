import { Order, Product, Category, User } from './types';
import { apiIngco } from './appState/user/operation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RawProduct extends Omit<
  Product,
  | 'price'
  | 'priceBulk'
  | 'rrcSale'
  | 'enterPrice'
  | 'priceRetailRecommendation'
  | 'warranty'
  | 'sort'
  | 'countInStock'
  | 'category'
  | 'badges'
> {
  price: string | number;
  priceBulk?: string | number | null;
  rrcSale?: string | number | null;
  enterPrice?: string | number | null;
  priceRetailRecommendation: string | number;
  warranty: string | number;
  sort: string | number;
  countInStock: string | number;
  category?: Category | null;
  badges?: { id: string | number; name: string; backgroundColor?: string; textColor?: string }[];
}

// Prisma serializes Decimal fields as strings. This converts them back to numbers.
export function normalizeProduct(p: unknown): Product {
  if (!p || typeof p !== 'object') return p as Product;
  const raw = p as RawProduct;
  const priceNum = raw.price != null && !isNaN(Number(raw.price)) ? Number(raw.price) : 0;
  const rrcNum =
    raw.priceRetailRecommendation != null && !isNaN(Number(raw.priceRetailRecommendation))
      ? Number(raw.priceRetailRecommendation)
      : 0;

  return {
    ...raw,
    category: raw.mainCategory || raw.category || null,
    price: priceNum,
    priceBulk:
      raw.priceBulk != null && !isNaN(Number(raw.priceBulk)) ? Number(raw.priceBulk) : undefined,
    rrcSale: raw.rrcSale != null && !isNaN(Number(raw.rrcSale)) ? Number(raw.rrcSale) : undefined,
    enterPrice:
      raw.enterPrice != null && !isNaN(Number(raw.enterPrice)) ? Number(raw.enterPrice) : undefined,
    priceRetailRecommendation: rrcNum,
    warranty: Number(raw.warranty || 0),
    sort: Number(raw.sort || 0),
    countInStock: Number(raw.countInStock || 0),
    badges: raw.badges
      ? raw.badges.map((b) => ({
          id: Number(b.id),
          name: b.name,
          backgroundColor: b.backgroundColor || '#000000',
          textColor: b.textColor || '#ffffff',
        }))
      : [],
  } as Product;
}

export function isProductOnSale(
  product?: Pick<Product, 'rrcSale' | 'priceRetailRecommendation'> | null,
): boolean {
  if (!product || !product.rrcSale) return false;
  return product.rrcSale > 0 && product.rrcSale < product.priceRetailRecommendation;
}

export function getEffectiveRetailPrice(
  product: Pick<Product, 'rrcSale' | 'priceRetailRecommendation'>,
): number {
  return isProductOnSale(product) ? (product.rrcSale as number) : product.priceRetailRecommendation;
}

interface RawOrderItem {
  id: number;
  quantity: number;
  unitPrice: string | number;
  totalPrice: string | number;
  productId: number;
  productName?: string | null;
  product?: { name?: string | null } | null;
  priceUsd?: string | number | null;
  priceUah?: string | number | null;
  priceRrc?: string | number | null;
}

interface RawOrder extends Omit<Order, 'products' | 'totalPrice' | 'usdRate'> {
  totalPrice: string | number;
  items?: RawOrderItem[] | null;
  usdRate?: string | number | null;
}

export function normalizeOrder(order: unknown): Order {
  if (!order) return order as Order;
  const raw = order as RawOrder;
  return {
    ...raw,
    orderCode: String(raw.orderCode),
    totalPrice: Number(raw.totalPrice),
    usdRate: raw.usdRate ? Number(raw.usdRate) : undefined,
    products: (raw.items || []).map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: Number(item.unitPrice),
      totalPriceByOneProduct: Number(item.totalPrice),
      priceUsd: item.priceUsd ? Number(item.priceUsd) : undefined,
      priceUah: item.priceUah ? Number(item.priceUah) : undefined,
      priceRrc: item.priceRrc ? Number(item.priceRrc) : undefined,
      product: {
        id: item.productId,
        name:
          item.productName ||
          (item.product && item.product.name) ||
          'Продукт застарів та видалений з бази',
      },
    })),
  } as Order;
}

interface RawUserOrder {
  id: number;
  orderCode: string | number;
  status: string;
  totalPrice: string | number;
}

export type NormalizedUserResult = User & {
  cartRetail?: unknown[];
};

export function normalizeUser(user: unknown): NormalizedUserResult {
  if (!user) return user as NormalizedUserResult;
  const raw = user as Record<string, unknown>;
  const isB2BVal = !!(raw.isB2B || raw.isB2b);
  return {
    ...raw,
    isB2B: isB2BVal,
    isB2b: isB2BVal,
    role: typeof raw.role === 'string' ? raw.role.toLowerCase() : 'user',
    orders: ((raw.orders as RawUserOrder[]) || []).map((o) => ({
      ...o,
      orderCode: String(o.orderCode),
      totalPrice: Number(o.totalPrice),
    })),
  } as unknown as NormalizedUserResult;
}

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};

export const generatePassword = () => {
  const length = 8;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let retVal = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset[Math.floor(Math.random() * n)];
  }
  return retVal;
};

export const printOrderExcel = async (order: Order) => {
  const API_URL = process.env.NEXT_PUBLIC_API;
  try {
    const response = await apiIngco.get(`${API_URL}/api/orders/sheets/${order.id}`, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Order-${order.orderCode}.xlsx`; // Ім'я файлу для завантаження
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Помилка при завантаженні Excel-файлу:', error);
  }
};

export function getYoutubeEmbedUrl(url: string): string {
  if (!url) return '';
  let videoId = '';
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname === 'youtu.be') {
      videoId = parsedUrl.pathname.slice(1);
    } else if (parsedUrl.pathname.includes('/embed/')) {
      videoId = parsedUrl.pathname.split('/embed/')[1];
    } else {
      videoId = parsedUrl.searchParams.get('v') || '';
    }
  } catch {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
    );
    if (match) videoId = match[1];
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
}

const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'h',
  ґ: 'g',
  д: 'd',
  е: 'e',
  є: 'ye',
  ж: 'zh',
  з: 'z',
  и: 'y',
  і: 'i',
  ї: 'yi',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ь: '',
  ю: 'yu',
  я: 'ya',
  '’': '',
  "'": '',
};

export function slugifyCyrillicToLatin(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .split('')
    .map((char) => CYRILLIC_TO_LATIN[char] ?? char)
    .join('')
    .replace(/[^a-z0-9\s_]/g, '')
    .trim()
    .replace(/\s+/g, '_');
}
