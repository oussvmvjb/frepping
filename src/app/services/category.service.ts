import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, shareReplay } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Category } from "../models/api.models";

@Injectable({ providedIn: "root" })
export class CategoryService {
  private readonly base = `${environment.apiUrl}/categories`;
  private cache$: Observable<Category[]> | null = null;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    if (!this.cache$) {
      this.cache$ = this.http.get<Category[]>(this.base).pipe(
        shareReplay(1),
        catchError(() => {
          this.cache$ = null;
          return of([] as Category[]);
        })
      );
    }
    return this.cache$;
  }

  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.base}/${id}`);
  }

  invalidateCache(): void {
    this.cache$ = null;
  }
}
