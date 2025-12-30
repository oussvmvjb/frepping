import { Product } from '../../app/models/product';

export const MOCK_PRODUCTS: Product[] = [
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
    isFeatured: true,
    has3DModel: false,
    discount: 0.24,
    isNew: true
  },
  {
    id: '2',
    name: 'DISTRESSED DENIM',
    description: 'Vintage style distressed jeans with custom rips and fading.',
    price: 89,
    originalPrice: 120,
    category: 'BOTTOMS',
    images: [
      'assets/images/products/pant1.png'
    ],
    sizes: ['28', '30', '32', '34'],
    colors: ['Blue', 'Black'],
    brand: 'FREPPING',
    rating: 4.2,
    reviewCount: 31,
    inStock: true,
    tags: ['jeans', 'vintage', 'distressed'],
    material: '100% Cotton Denim',
    isFeatured: true,
    has3DModel: false,
    discount: 0.26,
    isNew: false
  },
  {
    id: '3',
    name: 'NEON SNEAKERS',
    description: 'High-top sneakers with neon accents and custom glow-in-the-dark details.',
    price: 120,
    originalPrice: 150,
    category: 'SHOES',
    images: [
      'assets/images/products/hoodie2.png'
    ],
    sizes: ['8', '9', '10', '11', '12'],
    colors: ['Black/Green', 'White/Orange'],
    brand: 'FREPPING',
    rating: 4.8,
    reviewCount: 56,
    inStock: true,
    tags: ['sneakers', 'high-top', 'glow'],
    material: 'Leather/Synthetic',
    isFeatured: true,
    has3DModel: false,
    discount: 0.20,
    isNew: true
  },
  {
    id: '4',
    name: 'GIRL\'S GRAPHIC TEE',
    description: 'Stylish graphic t-shirt with modern design and comfortable fit.',
    price: 45,
    originalPrice: 60,
    category: 'TOPS',
    images: [
      'assets/images/products/tshert1.png' // Changed to regular image
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['White', 'Pink', 'Black'],
    brand: 'FREPPING',
    rating: 4.6,
    reviewCount: 28,
    inStock: true,
    tags: ['tshirt', 'graphic', 'casual', 'girls'],
    material: '100% Cotton',
    isFeatured: true,
    has3DModel: false,
    discount: 0.25,
    isNew: false
  },
  {
    id: '5',
    name: 'STREETWEAR CARGO PANTS',
    description: 'Urban cargo pants with multiple pockets and tactical design.',
    price: 79,
    originalPrice: 99,
    category: 'BOTTOMS',
    images: [
      'assets/3dmodel/uploads_files_4988185_黑色拼接宽松卫衣_obj/黑色拼接宽松卫衣_obj.obj', // 3D model
      'assets/images/products/pants1.png' // Fallback image
    ],
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Black', 'Olive Green', 'Gray'],
    brand: 'FREPPING',
    rating: 4.7,
    reviewCount: 89,
    inStock: true,
    tags: ['pants', 'cargo', 'streetwear', 'tactical'],
    material: '100% Cotton Twill',
    isFeatured: true,
    has3DModel: true,
    discount: 0.20,
    isNew: true
  },
  {
    id: '6',
    name: '3D HOODIE',
    description: 'Modern hoodie with 3D model preview available.',
    price: 75,
    originalPrice: 95,
    category: 'TOPS',
    images: [
      'assets/3dmodel/tshert_girl.obj', 
      'assets/images/products/hoodie1.png'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Gray', 'Navy'],
    brand: 'FREPPING',
    rating: 4.9,
    reviewCount: 63,
    inStock: true,
    tags: ['hoodie', '3d', 'modern', 'streetwear'],
    material: '80% Cotton, 20% Polyester',
    isFeatured: true,
    has3DModel: true,
    discount: 0.21,
    isNew: false
  },
  {
    id: '7',
    name: 'DESIGNER JACKET',
    description: 'Premium designer jacket with custom details.',
    price: 145,
    originalPrice: 180,
    category: 'OUTERWEAR',
    images: [
      'assets/3dmodel/uploads_files_5109932_米白印花卫衣/米白印花卫衣.obj',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Brown', 'Green'],
    brand: 'FREPPING',
    rating: 4.8,
    reviewCount: 47,
    inStock: true,
    tags: ['jacket', 'designer', 'premium'],
    material: 'Leather/Cotton Blend',
    isFeatured: true,
    has3DModel: false,
    discount: 0.19,
    isNew: false
  },
  {
    id: '8',
    name: 'RUNNING SHOES',
    description: 'High-performance running shoes with comfort technology.',
    price: 110,
    originalPrice: 140,
    category: 'SHOES',
    images: [
      'assets/images/products/shumis1.png'
    ],
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Black/White', 'Blue/White', 'Red/Black'],
    brand: 'FREPPING',
    rating: 4.6,
    reviewCount: 72,
    inStock: true,
    tags: ['shoes', 'running', 'sports'],
    material: 'Mesh/Synthetic',
    isFeatured: true,
    has3DModel: false,
    discount: 0.21,
    isNew: true
  }
];

export const CATEGORIES = [
  { id: '1', name: 'TOPS', icon: 'fas fa-tshirt' },
  { id: '2', name: 'BOTTOMS', icon: 'fas fa-vest' },
  { id: '3', name: 'SHOES', icon: 'fas fa-shoe-prints' },
  { id: '4', name: 'ACCESSORIES', icon: 'fas fa-gem' },
  { id: '5', name: 'OUTERWEAR', icon: 'fas fa-jacket' },
  { id: '6', name: 'ALL', icon: 'fas fa-store' }
];