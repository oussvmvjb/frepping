import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Order, OrderListResponse, OrderStatus } from "../models/api.models";
import { ErrorMapperService } from "./error-mapper.service";

@Injectable({ providedIn: "root" })
export class OrderService {
  private readonly base = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient, private errorMapper: ErrorMapperService) {}

  getMyOrders(params?: { status?: OrderStatus; page?: number; page_size?: number }): Observable<OrderListResponse> {
    let p = new HttpParams()
      .set("page", String(params?.page ?? 1))
      .set("page_size", String(params?.page_size ?? 10));
    if (params?.status) p = p.set("status", params.status);

    return this.http.get<OrderListResponse>(`${this.base}/my`, { params: p }).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  getById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.base}/${id}`).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  cancel(id: string): Observable<Order> {
    return this.http.post<Order>(`${this.base}/${id}/cancel`, {}).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }
}
