import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from '../../services/admin-dashboard.service';
import { AdminLikesService } from '../../services/admin-likes.service';
import {
  AdminDashboardSummary,
  ProductLikersListResponse,
  TopProductLikesItem,
  TopProductSalesItem
} from '../../models/admin-extended.models';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  summary: AdminDashboardSummary | null = null;
  loading = true;
  error: string | null = null;
  lastUpdated: Date = new Date();

  // Filters
  fromDate = '';
  toDate = '';

  // Likers Modal
  likersModalOpen = false;
  selectedProductForLikes: TopProductLikesItem | null = null;
  likersData: ProductLikersListResponse | null = null;
  likersLoading = false;
  likersPage = 1;
  likersPageSize = 10;

  constructor(
    private dashboardService: AdminDashboardService,
    private likesService: AdminLikesService
  ) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.loading = true;
    this.error = null;

    this.dashboardService.getSummary(this.fromDate || null, this.toDate || null).subscribe({
      next: (data) => {
        this.summary = data;
        this.lastUpdated = new Date();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.detail || err.message || 'Failed to load dashboard summary';
        this.loading = false;
      },
    });
  }

  setPreset(days: number): void {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - days);

    this.toDate = to.toISOString().split('T')[0];
    this.fromDate = from.toISOString().split('T')[0];
    this.loadSummary();
  }

  resetFilters(): void {
    this.fromDate = '';
    this.toDate = '';
    this.loadSummary();
  }

  getOrderStatusKeys(obs: Record<string, number> | undefined): string[] {
    if (!obs) return [];
    return Object.keys(obs);
  }

  getMaxDailyRevenue(): number {
    if (!this.summary?.revenue_daily?.length) return 100;
    const max = Math.max(...this.summary.revenue_daily.map(r => parseFloat(r.revenue) || 0));
    return max > 0 ? max : 100;
  }

  getBarHeight(rev: string): number {
    const max = this.getMaxDailyRevenue();
    const val = parseFloat(rev) || 0;
    return Math.min(100, Math.max(6, Math.round((val / max) * 100)));
  }

  // ─── Likers Modal ────────────────────────────────────────────────────────
  openLikersModal(product: TopProductLikesItem): void {
    this.selectedProductForLikes = product;
    this.likersModalOpen = true;
    this.likersPage = 1;
    this.fetchLikers();
  }

  closeLikersModal(): void {
    this.likersModalOpen = false;
    this.selectedProductForLikes = null;
    this.likersData = null;
  }

  fetchLikers(page = 1): void {
    if (!this.selectedProductForLikes) return;
    this.likersPage = page;
    this.likersLoading = true;

    this.likesService.getLikers(this.selectedProductForLikes.product_id, page, this.likersPageSize).subscribe({
      next: (res) => {
        this.likersData = res;
        this.likersLoading = false;
      },
      error: () => {
        this.likersLoading = false;
      },
    });
  }
}
