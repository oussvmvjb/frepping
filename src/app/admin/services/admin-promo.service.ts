import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  PromoCodeResponse,
  PromoCodeListResponse,
  PromoCodeCreateRequest,
  PromoCodeUpdateRequest,
} from '../models/admin-extended.models';

@Injectable({ providedIn: 'root' })
export class AdminPromoService {
  private readonly base = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  list(page = 1, pageSize = 20): Observable<PromoCodeListResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    return this.http.get<PromoCodeListResponse>(`${this.base}/promos`, { params });
  }

  get(id: string): Observable<PromoCodeResponse> {
    return this.http.get<PromoCodeResponse>(`${this.base}/promos/${id}`);
  }

  create(payload: PromoCodeCreateRequest): Observable<PromoCodeResponse> {
    return this.http.post<PromoCodeResponse>(`${this.base}/promos`, payload);
  }

  update(id: string, payload: PromoCodeUpdateRequest): Observable<PromoCodeResponse> {
    return this.http.patch<PromoCodeResponse>(`${this.base}/promos/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/promos/${id}`);
  }
}
