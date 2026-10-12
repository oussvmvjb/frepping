import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil, debounceTime, distinctUntilChanged, finalize } from "rxjs/operators";
import { ProductService } from "../../services/product.service";
import { CategoryService } from "../../services/category.service";
import { CartService } from "../../services/cart.service";
import { LikeService } from "../../services/like.service";
import { AuthService } from "../../services/auth.service";
import { Product, Category, ProductQueryParams } from "../../models/api.models";

// Maps UI labels to API sort values
const SORT_MAP: Record<string, string> = {
  NEWEST: "newest",
  "PRICE LOW-HIGH": "price_asc",
  "PRICE HIGH-LOW": "price_desc",
  POPULAR: "popular",
  "NAME A-Z": "name_asc",
};

@Component({
  selector: "app-shop",
  templateUrl: "./shop.component.html",
  styleUrls: ["./shop.component.scss"],
})
export class ShopComponent implements OnInit, OnDestroy {
  // -- Products --------------------------------------------------------------
  products: Product[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  addingToCartId: string | null = null;

  // -- Filters ---------------------------------------------------------------
  categories: Category[] = [];
  selectedCategoryId: string | null = null;
  sortOptions = Object.keys(SORT_MAP);
  selectedSort = "NEWEST";
  searchQuery = "";

  // -- Pagination ------------------------------------------------------------
  currentPage = 1;
  pageSize = 20;
  totalProducts = 0;
  totalPages = 0;

  // -- UI --------------------------------------------------------------------
  gridSize: "small" | "medium" | "large" = "medium";
  isMobile = window.innerWidth <= 768;
  marqueePaused = false;
  etherColors: string[] = ["#5227FF", "#FF9FFC", "#B497CF"];
  toastMessage: string | null = null;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private likeService: LikeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentPage = 1;
        this.fetchProducts();
      });

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params["category_id"]) this.selectedCategoryId = params["category_id"];
      this.fetchProducts();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategories(): void {
    this.categoryService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: cats => (this.categories = cats) });
  }

  fetchProducts(): void {
    this.isLoading = true;
    this.errorMessage = null;

    const params: ProductQueryParams = {
      page: this.currentPage,
      page_size: this.pageSize,
      category_id: this.selectedCategoryId || null,
      search: this.searchQuery.trim() || null,
      sort: SORT_MAP[this.selectedSort] || "newest",
    };

    this.productService
      .getProducts(params)
      .pipe(takeUntil(this.destroy$), finalize(() => (this.isLoading = false)))
      .subscribe({
        next: res => {
          this.products = res.items;
          this.totalProducts = res.total;
          this.totalPages = res.pages;
        },
        error: (err: Error) => {
          this.errorMessage = err.message;
          this.products = [];
        },
      });
  }

  onSearchInput(): void { this.searchSubject.next(this.searchQuery); }
  onSearch(): void { this.searchSubject.next(this.searchQuery); }

  onCategorySelect(categoryId: string | null): void {
    this.selectedCategoryId = categoryId;
    this.currentPage = 1;
    this.fetchProducts();
  }

  onSortChange(): void {
    this.currentPage = 1;
    this.fetchProducts();
  }

  clearFilters(): void {
    this.selectedCategoryId = null;
    this.searchQuery = "";
    this.selectedSort = "NEWEST";
    this.currentPage = 1;
    this.fetchProducts();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.fetchProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  get pages(): number[] {
    const arr: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) arr.push(i);
    return arr;
  }

  // -- Helpers ---------------------------------------------------------------

  getProductImage(product: Product): string {
    return this.productService.getPrimaryImage(product);
  }

  selectedCategoryName(): string {
    if (!this.selectedCategoryId) return "ALL";
    return this.categories.find(c => c.id === this.selectedCategoryId)?.name ?? "ALL";
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = "assets/placeholder.jpg";
  }

  // -- Navigation ------------------------------------------------------------

  onProductClick(product: Product): void {
    this.router.navigate(["/product", product.id]);
  }

  // -- Cart ------------------------------------------------------------------

  addToCart(product: Product, event: Event): void {
    event.stopPropagation();
    if (!product.in_stock) return;

    // If product has variants, navigate to details page for selection
    if (product.variants?.length > 0) {
      this.router.navigate(["/product", product.id]);
      return;
    }

    const isLoggedIn = !!this.authService.getAccessToken();
    if (!isLoggedIn) {
      this.cartService.addGuestItem({ product_id: product.id, variant_id: null, quantity: 1 });
      this.showToast("Added to bag!");
      return;
    }

    this.addingToCartId = product.id;
    this.cartService
      .addItem({ product_id: product.id, variant_id: null, quantity: 1 })
      .pipe(finalize(() => (this.addingToCartId = null)))
      .subscribe({
        next: () => this.showToast("Added to bag!"),
        error: (err: Error) => this.showToast(err.message, true),
      });
  }

  tryOnProduct(product: Product): void {
    this.router.navigate(["/try-on"], { queryParams: { productId: product.id } });
  }

  // -- Likes -----------------------------------------------------------------

  toggleLike(product: Product, event: Event): void {
    event.stopPropagation();

    if (!this.authService.getAccessToken()) {
      this.router.navigate(["/login"]);
      return;
    }

    const wasLiked = product.is_liked;
    // Optimistic update
    product.is_liked = !wasLiked;
    product.likes_count += wasLiked ? -1 : 1;

    const obs$ = wasLiked
      ? this.likeService.unlike(product.id)
      : this.likeService.like(product.id);

    obs$.subscribe({
      error: () => {
        // Rollback on error
        product.is_liked = wasLiked;
        product.likes_count += wasLiked ? 1 : -1;
      },
    });
  }

  private showToast(msg: string, isError = false): void {
    this.toastMessage = msg;
    setTimeout(() => (this.toastMessage = null), 3000);
  }

  @HostListener("window:resize")
  onResize(): void { this.isMobile = window.innerWidth <= 768; }
}
