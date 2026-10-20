import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DeliveryOptionResponse,
  DeliveryOptionCreateRequest,
  DeliveryOptionUpdateRequest,
} from '../models/admin-extended.models';

@Injectable({ providedIn: 'root' })
export class AdminDeliveryService {
  private readonly adminBase = `${environment.apiUrl}/admin`;
  private readonly publicBase = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  /** Public endpoint — only returns active options */
  listActive(): Observable<DeliveryOptionResponse[]> {
    return this.http.get<DeliveryOptionResponse[]>(`${this.publicBase}/delivery-options`);
  }

  create(payload: DeliveryOptionCreateRequest): Observable<DeliveryOptionResponse> {
    return this.http.post<DeliveryOptionResponse>(`${this.adminBase}/delivery-options`, payload);
  }

  update(id: string, payload: DeliveryOptionUpdateRequest): Observable<DeliveryOptionResponse> {
    return this.http.patch<DeliveryOptionResponse>(`${this.adminBase}/delivery-options/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.adminBase}/delivery-options/${id}`);
  }
}
