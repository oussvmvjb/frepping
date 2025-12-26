import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart-item';
import { Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class CartService {
  getSubtotal(): number {
    throw new Error('Method not implemented.');
  }
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addToCart(product: Product, quantity: number = 1): void {
    const items = this.getCartItems();
    const index = items.findIndex(item => item.product.id === product.id);
    if (index > -1) {
      items[index].quantity += quantity;
    } else {
      items.push({ product, quantity });
    }
    this.cartItemsSubject.next([...items]);
  }

  removeFromCart(productId: string): void {
    const items = this.getCartItems().filter(item => item.product.id !== productId);
    this.cartItemsSubject.next(items);
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
  }

  updateQuantity(productId: string, quantity: number): void {
    const items = this.getCartItems().map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    this.cartItemsSubject.next(items);
  }
}
