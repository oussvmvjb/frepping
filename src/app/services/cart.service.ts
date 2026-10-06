import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart-item';
import { ApiProduct, getEffectivePrice } from '../models/api-product.model';
import { ProductVariant } from '../models/product-variant.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartSubject.asObservable();

  // ─── Read ─────────────────────────────────────────────────────────────────

  getCartItems(): CartItem[] {
    return this.cartSubject.value;
  }

  getTotalItems(): number {
    return this.cartSubject.value.reduce((sum, item) => sum + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.cartSubject.value.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
  }

  // ─── Write ────────────────────────────────────────────────────────────────

  /**
   * Add a product (with optional selected variant) to the cart.
   * If the same product+variant combination already exists, increments quantity.
   * Variant uniqueness is determined by variant.id when present, otherwise product.id.
   */
  addToCart(
    product: ApiProduct,
    quantity = 1,
    variant: ProductVariant | null = null
  ): void {
    const items = [...this.getCartItems()];
    const existingIdx = items.findIndex(
      (item) =>
        item.product.id === product.id &&
        (variant ? item.variant?.id === variant.id : item.variant === null)
    );

    if (existingIdx > -1) {
      items[existingIdx] = {
        ...items[existingIdx],
        quantity: items[existingIdx].quantity + quantity,
      };
    } else {
      items.push({
        product,
        variant,
        unitPrice: getEffectivePrice(product, variant),
        quantity,
      });
    }
    this.cartSubject.next(items);
  }

  updateQuantity(productId: string, variantId: string | null, quantity: number): void {
    const valid = Math.max(1, Math.floor(Number(quantity)));
    const items = this.getCartItems().map((item) => {
      const sameProduct = item.product.id === productId;
      const sameVariant = variantId
        ? item.variant?.id === variantId
        : item.variant === null;
      return sameProduct && sameVariant ? { ...item, quantity: valid } : item;
    });
    this.cartSubject.next(items);
  }

  removeFromCart(productId: string, variantId: string | null = null): void {
    const items = this.getCartItems().filter((item) => {
      const sameProduct = item.product.id === productId;
      const sameVariant = variantId
        ? item.variant?.id === variantId
        : item.variant === null;
      return !(sameProduct && sameVariant);
    });
    this.cartSubject.next(items);
  }

  clearCart(): void {
    this.cartSubject.next([]);
  }
}
