import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MOCK_PRODUCTS } from '../../services/mock-products.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
onInputEnter($event: Event) {
throw new Error('Method not implemented.');
}
  cartItems$: Observable<CartItem[]>;
  cartItems: CartItem[] = [];
  private cartSubscription: Subscription | undefined;
  
  // Tax and shipping configuration
  readonly TAX_RATE = 0.085; // 8.5%
  readonly SHIPPING_THRESHOLD = 100;
  readonly SHIPPING_COST = 9.99;
  
  // Cart summary values
  subtotal: number = 0;
  shippingCost: number = 0;
  taxAmount: number = 0;
  total: number = 0;
  discountAmount: number = 0;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {
    this.cartItems$ = this.cartService.cartItems$;
  }

  ngOnInit(): void {
    this.cartSubscription = this.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateCartSummary();
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
  goBack(): void {
    this.router.navigate(['/shop']);
  }
  removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  updateQuantity(productId: string, quantity: number): void {
    // Ensure quantity is at least 1 and is a valid number
    const validQuantity = Math.max(1, Math.floor(Number(quantity)));
    
    if (isNaN(validQuantity)) {
      console.error('Invalid quantity value');
      return;
    }
    
    this.cartService.updateQuantity(productId, validQuantity);
  }

  // Get product from mock data for additional info
  getProductById(productId: string) {
    return MOCK_PRODUCTS.find(product => product.id === productId);
  }

  // Calculate item total including any discounts
  getItemTotal(item: CartItem): number {
    const product = this.getProductById(item.product.id);
    let price = item.product.price;
    
    // Apply discount if exists
    if (product?.originalPrice && product.originalPrice > price) {
      // If there's an original price, use the sale price
      price = product.price;
    }
    
    return Math.round(price * item.quantity * 100) / 100;
  }

  // Calculate item savings if on sale
  getItemSavings(item: CartItem): number {
    const product = this.getProductById(item.product.id);
    
    if (product?.originalPrice && product.originalPrice > product.price) {
      const savingsPerItem = product.originalPrice - product.price;
      return Math.round(savingsPerItem * item.quantity * 100) / 100;
    }
    
    return 0;
  }

  // Calculate cart summary
  calculateCartSummary(): void {
    // Calculate subtotal
    this.subtotal = this.cartItems.reduce((sum, item) => {
      return sum + this.getItemTotal(item);
    }, 0);
    
    // Calculate discount amount
    this.discountAmount = this.cartItems.reduce((sum, item) => {
      return sum + this.getItemSavings(item);
    }, 0);
    
    // Calculate shipping
    this.shippingCost = this.subtotal >= this.SHIPPING_THRESHOLD || this.cartItems.length === 0 
      ? 0 
      : this.SHIPPING_COST;
    
    // Calculate tax (only on subtotal)
    this.taxAmount = Math.round(this.subtotal * this.TAX_RATE * 100) / 100;
    
    // Calculate total
    this.total = Math.round((this.subtotal + this.shippingCost + this.taxAmount) * 100) / 100;
  }

  // Calculate subtotal (for template)
  getSubtotal(): number {
    return this.subtotal;
  }

  // Calculate tax (for template)
  getTax(): number {
    return this.taxAmount;
  }

  // Calculate shipping (for template)
  getShipping(): number {
    return this.shippingCost;
  }

  // Calculate total (for template)
  getTotal(): number {
    return this.total;
  }

  // Calculate total savings (for template)
  getTotalSavings(): number {
    return this.discountAmount;
  }

  // Check if free shipping applies
  hasFreeShipping(): boolean {
    return this.subtotal >= this.SHIPPING_THRESHOLD;
  }

  // Get remaining amount for free shipping
  getRemainingForFreeShipping(): number {
    if (this.hasFreeShipping() || this.cartItems.length === 0) {
      return 0;
    }
    return Math.max(0, this.SHIPPING_THRESHOLD - this.subtotal);
  }

  // Get total items count
  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  // Continue shopping - navigate back to shop
  continueShopping(): void {
    this.router.navigate(['/shop']);
  }

  // Proceed to checkout
  proceedToCheckout(): void {
    // Check if cart is empty
    if (this.cartItems.length === 0) {
      // You can add a toast/notification here
      console.warn('Cart is empty! Add items before checkout.');
      return;
    }
    
    // Navigate to checkout page
    this.router.navigate(['/checkout']);
  }

  // Format currency
  formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  // Check if item is on sale
  isItemOnSale(productId: string): boolean {
    const product = this.getProductById(productId);
    return !!(product?.originalPrice && product.originalPrice > product.price);
  }

  // Get discount percentage for an item
  getItemDiscountPercentage(productId: string): number {
    const product = this.getProductById(productId);
    if (product?.originalPrice && product.originalPrice > product.price) {
      const discount = ((product.originalPrice - product.price) / product.originalPrice) * 100;
      return Math.round(discount);
    }
    return 0;
  }
}