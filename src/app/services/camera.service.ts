import { Injectable } from '@angular/core';
import { ModelDefinition } from '@decartai/sdk';

@Injectable({ providedIn: 'root' })
export class CameraService {
  private stream: MediaStream | null = null;

  async start(model: Pick<ModelDefinition, 'fps' | 'width' | 'height'>): Promise<MediaStream> {
    if (!navigator.mediaDevices?.getUserMedia) {
      const isSecure = window.isSecureContext;
      const hint = !isSecure
        ? ' Camera access on mobile requires HTTPS or localhost. If you are accessing via local IP (http://...), please enable HTTPS or use a secure tunnel (e.g. ngrok).'
        : '';
      throw new Error(`Camera access is not available in this browser.${hint}`);
    }

    if (this.stream?.active) return this.stream;

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
        this.stream = await navigator.mediaDevices.getUserMedia(constraints);
        return this.stream;
      } catch (error) {
        lastError = error;
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
    throw lastError;
  }

  setEnabled(enabled: boolean): void {
    this.stream?.getVideoTracks().forEach(track => {
      track.enabled = enabled;
    });
  }

  stop(): void {
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = null;
  }
}
