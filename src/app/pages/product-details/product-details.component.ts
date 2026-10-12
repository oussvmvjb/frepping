import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductService } from "../../services/product.service";
import { CartService } from "../../services/cart.service";
import { LikeService } from "../../services/like.service";
import { AuthService } from "../../services/auth.service";
import { ModelViewerComponent } from "../../components/model-viewer/model-viewer.component";
import { Product, ProductVariant, ProductImage } from "../../models/api.models";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-product-details",
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.scss"],
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  selectedVariant: ProductVariant | null = null;
  selectedSize = "";
  selectedColor = "";
  selectedImageIndex = 0;

  isLoading = true;
  notFound = false;
  errorMessage: string | null = null;
  isAddingToCart = false;
  toastMessage: string | null = null;

  isRotating = true;
  has3DModel = false;
  show3DView = false;
  model3DUrl: string | null = null;
  etherColors: string[] = ["#5227FF", "#FF9FFC", "#B497CF"];

  @ViewChild(ModelViewerComponent) modelViewer!: ModelViewerComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private likeService: LikeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get("id");
      if (id) this.loadProduct(id);
      else { this.notFound = true; this.isLoading = false; }
    });
  }

  loadProduct(id: string): void {
    this.isLoading = true;
    this.notFound = false;
    this.errorMessage = null;

    this.productService.getProductById(id).subscribe({
      next: product => {
        this.product = product;
        this.isLoading = false;
        this.initProductState();
      },
      error: (err: Error) => {
        this.isLoading = false;
        if (err.message.includes("404") || err.message.toLowerCase().includes("not found")) {
          this.notFound = true;
        } else {
          this.errorMessage = err.message;
        }
      },
    });
  }

  private initProductState(): void {
    if (!this.product) return;
    this.checkFor3DModel();

    const activeVariants = this.product.variants.filter(v => v.is_active && v.stock > 0);
    const defaultVariant = activeVariants[0] || this.product.variants[0] || null;

    if (defaultVariant) {
      this.selectedVariant = defaultVariant;
      if (defaultVariant.size) this.selectedSize = defaultVariant.size;
      if (defaultVariant.color) this.selectedColor = defaultVariant.color;
    }

    if (this.product.images?.length > 0) {
      const primaryIdx = this.product.images.findIndex(img => img.is_primary);
      this.selectedImageIndex = primaryIdx >= 0 ? primaryIdx : 0;
    }
  }

  checkFor3DModel(): void {
    if (!this.product?.images?.length) {
      this.has3DModel = false;
      this.show3DView = false;
      return;
    }

    const modelImg = this.product.images.find(
      img => img.image_url?.endsWith(".glb") || img.image_url?.endsWith(".gltf") || img.image_url?.endsWith(".obj")
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

  // -- Variant Helpers --------------------------------------------------------

  get availableSizes(): string[] {
    return Array.from(new Set(
      (this.product?.variants ?? []).map(v => v.size).filter((s): s is string => !!s)
    ));
  }

  get availableColors(): string[] {
    return Array.from(new Set(
      (this.product?.variants ?? []).map(v => v.color).filter((c): c is string => !!c)
    ));
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
    const match = this.product.variants.find(v => {
      const sizeMatch = !this.selectedSize || v.size === this.selectedSize;
      const colorMatch = !this.selectedColor || v.color === this.selectedColor;
      return sizeMatch && colorMatch;
    });
    this.selectedVariant = match || null;
  }

  isSizeAvailable(size: string): boolean {
    return (this.product?.variants ?? []).some(
      v => v.size === size && v.is_active && v.stock > 0 && (!this.selectedColor || v.color === this.selectedColor)
    );
  }

  isColorAvailable(color: string): boolean {
    return (this.product?.variants ?? []).some(
      v => v.color === color && v.is_active && v.stock > 0 && (!this.selectedSize || v.size === this.selectedSize)
    );
  }

  // -- Pricing & Stock (from API) ---------------------------------------------

  get currentPrice(): number {
    if (!this.product) return 0;
    if (this.selectedVariant?.price != null) return Number(this.selectedVariant.price);
    return Number(this.product.price);
  }

  get discountPercent(): number {
    return this.product?.discount_percent ?? 0;
  }

  get isInStock(): boolean {
    if (!this.product) return false;
    if (this.selectedVariant) return this.selectedVariant.is_active && this.selectedVariant.stock > 0;
    return this.product.in_stock;
  }

  get stockCount(): number {
    if (this.selectedVariant) return this.selectedVariant.stock;
    if (!this.product?.variants?.length) return 0;
    return this.product.variants.filter(v => v.is_active).reduce((s, v) => s + v.stock, 0);
  }

  get likesCount(): number {
    return this.product?.likes_count ?? 0;
  }

  get isLiked(): boolean {
    return this.product?.is_liked ?? false;
  }

  // -- Images & 3D -----------------------------------------------------------

  getCurrentImage(): string {
    const regular = this.getImageThumbnails();
    if (!regular.length) return "assets/placeholder.jpg";
    return regular[this.selectedImageIndex]?.image_url ?? regular[0].image_url;
  }

  getImageThumbnails(): ProductImage[] {
    return (this.product?.images ?? []).filter(
      img => !img.image_url.endsWith(".obj") && !img.image_url.endsWith(".fbx") &&
             !img.image_url.endsWith(".glb") && !img.image_url.endsWith(".gltf")
    );
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
    this.show3DView = false;
  }

  toggleRotation(): void { this.isRotating = !this.isRotating; }
  resetModel(): void { this.isRotating = true; }

  // -- Like -----------------------------------------------------------------

  toggleLike(): void {
    if (!this.product) return;

    if (!this.authService.getAccessToken()) {
      this.router.navigate(["/login"]);
      return;
    }

    const wasLiked = this.product.is_liked;
    this.product.is_liked = !wasLiked;
    this.product.likes_count += wasLiked ? -1 : 1;

    const obs$ = wasLiked ? this.likeService.unlike(this.product.id) : this.likeService.like(this.product.id);
    obs$.subscribe({
      error: () => {
        if (this.product) {
          this.product.is_liked = wasLiked;
          this.product.likes_count += wasLiked ? 1 : -1;
        }
      },
    });
  }

  // -- Cart ------------------------------------------------------------------

  addToCart(): void {
    if (!this.product || !this.isInStock || this.isAddingToCart) return;

    // Require variant selection when sizes/colors exist
    if ((this.availableSizes.length > 0 || this.availableColors.length > 0) && !this.selectedVariant) {
      this.showToast("Please select a size/color first.");
      return;
    }

    const isLoggedIn = !!this.authService.getAccessToken();
    if (!isLoggedIn) {
      this.cartService.addGuestItem({
        product_id: this.product.id,
        variant_id: this.selectedVariant?.id ?? null,
        quantity: 1,
      });
      this.showToast("Added to bag!");
      return;
    }

    this.isAddingToCart = true;
    this.cartService.addItem({
      product_id: this.product.id,
      variant_id: this.selectedVariant?.id ?? null,
      quantity: 1,
    })
    .pipe(finalize(() => (this.isAddingToCart = false)))
    .subscribe({
      next: () => this.showToast("Added to bag! ???"),
      error: (err: Error) => this.showToast(err.message, true),
    });
  }

  tryOn(): void {
    if (!this.product) return;
    this.router.navigate(["/try-on"], {
      queryParams: { productId: this.product.id, modelUrl: this.model3DUrl },
    });
  }

  goBack(): void { this.router.navigate(["/shop"]); }

  private showToast(msg: string, isError = false): void {
    this.toastMessage = msg;
    setTimeout(() => (this.toastMessage = null), 3000);
  }
}
