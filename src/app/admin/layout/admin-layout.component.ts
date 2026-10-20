import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent {
  navOpen = false;

  navLinks = [
    { label: 'Dashboard', icon: '📊', route: '/admin/dashboard', exact: true },
    { label: 'Orders', icon: '📦', route: '/admin/orders', exact: false },
    { label: 'All Products', icon: '🛍️', route: '/admin/products', exact: true },
    { label: 'All Categories', icon: '🗂️', route: '/admin/categories', exact: false },
    { label: 'Add Product', icon: '＋', route: '/admin/products/new', exact: true },
    { label: 'Inventory', icon: '⚠️', route: '/admin/inventory', exact: false },
    { label: 'Gift Cards', icon: '💳', route: '/admin/gift-cards', exact: false },
    { label: 'Promo Codes', icon: '🎟️', route: '/admin/promos', exact: false },
    { label: 'Delivery', icon: '🚚', route: '/admin/delivery-options', exact: false },
    { label: 'User Directory', icon: '👥', route: '/admin/users', exact: false },
  ];

  toggleNav(): void {
    this.navOpen = !this.navOpen;
  }
}
