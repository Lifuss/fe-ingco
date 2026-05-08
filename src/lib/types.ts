export interface Category {
  id: number;
  name: string;
  renderSort: number;
  count: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  article: string;
  description: string;
  price: number;
  priceBulk?: number;
  rrcSale?: number;
  enterPrice?: number;
  priceRetailRecommendation: number;
  characteristics: { name: string; value: string; _id?: string }[];
  countInStock: number;
  image: string;
  warranty: number;
  sort: number;
  seoKeywords: string;
  barcode?: string;
  category: Category | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  email: string;
  login: string;
  name: string;
  role: string;
  isVerified: boolean;
  firstName: string;
  lastName: string;
  surName: string;
  phone: string;
  edrpou: string;
  orders: [{ id: number; orderCode: string; status: string; totalPrice: number }];
  cart: object[];
  favorites: string[];
  token: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  password?: string;
  resetToken?: string;
  isB2B: boolean;
}

export enum OrderStatusEnum {
  PendingConfirmation = 'очікує підтвердження',
  PendingPayment = 'очікує оплати',
  BeingCompiled = 'комплектується',
  Shipped = 'відправлено',
  OrderCompleted = 'замовлення виконано',
  OrderCancelled = 'замовлення скасовано',
}

export type UserWithoutAuth = {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  surName: string;
};

export type UserWithAuth = {
  login: string;
  userId: {
    id: number;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    surName: string;
    phone: string;
    edrpou: string;
  };
};

export interface Order {
  id: number;
  orderCode: string;
  user: UserWithoutAuth | UserWithAuth;
  products: {
    product: {
      id: number;
      name: string;
    };
    quantity: number;
    price: number;
    totalPriceByOneProduct: number;
    id: number;
  }[];
  totalPrice: number;
  status: OrderStatusEnum;
  isPaid: boolean;
  comment: string;
  createdAt: string;
  updatedAt: string;
  shippingAddress?: string;
  declarationNumber: string;
}
export interface CurrencyRates {
  lastUpdate: string;
  USD: number;
  EUR: number;
}

export interface SupportTicket {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  isAnswered: boolean;
  updatedAt: Date;
  createdAt: Date;
  ticketNumber: number;
}
