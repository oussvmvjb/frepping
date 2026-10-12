import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Store, StoreCreate, StoreUpdate, ProductListResponse } from "../models/api.models";
import { ErrorMapperService } from "./error-mapper.service";

@Injectable({ providedIn: "root" })
export class StoreService {
  private readonly base = `${environment.apiUrl}/stores`;

  constructor(private http: HttpClient, private errorMapper: ErrorMapperService) {}

  getStoreBySlug(slug: string): Observable<Store> {
    return this.http.get<Store>(`${this.base}/${slug}`).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  /**
   * TODO — BACKEND ENDPOINT REQUIRED: GET /api/v1/stores/{slug}/products
   * This endpoint does not exist yet. Returns 404 from backend.
   * Once added, this will work transparently.
   */
  getStoreProducts(slug: string, page = 1, pageSize = 20): Observable<ProductListResponse> {
    const p = new HttpParams().set("page", String(page)).set("page_size", String(pageSize));
    return this.http.get<ProductListResponse>(`${this.base}/${slug}/products`, { params: p }).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  getMyStore(): Observable<Store> {
    return this.http.get<Store>(`${this.base}/me`).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  createStore(payload: StoreCreate): Observable<Store> {
    return this.http.post<Store>(this.base, payload).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  updateMyStore(payload: StoreUpdate): Observable<Store> {
    return this.http.patch<Store>(`${this.base}/me`, payload).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  deactivateMyStore(): Observable<void> {
    return this.http.delete<void>(`${this.base}/me`).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }
}
