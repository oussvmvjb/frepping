import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AdminUserResponse,
  AdminUserListResponse,
  UserRoleUpdateRequest,
  UserStatusUpdateRequest,
} from '../models/admin-extended.models';

@Injectable({ providedIn: 'root' })
export class AdminUserService {
  private readonly base = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  list(filters: {
    page?: number;
    page_size?: number;
    role?: string | null;
    search?: string | null;
  }): Observable<AdminUserListResponse> {
    let params = new HttpParams()
      .set('page', (filters.page ?? 1).toString())
      .set('page_size', (filters.page_size ?? 20).toString());
    if (filters.role)   params = params.set('role', filters.role);
    if (filters.search) params = params.set('search', filters.search);
    return this.http.get<AdminUserListResponse>(`${this.base}`, { params });
  }

  get(id: string): Observable<AdminUserResponse> {
    return this.http.get<AdminUserResponse>(`${this.base}/${id}`);
  }

  updateRole(id: string, payload: UserRoleUpdateRequest): Observable<AdminUserResponse> {
    return this.http.patch<AdminUserResponse>(`${this.base}/${id}/role`, payload);
  }

  updateStatus(id: string, payload: UserStatusUpdateRequest): Observable<AdminUserResponse> {
    return this.http.patch<AdminUserResponse>(`${this.base}/${id}/status`, payload);
  }
}
