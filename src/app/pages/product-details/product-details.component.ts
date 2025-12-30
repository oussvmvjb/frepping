import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product';
import { MOCK_PRODUCTS } from '../../services/mock-products.service';
import { ModelViewerComponent } from '../../components/model-viewer/model-viewer.component';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;
  selectedSize: string = '';
  selectedColor: string = '';
  selectedImageIndex: number = 0;
  isRotating: boolean = true;
  has3DModel: boolean = false;
  show3DView: boolean = true;
  addStreetBackground: boolean = true; // Propriété pour le fond
  
  @ViewChild(ModelViewerComponent) modelViewer!: ModelViewerComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.product = MOCK_PRODUCTS.find(p => p.id === id);
      this.checkFor3DModel();
    }

    // Default selections
    if (this.product) {
      if (this.product.sizes?.length > 0) this.selectedSize = this.product.sizes[0];
      if (this.product.colors?.length > 0) this.selectedColor = this.product.colors[0];
    }
  }

  checkFor3DModel(): void {
    if (!this.product || !this.product.images || this.product.images.length === 0) {
      this.has3DModel = false;
      this.show3DView = false;
      return;
    }
    
    // Check if first image is a 3D model
    const firstImage = this.product.images[0];
    this.has3DModel = firstImage?.endsWith('.obj') || 
                     firstImage?.endsWith('.glb') ||
                     firstImage?.endsWith('.gltf') ||
                     this.product.has3DModel || 
                     false;
    
    // Show 3D view by default if available
    this.show3DView = this.has3DModel;
  }

  // 3D Controls
  toggleRotation(): void {
    this.isRotating = !this.isRotating;
  }

  toggleBackground(): void {
    this.addStreetBackground = !this.addStreetBackground;
    // Optionnel: vous pouvez forcer un rechargement si nécessaire
  }

  changeModelColor(): void {
    if (this.modelViewer) {
      // Changer la couleur du modèle
      const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      this.modelViewer.changeColor(randomColor);
    }
  }

  resetModel(): void {
    this.isRotating = true;
    // Réinitialiser d'autres propriétés si nécessaire
  }

  getCurrentImage(): string {
    if (!this.product?.images || this.product.images.length === 0) {
      return 'assets/images/placeholder.jpg';
    }
    
    // If showing 3D, return first image (might be 3D model)
    if (this.show3DView && this.has3DModel) {
      return this.product.images[0];
    }
    
    // Otherwise, return the selected image from thumbnails
    const images = this.getImageThumbnails();
    return images[this.selectedImageIndex] || images[0] || 'assets/images/placeholder.jpg';
  }

  getImageThumbnails(): string[] {
    if (!this.product?.images) return [];
    
    // Filter out 3D models, only return regular images
    return this.product.images.filter(img => 
      !img.endsWith('.obj') && 
      !img.endsWith('.fbx') && 
      !img.endsWith('.glb') &&
      !img.endsWith('.gltf')
    );
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  tryOn(): void {
    if (!this.product) return;
    this.router.navigate(['/try-on'], { 
      queryParams: { 
        productId: this.product.id,
        modelUrl: this.has3DModel ? this.product.images[0] : null,
        backgroundMode: this.addStreetBackground ? 'street' : 'studio'
      } 
    });
  }

  goBack(): void {
    this.router.navigate(['/shop']);
  }
  
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    console.log('Added to cart:', product.name);
  }
}