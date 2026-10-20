import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductLikersListResponse } from '../models/admin-extended.models';

@Injectable({ providedIn: 'root' })
export class AdminLikesService {
  private readonly base = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getLikers(productId: string, page = 1, pageSize = 20): Observable<ProductLikersListResponse> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('page_size', String(pageSize));
    return this.http.get<ProductLikersListResponse>(`${this.base}/products/${productId}/likes`, { params });
  }
}
