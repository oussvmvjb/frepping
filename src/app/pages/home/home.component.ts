import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MOCK_PRODUCTS } from '../../services/mock-products.service';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // Products
  allProducts: Product[] = MOCK_PRODUCTS;
  featuredProducts: Product[] = [];
  featuredProduct: Product | null = null;
  newArrivals: Product[] = [];
  
  // Categories
  categories = [
    { id: 'tops', name: 'TOPS', icon: 'fas fa-tshirt', count: 156 },
    { id: 'bottoms', name: 'BOTTOMS', icon: 'fas fa-vest', count: 89 },
    { id: 'shoes', name: 'SHOES', icon: 'fas fa-shoe-prints', count: 72 },
    { id: 'accessories', name: 'ACCESSORIES', icon: 'fas fa-gem', count: 134 },
    { id: 'outerwear', name: 'OUTERWEAR', icon: 'fas fa-jacket', count: 67 },
    { id: 'limited', name: 'LIMITED', icon: 'fas fa-crown', count: 42 }
  ];
  
  // Collections
  collections = [
    {
      id: 'street-essentials',
      name: 'Street Essentials',
      image: 'assets/collections/essentials.jpg',
      description: 'Core pieces for everyday wear',
      itemCount: 45,
      startingPrice: 39.99
    },
    {
      id: 'premium-collection',
      name: 'Premium Collection',
      image: 'assets/collections/premium.jpg',
      description: 'High-end materials and craftsmanship',
      itemCount: 28,
      startingPrice: 129.99
    },
    {
      id: 'limited-edition',
      name: 'Limited Edition',
      image: 'assets/collections/limited.jpg',
      description: 'Exclusive drops available for limited time',
      itemCount: 15,
      startingPrice: 89.99
    }
  ];
  
  // Testimonials
  testimonials = [
    {
      name: 'FRANKLIN',
      location: 'Los Santos',
      avatar: 'assets/avatars/franklin.jpg',
      rating: 5,
      text: 'The 3D fitting room changed how I shop. No more returns!',
      product: 'Vinewood Jacket'
    },
    {
      name: 'TREVOR',
      location: 'Sandy Shores',
      avatar: 'assets/avatars/trevor.jpg',
      rating: 4,
      text: 'Best streetwear in the city. Quality is unmatched.',
      product: 'Desert Cargos'
    },
    {
      name: 'MICHAEL',
      location: 'Rockford Hills',
      avatar: 'assets/avatars/michael.jpg',
      rating: 5,
      text: 'Premium quality meets street style. My go-to shop.',
      product: 'Executive Hoodie'
    }
  ];
  
  // Slider
  currentSlide = 0;
  sliderInterval: any;
  
  // Favorites
  favorites: { [productId: string]: boolean } = {};

  constructor(
    private router: Router,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.startSlider();
    this.loadFavorites();
  }

  ngOnDestroy(): void {
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval);
    }
  }

  loadData(): void {
    // Load featured products
    this.featuredProducts = this.allProducts
      .filter(p => p.isFeatured)
      .slice(0, 6);
    
    if (this.featuredProducts.length > 0) {
      this.featuredProduct = this.featuredProducts[0];
    }
    
    // Load new arrivals
    this.newArrivals = this.allProducts
      .filter(p => p.isNew)
      .slice(0, 4);
    
    // If not enough new arrivals, add regular products
    if (this.newArrivals.length < 4) {
      const additionalProducts = this.allProducts
        .filter(p => !p.isNew)
        .slice(0, 4 - this.newArrivals.length);
      this.newArrivals = [...this.newArrivals, ...additionalProducts];
    }
  }

  // Navigation methods
  goToTryOn(): void {
    this.router.navigate(['/try-on']);
  }

  goToShop(): void {
    this.router.navigate(['/shop']);
  }

  goToProduct(productId: string): void {
    this.router.navigate(['/product', productId]);
  }

  goToCategory(categoryId: string): void {
    this.router.navigate(['/shop'], { 
      queryParams: { category: categoryId.toUpperCase() } 
    });
  }

  goToCollection(collectionId: string): void {
    this.router.navigate(['/shop'], {
      queryParams: { collection: collectionId }
    });
  }

  goToTutorial(): void {
    this.router.navigate(['/tutorial']);
  }

  // Product actions
  addToCart(product: Product): void {
    if (!product.inStock) return;
    this.cartService.addToCart(product);
    console.log('Added to cart:', product.name);
  }

  tryOnProduct(product: Product): void {
    if (!product.inStock) return;
    this.router.navigate(['/try-on'], { 
      queryParams: { productId: product.id } 
    });
  }

  toggleFavorite(productId: string): void {
    this.favorites[productId] = !this.favorites[productId];
    this.saveFavorites();
  }

  isFavorite(productId: string): boolean {
    return !!this.favorites[productId];
  }

  loadFavorites(): void {
    const saved = localStorage.getItem('home_favorites');
    if (saved) {
      this.favorites = JSON.parse(saved);
    }
  }

  saveFavorites(): void {
    localStorage.setItem('home_favorites', JSON.stringify(this.favorites));
  }

  // Helper methods
  getDiscountPercent(product: Product): number {
    if (!product.originalPrice) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  }

  has3DModel(product: Product): boolean {
    if (!product || !product.images || !product.images[0]) return false;
    const src = product.images[0].toLowerCase();
    return src.endsWith('.obj') || src.endsWith('.glb') || src.endsWith('.fbx') || 
           !!(product as any).has3DModel;
  }

  // Slider methods
  startSlider(): void {
    this.sliderInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % 3; // 3 slides
  }

  prevSlide(): void {
    this.currentSlide = this.currentSlide === 0 ? 2 : this.currentSlide - 1;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    // Reset interval
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval);
      this.startSlider();
    }
  }

  // Responsive
  @HostListener('window:resize')
  onResize(): void {
    // Handle responsive adjustments if needed
  }

  // Mock method for new arrivals data
  getNewArrivalData(): any[] {
    return this.newArrivals.map(product => ({
      ...product,
      category: product.category,
      material: product.material || 'Premium Material'
    }));
  }
}