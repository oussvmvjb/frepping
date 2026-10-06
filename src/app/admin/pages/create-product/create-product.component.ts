import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminProductService } from '../../services/admin-product.service';
import { Category, CreateProductRequest } from '../../models/admin.models';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  categories: Category[] = [];
  isLoadingCategories = false;
  categoryError: string | null = null;

  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private adminService: AdminProductService
  ) {
    this.productForm = this.buildForm();
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── Form construction ────────────────────────────────────────────────────

  private buildForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      slug: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      category_id: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      compare_price: [null, Validators.min(0)],
      material: ['', Validators.maxLength(255)],
      is_active: [true],
      is_featured: [false],
      images: this.fb.array([]),
      variants: this.fb.array([]),
    });
  }

  // ─── Getters ──────────────────────────────────────────────────────────────

  get images(): FormArray {
    return this.productForm.get('images') as FormArray;
  }

  get variants(): FormArray {
    return this.productForm.get('variants') as FormArray;
  }

  // ─── Field helpers ────────────────────────────────────────────────────────

  isFieldInvalid(controlName: string): boolean {
    const control = this.productForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isVariantFieldInvalid(variantIndex: number, fieldName: string): boolean {
    const control = this.variants.at(variantIndex)?.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isImageFieldInvalid(imageIndex: number, fieldName: string): boolean {
    const control = this.images.at(imageIndex)?.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  // ─── Slug auto-generation from name ──────────────────────────────────────

  onNameInput(): void {
    const nameVal: string = this.productForm.get('name')?.value || '';
    const slugControl = this.productForm.get('slug');
    if (slugControl && !slugControl.dirty) {
      const slug = nameVal
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      slugControl.setValue(slug);
    }
  }

  // ─── Categories ───────────────────────────────────────────────────────────

  loadCategories(): void {
    this.isLoadingCategories = true;
    this.categoryError = null;

    this.adminService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cats) => {
          this.categories = cats;
          this.isLoadingCategories = false;
        },
        error: (err: Error) => {
          this.categoryError = err.message;
          this.isLoadingCategories = false;
        },
      });
  }

  // ─── Images FormArray ─────────────────────────────────────────────────────

  createImageGroup(): FormGroup {
    return this.fb.group({
      image_url: ['', Validators.required],
      alt_text: [''],
      sort_order: [0, Validators.min(0)],
      is_primary: [false],
    });
  }

  addImage(): void {
    this.images.push(this.createImageGroup());
  }

  removeImage(index: number): void {
    this.images.removeAt(index);
  }

  // ─── Variants FormArray ───────────────────────────────────────────────────

  createVariantGroup(): FormGroup {
    return this.fb.group({
      size: [''],
      color: [''],
      sku: ['', [Validators.required, Validators.maxLength(100)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      price: [null, Validators.min(0)],
      is_active: [true],
    });
  }

  addVariant(): void {
    this.variants.push(this.createVariantGroup());
  }

  removeVariant(index: number): void {
    this.variants.removeAt(index);
  }

  // ─── Submit ───────────────────────────────────────────────────────────────

  onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.errorMessage = 'Please fix the errors in the form before submitting.';
      return;
    }

    const raw = this.productForm.getRawValue();

    const payload: CreateProductRequest = {
      name: raw.name.trim(),
      slug: raw.slug.trim(),
      description: raw.description?.trim() || null,
      price: Number(raw.price),
      compare_price: raw.compare_price != null ? Number(raw.compare_price) : null,
      material: raw.material?.trim() || null,
      is_active: raw.is_active,
      is_featured: raw.is_featured,
      category_id: raw.category_id,
      images: (raw.images as any[]).map((img) => ({
        image_url: img.image_url.trim(),
        alt_text: img.alt_text?.trim() || null,
        sort_order: Number(img.sort_order) || 0,
        is_primary: img.is_primary,
      })),
      variants: (raw.variants as any[]).map((v) => ({
        size: v.size?.trim() || null,
        color: v.color?.trim() || null,
        sku: v.sku.trim(),
        stock: Number(v.stock),
        price: v.price != null ? Number(v.price) : null,
        is_active: v.is_active,
      })),
    };

    this.isSubmitting = true;

    this.adminService
      .createProduct(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.successMessage = `✅ Product "${response.name}" created successfully!`;
          this.productForm = this.buildForm();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: (err: Error) => {
          this.isSubmitting = false;
          this.errorMessage = err.message;
        },
      });
  }
}
