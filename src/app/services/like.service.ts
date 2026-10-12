import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { ErrorMapperService } from "./error-mapper.service";
import { Pagination, User, Product } from "../models/api.models";

@Injectable({ providedIn: "root" })
export class LikeService {
  private readonly base = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient, private errorMapper: ErrorMapperService) {}

  like(productId: string): Observable<void> {
    return this.http.post<void>(`${this.base}/${productId}/like`, {}).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  unlike(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${productId}/like`).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  getFavorites(page = 1, pageSize = 20): Observable<Pagination<Product>> {
    return this.http.get<Pagination<Product>>(`${environment.apiUrl}/users/me/favorites`, {
      params: { page: page.toString(), page_size: pageSize.toString() }
    }).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }
}
