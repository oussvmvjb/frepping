import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../services/store.service';
import { ProductService } from '../../../services/product.service';
import { Store } from '../../../models/store.model';
import { ApiProduct } from '../../../models/api-product.model';

@Component({
  selector: 'app-seller-dashboard',
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.scss'],
})
export class SellerDashboardComponent implements OnInit {
  store: Store | null = null;
  products: ApiProduct[] = [];
  loading = true;
  error: string | null = null;
  hasStore = false;

  constructor(
    private storeService: StoreService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadSellerData();
  }

  loadSellerData(): void {
    this.loading = true;
    this.error = null;

    this.storeService.getMyStore().subscribe({
      next: (store) => {
        this.store = store;
        this.hasStore = true;
        this.loading = false;
      },
      error: (err: Error) => {
        this.loading = false;
        if (err.message.includes('404') || err.message.toLowerCase().includes('not found')) {
          this.hasStore = false;
        } else {
          this.error = err.message || 'Failed to load seller store.';
        }
      },
    });
  }
}
