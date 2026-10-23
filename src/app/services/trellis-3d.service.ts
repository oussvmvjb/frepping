import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, timer, throwError } from 'rxjs';
import { catchError, map, switchMap, takeWhile } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface TrellisJobResponse {
  job_id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
  status_url: string;
  model_url?: string | null;
  error?: string | null;
  created_at: string;
  updated_at: string;
}

export interface GeneratedModelMeta {
  job_id: string;
  filename: string;
  size_bytes: number;
  size_mb: number;
  created_at: string;
  model_url: string;
}

export interface GeneratedModelsListResponse {
  count: number;
  models: GeneratedModelMeta[];
}

export interface TrellisHealthResponse {
  status: string;
  service: string;
  trellis: {
    configured: boolean;
    space: string;
    hf_token_configured: boolean;
    max_concurrent_jobs: number;
    max_file_size_mb: number;
    active_jobs: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class Trellis3dService {
  // Use environment.apiUrl (e.g. http://localhost:8000/api/v1)
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Get all generated 3D GLB models saved on the backend server
   */
  getGeneratedModels(): Observable<GeneratedModelsListResponse> {
    return this.http.get<GeneratedModelsListResponse>(`${this.baseUrl}/generate-3d/models`);
  }

  /**
   * Check backend health and Hugging Face TRELLIS.2 integration status
   */
  getHealth(): Observable<TrellisHealthResponse> {
    return this.http.get<TrellisHealthResponse>(`${this.baseUrl}/health`).pipe(
      catchError((err) => {
        // Fallback to /api/health if /api/v1/health is accessed relatively
        return this.http.get<TrellisHealthResponse>('/api/health');
      })
    );
  }

  /**
   * Submit clothing image for 3D generation
   */
  generate3D(
    file: File,
    options: { resolution?: string; seed?: number; wait?: boolean } = {}
  ): Observable<TrellisJobResponse> {
    const formData = new FormData();
    formData.append('image', file, file.name);

    let params = new HttpParams();
    if (options.resolution) {
      params = params.set('resolution', options.resolution);
    }
    if (options.seed !== undefined && options.seed !== null) {
      params = params.set('seed', String(options.seed));
    }
    if (options.wait !== undefined) {
      params = params.set('wait', String(options.wait));
    }

    return this.http.post<TrellisJobResponse>(`${this.baseUrl}/generate-3d`, formData, {
      params
    });
  }

  /**
   * Get the generation status of an ongoing or completed job
   */
  getJobStatus(jobId: string): Observable<TrellisJobResponse> {
    return this.http.get<TrellisJobResponse>(`${this.baseUrl}/generate-3d/${encodeURIComponent(jobId)}`);
  }

  /**
   * Poll generation status until completed or failed.
   * If maxWaitMs is 0 or omitted, polling continues indefinitely until completed or failed.
   */
  pollJob(
    jobId: string,
    intervalMs: number = 2500,
    maxWaitMs: number = 0
  ): Observable<TrellisJobResponse> {
    const startTime = Date.now();

    return timer(0, intervalMs).pipe(
      switchMap(() => {
        if (maxWaitMs > 0 && Date.now() - startTime > maxWaitMs) {
          return throwError(() => new Error(`Generation timed out after ${Math.round(maxWaitMs / 1000)} seconds.`));
        }
        return this.getJobStatus(jobId);
      }),
      takeWhile((res) => {
        // Continue polling while queued or processing
        return res.status === 'queued' || res.status === 'processing';
      }, true) // Inclusive: emit the final completed or failed state
    );
  }

  /**
   * Construct absolute URL for the generated GLB model
   */
  getModelUrl(jobId: string, download: boolean = false): string {
    const dlParam = download ? '?download=true' : '';
    return `${this.baseUrl}/generate-3d/${encodeURIComponent(jobId)}/model${dlParam}`;
  }
}
