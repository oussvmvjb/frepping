import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, finalize, switchMap } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import {
  ApiProduct,
  getPrimaryImage,
  getDiscountPercent,
  isProductInStock,
  ProductQueryParams,
} from '../../models/api-product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit, OnDestroy {
  // ── Products ─────────────────────────────────────────────────────────────
  filteredProducts: ApiProduct[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  // ── Filters ───────────────────────────────────────────────────────────────
  categories: Category[] = [];
  selectedCategoryId: string | null = null;
  sortOptions = ['NEWEST', 'PRICE LOW-HIGH', 'PRICE HIGH-LOW'];
  selectedSort = 'NEWEST';
  searchQuery = '';

  // ── Pagination ────────────────────────────────────────────────────────────
  currentPage = 1;
  pageSize = 20;
  totalProducts = 0;
  totalPages = 0;

  // ── UI ────────────────────────────────────────────────────────────────────
  gridSize: 'small' | 'medium' | 'large' = 'medium';
  favorites: { [id: string]: boolean } = {};

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    // Debounced search → backend
    this.searchSubject
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentPage = 1;
        this.fetchProducts();
      });

    // Read query params from URL (e.g. ?category_id=xxx from Home category click)
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params['category_id']) {
        this.selectedCategoryId = params['category_id'];
      }
      this.fetchProducts();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Data loading ─────────────────────────────────────────────────────────

  loadCategories(): void {
    this.categoryService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: (cats) => (this.categories = cats) });
  }

  fetchProducts(): void {
    this.isLoading = true;
    this.errorMessage = null;

    const params: ProductQueryParams = {
      page: this.currentPage,
      page_size: this.pageSize,
      category_id: this.selectedCategoryId || null,
      search: this.searchQuery.trim() || null,
    };

    this.productService
      .getProducts(params)
      .pipe(takeUntil(this.destroy$), finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => {
          let items = res.items;
          // Client-side sort (backend returns newest first by default)
          if (this.selectedSort === 'PRICE LOW-HIGH') {
            items = [...items].sort((a, b) => Number(a.price) - Number(b.price));
          } else if (this.selectedSort === 'PRICE HIGH-LOW') {
            items = [...items].sort((a, b) => Number(b.price) - Number(a.price));
          }
          this.filteredProducts = items;
          this.totalProducts = res.total;
          this.totalPages = res.pages;
        },
        error: (err: Error) => {
          this.errorMessage = err.message;
          this.filteredProducts = [];
        },
      });
  }

  // ── Filter/Search handlers ────────────────────────────────────────────────

  onSearch(): void { this.searchSubject.next(this.searchQuery); }
  onSearchInput(): void { this.searchSubject.next(this.searchQuery); }

  onCategorySelect(categoryId: string | null): void {
    this.selectedCategoryId = categoryId;
    this.currentPage = 1;
    this.fetchProducts();
  }

  onSortChange(): void { this.fetchProducts(); }

  clearFilters(): void {
    this.selectedCategoryId = null;
    this.searchQuery = '';
    this.selectedSort = 'NEWEST';
    this.currentPage = 1;
    this.fetchProducts();
  }

  // ── Pagination ────────────────────────────────────────────────────────────

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get pages(): number[] {
    const arr: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) arr.push(i);
    return arr;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

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

  selectedCategoryName(): string {
    if (!this.selectedCategoryId) return 'ALL';
    return this.categories.find((c) => c.id === this.selectedCategoryId)?.name ?? 'ALL';
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/placeholder.jpg';
  }

  // ── Cart ─────────────────────────────────────────────────────────────────

  onProductClick(product: ApiProduct): void {
    this.router.navigate(['/product', product.id]);
  }

  goToProduct(id: string): void {
    this.router.navigate(['/product', id]);
  }

  addToCart(product: ApiProduct): void {
    if (!this.isInStock(product)) return;
    this.cartService.addToCart(product, 1, null);
  }

  tryOnProduct(product: ApiProduct): void {
    this.router.navigate(['/try-on'], { queryParams: { productId: product.id } });
  }

  toggleFavorite(productId: string): void {
    this.favorites[productId] = !this.favorites[productId];
  }

  isFavorite(productId: string): boolean {
    return !!this.favorites[productId];
  }

  @HostListener('window:resize') onResize(): void {}
}