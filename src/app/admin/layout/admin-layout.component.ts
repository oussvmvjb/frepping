import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent {
  navOpen = false;

  navLinks = [
    { label: 'All Products', icon: '🛍️', route: '/admin/products', exact: true },
    { label: 'All Categories', icon: '🗂️', route: '/admin/categories', exact: false },
    { label: 'Add Product', icon: '＋', route: '/admin/products/new', exact: true },
  ];

  toggleNav(): void {
    this.navOpen = !this.navOpen;
  }
}
