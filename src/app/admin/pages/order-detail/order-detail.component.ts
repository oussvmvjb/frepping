import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminOrderService } from '../../services/admin-order.service';
import { OrderResponse, OrderStatus } from '../../models/admin-extended.models';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {
  orderId = '';
  order: OrderResponse | null = null;
  loading = true;
  error: string | null = null;

  // Status Update
  selectedStatus: OrderStatus = 'PROCESSING';
  statusNote = '';
  trackingNumber = '';
  updatingStatus = false;
  statusSuccessMsg = '';
  statusErrorMsg = '';

  // Refund
  refunding = false;
  refundSuccessMsg = '';
  refundErrorMsg = '';

  readonly statuses: OrderStatus[] = [
    'PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: AdminOrderService
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
    if (this.orderId) {
      this.fetchOrder();
    } else {
      this.error = 'No order ID specified';
      this.loading = false;
    }
  }

  fetchOrder(): void {
    this.loading = true;
    this.error = null;

    this.orderService.getOrder(this.orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.selectedStatus = order.status;
        this.trackingNumber = order.tracking_number || '';
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.detail || err.message || 'Failed to fetch order details';
        this.loading = false;
      },
    });
  }

  updateStatus(): void {
    if (!this.order) return;
    this.updatingStatus = true;
    this.statusSuccessMsg = '';
    this.statusErrorMsg = '';

    this.orderService.updateStatus(this.orderId, {
      status: this.selectedStatus,
      note: this.statusNote.trim() || null,
      tracking_number: this.trackingNumber.trim() || null,
    }).subscribe({
      next: (updated) => {
        this.order = updated;
        this.selectedStatus = updated.status;
        this.trackingNumber = updated.tracking_number || '';
        this.statusNote = '';
        this.statusSuccessMsg = `Order status successfully changed to ${updated.status}.`;
        this.updatingStatus = false;
        setTimeout(() => (this.statusSuccessMsg = ''), 4000);
      },
      error: (err) => {
        this.statusErrorMsg = err.error?.detail || err.message || 'Failed to update status';
        this.updatingStatus = false;
      },
    });
  }

  refundOrder(): void {
    if (!this.order) return;
    const confirmed = confirm(
      `⚠️ WARNING: Are you sure you want to refund Order #${this.order.order_number}?\nTotal amount: $${this.order.total}\nThis action is irreversible!`
    );
    if (!confirmed) return;

    this.refunding = true;
    this.refundSuccessMsg = '';
    this.refundErrorMsg = '';

    this.orderService.refundOrder(this.orderId).subscribe({
      next: (refunded) => {
        this.order = refunded;
        this.refundSuccessMsg = `Order #${refunded.order_number} has been refunded.`;
        this.refunding = false;
        setTimeout(() => (this.refundSuccessMsg = ''), 4000);
      },
      error: (err) => {
        this.refundErrorMsg = err.error?.detail || err.message || 'Failed to refund order';
        this.refunding = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/orders']);
  }
}
