import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";
import {
  Product, ProductListResponse, ProductQueryParams, Pagination
} from "../models/api.models";
import { ErrorMapperService } from "./error-mapper.service";

@Injectable({ providedIn: "root" })
export class ProductService {
  private readonly base = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient, private errorMapper: ErrorMapperService) {}

  getProducts(params: ProductQueryParams = {}): Observable<ProductListResponse> {
    let p = new HttpParams()
      .set("page", String(params.page ?? 1))
      .set("page_size", String(params.page_size ?? 20));

    if (params.category_id) p = p.set("category_id", params.category_id);
    if (params.search?.trim()) p = p.set("search", params.search.trim());
    if (params.is_featured !== undefined && params.is_featured !== null)
      p = p.set("is_featured", String(params.is_featured));
    if (params.sort) p = p.set("sort", params.sort);
    if (params.min_price !== undefined && params.min_price !== null)
      p = p.set("min_price", String(params.min_price));
    if (params.max_price !== undefined && params.max_price !== null)
      p = p.set("max_price", String(params.max_price));
    if (params.in_stock_only) p = p.set("in_stock_only", "true");

    return this.http.get<ProductListResponse>(this.base, { params: p }).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.base}/${id}`).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  getFeaturedProducts(pageSize = 6): Observable<ProductListResponse> {
    return this.getProducts({ is_featured: true, page: 1, page_size: pageSize });
  }

  getRecentProducts(pageSize = 4): Observable<ProductListResponse> {
    return this.getProducts({ page: 1, page_size: pageSize, sort: "newest" });
  }

  getMyProducts(page = 1, pageSize = 20): Observable<ProductListResponse> {
    const p = new HttpParams().set("page", String(page)).set("page_size", String(pageSize));
    return this.http.get<ProductListResponse>(`${this.base}/my`, { params: p }).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  create(payload: any): Observable<Product> {
    return this.http.post<Product>(this.base, payload).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  update(id: string, payload: any): Observable<Product> {
    return this.http.patch<Product>(`${this.base}/${id}`, payload).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  /** GET /users/me/favorites */
  getMyFavorites(page = 1, pageSize = 20): Observable<ProductListResponse> {
    const p = new HttpParams().set("page", String(page)).set("page_size", String(pageSize));
    return this.http.get<ProductListResponse>(`${environment.apiUrl}/users/me/favorites`, { params: p }).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  /** Helper: primary image URL */
  getPrimaryImage(product: Product): string {
    if (!product.images?.length) return "assets/placeholder.jpg";
    return product.images.find(i => i.is_primary)?.image_url ?? product.images[0].image_url;
  }

  /** Helper: effective price (variant override or base). Returns number. */
  getEffectivePrice(product: Product, variant?: any): number {
    if (variant?.price != null) return Number(variant.price);
    return Number(product.price);
  }
}
