import { Component, OnInit } from '@angular/core';
import { AdminInventoryService } from '../../services/admin-inventory.service';
import { LowStockVariantItem } from '../../models/admin-extended.models';

@Component({
  selector: 'app-admin-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit {
  items: LowStockVariantItem[] = [];
  threshold = 5;
  loading = true;
  error: string | null = null;
  searchQuery = '';

  // Inline edit state
  editingStock: { [variantId: string]: number } = {};
  saving: { [variantId: string]: boolean } = {};
  successMsg = '';
  actionError = '';

  constructor(private inventoryService: AdminInventoryService) {}

  ngOnInit(): void {
    this.fetchInventory();
  }

  fetchInventory(): void {
    this.loading = true;
    this.error = null;

    this.inventoryService.getLowStock(this.threshold).subscribe({
      next: (res) => {
        this.items = res.items || [];
        this.editingStock = {};
        for (const item of this.items) {
          this.editingStock[item.variant_id] = item.stock;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.detail || err.message || 'Failed to load inventory';
        this.loading = false;
      },
    });
  }

  get filteredItems(): LowStockVariantItem[] {
    if (!this.searchQuery.trim()) return this.items;
    const q = this.searchQuery.toLowerCase();
    return this.items.filter(
      (item) =>
        item.product_name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        (item.size && item.size.toLowerCase().includes(q)) ||
        (item.color && item.color.toLowerCase().includes(q))
    );
  }

  saveStock(item: LowStockVariantItem): void {
    const newStock = this.editingStock[item.variant_id];
    if (newStock === undefined || newStock < 0) return;

    this.saving[item.variant_id] = true;
    this.successMsg = '';
    this.actionError = '';

    this.inventoryService.updateStock(item.variant_id, { stock: newStock }).subscribe({
      next: (updated) => {
        item.stock = updated.stock;
        this.saving[item.variant_id] = false;
        this.successMsg = `Stock for ${item.product_name} (${item.sku}) updated to ${updated.stock}.`;
        setTimeout(() => (this.successMsg = ''), 4000);
      },
      error: (err) => {
        this.actionError = err.error?.detail || err.message || 'Failed to update stock';
        this.saving[item.variant_id] = false;
      },
    });
  }

  resetThreshold(val: number): void {
    this.threshold = val;
    this.fetchInventory();
  }
}
