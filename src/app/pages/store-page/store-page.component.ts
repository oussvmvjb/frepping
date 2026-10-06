import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Store } from '../../models/store.model';
import {
  ApiProduct,
  getPrimaryImage,
  getDiscountPercent,
  isProductInStock,
  getEffectivePrice,
} from '../../models/api-product.model';

@Component({
  selector: 'app-store-page',
  templateUrl: './store-page.component.html',
  styleUrls: ['./store-page.component.scss'],
})
export class StorePageComponent implements OnInit {
  store: Store | null = null;
  products: ApiProduct[] = [];
  loading = true;
  loadingProducts = false;
  error: string | null = null;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) {
        this.loadStore(slug);
      } else {
        this.error = 'Invalid store URL.';
        this.loading = false;
      }
    });
  }

  loadStore(slug: string): void {
    this.loading = true;
    this.error = null;
    this.notFound = false;

    this.storeService.getStoreBySlug(slug).subscribe({
      next: (store) => {
        this.store = store;
        this.loading = false;
        this.loadStoreProducts(store);
      },
      error: (err: Error) => {
        this.loading = false;
        if (err.message.includes('404') || err.message.includes('not found')) {
          this.notFound = true;
        } else {
          this.error = err.message || 'Failed to load store information.';
        }
      },
    });
  }

  loadStoreProducts(store: Store): void {
    this.loadingProducts = true;
    // Load public products and filter by seller_id if present
    this.productService.getProducts({ page: 1, page_size: 50 }).subscribe({
      next: (res) => {
        this.loadingProducts = false;
        if (store.seller_id) {
          this.products = res.items.filter((p) => p.seller_id === store.seller_id);
        } else {
          this.products = [];
        }
      },
      error: () => {
        this.loadingProducts = false;
        this.products = [];
      },
    });
  }

  getProductImage(product: ApiProduct): string {
    return getPrimaryImage(product) || 'assets/placeholder.jpg';
  }

  getDiscount(product: ApiProduct): number {
    return getDiscountPercent(product);
  }

  isInStock(product: ApiProduct): boolean {
    return isProductInStock(product);
  }

  getPrice(product: ApiProduct): number {
    return getEffectivePrice(product);
  }

  addToCart(product: ApiProduct, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    if (!this.isInStock(product)) return;
    const defaultVariant = product.variants.find((v) => v.is_active && v.stock > 0) || null;
    this.cartService.addToCart(product, 1, defaultVariant);
  }
}
