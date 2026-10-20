import { Component, OnInit } from '@angular/core';
import { AdminPromoService } from '../../services/admin-promo.service';
import {
  PromoCodeResponse,
  PromoCodeCreateRequest,
  DiscountType
} from '../../models/admin-extended.models';

@Component({
  selector: 'app-admin-promos',
  templateUrl: './promos.component.html',
  styleUrls: ['./promos.component.scss'],
})
export class PromosComponent implements OnInit {
  promos: PromoCodeResponse[] = [];
  loading = true;
  error: string | null = null;

  page = 1;
  pageSize = 15;
  total = 0;
  pages = 1;

  // Modal (Create or Edit)
  modalOpen = false;
  isEditing = false;
  editingId: string | null = null;
  saving = false;
  modalError: string | null = null;
  actionSuccess: string | null = null;

  formData: {
    code: string;
    description: string;
    discount_type: DiscountType;
    discount_value: string;
    min_order_amount: string;
    max_discount_amount: string;
    usage_limit: number | null;
    per_user_limit: number;
    starts_at: string;
    expires_at: string;
    is_active: boolean;
  } = this.getEmptyFormData();

  // Deleting state
  deletingId: string | null = null;

  constructor(private promoService: AdminPromoService) {}

  ngOnInit(): void {
    this.fetchPromos();
  }

  getEmptyFormData() {
    return {
      code: '',
      description: '',
      discount_type: 'PERCENT' as DiscountType,
      discount_value: '10.00',
      min_order_amount: '0.00',
      max_discount_amount: '',
      usage_limit: null as number | null,
      per_user_limit: 1,
      starts_at: '',
      expires_at: '',
      is_active: true,
    };
  }

  fetchPromos(page = 1): void {
    this.loading = true;
    this.page = page;
    this.error = null;

    this.promoService.list(this.page, this.pageSize).subscribe({
      next: (res) => {
        this.promos = res.items || [];
        this.total = res.total;
        this.pages = res.pages;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.detail || err.message || 'Failed to load promo codes';
        this.loading = false;
      },
    });
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.editingId = null;
    this.formData = this.getEmptyFormData();
    this.modalError = null;
    this.modalOpen = true;
  }

  openEditModal(promo: PromoCodeResponse): void {
    this.isEditing = true;
    this.editingId = promo.id;
    this.formData = {
      code: promo.code,
      description: promo.description || '',
      discount_type: promo.discount_type,
      discount_value: promo.discount_value,
      min_order_amount: promo.min_order_amount || '0.00',
      max_discount_amount: promo.max_discount_amount || '',
      usage_limit: promo.usage_limit,
      per_user_limit: promo.per_user_limit || 1,
      starts_at: promo.starts_at ? promo.starts_at.split('T')[0] : '',
      expires_at: promo.expires_at ? promo.expires_at.split('T')[0] : '',
      is_active: promo.is_active,
    };
    this.modalError = null;
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  savePromo(): void {
    if (!this.formData.code.trim()) {
      this.modalError = 'Promo code is required';
      return;
    }
    if (!this.formData.discount_value || parseFloat(this.formData.discount_value) <= 0) {
      this.modalError = 'Valid discount value is required';
      return;
    }

    this.saving = true;
    this.modalError = null;

    const payload: PromoCodeCreateRequest = {
      code: this.formData.code.trim().toUpperCase(),
      description: this.formData.description.trim() || null,
      discount_type: this.formData.discount_type,
      discount_value: this.formData.discount_value,
      min_order_amount: this.formData.min_order_amount || '0.00',
      max_discount_amount: this.formData.max_discount_amount || null,
      usage_limit: this.formData.usage_limit || null,
      per_user_limit: this.formData.per_user_limit || 1,
      starts_at: this.formData.starts_at ? new Date(this.formData.starts_at).toISOString() : null,
      expires_at: this.formData.expires_at ? new Date(this.formData.expires_at).toISOString() : null,
      is_active: this.formData.is_active,
    };

    if (this.isEditing && this.editingId) {
      this.promoService.update(this.editingId, payload).subscribe({
        next: () => {
          this.saving = false;
          this.modalOpen = false;
          this.actionSuccess = `Promo code '${payload.code}' updated successfully.`;
          setTimeout(() => (this.actionSuccess = ''), 4000);
          this.fetchPromos(this.page);
        },
        error: (err) => {
          this.modalError = err.error?.detail || err.message || 'Failed to update promo code';
          this.saving = false;
        },
      });
    } else {
      this.promoService.create(payload).subscribe({
        next: () => {
          this.saving = false;
          this.modalOpen = false;
          this.actionSuccess = `Promo code '${payload.code}' created successfully.`;
          setTimeout(() => (this.actionSuccess = ''), 4000);
          this.fetchPromos(1);
        },
        error: (err) => {
          this.modalError = err.error?.detail || err.message || 'Failed to create promo code';
          this.saving = false;
        },
      });
    }
  }

  deletePromo(promo: PromoCodeResponse): void {
    if (!confirm(`Are you sure you want to delete promo '${promo.code}'?`)) return;

    this.deletingId = promo.id;
    this.promoService.delete(promo.id).subscribe({
      next: () => {
        this.deletingId = null;
        this.actionSuccess = `Promo '${promo.code}' was deleted.`;
        setTimeout(() => (this.actionSuccess = ''), 4000);
        this.fetchPromos(this.page);
      },
      error: (err) => {
        alert(err.error?.detail || err.message || 'Failed to delete promo');
        this.deletingId = null;
      },
    });
  }

  toggleActive(promo: PromoCodeResponse): void {
    const nextVal = !promo.is_active;
    this.promoService.update(promo.id, { is_active: nextVal }).subscribe({
      next: (res) => {
        promo.is_active = res.is_active;
      },
      error: (err) => {
        alert(err.error?.detail || err.message || 'Failed to toggle status');
      },
    });
  }
}
