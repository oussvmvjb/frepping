import { Component, OnInit } from "@angular/core";
import { AdminService } from "../../../services/admin.service";
import { AdminDashboardSummary, OrdersByStatus, TopProduct, RevenuePoint } from "../../../models/api.models";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.scss"],
})
export class AdminDashboardComponent implements OnInit {
  summary: AdminDashboardSummary | null = null;
  loading = true;
  error: string | null = null;

  fromDate = "";
  toDate = "";

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.loading = true;
    this.error = null;
    const params: { from?: string; to?: string } = {};
    if (this.fromDate) params.from = this.fromDate;
    if (this.toDate) params.to = this.toDate;

    this.adminService.getDashboard(params).subscribe({
      next: data => {
        this.summary = data;
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }

  resetFilters(): void {
    this.fromDate = "";
    this.toDate = "";
    this.loadSummary();
  }

  getOrderStatusKeys(obs: OrdersByStatus | undefined): (keyof OrdersByStatus)[] {
    if (!obs) return [];
    return Object.keys(obs) as (keyof OrdersByStatus)[];
  }

  getMaxRevenue(): number {
    if (!this.summary?.revenue_last_30_days?.length) return 100;
    const max = Math.max(...this.summary.revenue_last_30_days.map(r => Number(r.revenue) || 0));
    return max > 0 ? max : 100;
  }

  getBarHeightPercent(rev: string): number {
    const max = this.getMaxRevenue();
    return Math.min(100, Math.round(((Number(rev) || 0) / max) * 100));
  }
}
