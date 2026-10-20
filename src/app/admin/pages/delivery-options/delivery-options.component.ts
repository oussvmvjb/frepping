import { Component, OnInit } from '@angular/core';
import { AdminDeliveryService } from '../../services/admin-delivery.service';
import {
  DeliveryOptionResponse,
  DeliveryOptionCreateRequest,
  DeliveryOptionUpdateRequest
} from '../../models/admin-extended.models';

@Component({
  selector: 'app-admin-delivery-options',
  templateUrl: './delivery-options.component.html',
  styleUrls: ['./delivery-options.component.scss'],
})
export class DeliveryOptionsComponent implements OnInit {
  options: DeliveryOptionResponse[] = [];
  loading = true;
  error: string | null = null;

  // Modal
  modalOpen = false;
  isEditing = false;
  editingId: string | null = null;
  saving = false;
  modalError: string | null = null;
  actionSuccess: string | null = null;

  formData = this.getEmptyFormData();
  deletingId: string | null = null;

  constructor(private deliveryService: AdminDeliveryService) {}

  ngOnInit(): void {
    this.fetchOptions();
  }

  getEmptyFormData() {
    return {
      code: '',
      title: '',
      description: '',
      badge: '',
      icon: '🚚',
      price: '5.00',
      estimated_days_min: 2,
      estimated_days_max: 5,
      estimated_label: '2-5 business days',
      is_active: true,
      sort_order: 0,
    };
  }

  fetchOptions(): void {
    this.loading = true;
    this.error = null;

    this.deliveryService.listActive().subscribe({
      next: (data) => {
        this.options = data || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.detail || err.message || 'Failed to load delivery options';
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

  openEditModal(opt: DeliveryOptionResponse): void {
    this.isEditing = true;
    this.editingId = opt.id;
    this.formData = {
      code: opt.code,
      title: opt.title,
      description: opt.description || '',
      badge: opt.badge || '',
      icon: opt.icon || '🚚',
      price: opt.price,
      estimated_days_min: opt.estimated_days_min || 1,
      estimated_days_max: opt.estimated_days_max || 3,
      estimated_label: opt.estimated_label || '',
      is_active: opt.is_active,
      sort_order: opt.sort_order || 0,
    };
    this.modalError = null;
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  saveOption(): void {
    if (!this.formData.code.trim() || !this.formData.title.trim()) {
      this.modalError = 'Code and Title are required';
      return;
    }
    if (this.formData.price === undefined || this.formData.price === '') {
      this.modalError = 'Price is required';
      return;
    }

    this.saving = true;
    this.modalError = null;

    const payload: DeliveryOptionCreateRequest = {
      code: this.formData.code.trim().toUpperCase(),
      title: this.formData.title.trim(),
      description: this.formData.description.trim() || null,
      badge: this.formData.badge.trim() || null,
      icon: this.formData.icon.trim() || null,
      price: this.formData.price,
      estimated_days_min: this.formData.estimated_days_min ? Number(this.formData.estimated_days_min) : null,
      estimated_days_max: this.formData.estimated_days_max ? Number(this.formData.estimated_days_max) : null,
      estimated_label: this.formData.estimated_label.trim() || null,
      is_active: this.formData.is_active,
      sort_order: Number(this.formData.sort_order) || 0,
    };

    if (this.isEditing && this.editingId) {
      this.deliveryService.update(this.editingId, payload).subscribe({
        next: () => {
          this.saving = false;
          this.modalOpen = false;
          this.actionSuccess = `Delivery option '${payload.title}' updated.`;
          setTimeout(() => (this.actionSuccess = ''), 4000);
          this.fetchOptions();
        },
        error: (err) => {
          this.modalError = err.error?.detail || err.message || 'Failed to update delivery option';
          this.saving = false;
        },
      });
    } else {
      this.deliveryService.create(payload).subscribe({
        next: () => {
          this.saving = false;
          this.modalOpen = false;
          this.actionSuccess = `Delivery option '${payload.title}' created.`;
          setTimeout(() => (this.actionSuccess = ''), 4000);
          this.fetchOptions();
        },
        error: (err) => {
          this.modalError = err.error?.detail || err.message || 'Failed to create delivery option';
          this.saving = false;
        },
      });
    }
  }

  deleteOption(opt: DeliveryOptionResponse): void {
    if (!confirm(`Are you sure you want to delete delivery option '${opt.title}'?`)) return;

    this.deletingId = opt.id;
    this.deliveryService.delete(opt.id).subscribe({
      next: () => {
        this.deletingId = null;
        this.actionSuccess = `Delivery option '${opt.title}' removed.`;
        setTimeout(() => (this.actionSuccess = ''), 4000);
        this.fetchOptions();
      },
      error: (err) => {
        alert(err.error?.detail || err.message || 'Failed to delete delivery option');
        this.deletingId = null;
      },
    });
  }

  toggleActive(opt: DeliveryOptionResponse): void {
    const nextVal = !opt.is_active;
    this.deliveryService.update(opt.id, { is_active: nextVal }).subscribe({
      next: () => {
        this.actionSuccess = nextVal
          ? `Delivery option '${opt.title}' activated.`
          : `Delivery option '${opt.title}' deactivated (hidden from active list).`;
        setTimeout(() => (this.actionSuccess = ''), 4000);
        this.fetchOptions();
      },
      error: (err) => {
        alert(err.error?.detail || err.message || 'Failed to toggle status');
      },
    });
  }
}
