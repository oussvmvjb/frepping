import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { PromoCode, Pagination } from "../models/api.models";
import { ErrorMapperService } from "./error-mapper.service";

@Injectable({ providedIn: "root" })
export class PromoService {
  private readonly base = `${environment.apiUrl}/promos`;

  constructor(private http: HttpClient, private errorMapper: ErrorMapperService) {}

  getActive(): Observable<Pagination<PromoCode>> {
    return this.http.get<Pagination<PromoCode>>(`${this.base}/active`).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }
}
