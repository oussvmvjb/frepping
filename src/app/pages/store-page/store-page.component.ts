import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil, finalize } from "rxjs/operators";
import { StoreService } from "../../services/store.service";
import { CartService } from "../../services/cart.service";
import { LikeService } from "../../services/like.service";
import { AuthService } from "../../services/auth.service";
import { ProductService } from "../../services/product.service";
import { Store, Product, ProductListResponse } from "../../models/api.models";

@Component({
  selector: "app-store-page",
  templateUrl: "./store-page.component.html",
  styleUrls: ["./store-page.component.scss"],
})
export class StorePageComponent implements OnInit, OnDestroy {
  store: Store | null = null;
  products: Product[] = [];
  loading = true;
  loadingProducts = false;
  error: string | null = null;
  notFound = false;
  storeProductsNotImplemented = false;

  currentPage = 1;
  pageSize = 20;
  totalProducts = 0;
  totalPages = 0;

  addingToCartId: string | null = null;
  toastMessage: string | null = null;

  private destroy$ = new Subject<void>();
  private currentSlug = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService,
    private cartService: CartService,
    private likeService: LikeService,
    private authService: AuthService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const slug = params.get("slug");
      if (slug) {
        this.currentSlug = slug;
        this.loadStore(slug);
      } else {
        this.error = "Invalid store URL.";
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadStore(slug: string): void {
    this.loading = true;
    this.error = null;
    this.notFound = false;

    this.storeService.getStoreBySlug(slug).pipe(takeUntil(this.destroy$)).subscribe({
      next: store => {
        this.store = store;
        this.loading = false;
        this.loadStoreProducts(slug);
      },
      error: (err: Error) => {
        this.loading = false;
        if (err.message.includes("404") || err.message.toLowerCase().includes("not found")) {
          this.notFound = true;
        } else {
          this.error = err.message;
        }
      },
    });
  }

  loadStoreProducts(slug: string, page = 1): void {
    this.loadingProducts = true;
    this.storeProductsNotImplemented = false;

    // TODO: Backend endpoint GET /stores/{slug}/products not yet implemented.
    // When added it will work transparently via StoreService.getStoreProducts().
    this.storeService.getStoreProducts(slug, page, this.pageSize)
      .pipe(takeUntil(this.destroy$), finalize(() => (this.loadingProducts = false)))
      .subscribe({
        next: (res: ProductListResponse) => {
          this.products = res.items;
          this.totalProducts = res.total;
          this.totalPages = res.pages;
          this.currentPage = res.page;
        },
        error: (err: Error) => {
          this.storeProductsNotImplemented = true;
          this.products = [];
        },
      });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.loadStoreProducts(this.currentSlug, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  get pages(): number[] {
    const arr: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) arr.push(i);
    return arr;
  }

  getPrice(product: Product): number {
    return Number(product.price) || 0;
  }

  getDiscount(product: Product): number {
    return product.discount_percent || 0;
  }

  isInStock(product: Product): boolean {
    return !!product.in_stock;
  }

  getProductImage(product: Product): string {
    return this.productService.getPrimaryImage(product);
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    if (!product.in_stock) return;

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
    this.cartService.addItem({ product_id: product.id, variant_id: null, quantity: 1 })
      .pipe(finalize(() => (this.addingToCartId = null)))
      .subscribe({
        next: () => this.showToast("Added to bag!"),
        error: (err: Error) => this.showToast(err.message, true),
      });
  }

  toggleLike(product: Product, event: Event): void {
    event.stopPropagation();
    if (!this.authService.getAccessToken()) {
      this.router.navigate(["/login"]);
      return;
    }
    const wasLiked = product.is_liked;
    product.is_liked = !wasLiked;
    product.likes_count += wasLiked ? -1 : 1;

    const obs$ = wasLiked ? this.likeService.unlike(product.id) : this.likeService.like(product.id);
    obs$.subscribe({
      error: () => {
        product.is_liked = wasLiked;
        product.likes_count += wasLiked ? 1 : -1;
      },
    });
  }

  goToProduct(id: string): void {
    this.router.navigate(["/product", id]);
  }

  private showToast(msg: string, isError = false): void {
    this.toastMessage = msg;
    setTimeout(() => (this.toastMessage = null), 3000);
  }
}
