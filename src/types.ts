export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  reportUrl?: string;
  sourceLab?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  proteinPerServing?: number;
  servings: number;
  description: string;
  bestPrice: number;
  originalPrice: number;
  bestStore: string;
  officialPrice?: number;
  amazonPrice?: number;
  healthkartPrice?: number;
  officialUrl?: string;
  amazonUrl?: string;
  healthkartUrl?: string;
  discountBadge?: string;
  flavor?: string;
  weight?: string;
}

export interface StorePrice {
  storeId: string;
  storeName: string;
  logo: string;
  price: number;
  originalPrice: number;
  affiliateUrl: string;
  shipping: string;
  inStock: boolean;
}

export interface Deal {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  image: string;
  discountPercent: number;
  currentPrice: number;
  originalPrice: number;
  type: 'HOT' | 'PRICE_DROP' | 'BEST_VALUE' | 'LIMITED';
  expiresAt?: string;
}
