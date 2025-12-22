import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MOCK_PRODUCTS, CATEGORIES } from '../../services/mock-products.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  allProducts: Product[] = MOCK_PRODUCTS;
  filteredProducts: Product[] = [];
  categories = CATEGORIES;
  selectedCategory = 'ALL';
  sortOptions = ['NEWEST', 'PRICE LOW-HIGH', 'PRICE HIGH-LOW', 'POPULAR'];
  selectedSort = 'NEWEST';
  searchQuery = '';
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
      }
      this.filterProducts();
    });
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
          p.tags.some(tag => tag.toLowerCase().includes(query))
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
  // Add these to your component
viewMode: 'grid' | 'list' = 'grid';
gridSize: 'small' | 'medium' | 'large' = 'medium';

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

getDiscountPercent(product: any): number {
  if (!product.originalPrice) return 0;
  return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
}

setViewMode(mode: 'grid' | 'list'): void {
  this.viewMode = mode;
}

addToCart(product: any): void {
  // Implement add to cart logic
  console.log('Added to cart:', product);
  // You can add a toast notification here
}

tryOnProduct(product: any): void {
  // Navigate to try-on page with product
  this.router.navigate(['/try-on'], { 
    queryParams: { productId: product.id } 
  });
}

toggleFavorite(productId: string): void {
  // Toggle favorite status
  console.log('Toggled favorite for:', productId);
}

}