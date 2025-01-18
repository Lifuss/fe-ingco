import { Row } from 'react-table';

export interface Category {
  _id: string;
  name: string;
  renderSort: number;
  count: number;
}

export interface Product {
  _id: string;
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
  _id: string;
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
  orders: [
    { _id: string; orderCode: string; status: string; totalPrice: number },
  ];
  cart: {}[];
  favorites: string[];
  token: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  password?: string;
  resetToken?: string;
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
    _id: string;
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
  _id: string;
  orderCode: string;
  user: UserWithoutAuth | UserWithAuth;
  products: {
    product: {
      _id: string;
      name: string;
    };
    quantity: number;
    price: number;
    totalPriceByOneProduct: number;
    _id: string;
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

export interface CustomRow extends Row {
  original: { _id: string; product: Product };
  values: {
    nameCol: string;
    photoCol: string;
    favoriteCol: boolean;
    priceCol: number;
    rrcCol: number;
    availableCol: boolean;
    _id: string;
    priceUahCol: number;
    product: Product;
  };
}

export interface SupportTicket {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  isAnswered: boolean;
  updatedAt: Date;
  createdAt: Date;
  ticketNumber: number;
}
