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
    
    console.log('🎯 Produit chargé:', this.product?.name);
    console.log('🏙️ addStreetBackground initial:', this.addStreetBackground);
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
    
    console.log('🔍 Vérification modèle 3D:', {
      firstImage,
      has3DModel: this.has3DModel,
      productHas3DModel: this.product.has3DModel
    });
    
    // Show 3D view by default if available
    this.show3DView = this.has3DModel;
  }

  // 3D Controls
  toggleRotation(): void {
    this.isRotating = !this.isRotating;
    console.log('🔄 Rotation:', this.isRotating ? 'ON' : 'OFF');
  }

  toggleBackground(): void {
    this.addStreetBackground = !this.addStreetBackground;
    console.log('🏙️ Fond changé:', this.addStreetBackground ? 'STREET' : 'STUDIO');
    
    // Mettre à jour le ModelViewer si nécessaire
    // Note: Vous devrez peut-être recréer le ModelViewerComponent
  }

  changeModelColor(): void {
    if (this.modelViewer) {
      console.log('🎨 Changement de couleur');
      const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      this.modelViewer.changeColor(randomColor);
    } else {
      console.log('❌ modelViewer non disponible');
    }
  }

  resetModel(): void {
    this.isRotating = true;
    console.log('🔄 Réinitialisation modèle');
    // Vous pouvez ajouter d'autres logiques de réinitialisation ici
  }

  getCurrentImage(): string {
    if (!this.product?.images || this.product.images.length === 0) {
      return 'assets/images/placeholder.jpg';
    }
    
    // If showing 3D, return first image (might be 3D model)
    if (this.show3DView && this.has3DModel) {
      console.log('📷 Image 3D sélectionnée:', this.product.images[0]);
      return this.product.images[0];
    }
    
    // Otherwise, return the selected image from thumbnails
    const images = this.getImageThumbnails();
    return images[this.selectedImageIndex] || images[0] || 'assets/images/placeholder.jpg';
  }

  getImageThumbnails(): string[] {
    if (!this.product?.images) return [];
    
    console.log('📸 Images disponibles:', this.product.images);
    
    // Filter out 3D models, only return regular images
    const thumbnails = this.product.images.filter(img => 
      !img.endsWith('.obj') && 
      !img.endsWith('.fbx') && 
      !img.endsWith('.glb') &&
      !img.endsWith('.gltf')
    );
    
    console.log('🖼️ Miniatures filtrées:', thumbnails);
    return thumbnails;
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
    console.log('🖼️ Image sélectionnée:', index);
  }

  selectSize(size: string): void {
    this.selectedSize = size;
    console.log('📏 Taille sélectionnée:', size);
  }

  selectColor(color: string): void {
    this.selectedColor = color;
    console.log('🎨 Couleur sélectionnée:', color);
  }

  tryOn(): void {
    if (!this.product) return;
    console.log('📷 Essayage virtuel:', this.product.name);
    this.router.navigate(['/try-on'], { 
      queryParams: { 
        productId: this.product.id,
        modelUrl: this.has3DModel ? this.product.images[0] : null,
        backgroundMode: this.addStreetBackground ? 'street' : 'studio'
      } 
    });
  }

  goBack(): void {
    console.log('⬅️ Retour');
    this.router.navigate(['/shop']);
  }
  
  addToCart(product: Product): void {
    console.log('🛒 Ajout au panier:', product.name);
    this.cartService.addToCart(product);
  }
}