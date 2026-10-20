import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LowStockInventoryResponse,
  LowStockVariantItem,
  VariantStockUpdateRequest,
} from '../models/admin-extended.models';

@Injectable({ providedIn: 'root' })
export class AdminInventoryService {
  private readonly base = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getLowStock(threshold: number = 5): Observable<LowStockInventoryResponse> {
    const params = new HttpParams().set('threshold', threshold.toString());
    return this.http.get<LowStockInventoryResponse>(`${this.base}/inventory/low-stock`, { params });
  }

  updateStock(variantId: string, payload: VariantStockUpdateRequest): Observable<LowStockVariantItem> {
    return this.http.patch<LowStockVariantItem>(`${this.base}/variants/${variantId}/stock`, payload);
  }
}
