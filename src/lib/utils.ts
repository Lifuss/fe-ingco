import { Order, Product, Category, User } from './types';
import { apiIngco } from './appState/user/operation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RawProduct extends Omit<Product, 'price' | 'priceBulk' | 'rrcSale' | 'enterPrice' | 'priceRetailRecommendation' | 'warranty' | 'sort' | 'countInStock' | 'category'> {
  price: string | number;
  priceBulk?: string | number | null;
  rrcSale?: string | number | null;
  enterPrice?: string | number | null;
  priceRetailRecommendation: string | number;
  warranty: string | number;
  sort: string | number;
  countInStock: string | number;
  category?: Category | null;
}

// Prisma serializes Decimal fields as strings. This converts them back to numbers.
export function normalizeProduct(p: unknown): Product {
  const raw = p as RawProduct;
  return {
    ...raw,
    category: raw.mainCategory || raw.category || null,
    price: Number(raw.price),
    priceBulk: raw.priceBulk != null ? Number(raw.priceBulk) : undefined,
    rrcSale: raw.rrcSale != null ? Number(raw.rrcSale) : undefined,
    enterPrice: raw.enterPrice != null ? Number(raw.enterPrice) : undefined,
    priceRetailRecommendation: Number(raw.priceRetailRecommendation),
    warranty: Number(raw.warranty),
    sort: Number(raw.sort),
    countInStock: Number(raw.countInStock),
  } as Product;
}

interface RawOrderItem {
  id: number;
  quantity: number;
  unitPrice: string | number;
  totalPrice: string | number;
  productId: number;
  productName?: string | null;
  product?: { name?: string | null } | null;
}

interface RawOrder extends Omit<Order, 'products' | 'totalPrice'> {
  totalPrice: string | number;
  items?: RawOrderItem[] | null;
}

export function normalizeOrder(order: unknown): Order {
  if (!order) return order as Order;
  const raw = order as RawOrder;
  return {
    ...raw,
    orderCode: String(raw.orderCode),
    totalPrice: Number(raw.totalPrice),
    products: (raw.items || []).map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: Number(item.unitPrice),
      totalPriceByOneProduct: Number(item.totalPrice),
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
  return {
    ...raw,
    role: typeof raw.role === 'string' ? raw.role.toLowerCase() : 'user',
    orders: (((raw.orders as RawUserOrder[]) || [])).map((o) => ({
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
