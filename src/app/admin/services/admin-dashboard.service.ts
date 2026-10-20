import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminDashboardSummary } from '../models/admin-extended.models';

@Injectable({ providedIn: 'root' })
export class AdminDashboardService {
  private readonly base = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getSummary(from?: string | null, to?: string | null): Observable<AdminDashboardSummary> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to)   params = params.set('to', to);
    return this.http.get<AdminDashboardSummary>(`${this.base}/dashboard/summary`, { params });
  }
}
