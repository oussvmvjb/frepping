import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  Cart, AddCartItemRequest, UpdateCartItemRequest, GuestCartEntry
} from '../models/api.models';
import { ErrorMapperService } from './error-mapper.service';

import { map } from 'rxjs/operators';

const GUEST_CART_KEY = 'frepping_guest_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly base = `${environment.apiUrl}/cart`;

  private cartSubject = new BehaviorSubject<Cart | null>(null);
  /** Full server-side cart. null = not loaded yet. */
  cart$ = this.cartSubject.asObservable();

  itemCount$ = this.cart$.pipe(
    map(cart => (cart?.items ?? []).reduce((count, item) => count + item.quantity, 0))
  );

  /** Compatibility stream for components expecting cartItems$ */
  cartItems$ = this.cart$.pipe(
    map(cart => (cart?.items ?? []).map(item => ({
      id: item.id,
      product: item.product,
      variant: item.variant,
      quantity: item.quantity,
      unitPrice: Number(item.unit_price) || 0
    })))
  );

  constructor(private http: HttpClient, private errorMapper: ErrorMapperService) {}

  /** GET /cart */
  load(): Observable<Cart> {
    return this.http.get<Cart>(this.base).pipe(
      tap(cart => this.cartSubject.next(cart)),
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  /** POST /cart/items */
  addItem(req: AddCartItemRequest): Observable<Cart> {
    return this.http.post<Cart>(`${this.base}/items`, req).pipe(
      tap(cart => this.cartSubject.next(cart)),
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  /** PATCH /cart/items/:id */
  updateQty(itemId: string, quantity: number): Observable<Cart> {
    const req: UpdateCartItemRequest = { quantity };
    return this.http.patch<Cart>(`${this.base}/items/${itemId}`, req).pipe(
      tap(cart => this.cartSubject.next(cart)),
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  /** DELETE /cart/items/:id */
  removeItem(itemId: string): Observable<Cart> {
    return this.http.delete<Cart>(`${this.base}/items/${itemId}`).pipe(
      tap(cart => this.cartSubject.next(cart)),
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  /** DELETE /cart */
  clear(): Observable<void> {
    return this.http.delete<void>(this.base).pipe(
      tap(() => this.cartSubject.next(null)),
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  /** POST /cart/promo */
  applyPromo(code: string): Observable<Cart> {
    return this.http.post<Cart>(`${this.base}/promo`, { code }).pipe(
      tap(cart => this.cartSubject.next(cart)),
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  /** DELETE /cart/promo */
  removePromo(): Observable<Cart> {
    return this.http.delete<Cart>(`${this.base}/promo`).pipe(
      tap(cart => this.cartSubject.next(cart)),
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  /** PATCH /cart/gift-wrap */
  setGiftWrap(enabled: boolean): Observable<Cart> {
    return this.http.patch<Cart>(`${this.base}/gift-wrap`, { enabled }).pipe(
      tap(cart => this.cartSubject.next(cart)),
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  get currentCart(): Cart | null {
    return this.cartSubject.value;
  }

  get itemCount(): number {
    return (this.cartSubject.value?.items ?? []).reduce((s, i) => s + i.quantity, 0);
  }

  // --- Guest cart (unauthenticated) -----------------------------------------

  getGuestCart(): GuestCartEntry[] {
    try {
      return JSON.parse(localStorage.getItem(GUEST_CART_KEY) ?? '[]');
    } catch { return []; }
  }

  addGuestItem(entry: GuestCartEntry): void {
    const items = this.getGuestCart();
    const idx = items.findIndex(
      i => i.product_id === entry.product_id && i.variant_id === entry.variant_id
    );
    if (idx >= 0) {
      items[idx].quantity += entry.quantity;
    } else {
      items.push(entry);
    }
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  }

  clearGuestCart(): void {
    localStorage.removeItem(GUEST_CART_KEY);
  }

  /** On login: push all guest items to server cart then clear localStorage. */
  flushGuestCart(): Observable<Cart | null> {
    const items = this.getGuestCart();
    if (items.length === 0) return this.load();

    const chain = items.reduce(
      (obs: Observable<any>, entry) =>
        obs.pipe(switchMap(() => this.addItem({ product_id: entry.product_id, variant_id: entry.variant_id, quantity: entry.quantity }))),
      this.load()
    );

    return chain.pipe(
      tap(() => this.clearGuestCart()),
      catchError(() => this.load())
    );
  }

  /** Legacy / convenient wrapper for adding to cart */
  addToCart(product: any, quantity = 1, variant: any = null): void {
    const isLoggedIn = !!localStorage.getItem('access_token');
    const pid = product?.id;
    const vid = variant?.id ?? null;
    if (!pid) return;

    if (!isLoggedIn) {
      this.addGuestItem({ product_id: pid, variant_id: vid, quantity });
    } else {
      this.addItem({ product_id: pid, variant_id: vid, quantity }).subscribe({
        error: () => {}
      });
    }
  }

  removeFromCart(productId: string, variantId?: string | null): void {
    const cart = this.cartSubject.value;
    if (cart) {
      const item = cart.items.find(i => i.product_id === productId && (!variantId || i.variant_id === variantId));
      if (item) {
        this.removeItem(item.id).subscribe({ error: () => {} });
        return;
      }
    }
    const guest = this.getGuestCart().filter(i => !(i.product_id === productId && (!variantId || i.variant_id === variantId)));
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guest));
  }

  updateQuantity(productId: string, variantId: string | null, quantity: number): void {
    const cart = this.cartSubject.value;
    if (cart) {
      const item = cart.items.find(i => i.product_id === productId && (!variantId || i.variant_id === variantId));
      if (item) {
        this.updateQty(item.id, quantity).subscribe({ error: () => {} });
        return;
      }
    }
    const guest = this.getGuestCart();
    const idx = guest.findIndex(i => i.product_id === productId && (!variantId || i.variant_id === variantId));
    if (idx >= 0) {
      guest[idx].quantity = quantity;
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guest));
    }
  }

  clearCart(): void {
    this.clearGuestCart();
    if (this.cartSubject.value) {
      this.clear().subscribe({ error: () => {} });
    }
  }
}
