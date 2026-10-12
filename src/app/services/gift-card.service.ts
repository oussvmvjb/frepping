import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { GiftCardCheckRequest, GiftCardCheckResponse } from "../models/api.models";
import { ErrorMapperService } from "./error-mapper.service";

@Injectable({ providedIn: "root" })
export class GiftCardService {
  private readonly base = `${environment.apiUrl}/gift-cards`;

  constructor(private http: HttpClient, private errorMapper: ErrorMapperService) {}

  check(req: GiftCardCheckRequest): Observable<GiftCardCheckResponse> {
    return this.http.post<GiftCardCheckResponse>(`${this.base}/check`, req).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }
}
