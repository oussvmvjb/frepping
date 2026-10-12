import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";
import {
  AdminDashboardSummary, Order, OrderListResponse, OrderStatus, PaymentStatus,
  LowStockVariant, StockAdjustRequest, PromoCode, DeliveryOption, GiftCard,
  Pagination, User, UserRole
} from "../models/api.models";
import { ErrorMapperService } from "./error-mapper.service";

@Injectable({ providedIn: "root" })
export class AdminService {
  private readonly base = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient, private errorMapper: ErrorMapperService) {}

  getDashboard(params?: { from?: string; to?: string }): Observable<AdminDashboardSummary> {
    let p = new HttpParams();
    if (params?.from) p = p.set("from", params.from);
    if (params?.to) p = p.set("to", params.to);
    return this.http.get<AdminDashboardSummary>(`${this.base}/dashboard/summary`, { params: p }).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  getOrders(params?: {
    status?: OrderStatus; payment_status?: PaymentStatus;
    search?: string; from?: string; to?: string; page?: number; page_size?: number;
  }): Observable<OrderListResponse> {
    let p = new HttpParams()
      .set("page", String(params?.page ?? 1))
      .set("page_size", String(params?.page_size ?? 20));
    if (params?.status) p = p.set("status", params.status);
    if (params?.payment_status) p = p.set("payment_status", params.payment_status);
    if (params?.search) p = p.set("search", params.search);
    if (params?.from) p = p.set("from", params.from);
    if (params?.to) p = p.set("to", params.to);
    return this.http.get<OrderListResponse>(`${this.base}/orders`, { params: p }).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  getOrder(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.base}/orders/${id}`).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  updateOrderStatus(id: string, payload: { status: OrderStatus; note?: string; tracking_number?: string }): Observable<Order> {
    return this.http.patch<Order>(`${this.base}/orders/${id}/status`, payload).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  refundOrder(id: string): Observable<Order> {
    return this.http.post<Order>(`${this.base}/orders/${id}/refund`, {}).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  getLowStock(threshold = 5): Observable<LowStockVariant[]> {
    const p = new HttpParams().set("threshold", String(threshold));
    return this.http.get<LowStockVariant[]>(`${this.base}/inventory/low-stock`, { params: p }).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  adjustStock(variantId: string, payload: StockAdjustRequest): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/admin/variants/${variantId}/stock`, payload).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  getPromos(page = 1): Observable<Pagination<PromoCode>> {
    const p = new HttpParams().set("page", String(page));
    return this.http.get<Pagination<PromoCode>>(`${environment.apiUrl}/promos`, { params: p }).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  createPromo(payload: any): Observable<PromoCode> {
    return this.http.post<PromoCode>(`${environment.apiUrl}/promos`, payload).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  updatePromo(id: string, payload: any): Observable<PromoCode> {
    return this.http.patch<PromoCode>(`${environment.apiUrl}/promos/${id}`, payload).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  deletePromo(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/promos/${id}`).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  getDeliveryOptions(): Observable<DeliveryOption[]> {
    return this.http.get<DeliveryOption[]>(`${environment.apiUrl}/delivery-options`).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  createDeliveryOption(payload: any): Observable<DeliveryOption> {
    return this.http.post<DeliveryOption>(`${environment.apiUrl}/delivery-options`, payload).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  updateDeliveryOption(id: string, payload: any): Observable<DeliveryOption> {
    return this.http.patch<DeliveryOption>(`${environment.apiUrl}/delivery-options/${id}`, payload).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  deleteDeliveryOption(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/delivery-options/${id}`).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  getGiftCards(page = 1): Observable<Pagination<GiftCard>> {
    const p = new HttpParams().set("page", String(page));
    return this.http.get<Pagination<GiftCard>>(`${environment.apiUrl}/gift-cards`, { params: p }).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  createGiftCard(payload: any): Observable<GiftCard & { plain_pin?: string }> {
    return this.http.post<GiftCard & { plain_pin?: string }>(`${environment.apiUrl}/gift-cards`, payload).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  toggleGiftCard(id: string, is_active: boolean): Observable<GiftCard> {
    return this.http.patch<GiftCard>(`${environment.apiUrl}/gift-cards/${id}`, { is_active }).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  getProductLikes(productId: string): Observable<Pagination<User>> {
    return this.http.get<Pagination<User>>(`${this.base}/products/${productId}/likes`).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  getUsers(page = 1): Observable<Pagination<User>> {
    const p = new HttpParams().set("page", String(page));
    return this.http.get<Pagination<User>>(`${environment.apiUrl}/users`, { params: p }).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  updateUserRole(id: string, role: UserRole): Observable<User> {
    return this.http.patch<User>(`${environment.apiUrl}/users/${id}/role`, { role }).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  updateUserStatus(id: string, is_active: boolean): Observable<User> {
    return this.http.patch<User>(`${environment.apiUrl}/users/${id}/status`, { is_active }).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }
}
