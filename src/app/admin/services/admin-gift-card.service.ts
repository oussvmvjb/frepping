import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  GiftCardCreatedAdminResponse,
  GiftCardListResponse,
  GiftCardResponse,
  GiftCardCreateRequest,
  GiftCardUpdateRequest,
} from '../models/admin-extended.models';

@Injectable({ providedIn: 'root' })
export class AdminGiftCardService {
  private readonly base = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  list(page = 1, pageSize = 20): Observable<GiftCardListResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    return this.http.get<GiftCardListResponse>(`${this.base}/gift-cards`, { params });
  }

  create(payload: GiftCardCreateRequest): Observable<GiftCardCreatedAdminResponse> {
    return this.http.post<GiftCardCreatedAdminResponse>(`${this.base}/gift-cards`, payload);
  }

  update(id: string, payload: GiftCardUpdateRequest): Observable<GiftCardResponse> {
    return this.http.patch<GiftCardResponse>(`${this.base}/gift-cards/${id}`, payload);
  }
}
