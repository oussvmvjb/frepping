import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss']
})
export class BottomNavComponent implements OnInit, OnDestroy {
  cartItemCount = 0;
  private cartSubscription: Subscription | undefined;
  badgeClass = '';

  navItems = [
    { path: '/', icon: 'fas fa-home', label: 'HOME', active: true },
    { path: '/shop', icon: 'fas fa-store', label: 'SHOP', active: false },
    { path: '/try-on', icon: 'fas fa-user', label: 'TRY-ON', active: false },
    { path: '/cart', icon: 'fas fa-shopping-cart', label: 'CART', active: false },
    { path: '/profile', icon: 'fas fa-user-circle', label: 'PROFILE', active: false }
  ];

  constructor(
    private router: Router,
    private cartService: CartService,
    private cdRef: ChangeDetectorRef
  ) {
    this.updateActiveNav();
    this.router.events.subscribe(() => {
      this.updateActiveNav();
    });
  }

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      const oldCount = this.cartItemCount;
      this.cartItemCount = this.calculateTotalItems(items);
      this.updateBadgeClass();
      
      // Trigger change animation if count changed
      if (oldCount !== this.cartItemCount) {
        this.triggerBadgeAnimation();
      }
      
      this.cdRef.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
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

  calculateTotalItems(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  updateBadgeClass(): void {
    if (this.cartItemCount === 0) {
      this.badgeClass = '';
    } else if (this.cartItemCount > 5 && this.cartItemCount <= 9) {
      this.badgeClass = 'many-items';
    } else if (this.cartItemCount > 9) {
      this.badgeClass = 'many-items many-many';
    } else {
      this.badgeClass = '';
    }
  }

  triggerBadgeAnimation(): void {
    // Add animation class for 300ms then remove it
    this.badgeClass += ' changing';
    
    setTimeout(() => {
      this.badgeClass = this.badgeClass.replace(' changing', '');
      this.updateBadgeClass();
    }, 300);
  }

  getBadgeText(): string {
    if (this.cartItemCount === 0) {
      return '';
    } else if (this.cartItemCount > 99) {
      return '99+';
    }
    return this.cartItemCount.toString();
  }
}