import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ErrorMapperService {
  /**
   * Converts a backend HttpErrorResponse into a user-friendly string.
   * Backend detail format: { detail: string } or { detail: [{ msg: string }] }
   */
  map(err: any): string {
    if (err instanceof HttpErrorResponse) {
      const body = err.error;
      if (body) {
        if (typeof body.detail === 'string') return body.detail;
        if (Array.isArray(body.detail) && body.detail.length > 0) {
          return body.detail.map((d: any) => d.msg || JSON.stringify(d)).join('; ');
        }
        if (typeof body.message === 'string') return body.message;
      }
      switch (err.status) {
        case 0:   return 'Cannot reach the server. Is the backend running?';
        case 400: return 'Invalid request. Please check your input.';
        case 401: return 'You are not signed in. Please log in and try again.';
        case 403: return 'You do not have permission to perform this action.';
        case 404: return 'The requested resource was not found.';
        case 409: return 'Conflict: the resource already exists or is locked.';
        case 422: return 'Validation error. Please check your input.';
        case 429: return 'Too many requests. Please wait a moment and try again.';
        default:
          if (err.status >= 500) return 'Server error. Please try again later.';
          return `Unexpected error (${err.status}).`;
      }
    }
    if (err instanceof Error) return err.message;
    return 'An unexpected error occurred.';
  }
}
