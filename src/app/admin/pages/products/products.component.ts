import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { AdminProductService } from '../../services/admin-product.service';
import {
  Category,
  Product,
  ProductListResponse,
} from '../../models/admin.models';

export type FeaturedFilterOption = 'all' | 'featured' | 'not_featured';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  // Data state
  products: Product[] = [];
  categories: Category[] = [];

  // Loading & Error states
  isLoading = false;
  isCategoriesLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Search & Filter state
  searchTerm = '';
  selectedCategoryId = '';
  selectedFeatured: FeaturedFilterOption = 'all';

  // Pagination state (server-driven)
  currentPage = 1;
  pageSize = 20;
  totalProducts = 0;
  totalPages = 0;

  // Delete modal state
  productToDelete: Product | null = null;
  isDeleting = false;
  deleteError: string | null = null;

  // RxJS
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private adminProductService: AdminProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setupSearchDebounce();
    this.loadCategories();
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── Setup Search Debounce (300ms) ───────────────────────────

  private setupSearchDebounce(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((term) => {
        this.searchTerm = term;
        this.currentPage = 1;
        this.loadProducts();
      });
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadProducts();
  }

  // ─── Filter Handlers ─────────────────────────────────────────

  onCategoryChange(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  onFeaturedChange(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  resetAllFilters(): void {
    this.searchTerm = '';
    this.selectedCategoryId = '';
    this.selectedFeatured = 'all';
    this.currentPage = 1;
    this.loadProducts();
  }

  get isFiltered(): boolean {
    return (
      this.searchTerm.trim() !== '' ||
      this.selectedCategoryId !== '' ||
      this.selectedFeatured !== 'all'
    );
  }

  // ─── Data Loading ────────────────────────────────────────────

  loadCategories(): void {
    this.isCategoriesLoading = true;
    this.adminProductService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cats) => {
          this.categories = cats;
          this.isCategoriesLoading = false;
        },
        error: () => {
          this.isCategoriesLoading = false;
        },
      });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = null;

    let isFeaturedParam: boolean | null = null;
    if (this.selectedFeatured === 'featured') {
      isFeaturedParam = true;
    } else if (this.selectedFeatured === 'not_featured') {
      isFeaturedParam = false;
    }

    this.adminProductService
      .getProducts({
        page: this.currentPage,
        pageSize: this.pageSize,
        categoryId: this.selectedCategoryId || null,
        search: this.searchTerm.trim() || null,
        isFeatured: isFeaturedParam,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ProductListResponse) => {
          this.products = response.items || [];
          this.currentPage = response.page;
          this.pageSize = response.page_size;
          this.totalProducts = response.total;
          this.totalPages = response.pages;
          this.isLoading = false;
        },
        error: (err: Error) => {
          this.errorMessage = err.message || 'Unable to load products.';
          this.isLoading = false;
        },
      });
  }

  retryLoad(): void {
    this.loadProducts();
    if (this.categories.length === 0) {
      this.loadCategories();
    }
  }

  // ─── Stock Calculation ───────────────────────────────────────

  /**
   * Sum of all active variant stocks.
   * If there are no variants, display "—".
   */
  getTotalStock(product: Product): string {
    if (!product.variants || product.variants.length === 0) {
      return '—';
    }
    const sum = product.variants
      .filter((v) => v.is_active)
      .reduce((acc, v) => acc + (Number(v.stock) || 0), 0);
    return sum.toString();
  }

  isOutOfStock(product: Product): boolean {
    if (!product.variants || product.variants.length === 0) {
      return false;
    }
    const sum = product.variants
      .filter((v) => v.is_active)
      .reduce((acc, v) => acc + (Number(v.stock) || 0), 0);
    return sum === 0;
  }

  // ─── Image Resolution ────────────────────────────────────────

  /**
   * Primary image where is_primary === true.
   * If none, first image. Otherwise null (placeholder shown).
   */
  getProductPrimaryImage(product: Product): string | null {
    if (!product.images || product.images.length === 0) {
      return null;
    }
    const primary = product.images.find((img) => img.is_primary);
    return primary ? primary.image_url : product.images[0].image_url;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLElement;
    target.style.display = 'none';
    const parent = target.parentElement;
    if (parent) {
      parent.classList.add('has-fallback');
    }
  }

  // ─── Category Name Lookup ────────────────────────────────────

  getCategoryLabel(product: Product): string {
    if (product.category && product.category.name) {
      return product.category.name;
    }
    const found = this.categories.find((c) => c.id === product.category_id);
    return found ? found.name : 'Uncategorized';
  }

  // ─── Pagination Helpers ──────────────────────────────────────

  get pagesArray(): number[] {
    if (this.totalPages <= 1) return [1];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  get rangeStart(): number {
    if (this.totalProducts === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get rangeEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalProducts);
  }

  changePage(page: number): void {
    if (
      page < 1 ||
      page > this.totalPages ||
      page === this.currentPage ||
      this.isLoading
    ) {
      return;
    }
    this.currentPage = page;
    this.loadProducts();
  }

  previousPage(): void {
    if (this.currentPage > 1 && !this.isLoading) {
      this.changePage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages && !this.isLoading) {
      this.changePage(this.currentPage + 1);
    }
  }

  // ─── Edit Navigation ─────────────────────────────────────────

  navigateToEdit(productId: string): void {
    this.router.navigate(['/admin/products', productId, 'edit']);
  }

  // ─── Delete Flow ─────────────────────────────────────────────

  openDeleteConfirm(product: Product): void {
    this.productToDelete = product;
    this.deleteError = null;
    this.errorMessage = null;
  }

  closeDeleteConfirm(): void {
    if (this.isDeleting) return;
    this.productToDelete = null;
    this.deleteError = null;
  }

  confirmDelete(): void {
    if (!this.productToDelete) return;
    this.isDeleting = true;
    this.deleteError = null;

    const id = this.productToDelete.id;
    const name = this.productToDelete.name;

    this.adminProductService
      .deleteProduct(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isDeleting = false;
          this.productToDelete = null;
          this.successMessage = `Product "${name}" was deleted successfully.`;

          // If this was the last item on a page > 1, step back
          if (this.products.length === 1 && this.currentPage > 1) {
            this.currentPage--;
          }
          this.loadProducts();
        },
        error: (err: Error) => {
          this.isDeleting = false;
          this.deleteError = err.message || 'Failed to delete product.';
        },
      });
  }

  dismissSuccessMessage(): void {
    this.successMessage = null;
  }

  dismissErrorMessage(): void {
    this.errorMessage = null;
  }
}
