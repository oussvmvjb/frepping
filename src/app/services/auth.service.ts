import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor(private http: HttpClient) { }

  initAuth(): Observable<any> {
    const token = this.getAccessToken();
    if (!token) {
      this.setAuthState(false, null);
      this.isLoadingSubject.next(false);
      return of(null);
    }
    
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap(user => {
        this.setAuthState(true, user);
        this.isLoadingSubject.next(false);
      }),
      catchError(err => {
        this.setAuthState(false, null);
        this.isLoadingSubject.next(false);
        return of(null);
      })
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => this.storeTokens(res)),
      switchMap(() => this.initAuth())
    );
  }

  register(data: any): Observable<any> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(res => this.storeTokens(res)),
      switchMap(() => this.initAuth())
    );
  }

  logout(): Observable<any> {
    const refresh_token = localStorage.getItem('refresh_token');
    this.clearAuth();
    if (!refresh_token) {
      return of(null);
    }
    return this.http.post(`${this.apiUrl}/logout`, { refresh_token }).pipe(
      catchError(() => of(null))
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) return throwError(() => new Error('No refresh token'));
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, { refresh_token }).pipe(
      tap(res => this.storeTokens(res)),
      catchError(err => {
        this.clearAuth();
        return throwError(() => err);
      })
    );
  }

  private storeTokens(res: AuthResponse) {
    localStorage.setItem('access_token', res.access_token);
    localStorage.setItem('refresh_token', res.refresh_token);
  }

  private clearAuth() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.setAuthState(false, null);
  }

  private setAuthState(isAuthenticated: boolean, user: User | null) {
    this.isAuthenticatedSubject.next(isAuthenticated);
    this.currentUserSubject.next(user);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
