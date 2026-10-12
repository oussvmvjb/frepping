import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { SavedPaymentMethod } from "../models/api.models";
import { ErrorMapperService } from "./error-mapper.service";

@Injectable({ providedIn: "root" })
export class PaymentMethodService {
  private readonly base = `${environment.apiUrl}/users/me/payment-methods`;

  constructor(private http: HttpClient, private errorMapper: ErrorMapperService) {}

  list(): Observable<SavedPaymentMethod[]> {
    return this.http.get<SavedPaymentMethod[]>(this.base).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }
}
