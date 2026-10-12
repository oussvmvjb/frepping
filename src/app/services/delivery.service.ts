import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { DeliveryOption } from "../models/api.models";
import { ErrorMapperService } from "./error-mapper.service";

@Injectable({ providedIn: "root" })
export class DeliveryService {
  private readonly base = `${environment.apiUrl}/delivery-options`;

  constructor(private http: HttpClient, private errorMapper: ErrorMapperService) {}

  getActive(): Observable<DeliveryOption[]> {
    return this.http.get<DeliveryOption[]>(this.base).pipe(
      catchError(err => throwError(() => new Error(this.errorMapper.map(err))))
    );
  }
}
