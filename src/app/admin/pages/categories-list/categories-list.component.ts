import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminProductService } from '../../services/admin-product.service';
import { CategoryService } from '../../../services/category.service';
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../../models/admin.models';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
})
export class CategoriesListComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  filteredCategories: Category[] = [];

  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  searchTerm = '';

  // ── Create Modal State ──
  showCreateModal = false;
  createForm: CreateCategoryRequest = {
    name: '',
    slug: '',
    description: null,
    image_url: null,
    is_active: true,
  };
  isCreating = false;
  createError: string | null = null;

  // ── Edit Modal State ──
  categoryToEdit: Category | null = null;
  editForm: UpdateCategoryRequest = {};
  isUpdating = false;
  editError: string | null = null;

  // ── Delete Modal State ──
  categoryToDelete: Category | null = null;
  isDeleting = false;

  private destroy$ = new Subject<void>();

  constructor(
    private adminService: AdminProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.adminService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cats) => {
          this.categories = cats;
          this.applyFilter();
          this.isLoading = false;
        },
        error: (err: Error) => {
          this.errorMessage = err.message;
          this.isLoading = false;
        },
      });
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredCategories = this.categories.filter((c) => {
      return (
        !term ||
        c.name.toLowerCase().includes(term) ||
        c.slug.toLowerCase().includes(term) ||
        (c.description && c.description.toLowerCase().includes(term))
      );
    });
  }

  // ── Auto-slug for Create ──
  onCreateNameChange(): void {
    if (!this.createForm.slug || this.createForm.slug === this.slugify(this.createForm.name.slice(0, -1))) {
      this.createForm.slug = this.slugify(this.createForm.name);
    }
  }

  private slugify(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  }

  // ── Create Modal ──
  openCreateModal(): void {
    this.createForm = {
      name: '',
      slug: '',
      description: null,
      image_url: null,
      is_active: true,
    };
    this.createError = null;
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.isCreating = false;
    this.createError = null;
  }

  submitCreate(): void {
    if (!this.createForm.name.trim() || !this.createForm.slug.trim()) {
      this.createError = 'Category Name and Slug are required.';
      return;
    }

    this.isCreating = true;
    this.createError = null;

    const payload: CreateCategoryRequest = {
      name: this.createForm.name.trim(),
      slug: this.createForm.slug.trim(),
      description: this.createForm.description?.trim() || null,
      image_url: this.createForm.image_url?.trim() || null,
      is_active: this.createForm.is_active,
    };

    this.adminService
      .createCategory(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (created) => {
          this.categories.unshift(created);
          this.applyFilter();
          this.categoryService.invalidateCache();
          this.successMessage = `Category "${created.name}" created successfully.`;
          this.closeCreateModal();
        },
        error: (err: Error) => {
          this.createError = err.message;
          this.isCreating = false;
        },
      });
  }

  // ── Edit Modal ──
  openEditModal(category: Category): void {
    this.categoryToEdit = category;
    this.editError = null;
    this.editForm = {
      name: category.name,
      slug: category.slug,
      description: category.description,
      image_url: category.image_url,
      is_active: category.is_active,
    };
  }

  closeEditModal(): void {
    this.categoryToEdit = null;
    this.isUpdating = false;
    this.editError = null;
  }

  submitEdit(): void {
    if (!this.categoryToEdit) return;
    if (!this.editForm.name?.trim() || !this.editForm.slug?.trim()) {
      this.editError = 'Category Name and Slug are required.';
      return;
    }

    this.isUpdating = true;
    this.editError = null;

    const payload: UpdateCategoryRequest = {
      name: this.editForm.name.trim(),
      slug: this.editForm.slug.trim(),
      description: this.editForm.description?.trim() || null,
      image_url: this.editForm.image_url?.trim() || null,
      is_active: this.editForm.is_active,
    };

    this.adminService
      .updateCategory(this.categoryToEdit.id, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          const index = this.categories.findIndex((c) => c.id === updated.id);
          if (index !== -1) {
            this.categories[index] = updated;
          }
          this.applyFilter();
          this.categoryService.invalidateCache();
          this.successMessage = `Category "${updated.name}" updated successfully.`;
          this.closeEditModal();
        },
        error: (err: Error) => {
          this.editError = err.message;
          this.isUpdating = false;
        },
      });
  }

  // ── Delete Modal ──
  openDeleteConfirm(category: Category): void {
    this.categoryToDelete = category;
    this.errorMessage = null;
    this.successMessage = null;
  }

  closeDeleteConfirm(): void {
    this.categoryToDelete = null;
    this.isDeleting = false;
  }

  confirmDelete(): void {
    if (!this.categoryToDelete) return;
    this.isDeleting = true;

    const id = this.categoryToDelete.id;
    const name = this.categoryToDelete.name;

    this.adminService
      .deleteCategory(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.categories = this.categories.filter((c) => c.id !== id);
          this.applyFilter();
          this.categoryService.invalidateCache();
          this.successMessage = `Category "${name}" was deleted successfully.`;
          this.closeDeleteConfirm();
        },
        error: (err: Error) => {
          this.errorMessage = `Failed to delete category: ${err.message}`;
          this.isDeleting = false;
        },
      });
  }
}
