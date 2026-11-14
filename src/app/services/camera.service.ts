import { Injectable } from '@angular/core';
import { ModelDefinition } from '@decartai/sdk';
import { RealtimeDiagnosticsService } from './realtime-diagnostics.service';

@Injectable({ providedIn: 'root' })
export class CameraService {
  private stream: MediaStream | null = null;
  private startGeneration = 0;

  constructor(private readonly diagnostics: RealtimeDiagnosticsService) {}

  async start(model: Pick<ModelDefinition, 'fps' | 'width' | 'height'>): Promise<MediaStream> {
    const generation = ++this.startGeneration;
    this.diagnostics.cameraStatus = 'requesting permission';
    this.diagnostics.log('camera.permission.requested', {
      secureContext: window.isSecureContext,
      getUserMediaAvailable: Boolean(navigator.mediaDevices?.getUserMedia),
      requestedWidth: model.width,
      requestedHeight: model.height,
      requestedFps: typeof model.fps === 'number' ? model.fps : model.fps?.max,
    });

    if (!navigator.mediaDevices?.getUserMedia) {
      const isSecure = window.isSecureContext;
      const hint = !isSecure
        ? ' Camera access on mobile requires HTTPS or localhost. If you are accessing via local IP (http://...), please enable HTTPS or use a secure tunnel (e.g. ngrok).'
        : '';
      const error = new Error(`Camera access is not available in this browser.${hint}`);
      this.diagnostics.cameraStatus = 'unavailable';
      this.diagnostics.log('camera.unavailable', undefined, error);
      throw error;
    }

    if (this.stream?.active) {
      this.diagnostics.log('camera.reused', this.streamInfo(this.stream));
      return this.stream;
    }

    try {
      const permission = await navigator.permissions?.query({ name: 'camera' as PermissionName });
      this.diagnostics.log('camera.permission.status', { state: permission?.state ?? 'unsupported' });
    } catch (error) {
      this.diagnostics.log('camera.permission.status-unavailable', undefined, error);
    }

    const fpsNumber = typeof model.fps === 'number' ? model.fps : (model.fps?.max ?? 20);

    const constraintAttempts: MediaStreamConstraints[] = [
      {
        audio: false,
        video: {
          facingMode: { ideal: 'user' },
          width: { ideal: model.width },
          height: { ideal: model.height },
          frameRate: { ideal: fpsNumber },
        },
      },
      {
        audio: false,
        video: {
          facingMode: 'user',
        },
      },
      {
        audio: false,
        video: true,
      },
    ];

    let lastError: unknown;
    for (const constraints of constraintAttempts) {
      try {
        this.diagnostics.log('camera.get-user-media.started', {
          constraintAttempt: constraintAttempts.indexOf(constraints) + 1,
        });
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (generation !== this.startGeneration) {
          stream.getTracks().forEach(track => track.stop());
          this.diagnostics.log('camera.get-user-media.cancelled-stale');
          throw new DOMException('Camera start cancelled.', 'AbortError');
        }
        this.stream = stream;
        this.diagnostics.cameraStatus = 'ready';
        this.diagnostics.localStreamStatus = 'camera acquired';
        this.diagnostics.log('camera.get-user-media.succeeded', this.streamInfo(stream));
        return stream;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError' && generation !== this.startGeneration) {
          throw error;
        }
        lastError = error;
        this.diagnostics.log('camera.get-user-media.failed', {
          constraintAttempt: constraintAttempts.indexOf(constraints) + 1,
        }, error);
        if (error instanceof DOMException && error.name === 'OverconstrainedError') {
          // Retry with more relaxed constraints
          continue;
        }
        break;
      }
    }

    if (lastError instanceof DOMException) {
      if (lastError.name === 'NotAllowedError' || lastError.name === 'PermissionDeniedError') {
        throw new Error('Camera permission was denied. Allow camera access in your browser and try again.');
      }
      if (lastError.name === 'NotFoundError' || lastError.name === 'DevicesNotFoundError') {
        throw new Error('No camera was found on this device.');
      }
      if (lastError.name === 'NotReadableError' || lastError.name === 'TrackStartError') {
        throw new Error('The camera is already in use by another application.');
      }
      if (lastError.name === 'OverconstrainedError') {
        throw new Error('Your camera does not support the requested video resolution.');
      }
    }
    this.diagnostics.cameraStatus = 'failed';
    throw lastError;
  }

  setEnabled(enabled: boolean): void {
    this.stream?.getVideoTracks().forEach(track => {
      track.enabled = enabled;
    });
  }

  stop(stream?: MediaStream): void {
    if (!stream || this.stream === stream) this.startGeneration += 1;
    const target = stream ?? this.stream;
    if (target) {
      target.getTracks().forEach(track => track.stop());
      this.diagnostics.log('camera.tracks.stopped', this.streamInfo(target));
    }
    if (!stream || this.stream === stream) this.stream = null;
    if (!stream || this.stream === null) {
      this.diagnostics.cameraStatus = 'stopped';
      this.diagnostics.localStreamStatus = 'stopped';
    }
  }

  private streamInfo(stream: MediaStream): Record<string, unknown> {
    return {
      active: stream.active,
      streamId: stream.id,
      trackCount: stream.getTracks().length,
      tracks: stream.getTracks().map(track => {
        let settings: MediaTrackSettings = {};
        try {
          settings = track.getSettings();
        } catch {
          // Some mobile browsers do not expose track settings.
        }
        return {
          kind: track.kind,
          readyState: track.readyState,
          enabled: track.enabled,
          muted: track.muted,
          label: track.label,
          facingMode: settings.facingMode,
          width: settings.width,
          height: settings.height,
          frameRate: settings.frameRate,
        };
      }),
    };
  }
}
