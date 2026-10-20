import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminOrderService } from '../../services/admin-order.service';
import { OrderResponse, OrderStatus, PaymentStatus } from '../../models/admin-extended.models';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss'],
})
export class AdminOrdersComponent implements OnInit {
  orders: OrderResponse[] = [];
  loading = true;
  error: string | null = null;

  // Filters
  filterStatus: OrderStatus | '' = '';
  filterPaymentStatus: PaymentStatus | '' = '';
  searchQuery = '';
  fromDate = '';
  toDate = '';

  page = 1;
  pageSize = 15;
  total = 0;
  pages = 1;

  readonly statuses: OrderStatus[] = [
    'PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'
  ];
  readonly paymentStatuses: PaymentStatus[] = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];

  constructor(
    private orderService: AdminOrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(page = 1): void {
    this.loading = true;
    this.page = page;
    this.error = null;

    this.orderService.listOrders({
      page: this.page,
      page_size: this.pageSize,
      status: this.filterStatus || null,
      payment_status: this.filterPaymentStatus || null,
      search: this.searchQuery.trim() || null,
      date_from: this.fromDate || null,
      date_to: this.toDate || null,
    }).subscribe({
      next: (res) => {
        this.orders = res.items;
        this.total = res.total;
        this.pages = res.pages;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.detail || err.message || 'Failed to load orders';
        this.loading = false;
      },
    });
  }

  resetFilters(): void {
    this.filterStatus = '';
    this.filterPaymentStatus = '';
    this.searchQuery = '';
    this.fromDate = '';
    this.toDate = '';
    this.fetchOrders(1);
  }

  viewOrder(order: OrderResponse): void {
    this.router.navigate(['/admin/orders', order.id]);
  }
}
