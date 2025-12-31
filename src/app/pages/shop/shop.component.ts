import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MOCK_PRODUCTS, CATEGORIES } from '../../services/mock-products.service';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  onProductClick(product: Product): void {
    if (!product) return;
    this.goToProduct(product.id);
  }
  allProducts: Product[] = MOCK_PRODUCTS;
  filteredProducts: Product[] = [];
  categories = CATEGORIES;
  selectedCategory = 'ALL';
  sortOptions = ['NEWEST', 'PRICE LOW-HIGH', 'PRICE HIGH-LOW', 'POPULAR'];
  selectedSort = 'NEWEST';
  searchQuery = '';
  isLoading = false;
  viewMode: 'grid' | 'list' = 'grid';
  gridSize: 'small' | 'medium' | 'large' = 'medium';

  // 3D View State Management
  product3DView: { [productId: string]: boolean } = {};
  productIsRotating: { [productId: string]: boolean } = {};
  favorites: { [productId: string]: boolean } = {};

  // Product details sidebar state
  selectedProduct: Product | null = null;
  selectedSize: string = '';
  selectedColor: string = '';
  isRotating: boolean = true;
  show3DView: boolean = true;
  selectedImageIndex: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
      }
      // Check if product is selected from URL
      if (params['productId']) {
        const productId = params['productId'];
        this.selectedProduct = this.allProducts.find(p => p.id === productId) || null;
      }
      this.filterProducts();
    });
  }

  // Method to select product for details view
  selectProduct(product: Product): void {
    this.selectedProduct = product;
    this.selectedSize = '';
    this.selectedColor = '';
    this.isRotating = true;
    this.show3DView = this.has3DModel(product);
    this.selectedImageIndex = 0;
    // Update URL without reloading
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { productId: product.id },
      queryParamsHandling: 'merge'
    });
  }

  // Method to close product details
  closeProductDetails(): void {
    this.selectedProduct = null;
    // Update URL without reloading
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { productId: null },
      queryParamsHandling: 'merge'
    });
  }

  // Check if selected product has 3D model
  get selectedProductHas3DModel(): boolean {
    return this.selectedProduct ? this.has3DModel(this.selectedProduct) : false;
  }

  // Get current image for selected product
  getCurrentImage(): string {
    if (!this.selectedProduct || !this.selectedProduct.images) return '';
    return this.selectedProduct.images[this.selectedImageIndex];
  }

  // Select image from thumbnails
  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  // Toggle 3D rotation
  toggleRotation(): void {
    this.isRotating = !this.isRotating;
  }

  // Change color (to be implemented in ModelViewerComponent)
  changeColor(): void {
    console.log('Change color for selected product');
    // This should trigger a method in ModelViewerComponent
    // You can use ViewChild or Service for communication
  }

  // Reset 3D view
  resetView(): void {
    this.isRotating = true;
    this.selectedImageIndex = 0;
    // This should trigger a method in ModelViewerComponent
  }
  // Handle window resize for responsive layout
  @HostListener('window:resize')
  onResize(): void {
    // Close sidebar on mobile when screen gets too small
    if (window.innerWidth < 768 && this.selectedProduct) {
      this.closeProductDetails();
    }
  }

  filterProducts(): void {
    this.isLoading = true;
    
    // Simulate API delay
    setTimeout(() => {
      let filtered = [...this.allProducts];
      
      // Filter by category
      if (this.selectedCategory !== 'ALL') {
        filtered = filtered.filter(p => p.category === this.selectedCategory);
      }
      
      // Filter by search query
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(query) || 
          p.description.toLowerCase().includes(query) ||
          (p.tags && p.tags.some((tag: string) => tag.toLowerCase().includes(query)))
        );
      }
      
      // Sort products
      this.filteredProducts = this.sortProducts(filtered);
      this.isLoading = false;
    }, 300);
  }

  sortProducts(products: Product[]): Product[] {
    switch (this.selectedSort) {
      case 'PRICE LOW-HIGH':
        return [...products].sort((a, b) => a.price - b.price);
      case 'PRICE HIGH-LOW':
        return [...products].sort((a, b) => b.price - a.price);
      case 'POPULAR':
        return [...products].sort((a, b) => b.rating - a.rating);
      case 'NEWEST':
      default:
        return products;
    }
  }

  onCategorySelect(category: string): void {
    this.selectedCategory = category;
    this.filterProducts();
  }

  onSortChange(): void {
    this.filterProducts();
  }

  onSearch(): void {
    this.filterProducts();
  }

  clearFilters(): void {
    this.selectedCategory = 'ALL';
    this.searchQuery = '';
    this.selectedSort = 'NEWEST';
    this.filterProducts();
  }

  goToProduct(id: string): void {
    this.router.navigate(['/product', id]);
  }

  // Helper methods
  getCategoryIcon(category: string): string {
    const icons: {[key: string]: string} = {
      'TOPS': 'fas fa-tshirt',
      'BOTTOMS': 'fas fa-vest',
      'SHOES': 'fas fa-shoe-prints',
      'ACCESSORIES': 'fas fa-gem',
      'OUTERWEAR': 'fas fa-jacket'
    };
    return icons[category] || 'fas fa-store';
  }

  getDiscountPercent(product: Product): number {
    if (!product.originalPrice) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  }

  // Check if product has 3D model


  // 3D Model Controls
  toggleProduct3DView(productId: string): void {
    this.product3DView[productId] = !this.product3DView[productId];
    // Enable rotation by default when switching to 3D view
    if (this.product3DView[productId]) {
      this.productIsRotating[productId] = true;
    }
  }

  toggleProductRotation(productId: string): void {
    this.productIsRotating[productId] = !this.productIsRotating[productId];
  }

  changeProductColor(productId: string): void {
    console.log('Change color for product:', productId);
    // This would call a method in ModelViewerComponent
    // We'll implement this via ViewChild if needed
  }

  resetProductView(productId: string): void {
    this.product3DView[productId] = false;
    this.productIsRotating[productId] = false;
  }

  // Product Actions
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    console.log('Added to cart:', product.name);
    // Implement your cart logic here
    // Example: this.cartService.addToCart(product);
  }

  tryOnProduct(product: Product): void {
    console.log('Try on:', product.name);
    this.router.navigate(['/try-on'], { 
      queryParams: { productId: product.id } 
    });
  }

  toggleFavorite(productId: string): void {
    this.favorites[productId] = !this.favorites[productId];
    console.log('Toggled favorite for:', productId, 'Status:', this.favorites[productId]);
  }

  isFavorite(productId: string): boolean {
    return !!this.favorites[productId];
  }
  // Dans votre composant shop.component.ts

