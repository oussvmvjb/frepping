import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Address, AddressCreate, AddressUpdate } from "../models/api.models";
import { ErrorMapperService } from "./error-mapper.service";

@Injectable({ providedIn: "root" })
export class AddressService {
  private readonly base = `${environment.apiUrl}/users/me/addresses`;

  constructor(private http: HttpClient, private errorMapper: ErrorMapperService) {}

  list(): Observable<Address[]> {
    return this.http.get<Address[]>(this.base).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  create(payload: AddressCreate): Observable<Address> {
    return this.http.post<Address>(this.base, payload).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  update(id: string, payload: AddressUpdate): Observable<Address> {
    return this.http.patch<Address>(`${this.base}/${id}`, payload).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }

  setDefault(id: string): Observable<Address> {
    return this.http.patch<Address>(`${this.base}/${id}/default`, {}).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }
}
