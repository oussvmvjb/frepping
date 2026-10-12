import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";
import {
  CheckoutPreviewRequest, CheckoutPreviewResponse, PlaceOrderRequest, Order
} from "../models/api.models";
import { ErrorMapperService } from "./error-mapper.service";

@Injectable({ providedIn: "root" })
export class CheckoutService {
  private readonly base = `${environment.apiUrl}/checkout`;

  constructor(private http: HttpClient, private errorMapper: ErrorMapperService) {}

  preview(req: CheckoutPreviewRequest): Observable<CheckoutPreviewResponse> {
    return this.http.post<CheckoutPreviewResponse>(`${this.base}/preview`, req).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  placeOrder(req: PlaceOrderRequest, idempotencyKey: string): Observable<Order> {
    const headers = new HttpHeaders({ "Idempotency-Key": idempotencyKey });
    return this.http.post<Order>(`${this.base}/place-order`, req, { headers }).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }
}
