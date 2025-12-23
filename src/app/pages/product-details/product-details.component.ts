import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product';
import { MOCK_PRODUCTS } from '../../services/mock-products.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;
  selectedSize: string = '';
  selectedColor: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.product = MOCK_PRODUCTS.find(p => p.id === id);
    }

    // Default selections
    if (this.product) {
      if (this.product.sizes?.length > 0) this.selectedSize = this.product.sizes[0];
      if (this.product.colors?.length > 0) this.selectedColor = this.product.colors[0];
    }
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  addToCart(): void {
    if (!this.product) return;

    console.log('Adding to cart:', {
      product: this.product,
      size: this.selectedSize,
      color: this.selectedColor
    });
    // TODO: Implement actual cart service
    alert('Added to cart!');
  }

  tryOn(): void {
    if (!this.product) return;
    this.router.navigate(['/try-on'], { queryParams: { productId: this.product.id } });
  }

  goBack(): void {
    this.router.navigate(['/shop']);
  }
}
