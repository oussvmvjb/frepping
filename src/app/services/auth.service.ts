import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  User, AuthResponse, UserProfileUpdate, ChangePasswordRequest
} from '../models/api.models';
import { ErrorMapperService } from './error-mapper.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  public get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private errorMapper: ErrorMapperService
  ) {}

  /** Call once on app startup to restore session from stored token. */
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
      catchError(() => {
        this.clearAuth();
        this.isLoadingSubject.next(false);
        return of(null);
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => this.storeTokens(res)),
      switchMap(() => this.me()),
      tap(user => this.setAuthState(true, user)),
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  register(data: { email: string; password: string; first_name?: string; last_name?: string }): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(res => this.storeTokens(res)),
      switchMap(() => this.me()),
      tap(user => this.setAuthState(true, user)),
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  logout(): Observable<any> {
    const refresh_token = localStorage.getItem('refresh_token');
    this.clearAuth();
    if (!refresh_token) return of(null);
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
        this.router.navigate(['/login']);
        return throwError(() => err);
      })
    );
  }

  me(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  /** PATCH /auth/me */
  updateMe(payload: UserProfileUpdate): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/me`, payload).pipe(
      tap(user => this.currentUserSubject.next(user)),
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  /** POST /auth/change-password */
  changePassword(payload: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/change-password`, payload).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  get role(): string {
    return this.currentUserSubject.value?.role ?? '';
  }

  isAdmin(): boolean {
    return ['ADMIN', 'SUPER_ADMIN'].includes(this.role);
  }

  isSeller(): boolean {
    return this.role === 'SELLER';
  }

  isSuperAdmin(): boolean {
    return this.role === 'SUPER_ADMIN';
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private storeTokens(res: AuthResponse): void {
    localStorage.setItem('access_token', res.access_token);
    localStorage.setItem('refresh_token', res.refresh_token);
  }

  private clearAuth(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.setAuthState(false, null);
  }

  private setAuthState(isAuthenticated: boolean, user: User | null): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
    this.currentUserSubject.next(user);
  }
}
