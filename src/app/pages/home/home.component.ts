import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { ApiProduct, getPrimaryImage, getDiscountPercent, isProductInStock } from '../../models/api-product.model';
import { Category } from '../../models/category.model';
import { FlexCarouselItem } from '../../components/flex-carousel/flex-carousel.component';

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
  /** Memoized gallery items – computed once when categories load. */
  categoryGalleryItems: { id: string; src: string; alt: string; label: string }[] = [];

  isLoadingFeatured = false;
  isLoadingArrivals = false;
  isLoadingCategories = false;
  featuredError: string | null = null;
  arrivalsError: string | null = null;

  // Slider state (REMOVED – FlexCarousel manages this internally)
  // currentSlide / sliderInterval removed

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
    this.loadFavorites();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
      .getRecentProducts(8)
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
      .subscribe({
        next: (cats) => {
          this.categories = cats;
          this.categoryGalleryItems = cats.map((c) => ({
            id: c.id,
            src: c.image_url || this.makeCategoryPlaceholder(c.name),
            alt: c.name,
            label: c.name,
          }));
        }
      });
  }

  private makeCategoryPlaceholder(name: string): string {
    const initials = name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('');
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='150' viewBox='0 0 120 150'>` +
      `<rect width='120' height='150' fill='#1a1a1a'/>` +
      `<text x='60' y='70' font-family='sans-serif' font-size='28' fill='#39ff14' font-weight='bold' text-anchor='middle' dominant-baseline='middle'>${initials}</text>` +
      `<text x='60' y='105' font-family='sans-serif' font-size='10' fill='#888888' text-anchor='middle' letter-spacing='2'>${name.toUpperCase().slice(0, 12)}</text>` +
      `</svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
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

  // ── FlexCarousel helpers ──────────────────────────────────────────────────

  getCarouselItems(): FlexCarouselItem[] {
    return this.newArrivals.map(p => ({
      src: this.getProductImage(p),
      alt: p.name,
      title: p.name,
      subtitle: this.getCategoryName(p) + (p.material ? ' · ' + p.material : ''),
      productId: p.id,
      price: (+p.price).toFixed(2),
      category: this.getCategoryName(p),
    }));
  }

  onCarouselItemClick(event: { index: number; item: FlexCarouselItem }): void {
    const item = event.item as any;
    if (item._addToCart) {
      // ADD TO CART action from carousel action bar
      const product = this.newArrivals[event.index];
      if (product) this.addToCart(product);
    } else {
      // QUICK VIEW — navigate to product
      if (event.item.productId) this.goToProduct(event.item.productId);
    }
  }

  // ── Slider (REMOVED — FlexCarousel is self-contained) ────────────────────
  // startSlider / nextSlide / prevSlide / goToSlide removed

  @HostListener('window:resize') onResize(): void {}
}