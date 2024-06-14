export interface Category {
  _id: string;
  name: string;
  count: number;
}

export interface Product {
  _id: string;
  name: string;
  article: string;
  description: string;
  price: number;
  priceBulk?: number;
  rrcSale?: number;
  enterPrice?: number;
  priceRetailRecommendation: number;
  countInStock: number;
  image: string;
  category: Category;
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
