import { Component } from '@angular/core';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss']
})
export class BottomNavComponent {
  navItems = [
    { path: '/', icon: 'fas fa-home', label: 'HOME' },
    { path: '/shop', icon: 'fas fa-store', label: 'SHOP' },
    { path: '/try-on', icon: 'fas fa-user', label: 'TRY-ON' },
    { path: '/cart', icon: 'fas fa-shopping-cart', label: 'CART' },
    { path: '/profile', icon: 'fas fa-user-circle', label: 'PROFILE' }
  ];

  cartItemCount = 3; // This should come from CartService
}