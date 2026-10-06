import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Category,
  CreateCategoryRequest,
  CreateProductRequest,
  Product,
  ProductListResponse,
  ProductQueryParams,
  ProductResponse,
  UpdateCategoryRequest,
  UpdateProductRequest,
} from '../models/admin.models';

@Injectable({ providedIn: 'root' })
export class AdminProductService {
  private readonly base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ─── Categories ───────────────────────────────────────────────

  getCategories(): Observable<Category[]> {
    return this.http
      .get<Category[]>(`${this.base}/categories`)
      .pipe(catchError(this.handleError));
  }

  createCategory(payload: CreateCategoryRequest): Observable<Category> {
    return this.http
      .post<Category>(`${this.base}/categories`, payload)
      .pipe(catchError(this.handleError));
  }

  updateCategory(id: string, payload: UpdateCategoryRequest): Observable<Category> {
    return this.http
      .patch<Category>(`${this.base}/categories/${id}`, payload)
      .pipe(catchError(this.handleError));
  }

  deleteCategory(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.base}/categories/${id}`)
      .pipe(catchError(this.handleError));
  }

  // ─── Products ─────────────────────────────────────────────────

  getProducts(
    pageOrParams: number | ProductQueryParams = 1,
    pageSize: number = 20,
    categoryId?: string | null,
    search?: string | null,
    isFeatured?: boolean | null
  ): Observable<ProductListResponse> {
    let page = 1;
    let size = pageSize;
    let catId = categoryId;
    let query = search;
    let feat = isFeatured;

    if (typeof pageOrParams === 'object' && pageOrParams !== null) {
      page = pageOrParams.page ?? 1;
      size = pageOrParams.pageSize ?? 20;
      catId = pageOrParams.categoryId;
      query = pageOrParams.search;
      feat = pageOrParams.isFeatured;
    } else if (typeof pageOrParams === 'number') {
      page = pageOrParams;
    }

    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', size.toString());

    if (catId && catId.trim() !== '') {
      params = params.set('category_id', catId.trim());
    }
    if (query && query.trim() !== '') {
      params = params.set('search', query.trim());
    }
    if (feat !== undefined && feat !== null) {
      params = params.set('is_featured', feat.toString());
    }

    return this.http
      .get<ProductListResponse>(`${this.base}/products`, { params })
      .pipe(catchError(this.handleError));
  }

  getProductById(id: string): Observable<ProductResponse> {
    return this.http
      .get<ProductResponse>(`${this.base}/products/${id}`)
      .pipe(catchError(this.handleError));
  }

  createProduct(payload: CreateProductRequest): Observable<ProductResponse> {
    return this.http
      .post<ProductResponse>(`${this.base}/products`, payload)
      .pipe(catchError(this.handleError));
  }

  updateProduct(id: string, payload: UpdateProductRequest): Observable<ProductResponse> {
    return this.http
      .patch<ProductResponse>(`${this.base}/products/${id}`, payload)
      .pipe(catchError(this.handleError));
  }

  deleteProduct(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.base}/products/${id}`)
      .pipe(catchError(this.handleError));
  }

  // ─── Error handler ────────────────────────────────────────────

  private handleError(error: HttpErrorResponse): Observable<never> {
    let msg = 'An unexpected error occurred.';
    if (error.status === 0)        msg = 'Cannot reach the server. Is the backend running?';
    else if (error.status === 400) msg = 'Bad request — please check your input.';
    else if (error.status === 404) msg = 'Resource not found.';
    else if (error.status === 409) msg = error.error?.error?.message || 'Conflict — slug or SKU may already exist.';
    else if (error.status === 422) msg = 'Validation error — please check all required fields.';
    else if (error.status >= 500)  msg = 'Server error. Please try again later.';
    return throwError(() => new Error(msg));
  }
}
