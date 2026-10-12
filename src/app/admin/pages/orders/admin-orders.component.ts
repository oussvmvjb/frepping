import { Component, OnInit } from "@angular/core";
import { AdminService } from "../../../services/admin.service";
import { Order, OrderStatus, PaymentStatus } from "../../../models/api.models";

@Component({
  selector: "app-admin-orders",
  templateUrl: "./admin-orders.component.html",
  styleUrls: ["./admin-orders.component.scss"],
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error: string | null = null;

  // Filters
  filterStatus: OrderStatus | "" = "";
  filterPaymentStatus: PaymentStatus | "" = "";
  searchQuery = "";
  fromDate = "";
  toDate = "";

  page = 1;
  pageSize = 15;
  total = 0;
  pages = 1;

  // Order Details / Edit Status Modal
  selectedOrder: Order | null = null;
  statusUpdate = {
    status: "PROCESSING" as OrderStatus,
    note: "",
    tracking_number: "",
  };
  updatingStatus = false;
  refunding = false;
  modalMsg = "";

  readonly statuses: OrderStatus[] = [
    "PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"
  ];
  readonly paymentStatuses: PaymentStatus[] = ["PENDING", "PAID", "FAILED", "REFUNDED"];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(page = 1): void {
    this.loading = true;
    this.page = page;
    this.error = null;

    this.adminService.getOrders({
      status: this.filterStatus || undefined,
      payment_status: this.filterPaymentStatus || undefined,
      search: this.searchQuery || undefined,
      from: this.fromDate || undefined,
      to: this.toDate || undefined,
      page,
      page_size: this.pageSize,
    }).subscribe({
      next: res => {
        this.orders = res.items;
        this.total = res.total;
        this.pages = res.pages;
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }

  openOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.statusUpdate = {
      status: order.status,
      note: order.notes || "",
      tracking_number: order.tracking_number || "",
    };
    this.modalMsg = "";
  }

  closeModal(): void {
    this.selectedOrder = null;
  }

  saveStatusUpdate(): void {
    if (!this.selectedOrder) return;
    this.updatingStatus = true;
    this.modalMsg = "";

    this.adminService.updateOrderStatus(this.selectedOrder.id, {
      status: this.statusUpdate.status,
      note: this.statusUpdate.note || undefined,
      tracking_number: this.statusUpdate.tracking_number || undefined,
    }).subscribe({
      next: updated => {
        this.selectedOrder!.status = updated.status;
        this.selectedOrder!.tracking_number = updated.tracking_number;
        this.selectedOrder!.notes = updated.notes;
        this.updatingStatus = false;
        this.modalMsg = "Status updated successfully!";
        this.fetchOrders(this.page);
      },
      error: (err: Error) => {
        this.modalMsg = `Failed: ${err.message}`;
        this.updatingStatus = false;
      },
    });
  }

  refundOrder(): void {
    if (!this.selectedOrder) return;
    if (!confirm(`Are you sure you want to refund order #${this.selectedOrder.order_number}? This will return funds to the customer.`)) {
      return;
    }
    this.refunding = true;
    this.modalMsg = "";

    this.adminService.refundOrder(this.selectedOrder.id).subscribe({
      next: refunded => {
        this.selectedOrder!.payment_status = refunded.payment_status;
        this.selectedOrder!.status = refunded.status;
        this.refunding = false;
        this.modalMsg = "Order marked as refunded.";
        this.fetchOrders(this.page);
      },
      error: (err: Error) => {
        this.modalMsg = `Refund error: ${err.message}`;
        this.refunding = false;
      },
    });
  }
}
