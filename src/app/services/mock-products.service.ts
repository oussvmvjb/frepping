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
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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