import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss']
})
export class BottomNavComponent {
  cartItemCount = 3; // Mock cart count

  navItems = [
    { path: '/', icon: 'fas fa-home', label: 'HOME', active: true },
    { path: '/shop', icon: 'fas fa-store', label: 'SHOP', active: false },
    { path: '/try-on', icon: 'fas fa-user', label: 'TRY-ON', active: false },
    { path: '/cart', icon: 'fas fa-shopping-cart', label: 'CART', active: false },
    { path: '/profile', icon: 'fas fa-user-circle', label: 'PROFILE', active: false }
  ];

  constructor(private router: Router) {
    this.updateActiveNav();
    this.router.events.subscribe(() => {
      this.updateActiveNav();
    });
  }

  updateActiveNav(): void {
    const currentPath = this.router.url;
    this.navItems.forEach(item => {
      item.active = currentPath === item.path || 
                   (item.path !== '/' && currentPath.startsWith(item.path));
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}