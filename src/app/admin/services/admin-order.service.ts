import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  OrderListResponse,
  OrderResponse,
  OrderStatusUpdateRequest,
} from '../models/admin-extended.models';

@Injectable({ providedIn: 'root' })
export class AdminOrderService {
  private readonly base = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  listOrders(filters: {
    page?: number;
    page_size?: number;
    status?: string | null;
    payment_status?: string | null;
    user_id?: string | null;
    date_from?: string | null;
    date_to?: string | null;
    search?: string | null;
  }): Observable<OrderListResponse> {
    let params = new HttpParams()
      .set('page', (filters.page ?? 1).toString())
      .set('page_size', (filters.page_size ?? 20).toString());

    if (filters.status)         params = params.set('status', filters.status);
    if (filters.payment_status) params = params.set('payment_status', filters.payment_status);
    if (filters.user_id)        params = params.set('user_id', filters.user_id);
    if (filters.date_from)      params = params.set('date_from', filters.date_from);
    if (filters.date_to)        params = params.set('date_to', filters.date_to);
    if (filters.search)         params = params.set('search', filters.search);

    return this.http.get<OrderListResponse>(`${this.base}/orders`, { params });
  }

  getOrder(id: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.base}/orders/${id}`);
  }

  updateStatus(id: string, payload: OrderStatusUpdateRequest): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${this.base}/orders/${id}/status`, payload);
  }

  refundOrder(id: string): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.base}/orders/${id}/refund`, {});
  }
}
