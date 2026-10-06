import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, shareReplay } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly base = `${environment.apiUrl}/categories`;

  /** Shared cached observable so every component reuses the same in-flight request. */
  private cache$: Observable<Category[]> | null = null;

  constructor(private http: HttpClient) {}

  /** GET /api/v1/categories — returns all active categories */
  getCategories(): Observable<Category[]> {
    if (!this.cache$) {
      this.cache$ = this.http
        .get<Category[]>(this.base)
        .pipe(
          shareReplay(1),
          catchError(() => {
            this.cache$ = null; // Allow retry on next call
            return of([] as Category[]);
          })
        );
    }
    return this.cache$;
  }

  /** GET /api/v1/categories/:id */
  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.base}/${id}`);
  }

  /** Bust the in-memory cache (call after admin creates/updates/deletes a category) */
  invalidateCache(): void {
    this.cache$ = null;
  }
}
