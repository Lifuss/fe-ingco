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
  priceBulk: number;
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
  orders: string[];
  cart: {}[];
  favorites: string[];
  token: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  orderCode: string;
  user: {
    login: string;
    userId: string;
  };
  products: {
    product: {
      _id: string;
      name: string;
    };
    quantity: number;
    totalPriceByOneProduct: number;
    _id: string;
  }[];
  totalPrice: number;
  status: string;
  isPaid: boolean;
  comment: string;
  createdAt: string;
  updatedAt: string;
  declarationNumber: string;
}
export interface CurrencyRates {
  lastUpdate: string;
  USD: number;
  EUR: number;
}
