import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Store, StoreCreate, StoreUpdate } from '../models/store.model';
import { ProductListResponse } from '../models/api-product.model';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly base = `${environment.apiUrl}/stores`;

  constructor(private http: HttpClient) {}

  /**
   * GET /api/v1/stores/:slug — Public.
   * Browse a seller's public store page by slug.
   */
  getStoreBySlug(slug: string): Observable<Store> {
    return this.http
      .get<Store>(`${this.base}/${slug}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * GET /api/v1/stores/me — Seller only.
   * Returns the authenticated seller's store data.
   */
  getMyStore(): Observable<Store> {
    return this.http
      .get<Store>(`${this.base}/me`)
      .pipe(catchError(this.handleError));
  }

  /**
   * POST /api/v1/stores — Seller only.
   * Create the seller's store.
   */
  createStore(payload: StoreCreate): Observable<Store> {
    return this.http
      .post<Store>(this.base, payload)
      .pipe(catchError(this.handleError));
  }

  /**
   * PATCH /api/v1/stores/me — Seller only.
   * Update the authenticated seller's store.
   */
  updateMyStore(payload: StoreUpdate): Observable<Store> {
    return this.http
      .patch<Store>(`${this.base}/me`, payload)
      .pipe(catchError(this.handleError));
  }

  /**
   * DELETE /api/v1/stores/me — Seller only.
   * Soft-deactivates the seller's store.
   */
  deactivateMyStore(): Observable<void> {
    return this.http
      .delete<void>(`${this.base}/me`)
      .pipe(catchError(this.handleError));
  }

  /**
   * GET /api/v1/products?seller_id=... is NOT yet exposed by the backend.
   * Products for a store page are filtered client-side by seller_id from each product's seller_id field.
   * This method exists as a documented placeholder until the backend adds a per-seller public filter.
   *
   * NOT IMPLEMENTED — BACKEND ENDPOINT REQUIRED:
   *   GET /api/v1/products?seller_id=<uuid>  (or GET /api/v1/stores/:slug/products)
   */
  getStoreProducts(_sellerId: string): Observable<ProductListResponse> {
    return throwError(() => new Error('NOT IMPLEMENTED — BACKEND ENDPOINT REQUIRED: GET /api/v1/stores/:slug/products'));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let msg = 'An unexpected error occurred.';
    if (error.status === 0) msg = 'Cannot reach the server.';
    else if (error.status === 404) msg = 'Store not found.';
    else if (error.status === 403) msg = 'You do not have permission to access this store.';
    else if (error.status >= 500) msg = 'Server error. Please try again later.';
    return throwError(() => new Error(msg));
  }
}
