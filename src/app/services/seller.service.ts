import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { SellerDashboardSummary, Order, OrderListResponse, Pagination, User } from "../models/api.models";
import { ErrorMapperService } from "./error-mapper.service";

@Injectable({ providedIn: "root" })
export class SellerService {
  private readonly base = `${environment.apiUrl}/seller`;

  constructor(private http: HttpClient, private errorMapper: ErrorMapperService) {}

  getDashboard(): Observable<SellerDashboardSummary> {
    return this.http.get<SellerDashboardSummary>(`${this.base}/dashboard/summary`).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  getOrders(page = 1): Observable<OrderListResponse> {
    const p = new HttpParams().set("page", String(page));
    return this.http.get<OrderListResponse>(`${this.base}/orders`, { params: p }).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  updateOrderItemStatus(orderId: string, payload: any): Observable<Order> {
    return this.http.patch<Order>(`${this.base}/orders/${orderId}/items/status`, payload).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  getProductLikes(productId: string): Observable<Pagination<User>> {
    return this.http.get<Pagination<User>>(`${this.base}/products/${productId}/likes`).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }
}
