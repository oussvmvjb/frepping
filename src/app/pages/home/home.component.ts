import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { ApiProduct, getPrimaryImage, getDiscountPercent, isProductInStock } from '../../models/api-product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  // ── State ────────────────────────────────────────────────────────────────
  featuredProducts: ApiProduct[] = [];
  featuredProduct: ApiProduct | null = null;
  /** Recent products used for "New Arrivals" display (sorted by created_at desc by backend). */
  newArrivals: ApiProduct[] = [];
  categories: Category[] = [];

  isLoadingFeatured = false;
  isLoadingArrivals = false;
  isLoadingCategories = false;
  featuredError: string | null = null;
  arrivalsError: string | null = null;

  // Slider state
  currentSlide = 0;
  sliderInterval: any;

  // Favorites (localStorage, presentation only)
  favorites: { [productId: string]: boolean } = {};

  // Hardcoded static content (not connected to backend — kept as-is)
  collections = [
    { id: 'street-essentials', name: 'Street Essentials', image: 'assets/collections/essentials.jpg', description: 'Core pieces for everyday wear', itemCount: 45, startingPrice: 39.99 },
    { id: 'premium-collection', name: 'Premium Collection', image: 'assets/collections/premium.jpg', description: 'High-end materials and craftsmanship', itemCount: 28, startingPrice: 129.99 },
    { id: 'limited-edition', name: 'Limited Edition', image: 'assets/collections/limited.jpg', description: 'Exclusive drops available for limited time', itemCount: 15, startingPrice: 89.99 }
  ];
  testimonials = [
    { name: 'FRANKLIN', location: 'Los Santos', avatar: 'assets/avatars/franklin.jpg', rating: 5, text: 'The 3D fitting room changed how I shop. No more returns!', product: 'Vinewood Jacket' },
    { name: 'TREVOR', location: 'Sandy Shores', avatar: 'assets/avatars/trevor.jpg', rating: 4, text: 'Best streetwear in the city. Quality is unmatched.', product: 'Desert Cargos' },
    { name: 'MICHAEL', location: 'Rockford Hills', avatar: 'assets/avatars/michael.jpg', rating: 5, text: 'Premium quality meets street style. My go-to shop.', product: 'Executive Hoodie' }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
    this.loadRecentProducts();
    this.loadCategories();
    this.startSlider();
    this.loadFavorites();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.sliderInterval) clearInterval(this.sliderInterval);
  }

  // ── Data loading ─────────────────────────────────────────────────────────

  loadFeaturedProducts(): void {
    this.isLoadingFeatured = true;
    this.featuredError = null;
    this.productService
      .getFeaturedProducts(6)
      .pipe(takeUntil(this.destroy$), finalize(() => (this.isLoadingFeatured = false)))
      .subscribe({
        next: (res) => {
          this.featuredProducts = res.items;
          this.featuredProduct = res.items[0] ?? null;
        },
        error: (err: Error) => {
          this.featuredError = err.message;
        },
      });
  }

  loadRecentProducts(): void {
    this.isLoadingArrivals = true;
    this.arrivalsError = null;
    this.productService
      .getRecentProducts(4)
      .pipe(takeUntil(this.destroy$), finalize(() => (this.isLoadingArrivals = false)))
      .subscribe({
        next: (res) => {
          this.newArrivals = res.items;
        },
        error: (err: Error) => {
          this.arrivalsError = err.message;
        },
      });
  }

  loadCategories(): void {
    this.isLoadingCategories = true;
    this.categoryService
      .getCategories()
      .pipe(takeUntil(this.destroy$), finalize(() => (this.isLoadingCategories = false)))
      .subscribe({ next: (cats) => (this.categories = cats) });
  }

  // ── Helpers (shared utilities from model) ────────────────────────────────

  getProductImage(product: ApiProduct): string {
    return getPrimaryImage(product) ?? 'assets/placeholder.jpg';
  }

  getDiscountPercent(product: ApiProduct): number {
    return getDiscountPercent(product);
  }

  isInStock(product: ApiProduct): boolean {
    return isProductInStock(product);
  }

  getCategoryName(product: ApiProduct): string {
    return product.category?.name ?? '';
  }

  // ── Navigation ───────────────────────────────────────────────────────────

  goToTryOn(): void { this.router.navigate(['/try-on']); }
  goToShop(): void { this.router.navigate(['/shop']); }
  goToProduct(productId: string): void { this.router.navigate(['/product', productId]); }
  goToTutorial(): void { this.router.navigate(['/tutorial']); }

  goToCategory(categoryId: string): void {
    this.router.navigate(['/shop'], { queryParams: { category_id: categoryId } });
  }

  goToCollection(collectionId: string): void {
    this.router.navigate(['/shop'], { queryParams: { collection: collectionId } });
  }

  // ── Cart ─────────────────────────────────────────────────────────────────

  addToCart(product: ApiProduct): void {
    if (!this.isInStock(product)) return;
    // No variant selected from the home page — add with no variant (null)
    this.cartService.addToCart(product, 1, null);
  }

  tryOnProduct(product: ApiProduct): void {
    this.router.navigate(['/try-on'], { queryParams: { productId: product.id } });
  }

  // ── Favorites ────────────────────────────────────────────────────────────

  toggleFavorite(productId: string): void {
    this.favorites[productId] = !this.favorites[productId];
    this.saveFavorites();
  }
  isFavorite(productId: string): boolean { return !!this.favorites[productId]; }
  loadFavorites(): void {
    const saved = localStorage.getItem('home_favorites');
    if (saved) this.favorites = JSON.parse(saved);
  }
  saveFavorites(): void {
    localStorage.setItem('home_favorites', JSON.stringify(this.favorites));
  }

  // ── Slider ───────────────────────────────────────────────────────────────

  startSlider(): void {
    this.sliderInterval = setInterval(() => this.nextSlide(), 5000);
  }
  nextSlide(): void { this.currentSlide = (this.currentSlide + 1) % Math.max(1, this.newArrivals.length); }
  prevSlide(): void { this.currentSlide = this.currentSlide === 0 ? Math.max(0, this.newArrivals.length - 1) : this.currentSlide - 1; }
  goToSlide(index: number): void {
    this.currentSlide = index;
    if (this.sliderInterval) { clearInterval(this.sliderInterval); this.startSlider(); }
  }

  @HostListener('window:resize') onResize(): void {}
}