import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ModelViewerComponent } from '../../components/model-viewer/model-viewer.component';
import {
  ApiProduct,
  getEffectivePrice,
  getPrimaryImage,
  getDiscountPercent,
  isProductInStock,
  getTotalStock,
} from '../../models/api-product.model';
import { ProductVariant } from '../../models/product-variant.model';
import { ProductImage } from '../../models/product-image.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  product: ApiProduct | null = null;
  selectedVariant: ProductVariant | null = null;
  selectedSize: string = '';
  selectedColor: string = '';
  selectedImageIndex: number = 0;

  isLoading = true;
  notFound = false;
  errorMessage: string | null = null;

  isRotating: boolean = true;
  has3DModel: boolean = false;
  show3DView: boolean = false;
  model3DUrl: string | null = null;

  @ViewChild(ModelViewerComponent) modelViewer!: ModelViewerComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
      } else {
        this.notFound = true;
        this.isLoading = false;
      }
    });
  }

  loadProduct(id: string): void {
    this.isLoading = true;
    this.notFound = false;
    this.errorMessage = null;

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
        this.initProductState();
      },
      error: (err: Error) => {
        this.isLoading = false;
        if (err.message.includes('404') || err.message.toLowerCase().includes('not found')) {
          this.notFound = true;
        } else {
          this.errorMessage = err.message || 'Failed to load product details.';
        }
      },
    });
  }

  private initProductState(): void {
    if (!this.product) return;

    this.checkFor3DModel();

    // Auto-select first active variant with stock, or first variant
    const activeVariants = this.product.variants.filter((v) => v.is_active && v.stock > 0);
    const defaultVariant = activeVariants[0] || this.product.variants[0] || null;

    if (defaultVariant) {
      this.selectedVariant = defaultVariant;
      if (defaultVariant.size) this.selectedSize = defaultVariant.size;
      if (defaultVariant.color) this.selectedColor = defaultVariant.color;
    }

    // Set primary image index
    if (this.product.images?.length > 0) {
      const primaryIdx = this.product.images.findIndex((img) => img.is_primary);
      this.selectedImageIndex = primaryIdx >= 0 ? primaryIdx : 0;
    }
  }

  checkFor3DModel(): void {
    if (!this.product || !this.product.images || this.product.images.length === 0) {
      this.has3DModel = false;
      this.show3DView = false;
      return;
    }

    const modelImg = this.product.images.find(
      (img) =>
        img.image_url?.endsWith('.glb') ||
        img.image_url?.endsWith('.gltf') ||
        img.image_url?.endsWith('.obj')
    );

    if (modelImg) {
      this.has3DModel = true;
      this.model3DUrl = modelImg.image_url;
      this.show3DView = true;
    } else {
      this.has3DModel = false;
      this.show3DView = false;
    }
  }

  // ── Variant Helpers ────────────────────────────────────────────────────────

  get availableSizes(): string[] {
    if (!this.product?.variants) return [];
    const sizes = this.product.variants
      .map((v) => v.size)
      .filter((s): s is string => !!s);
    return Array.from(new Set(sizes));
  }

  get availableColors(): string[] {
    if (!this.product?.variants) return [];
    const colors = this.product.variants
      .map((v) => v.color)
      .filter((c): c is string => !!c);
    return Array.from(new Set(colors));
  }

  selectSize(size: string): void {
    this.selectedSize = size;
    this.updateSelectedVariant();
  }

  selectColor(color: string): void {
    this.selectedColor = color;
    this.updateSelectedVariant();
  }

  private updateSelectedVariant(): void {
    if (!this.product?.variants) return;

    const match = this.product.variants.find((v) => {
      const sizeMatch = !this.selectedSize || v.size === this.selectedSize;
      const colorMatch = !this.selectedColor || v.color === this.selectedColor;
      return sizeMatch && colorMatch;
    });

    this.selectedVariant = match || null;
  }

  isSizeAvailable(size: string): boolean {
    if (!this.product?.variants) return false;
    return this.product.variants.some(
      (v) =>
        v.size === size &&
        v.is_active &&
        v.stock > 0 &&
        (!this.selectedColor || v.color === this.selectedColor)
    );
  }

  isColorAvailable(color: string): boolean {
    if (!this.product?.variants) return false;
    return this.product.variants.some(
      (v) =>
        v.color === color &&
        v.is_active &&
        v.stock > 0 &&
        (!this.selectedSize || v.size === this.selectedSize)
    );
  }

  // ── Pricing & Stock ───────────────────────────────────────────────────────

  get currentPrice(): number {
    if (!this.product) return 0;
    return getEffectivePrice(this.product, this.selectedVariant);
  }

  get discountPercent(): number {
    if (!this.product) return 0;
    return getDiscountPercent(this.product);
  }

  get isInStock(): boolean {
    if (!this.product) return false;
    if (this.selectedVariant) {
      return this.selectedVariant.is_active && this.selectedVariant.stock > 0;
    }
    return isProductInStock(this.product);
  }

  get stockCount(): number {
    if (this.selectedVariant) return this.selectedVariant.stock;
    if (this.product) return getTotalStock(this.product) ?? 0;
    return 0;
  }

  // ── Images & 3D ───────────────────────────────────────────────────────────

  getCurrentImage(): string {
    if (!this.product?.images || this.product.images.length === 0) {
      return 'assets/placeholder.jpg';
    }
    const regularImages = this.getImageThumbnails();
    if (regularImages.length === 0) return 'assets/placeholder.jpg';
    const selected = regularImages[this.selectedImageIndex];
    return selected ? selected.image_url : regularImages[0].image_url;
  }

  getImageThumbnails(): ProductImage[] {
    if (!this.product?.images) return [];
    return this.product.images.filter(
      (img) =>
        !img.image_url.endsWith('.obj') &&
        !img.image_url.endsWith('.fbx') &&
        !img.image_url.endsWith('.glb') &&
        !img.image_url.endsWith('.gltf')
    );
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
    this.show3DView = false;
  }

  toggleRotation(): void {
    this.isRotating = !this.isRotating;
  }

  resetModel(): void {
    this.isRotating = true;
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  addToCart(): void {
    if (!this.product || !this.isInStock) return;
    this.cartService.addToCart(this.product, 1, this.selectedVariant);
  }

  tryOn(): void {
    if (!this.product) return;
    this.router.navigate(['/try-on'], {
      queryParams: {
        productId: this.product.id,
        modelUrl: this.model3DUrl,
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/shop']);
  }
}