// Méthode pour obtenir l'image du produit (sauter les fichiers 3D)
getProductImage(product: Product): string {
  if (!product.images || product.images.length === 0) {
    return 'assets/images/placeholder.jpg';
  }
  
  // Chercher une image (pas un fichier 3D)
  for (const image of product.images) {
    if (!this.is3DFile(image)) {
      return image;
    }
  }
  
  // Si toutes les images sont des fichiers 3D, prendre la première
  return product.images[0];
}

// Méthode pour vérifier si un fichier est un modèle 3D
is3DFile(filename: string): boolean {
  if (!filename) return false;
  
  const lowerFilename = filename.toLowerCase();
  return lowerFilename.endsWith('.obj') || 
         lowerFilename.endsWith('.glb') || 
         lowerFilename.endsWith('.gltf') ||
         lowerFilename.endsWith('.fbx');
}

// Méthode pour gérer les erreurs d'image
handleImageError(product: Product, event: any): void {
  console.log('❌ Erreur de chargement d\'image pour:', product.name);
  
  // Si c'est un fichier 3D, afficher un placeholder spécial
  if (this.is3DFile(event.target.src)) {
    event.target.style.display = 'none';
    const parent = event.target.parentElement;
    
    // Créer un placeholder pour les modèles 3D
    const placeholder = document.createElement('div');
    placeholder.className = 'product-3d-placeholder';
    placeholder.innerHTML = `
      <i class="fas fa-cube"></i>
      <span>3D MODEL</span>
      <small>Cliquez pour voir</small>
    `;
    
    parent.appendChild(placeholder);
  } else {
    // Pour les images normales, utiliser le placeholder par défaut
    event.target.src = 'assets/images/placeholder.jpg';
  }
}

// Méthode pour vérifier si le produit a un modèle 3D (pour le badge)
has3DModel(product: Product): boolean {
  if (!product.images) return false;
  
  return product.images.some(image => this.is3DFile(image)) || 
         product.has3DModel || 
         false;
}
}