import { Product } from '../../app/models/product';

export const MOCK_PRODUCTS: Product[] = [
  // Update your mock products in shop.component.ts or mock-products.ts


  {
    id: '1',
    name: 'GREEN CAMO HOODIE',
    description: 'Urban camouflage hoodie with street style.',
    price: 65,
    originalPrice: 85,
    category: 'TOPS',
    images: [
      'assets/images/products/hoodie1.png'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Green', 'Black'],
    brand: 'FREPPING',
    rating: 4.5,
    reviewCount: 42,
    inStock: true,
    tags: ['streetwear', 'hoodie', 'camo'],
    material: '80% Cotton, 20% Polyester',
    isFeatured: true
  },
  {
    id: '2',
    name: 'DISTRESSED DENIM',
    description: 'Vintage style distressed jeans with custom rips and fading.',
    price: 89,
    originalPrice: 120,
    category: 'BOTTOMS',
    images: [
      'assets/images/products/pants1.png'
    ],
    sizes: ['28', '30', '32', '34'],
    colors: ['Blue', 'Black'],
    brand: 'FREPPING',
    rating: 4.2,
    reviewCount: 31,
    inStock: true,
    tags: ['jeans', 'vintage', 'distressed'],
    material: '100% Cotton Denim',
    isFeatured: true
  },
  {
    id: '3',
    name: 'NEON SNEAKERS',
    description: 'High-top sneakers with neon accents and custom glow-in-the-dark details.',
    price: 120,
    originalPrice: 150,
    category: 'SHOES',
    images: [
      'assets/images/products/hoody1.png'
    ],
    sizes: ['8', '9', '10', '11', '12'],
    colors: ['Black/Green', 'White/Orange'],
    brand: 'FREPPING',
    rating: 4.8,
    reviewCount: 56,
    inStock: true,
    tags: ['sneakers', 'high-top', 'glow'],
    material: 'Leather/Synthetic',
    isFeatured: true
  },
  {
    id: '4',
    name: 'GIRL\'S GRAPHIC TEE',
    description: 'Stylish graphic t-shirt with modern design and comfortable fit.',
    price: 45,
    originalPrice: 60,
    category: 'TOPS',
    images: [
      'assets/3dmodel/tshert_girl.obj'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['White', 'Pink', 'Black'],
    brand: 'FREPPING',
    rating: 4.6,
    reviewCount: 28,
    inStock: true,
    tags: ['tshirt', 'graphic', 'casual', 'girls'],
    material: '100% Cotton',
    isFeatured: true
  }
  // ... add more products with image URLs
];


export const CATEGORIES = [
  { id: '1', name: 'TOPS', icon: 'fas fa-tshirt' },
  { id: '2', name: 'BOTTOMS', icon: 'fas fa-vest' },
  { id: '3', name: 'SHOES', icon: 'fas fa-shoe-prints' },
  { id: '4', name: 'ACCESSORIES', icon: 'fas fa-gem' },
  { id: '5', name: 'OUTERWEAR', icon: 'fas fa-jacket' },
  { id: '6', name: 'ALL', icon: 'fas fa-store' }
];