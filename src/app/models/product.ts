export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  brand: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  tags: string[];
  material: string;
  isFeatured: boolean;
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}