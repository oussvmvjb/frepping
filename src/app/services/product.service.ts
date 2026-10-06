import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  ApiProduct,
  ProductListResponse,
  ProductQueryParams,
} from '../models/api-product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly base = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  /**
   * GET /api/v1/products
   * Public. Supports page, page_size, category_id, search, is_featured.
   */
  getProducts(params: ProductQueryParams = {}): Observable<ProductListResponse> {
    let httpParams = new HttpParams()
      .set('page', String(params.page ?? 1))
      .set('page_size', String(params.page_size ?? 20));

    if (params.category_id) {
      httpParams = httpParams.set('category_id', params.category_id);
    }
    if (params.search && params.search.trim()) {
      httpParams = httpParams.set('search', params.search.trim());
    }
    if (params.is_featured !== undefined && params.is_featured !== null) {
      httpParams = httpParams.set('is_featured', String(params.is_featured));
    }

    return this.http
      .get<ProductListResponse>(this.base, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  /**
   * GET /api/v1/products/:id
   * Public. Returns full product with category, images, and variants.
   */
  getProductById(id: string): Observable<ApiProduct> {
    return this.http
      .get<ApiProduct>(`${this.base}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * GET /api/v1/products?is_featured=true
   * Convenience wrapper for featured products.
   */
  getFeaturedProducts(pageSize = 6): Observable<ProductListResponse> {
    return this.getProducts({ is_featured: true, page: 1, page_size: pageSize });
  }

  /**
   * GET /api/v1/products ordered by created_at DESC (most recent page).
   * Used for "recent arrivals" display since the backend has no is_new field.
   */
  getRecentProducts(pageSize = 4): Observable<ProductListResponse> {
    return this.getProducts({ page: 1, page_size: pageSize });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let msg = 'An unexpected error occurred.';
    if (error.status === 0) msg = 'Cannot reach the server. Is the backend running?';
    else if (error.status === 404) msg = 'Product not found.';
    else if (error.status === 422) msg = 'Invalid request parameters.';
    else if (error.status >= 500) msg = 'Server error. Please try again later.';
    return throwError(() => new Error(msg));
  }
}
