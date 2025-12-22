import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MOCK_PRODUCTS, CATEGORIES } from '../../services/mock-products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredProducts = MOCK_PRODUCTS.filter(p => p.isFeatured);
  categories = CATEGORIES;

  constructor(private router: Router) { }

  ngOnInit(): void {}

  goToShop(): void {
    this.router.navigate(['/shop']);
  }

  goToTryOn(): void {
    this.router.navigate(['/try-on']);
  }

  goToProduct(id: string): void {
    this.router.navigate(['/product', id]);
  }

  goToCategory(category: string): void {
    if (category === 'ALL') {
      this.router.navigate(['/shop']);
    } else {
      this.router.navigate(['/shop'], { queryParams: { category } });
    }
  }
}